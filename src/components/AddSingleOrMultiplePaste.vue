<script setup lang="ts">
import {
  inject,
  triggerRef,
  ref,
  watch,
  customRef,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";

const props = defineProps<{
  index: number;
  nospace: string;
  tree: {
    single: string;
    value: string[];
    index: number;
    temporary: string[];
    done: boolean;
    bottom: boolean;
    loading: boolean;
    addloading: boolean;
  };
  areatype: string;
}>();

const cards = inject("cards") as any;

const refincluded = ref([]),
  includedend = ref(),
  shouldincludeorstartwithref = ref(),
  processedpasteincludeedit = ref([]),
  pastefrommultipleinclude = ref(false),
  pastefrommultipleincluderef = ref(),
  pastefrommultipleincludeexpand = ref(false),
  pastefrommultipleincludetext = ref(""),
  pastefrommultipleincludeloading = ref(false),
  processedpasteinclude = ref([]),
  processedpasteincludeduplicate = ref(0),
  processedpasteincludeerror = ref(0),
  processedpasteincludelines = ref(0),
  pages = ref([]),
  pastefrommultipleincludecounter = ref(0),
  current = ref(0),
  inputpagenumberref = ref();

let duplicateCheckerObject = {},
  unwatchpastefrommultipleincludetext = null,
  actualpastedincludedata = "",
  unwatch = null,
  unwatchcurrent = null,
  unwatchpagination = null,
  temporary = useDebouncedRef(props.tree);

function useDebouncedRef(value, delay = 1) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
          clearTimeout(timeout);
        }, delay);
      },
    };
  });
}
function processPastedTextAndFindRejectedAndAcceptedLines(
  actualtext,
  textareaacceptedtext
) {
  let actualtextArray = actualtext.split("\n");
  let textareaacceptedtextArray = textareaacceptedtext.split("\n");

  if (textareaacceptedtextArray[textareaacceptedtextArray.length - 1].trim() !== "") {
    if (
      textareaacceptedtextArray[textareaacceptedtextArray.length - 1] !==
      actualtextArray[textareaacceptedtextArray.length - 1]
    ) {
      textareaacceptedtextArray.splice(textareaacceptedtextArray.length - 1, 1);
      actualtextArray.splice(textareaacceptedtextArray.length - 1, 1);
    }
  }

  let lines = textareaacceptedtextArray.length;

  for (let i = 0; i < textareaacceptedtextArray.length; i++) {
    if (textareaacceptedtextArray[i].trim() === "") {
      textareaacceptedtextArray.splice(i, 1);
      continue;
    }
  }

  return [lines, removeDuplicateAndValidateLine(textareaacceptedtextArray)];
}
function removeDuplicateAndValidateLine(acceptedArray) {
  let newArray = [],
    index = 0,
    duplicate = 0,
    error = 0;
  acceptedArray.forEach((item, i) => {
    if (item.trim() !== "") {
      if (
        duplicateCheckerObject["" + item] === undefined ||
        duplicateCheckerObject["" + item] === null
      ) {
        if (!/^\s*\d+\s*$/g.test(item) && item.length <= 40) {
          duplicateCheckerObject["" + item] = "";
          newArray[index] = [item, "STRING"];
          processedpasteincludeedit.value[index] = false;
        } else {
          if (/^\s*\d+\s*$/g.test(item)) {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "NUMERIC"];
            processedpasteincludeedit.value[index] = false;
          } else {
            if (item.length > 40) {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "ERROR"];
              processedpasteincludeedit.value[index] = false;
              error++;
            }
          }
        }
        index++;
      } else {
        duplicate++;
      }
    }
  });

  return [newArray, duplicate, error];
}
function paginateFurther() {
  let includesize = props.tree.temporary.length;
  if (includesize > 0) {
    pages.value = [];
    let innerpage = [],
      j = 0,
      k = 0,
      suminclude = 0;
    for (let i = 0; i < includesize; i++) {
      suminclude += props.tree.temporary[i].length;
      innerpage[k] = props.tree.temporary[i];
      if (suminclude > 300) {
        innerpage.splice(k, 1);
        if (innerpage.length > 0) pages.value[j] = innerpage;
        innerpage = [];
        j++;
        k = -1;
        i -= 1;
        suminclude = 0;
      } else {
        if (i === includesize - 1 && innerpage.length > 0) {
          pages.value[j] = innerpage;
        }
      }
      k++;
    }
  }
}
function addNewIncludeOrExclude(tree: {
  single: string;
  value: string[];
  index: number;
  temporary: string[];
  done: boolean;
  bottom: boolean;
  loading: boolean;
  addloading: boolean;
}) {
  let includeorexclude = tree.single;
  if (includeorexclude.trim() !== "") {
    let increment = true;
    if (tree.value.length === 0) {
      increment = true;
    } else {
      let tt3 = [],
        tt3Index = 0;

      if (current.value !== 0) {
        tree.value = pages.value[pages.value.length - 1];
        current.value = pages.value.length;
        nextTick(() => triggerRef(cards));
      }
      for (let i = 0; i < tree.value.length; i++) {
        if (tree.value[i] === includeorexclude) {
          increment = false;
          scrollToElement(refincluded.value[i]);
          refincluded.value[i].style.backgroundColor = "red";
          refincluded.value[i].style.color = "#fff";
          tt3[tt3Index] = setTimeout(() => {
            if (refincluded.value[i] !== undefined && refincluded.value[i] !== null) {
              if (refincluded.value[i].style.backgroundColor !== "#fff") {
                refincluded.value[i].style.backgroundColor = "#fff";
                refincluded.value[i].style.color = "black";
                clearTimeout(tt3[tt3Index]);
              }
            }
          }, 800);
          tt3Index++;
          break;
        }
      }
    }
    if (increment && tree.addloading === false) {
      tree.done = true;
      tree.addloading = true;
      nextTick(() => triggerRef(cards));
      if (tree.temporary.length > 0) {
        for (let i = 0; i < tree.temporary.length; i++) {
          if (includeorexclude === tree.temporary[i]) {
            tree.temporary.splice(i, 1);
            nextTick(() => triggerRef(cards));
            break;
          }
        }
      }
      let temp = tree.temporary.slice(tree.value.length, tree.temporary.length);
      tree.value.push(includeorexclude);
      let newTree = JSON.parse(JSON.stringify(tree.value));
      tree.temporary = newTree;
      tree.temporary.push(...temp);
      temporary.value = tree;
      tree.index = tree.value.length;
      paginateFurther();

      let t2;
      clearTimeout(t2);
      t2 = setTimeout(() => {
        scrollToElement(includedend.value);
        tree.single = "";
        tree.addloading = false;
        nextTick(() => triggerRef(cards));
        clearTimeout(t2);
      }, 50);
    }
  } else {
    tree.single = "";
    nextTick(() => triggerRef(cards));
  }
}
function openPasteArea() {
  pastefrommultipleinclude.value = true;
  pastefrommultipleincludeexpand.value = false;
  pastefrommultipleincludetext.value = "";
  pastefrommultipleincludecounter.value = 0;
  pastefrommultipleincludeloading.value = false;
  duplicateCheckerObject = {};
  let tt;
  clearTimeout(tt);
  tt = setTimeout(() => {
    pastefrommultipleincluderef.value.focus();
    clearTimeout(tt);
  }, 50);
}
function pasteMultilineWordsCopiedFromSomewhere(e) {
  pastefrommultipleincluderef.value.maxLength = 5000;
  actualpastedincludedata = handlePaste(e);
  let pastelengthresizetimer;
  clearTimeout(pastelengthresizetimer);
  pastelengthresizetimer = setTimeout(() => {
    pastefrommultipleincluderef.value.maxLength = 0;
    clearTimeout(pastelengthresizetimer);
  }, 10);
}
function addPasted() {
  let done = false,
    tt3 = [],
    tt3Index = 0;
  for (let i = 0; i < processedpasteinclude.value.length; i++) {
    let item = processedpasteinclude.value[i];
    if (item[1] !== "ERROR") {
      if (item[0].trim() !== "") {
        let increment = true;
        if (props.tree.value.length === 0) {
          increment = true;
        } else {
          if (current.value !== 0) {
            current.value = 0;
            props.tree.value = pages.value[0];
            nextTick(() => triggerRef(cards));
          }
          for (let i = 0; i < props.tree.value.length; i++) {
            if (props.tree.value[i] === item[0]) {
              increment = false;
              if (refincluded.value[i] !== undefined && refincluded.value[i] !== null) {
                refincluded.value[i].style.backgroundColor = "red";
                refincluded.value[i].style.color = "#fff";
                tt3[tt3Index] = setTimeout(() => {
                  if (refincluded.value[i].style.backgroundColor !== "#fff") {
                    refincluded.value[i].style.backgroundColor = "#fff";
                    refincluded.value[i].style.color = "black";
                    clearTimeout(tt3[tt3Index]);
                  }
                }, 800);
                tt3Index++;
              }
              break;
            }
          }
        }
        if (increment && props.tree.addloading === false) {
          props.tree.done = true;
          props.tree.addloading = true;
          nextTick(() => triggerRef(cards));
          if (props.tree.temporary.length > 0) {
            for (let i = 0; i < props.tree.temporary.length; i++) {
              if (item[0] === props.tree.temporary[i]) {
                props.tree.temporary.splice(i, 1);
                nextTick(() => triggerRef(cards));
                break;
              }
            }
          }
          let temp = props.tree.temporary.slice(
            props.tree.value.length,
            props.tree.temporary.length
          );
          props.tree.value.push(item[0]);
          let newTree = JSON.parse(JSON.stringify(props.tree.value));
          props.tree.temporary = newTree;
          props.tree.temporary.push(...temp);
          props.tree.index = props.tree.value.length;
          props.tree.single = "";
          props.tree.addloading = false;
          temporary.value = props.tree;
          paginateFurther();
          nextTick(() => triggerRef(cards));
        }
      } else {
        props.tree.single = "";
        nextTick(() => triggerRef(cards));
      }
    }
  }
  let tt;
  clearTimeout(tt);
  tt = setTimeout(() => {
    scrollToElement(includedend.value);
    clearTimeout(tt);
  }, 300);
  pastefrommultipleincludetext.value = "";
  pastefrommultipleincludecounter.value = 0;
  pastefrommultipleincludeloading.value = false;
  pastefrommultipleincludeexpand.value = false;
  pastefrommultipleinclude.value = false;
  duplicateCheckerObject = {};
}
function saveEditedTooLong(item, i) {
  if (item.length <= 40) {
    if (item.trim() !== "") {
      if (
        duplicateCheckerObject["" + item] === undefined ||
        duplicateCheckerObject["" + item] === null
      ) {
        if (!/^\s*\d+\s*$/g.test(item)) {
          duplicateCheckerObject["" + item] = "";
          processedpasteinclude.value[i][1] = "STRING";
          processedpasteinclude.value[i][0] = item;
          processedpasteincludeedit.value[i] = false;
        } else {
          duplicateCheckerObject["" + item] = "";
          processedpasteinclude.value[i][1] = "NUMERIC";
          processedpasteinclude.value[i][0] = item;
          processedpasteincludeedit.value[i] = false;
        }
        processedpasteincludeerror.value--;
      }
    }
  }
}
function handlePaste(e) {
  var clipboardData, pastedData;

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData("Text");

  return pastedData;
}
function deletePasted(index) {
  processedpasteinclude.value.splice(index, 1);
  if (processedpasteinclude.value.length === 0) {
    pastefrommultipleincludetext.value = "";
    pastefrommultipleincludecounter.value = 0;
    pastefrommultipleincludeloading.value = false;
    pastefrommultipleincludeexpand.value = false;
    pastefrommultipleinclude.value = false;
    duplicateCheckerObject = {};
  }
}
function resetDoneClick(tree: {
  value: string[];
  index: number;
  temporary: string[];
  done: boolean;
  loading: boolean;
  bottom: boolean;
  addloading: boolean;
}) {
  tree.done = false;
  nextTick(() => triggerRef(cards));
}
function deleteIncludeOrExclude(
  tree: { value: string[]; index: number; temporary: string[]; done: boolean },
  index: number
) {
  if (current.value === 0) {
    for (let i = 0; i < tree.value.length; i++) {
      if (tree.value[i] === tree.value[index]) {
        tree.value.splice(i, 1);
        tree.temporary.splice(i, 1);
        tree.index--;
        tree.done = true;
        break;
      }
    }
    temporary.value = tree;
  } else {
    let val = "";
    for (let i = 0; i < tree.value.length; i++) {
      if (tree.value[i] === tree.value[index]) {
        val = tree.value[i];
        tree.value.splice(i, 1);
        tree.index--;
        tree.done = true;
        break;
      }
    }
    for (let i = 0; i < tree.temporary.length; i++) {
      if (val === tree.temporary[i]) {
        tree.temporary.splice(i, 1);
        break;
      }
    }
    let newpagenum = current.value - 1;
    if (tree.value.length === 0) {
      pages.value.splice(newpagenum, 1);
      if (newpagenum === pages.value.length) {
        current.value = newpagenum;
        newpagenum--;
      }
      tree.value = pages.value[newpagenum];
      paginateFurther();
    } else {
      paginateFurther();
      tree.value = pages.value[newpagenum];
    }
  }
  nextTick(() => triggerRef(cards));
}
function previousOrNextClicked(previousornext: "PREVIOUS" | "NEXT" | "INPUT") {
  if (previousornext === "NEXT") {
    if (current.value >= 1 && current.value < pages.value.length) {
      current.value++;
      if (inputpagenumberref.value) {
        if (pages.value.length > 10 && pages.value.length < 999) {
          if (current.value >= 5 && current.value <= pages.value.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (pages.value.length >= 999) {
            if (current.value >= 5 && current.value <= pages.value.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
    }
  } else if (previousornext === "PREVIOUS") {
    if (current.value > 1) {
      current.value--;
      if (inputpagenumberref.value) {
        if (pages.value.length > 10 && pages.value.length < 999) {
          if (current.value >= 5 && current.value <= pages.value.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (pages.value.length >= 999) {
            if (current.value >= 5 && current.value <= pages.value.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
    }
  } else {
    current.value = inputpagenumberref.value.value;
  }
}
function scrollToElement(el) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
onMounted(() => {
  let doc = document;

  let includesize = props.tree.temporary.length,
    suminclude = 0;
  if (includesize > 0) {
    for (let j = 0; j < includesize; j++) {
      suminclude += props.tree.temporary[j].length;
    }
    if (suminclude > 300) {
      for (let j = includesize - 1; j >= 0; j--) {
        suminclude -= props.tree.temporary[j].length;
        props.tree.value.splice(j, 1);
        if (suminclude <= 300) {
          props.tree.index = props.tree.value.length;
          break;
        }
      }
    }
  }

  nextTick(() => triggerRef(cards));

  if (
    doc.getElementById(
      cards.value[props.index].scroll.areaid + "-included-" + props.areatype
    )
  ) {
    doc
      .getElementById(
        cards.value[props.index].scroll.areaid + "-included-" + props.areatype
      )
      .addEventListener("scroll", scrollInclude, true);
  }

  pastefrommultipleinclude.value = false;

  paginateFurther();

  unwatchcurrent = watch(
    () => current.value,
    (num) => {
      props.tree.value = pages.value[num > 0 ? num - 1 : num];
    }
  );

  unwatchpagination = watch(
    () => temporary.value.temporary.length,
    (includesize) => {
      paginateFurther();
    }
  );

  unwatchpastefrommultipleincludetext = watch(
    () => pastefrommultipleincludetext.value,
    (text) => {
      if (pastefrommultipleincludecounter.value === 0) {
        pastefrommultipleincludeloading.value = true;
        pastefrommultipleincludecounter.value = 1;
        let pt;
        clearTimeout(pt);
        pt = setTimeout(() => {
          pastefrommultipleincludeloading.value = false;
          pastefrommultipleincludeexpand.value = true;
          let result = processPastedTextAndFindRejectedAndAcceptedLines(
            actualpastedincludedata,
            pastefrommultipleincludetext.value
          );
          processedpasteinclude.value = result[1][0];
          processedpasteincludeduplicate.value = result[1][1];
          processedpasteincludeerror.value = result[1][2];
          processedpasteincludelines.value = result[0];
          clearTimeout(pt);
        }, 200);
      }
    }
  );
});

function scrollInclude(e) {
  let doc = document,
    originalElement = e.srcElement || e.originalTarget,
    el = doc.getElementById(
      cards.value[props.index].scroll.areaid + "-included-" + props.areatype
    );
  if (originalElement === el) {
    if (props.tree.done === false) {
      props.tree.bottom = bottomReach(el);
      nextTick(() => triggerRef(cards));
      if (props.tree.bottom) {
        if (
          props.tree.loading === false &&
          props.tree.value.length !== props.tree.temporary.length
        ) {
          props.tree.loading = true;
          nextTick(() => triggerRef(cards));
          let time2;
          clearTimeout(time2);
          time2 = setTimeout(() => {
            let sum = 0,
              temp = [],
              length = props.tree.value.length,
              newTree = JSON.parse(JSON.stringify(props.tree.value));
            temp = newTree;
            for (let i = length; i < props.tree.temporary.length; i++) {
              sum += props.tree.temporary[i].length;
              let copy = JSON.parse(JSON.stringify(props.tree.temporary[i]));
              temp.push(copy);
            }
            if (sum > 300) {
              for (let i = props.tree.temporary.length - 1; i >= length; i--) {
                sum -= props.tree.temporary[i].length;
                temp.splice(i, 1);
                if (sum <= 300) {
                  break;
                }
              }
            }
            let newTemp = JSON.parse(JSON.stringify(temp));
            props.tree.value = newTemp;
            props.tree.loading = false;
            props.tree.index = props.tree.value.length;
            nextTick(() => triggerRef(cards));
            clearTimeout(time2);
          }, 400);
        }
      }
    }
  }
}

function bottomReach(scrollarea: HTMLElement) {
  if (scrollarea.offsetHeight + scrollarea.scrollTop > scrollarea.scrollHeight - 80) {
    if (
      scrollarea.offsetHeight + scrollarea.scrollTop - (scrollarea.scrollHeight - 80) ===
      80
    )
      return true;
    else return false;
  }
  return false;
}

onBeforeUnmount(() => {
  let doc = document;

  if (unwatch) {
    unwatch();
  }

  if (unwatchpastefrommultipleincludetext) {
    unwatchpastefrommultipleincludetext();
  }

  if (unwatchpagination) {
    unwatchpagination();
  }

  if (unwatchcurrent) {
    unwatchcurrent();
  }

  refincluded.value = [];
  includedend.value = null;
  shouldincludeorstartwithref.value = null;

  if (
    doc.getElementById(
      cards.value[props.index].scroll.areaid + "-included-" + props.areatype
    )
  ) {
    doc
      .getElementById(
        cards.value[props.index].scroll.areaid + "-included-" + props.areatype
      )
      .removeEventListener("scroll", scrollInclude, true);
  }
});
</script>

<template>
  <div class="d-block position-relative" style="padding-bottom: 15px">
    <div
      class="position-relative shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
    >
      <div class="flex-fill p-0 m-0 align-self-stretch">
        <template v-if="nospace === 'false'">
          <input
            ref="shouldincludeorstartwithref"
            @keypress.enter="addNewIncludeOrExclude(tree)"
            maxlength="40"
            type="text"
            v-model="tree.single"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
        <template v-else>
          <input
            ref="shouldincludeorstartwithref"
            @keydown.space.prevent
            @keypress.enter="addNewIncludeOrExclude(tree)"
            maxlength="40"
            type="text"
            v-model="tree.single"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
      </div>
      <div
        class="position-absolute flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
        style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
      >
        <a
          class="cursor-pointer d-block text-center"
          style="padding: 3px 0"
          @click="addNewIncludeOrExclude(tree)"
        >
          <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
        </a>
      </div>
    </div>
    <div class="d-block">
      <div class="d-block text-center" style="padding: 5px 0">
        <button
          class="btn shadow-sm w-100"
          style="padding: 2px; font-size: 0.85rem"
          @click="openPasteArea()"
        >
          Paste multiple lines of words copied from somewhere else
        </button>
      </div>
    </div>
    <template v-if="pastefrommultipleinclude">
      <div
        class="w-100 position-absolute t-0 l-0 shadow-sm"
        style="height: 188px; background-color: #fff; border: 1px solid #fff"
      >
        <div
          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
          style="height: 30px"
        >
          <div class="flex-fill" style="font-size: 0.8rem">
            Press Ctrl + V on a PC or Command + V on an Apple Mac.
          </div>
          <div class="flex-grow-0 flex-shrink-0 text-center">
            <a
              @click="pastefrommultipleinclude = false"
              class="d-inline-block cursor-pointer"
              title="Close"
            >
              <img
                src="/src/assets/icons/close.png"
                style="width: 20px; height: 20px"
                class="align-middle"
              />
            </a>
          </div>
        </div>
        <div class="d-block position-relative" style="height: 170px">
          <div class="d-block h-100" style="z-index: 800">
            <textarea
              :ref="(el) => (pastefrommultipleincluderef = el)"
              style="border: 1px solid gray; padding: 5px; resize: none"
              class="w-100 h-100 text-left d-inline-block overflow-auto"
              maxlength="0"
              v-model="pastefrommultipleincludetext"
              @paste="(e) => pasteMultilineWordsCopiedFromSomewhere(e)"
            ></textarea>
          </div>
          <template v-if="pastefrommultipleincludeloading">
            <div
              style="padding: 26px 0px; z-index: 900"
              class="t-0 l-0 w-100 position-absolute m-0 h-100 modal-mask-background-1"
            >
              <img
                src="/src/assets/icons/loading.gif"
                style="width: 80px; height: 80px"
                class="align-middle"
              />
            </div>
          </template>
        </div>
        <div
          class="d-block"
          style="background-color: #fff; height: 26px; padding: 2px 0; font-size: 0.8rem"
        >
          Max letters per line = 40, Total Max letters for all lines = 5000
        </div>
      </div>
      <Teleport to="body">
        <div v-if="pastefrommultipleincludeexpand" class="d-block position-relative">
          <transition name="modal">
            <div
              class="position-fixed h-100 w-100 overflow-auto user-select-none"
              style="z-index: 1800"
            >
              <div class="modal-mask h-100 w-100 modal-mask-background-2">
                <div class="modal-wrapper text-center">
                  <div
                    class="modal-container d-block shadow"
                    style="height: auto; width: 560px"
                  >
                    <div class="d-block m-0 p-0">
                      <div
                        class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                        style="height: 30px; padding: 0 3px"
                      >
                        <div class="text-left flex-fill" style="font-size: 0.8rem">
                          Out of {{ processedpasteincludelines }} pasted
                          {{ processedpasteincludelines > 1 ? "lines" : "line" }}
                          of words,
                          {{
                            processedpasteincludeduplicate > 0
                              ? processedpasteincludeduplicate
                              : "no"
                          }}
                          {{
                            processedpasteincludeduplicate > 1
                              ? "duplicates"
                              : "duplicate"
                          }}
                          removed and
                          {{
                            processedpasteincludeerror > 0
                              ? processedpasteincludeerror
                              : "no"
                          }}
                          {{ processedpasteincludeerror > 1 ? "lines" : "line" }}
                          of words are too long
                        </div>
                        <div class="flex-grow-0 flex-shrink-0 text-center">
                          <a
                            @click="
                              () => {
                                pastefrommultipleincludetext = '';
                                pastefrommultipleincludecounter = 0;
                                pastefrommultipleincludeloading = false;
                                pastefrommultipleincludeexpand = false;
                                pastefrommultipleinclude = false;
                                duplicateCheckerObject = {};
                              }
                            "
                            class="d-inline-block cursor-pointer"
                            title="Close"
                          >
                            <img
                              src="/src/assets/icons/close.png"
                              style="width: 20px; height: 20px"
                              class="align-middle"
                            />
                          </a>
                        </div>
                      </div>
                      <div class="d-block" style="padding: 10px">
                        <button
                          @click="addPasted()"
                          class="btn shadow-sm d-inline-block w-100"
                          style="background-color: green; color: #fff"
                        >
                          Add pasted
                        </button>
                      </div>
                      <div class="d-block">
                        <ul class="d-block list-style-none m-0 p-0">
                          <li
                            v-for="(item, i) in processedpasteinclude"
                            :key="'expand-include-' + i"
                          >
                            <div class="d-block" style="padding: 5px">
                              <template v-if="processedpasteincludeedit[i]">
                                <div
                                  class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
                                >
                                  <div class="flex-fill p-0 m-0 align-self-stretch">
                                    <input
                                      type="text"
                                      class="w-100"
                                      v-model="item[0]"
                                      style="
                                        border-radius: 20px;
                                        padding: 8px;
                                        background-color: #ffcccb;
                                      "
                                    />
                                  </div>
                                  <div
                                    class="position-absolute flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                                    style="
                                      background-color: #eee;
                                      outline: 1px solid rgba(0, 0, 0, 0.2);
                                      border-top-right-radius: 20px;
                                      border-bottom-right-radius: 20px;
                                    "
                                  >
                                    <a
                                      class="cursor-pointer d-block text-center"
                                      style="padding: 7px 0"
                                      @click="saveEditedTooLong(item[0], i)"
                                    >
                                      <img
                                        src="/src/assets/icons/save.png"
                                        class="wh-1-dot-25-rem align-middle"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </template>
                              <template v-else>
                                <div
                                  :style="
                                    item[1] === 'ERROR'
                                      ? 'background-color:red;color:#fff;'
                                      : 'background-color:#fff;'
                                  "
                                  class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                  style="border-radius: 20px; padding: 8px"
                                >
                                  <div
                                    class="ellipsis overflow-hidden text-left flex-fill letter-spacing font-0-dot-875-rem"
                                  >
                                    {{ item[0] }}
                                  </div>
                                  <div
                                    class="flex-shrink-0 flex-grow-0 flex-w-3-dot-5-rem"
                                  >
                                    <div
                                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
                                    >
                                      <template v-if="item[1] === 'ERROR'">
                                        <div
                                          class="flex-shrink-0 flex-grow-0"
                                          style="padding-right: 4px"
                                        >
                                          <a
                                            @click="processedpasteincludeedit[i] = true"
                                            class="d-inline-block cursor-pointer"
                                          >
                                            <img
                                              src="/src/assets/icons/edit.png"
                                              style="width: 18px; height: 18px"
                                              class="align-middle"
                                            />
                                          </a>
                                        </div>
                                      </template>
                                      <div
                                        class="flex-shrink-0 flex-grow-0"
                                        style="padding-left: 4px"
                                      >
                                        <a
                                          @click="deletePasted(i)"
                                          class="d-inline-block cursor-pointer"
                                        >
                                          <img
                                            src="/src/assets/icons/delete.png"
                                            style="width: 18px; height: 18px"
                                            class="align-middle"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </Teleport>
    </template>
    <div class="d-block">
      <ul
        class="m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
      >
        <li
          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
          style="padding: 5px 3px; width: 10%"
        >
          <a
            class="btn underline-none shadow-sm d-block"
            style="font-size: 0.8rem; padding: 5.2px 0"
            :style="current === 0 && pages.length > 1 ? 'background-color: #F0E68C;' : ''"
            @click="current = 0"
          >
            All
          </a>
        </li>
        <li class="flex-fill align-self-stretch" style="width: 90%">
          <template v-if="pages.length > 1">
            <ul
              class="m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
            >
              <li
                style="padding: 5px 3px"
                class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                :style="
                  pages.length < 11
                    ? 'width:' + 100 / (pages.length + 2) + '%'
                    : 'width:' + 100 / 11 + '%'
                "
              >
                <a
                  @click="previousOrNextClicked('PREVIOUS')"
                  class="btn underline-none shadow-sm d-block"
                  style="padding: 2.7px 0"
                >
                  <img
                    src="/src/assets/icons/previous.png"
                    class="align-middle"
                    style="width: 15px; height: 15px"
                  />
                </a>
              </li>
              <template v-if="pages.length <= 10">
                <li
                  style="padding: 5px 3px"
                  class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                  v-for="pageindex in pages.length"
                  :key="pageindex + '-pagination'"
                  :style="
                    pages.length < 11
                      ? 'width:' + 100 / (pages.length + 2) + '%'
                      : 'width:' + 100 / 11 + '%'
                  "
                >
                  <a
                    class="btn underline-none shadow-sm d-block"
                    style="font-size: 0.8rem; padding: 5.2px 0px"
                    :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                    @click="current = pageindex"
                  >
                    {{ pageindex }}
                  </a>
                </li>
              </template>
              <template v-else-if="pages.length > 10 && pages.length < 999">
                <template v-for="pageindex in pages.length">
                  <template v-if="pageindex < 5">
                    <li
                      style="padding: 5px 3px; width: 8.333333333%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <a
                        class="btn underline-none shadow-sm d-block"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                        @click="current = pageindex"
                      >
                        {{ pageindex }}
                      </a>
                    </li>
                  </template>
                  <template v-else-if="pageindex === 5">
                    <li
                      style="padding: 5px 3px; width: 16.666666667%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <input
                        :ref="(el) => (inputpagenumberref = el)"
                        type="number"
                        class="shadow-sm w-100 text-center"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="
                          current >= 5 && current <= pages.length - 4
                            ? 'background-color: #F0E68C;'
                            : ''
                        "
                        min="5"
                        :max="pages.length - 4"
                        maxlength="3"
                        size="4"
                        value="5"
                        @keypress.enter="previousOrNextClicked('INPUT')"
                      />
                    </li>
                  </template>
                  <template v-else>
                    <template v-if="pageindex + 4 > pages.length">
                      <li
                        style="padding: 5px 3px; width: 8.333333333%"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                        :key="pageindex + '-pagination'"
                      >
                        <a
                          class="btn underline-none shadow-sm d-block"
                          style="font-size: 0.8rem; padding: 5.2px 0px"
                          :style="
                            current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @click="current = pageindex"
                        >
                          {{ pageindex }}
                        </a>
                      </li>
                    </template>
                  </template>
                </template>
              </template>
              <template v-else>
                <template v-for="pageindex in pages.length">
                  <template v-if="pageindex < 5">
                    <li
                      style="padding: 5px 3px; width: 8.333333333%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <a
                        class="btn underline-none shadow-sm d-block"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                        @click="current = pageindex"
                      >
                        {{ pageindex }}
                      </a>
                    </li>
                  </template>
                  <template v-else-if="pageindex === 5">
                    <li
                      style="padding: 5px 3px; width: 24.999999%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <input
                        :ref="(el) => (inputpagenumberref = el)"
                        type="number"
                        class="shadow-sm w-100 text-center"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="
                          current >= 5 && current <= pages.length - 1
                            ? 'background-color: #F0E68C;'
                            : ''
                        "
                        min="5"
                        :max="pages.length - 1"
                        maxlength="5"
                        size="6"
                        value="5"
                        @keypress.enter="previousOrNextClicked('INPUT')"
                      />
                    </li>
                  </template>
                  <template v-else>
                    <template v-if="pageindex + 1 > pages.length">
                      <li
                        style="padding: 5px 3px; width: 24.999999%"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                        :key="pageindex + '-pagination'"
                      >
                        <a
                          class="btn underline-none shadow-sm d-block"
                          style="font-size: 0.8rem; padding: 5.2px 0px"
                          :style="
                            current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @click="current = pageindex"
                        >
                          {{ pageindex }}
                        </a>
                      </li>
                    </template>
                  </template>
                </template>
              </template>
              <li
                style="padding: 5px 3px"
                class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                :style="
                  pages.length < 11
                    ? 'width:' + 100 / (pages.length + 2) + '%'
                    : 'width:' + 100 / 11 + '%'
                "
              >
                <a
                  @click="previousOrNextClicked('NEXT')"
                  class="btn underline-none shadow-sm d-block"
                  style="padding: 2.7px 0"
                >
                  <img
                    src="/src/assets/icons/next.png"
                    class="align-middle"
                    style="width: 15px; height: 15px"
                  />
                </a>
              </li>
            </ul>
          </template>
        </li>
        <li
          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
          style="padding: 5px 3px; width: 10%"
        >
          <a class="btn underline-none shadow-sm d-block" style="padding: 2.8px 0">
            <img
              src="/src/assets/icons/expand.png"
              class="align-middle"
              style="width: 15px; height: 15px"
            />
          </a>
        </li>
      </ul>
    </div>
    <div class="d-block">
      <div
        @mousedown="resetDoneClick(tree)"
        @mouseup="resetDoneClick(tree)"
        :id="current === 0 ? cards[index].scroll.areaid + '-included-' + areatype : ''"
        class="m-0 p-0 d-block overflow-y-auto"
        style="z-index: 1000; height: 120px; background-color: #eee"
      >
        <div class="d-block">
          <template v-if="tree.value">
            <ul
              class="m-0 p-0 flex-box flex-direction-row flex-wrap list-style-none justify-content-start w-100"
            >
              <li
                style="padding: 5px"
                class="flex-grow-0 flex-shrink-0"
                v-for="(included, includeindex) in tree.value"
                :key="includeindex + 'include'"
              >
                <div
                  :ref="
                    (el) => {
                      refincluded[includeindex] = el;
                    }
                  "
                  class="d-inline-block shadow-sm cursor-pointer"
                  style="
                    border-radius: 9px;
                    background-color: #fff;
                    padding: 4px 7px;
                    font-size: 10px;
                  "
                >
                  <a
                    @click="deleteIncludeOrExclude(tree, includeindex)"
                    class="d-inline-block underline-none"
                    ><img
                      src="/src/assets/icons/close.png"
                      style="width: 18px; height: 18px"
                      class="align-middle"
                  /></a>
                  <span
                    class="font-0-dot-90-rem d-inline-block align-middle"
                    style="padding-left: 5px"
                    >{{ included }}</span
                  >
                </div>
              </li>
              <template v-if="tree.addloading">
                <li style="padding: 5px" class="flex-grow-0 flex-shrink-0">
                  <img
                    src="/src/assets/icons/loading.gif"
                    style="width: 32px; height: 32px"
                    class="align-middle"
                  />
                </li>
              </template>
              <li ref="includedend"></li>
            </ul>
          </template>
        </div>
        <div class="d-block">
          <template v-if="tree.loading">
            <div class="d-block text-center" style="padding: 20px 0">
              <img
                src="/src/assets/icons/loading.gif"
                style="width: 40px; height: 40px"
                class="align-middle"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask-background-2 {
  background-color: rgba(255, 255, 255, 0.85);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
noindex:-o-prefocus,
input[type="number"] {
  padding-right: 1.5em;
}
@media all and (-webkit-min-device-pixel-ratio: 10000),
  not all and (-webkit-min-device-pixel-ratio: 0) {
  input[type="number"] {
    padding-right: 1.5em;
  }
}
</style>
