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
  type WatchStopHandle,
  type Ref,
  type ShallowRef,
} from "vue";
import type { PrimitiveType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";

export type DuplicateCheckerObjectType = {
  [key: string]: string;
};

const props = defineProps<{
  index: number;
  nospace: string;
  tree: {
    single: string;
    value: string[];
    index: number;
    temporary: string[];
    bottom: boolean;
    done: boolean;
    loading: boolean;
    addloading: boolean;
    tabclicked: boolean;
    tabref: HTMLButtonElement | undefined;
  };
  areatype: string;
  textAreaHeight: string;
}>();

const cards = inject("cards") as ShallowRef<PrimitiveType[]>;
const pasteditemsref = ref<HTMLDivElement[]>([]),
  lastpasteditemsref = ref(),
  newitementryinputref = ref(),
  pasteditemeditenabler = ref<Boolean[]>([]),
  pastetextarearef = ref<HTMLTextAreaElement>(),
  pasteexpanded = ref(false),
  pastedtext = ref(""),
  duplicatecount = ref<number>(0),
  errorcount = ref(0),
  pasteditemloading = ref(false),
  pasteditemcount = ref(0),
  pages = ref<string[][]>([]),
  current = ref(0),
  inputpagenumberref = ref(),
  acceptedpasteditemcount = ref(0),
  pasteditemvalidity = ref<string[][]>([]),
  pastemultiplelineitems = ref(false);

let duplicateCheckerObject = {} as DuplicateCheckerObjectType,
  unwatchpastedtext: WatchStopHandle,
  actualpastedincludedata = "",
  unwatch: WatchStopHandle,
  unwatchcurrent: WatchStopHandle,
  unwatchpagination: WatchStopHandle,
  temporary = useDebouncedRef(props.tree);

function useDebouncedRef(value: { single: string; value: string[]; index: number; temporary: string[]; done: boolean; bottom: boolean; loading: boolean; addloading: boolean; }, delay = 1) {
  let timeout: NodeJS.Timeout;
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
  actualtext: string,
  textareaacceptedtext: string
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
  return [lines, ...removeDuplicateAndValidateLine(textareaacceptedtextArray)];
}
function removeDuplicateAndValidateLine(acceptedArray: string[]) {
  let newArray: string[][] = [],
    index = 0,
    duplicate = 0,
    error = 0;
  acceptedArray.forEach((item: string, i: any) => {
    if (item.trim() !== "") {
      if (
        duplicateCheckerObject["" + item] === undefined ||
        duplicateCheckerObject["" + item] === null
      ) {
        if (!/^\s*\d+\s*$/g.test(item) && item.length <= 40) {
          duplicateCheckerObject["" + item] = "";
          newArray[index] = [item, "STRING"];
          pasteditemeditenabler.value[index] = false;
        } else {
          if (/^\s*\d+\s*$/g.test(item)) {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "NUMERIC"];
            pasteditemeditenabler.value[index] = false;
          } else {
            if (item.length > 40) {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "ERROR"];
              pasteditemeditenabler.value[index] = false;
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
function addNewIncludeOrExclude(tree: StringSearchType) {
  let includeorexclude = tree.single;
  if (includeorexclude.trim() !== "") {
    let increment = true;
    if (tree.value.length === 0) {
      increment = true;
    } else {
      let tt3: NodeJS.Timeout[] = [],
        tt3Index = 0;
      if (current.value !== 0) {
        tree.value = pages.value[pages.value.length - 1];
        current.value = pages.value.length;
        nextTick(() => triggerRef(cards));
      }
      for (let i = 0; i < tree.value.length; i++) {
        if (tree.value[i] === includeorexclude) {
          increment = false;
          scrollToElement(pasteditemsref.value[i]);
          pasteditemsref.value[i].style.backgroundColor = "red";
          pasteditemsref.value[i].style.color = "#fff";
          tt3[tt3Index] = setTimeout(() => {
            if (pasteditemsref.value[i] !== undefined && pasteditemsref.value[i] !== null) {
              if (pasteditemsref.value[i].style.backgroundColor !== "#fff") {
                pasteditemsref.value[i].style.backgroundColor = "#fff";
                pasteditemsref.value[i].style.color = "black";
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
      let t2: NodeJS.Timeout;
      t2 = setTimeout(() => {
        scrollToElement(lastpasteditemsref.value);
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
  pastemultiplelineitems.value = true;
  pasteexpanded.value = false;
  pastedtext.value = "";
  pasteditemcount.value = 0;
  pasteditemloading.value = false;
  duplicateCheckerObject = {};
  let tt: NodeJS.Timeout;
  tt = setTimeout(() => {
    (pastetextarearef.value as HTMLTextAreaElement).focus();
    clearTimeout(tt);
  }, 50);
}
function saveEditedTooLong(item: string, i: number) {
  if (item.length <= 40) {
    if (item.trim() !== "") {
      if (
        duplicateCheckerObject["" + item] === undefined ||
        duplicateCheckerObject["" + item] === null
      ) {
        if (!/^\s*\d+\s*$/g.test(item)) {
          duplicateCheckerObject["" + item] = "";
          pasteditemvalidity.value[i][1] = "STRING";
          pasteditemvalidity.value[i][0] = item;
          pasteditemeditenabler.value[i] = false;
        } else {
          duplicateCheckerObject["" + item] = "";
          pasteditemvalidity.value[i][1] = "NUMERIC";
          pasteditemvalidity.value[i][0] = item;
          pasteditemeditenabler.value[i] = false;
        }
        errorcount.value--;
      }
    }
  }
}


function scrollToElement(el: HTMLDivElement) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
function scrollInclude(e) {
  let doc = document,
    originalElement = e.srcElement || e.originalTarget,
    el = doc.getElementById(
      cards.value[props.index].scroll.areaid + "-included-" + props.areatype
    );
  if (originalElement === el) {
    if (props.tree.done === false) {
      props.tree.bottom = bottomReach(el as HTMLDivElement);
      nextTick(() => triggerRef(cards));
      if (props.tree.bottom) {
        if (
          props.tree.loading === false &&
          props.tree.value.length !== props.tree.temporary.length
        ) {
          props.tree.loading = true;
          nextTick(() => triggerRef(cards));
          let time2: NodeJS.Timeout;
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
function bottomReach(scrollarea: HTMLDivElement) {
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
    (doc
      .getElementById(
        cards.value[props.index].scroll.areaid + "-included-" + props.areatype
      ) as HTMLDivElement)
      .addEventListener("scroll", scrollInclude, true);
  }
  pastemultiplelineitems.value = false;
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
  unwatchpastedtext = watch(
    () => pastedtext.value,
    (text) => {
      if (pasteditemcount.value === 0) {
        pasteditemloading.value = true;
        pasteditemcount.value = 1;
        let pt: NodeJS.Timeout;
        pt = setTimeout(() => {
          pasteditemloading.value = false;
          pasteexpanded.value = true;
          let result = processPastedTextAndFindRejectedAndAcceptedLines(
            actualpastedincludedata,
            pastedtext.value
          );
          pasteditemvalidity.value = result[1] as string[][];
          duplicatecount.value = result[2] as number;
          errorcount.value = result[3] as number;
          acceptedpasteditemcount.value = result[0] as number;
          clearTimeout(pt);
        }, 200);

        //return [lines, newArray, duplicate, error];
      }
    }
  );
});
onBeforeUnmount(() => {
  let doc = document;
  if (unwatch) {
    unwatch();
  }
  if (unwatchpastedtext) {
    unwatchpastedtext();
  }
  if (unwatchpagination) {
    unwatchpagination();
  }
  if (unwatchcurrent) {
    unwatchcurrent();
  }
  pasteditemsref.value = [];
  lastpasteditemsref.value = null;
  newitementryinputref.value = null;
  if (
    doc.getElementById(
      cards.value[props.index].scroll.areaid + "-included-" + props.areatype
    )
  ) {
    (doc
      .getElementById(
        cards.value[props.index].scroll.areaid + "-included-" + props.areatype
      ) as HTMLDivElement)
      .removeEventListener("scroll", scrollInclude, true);
  }
});
</script>

<template>
  <div class="d-block position-relative">
    <div
      class="position-relative shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
    >
      <div class="flex-fill p-0 m-0 align-self-stretch">
        <template v-if="nospace === 'false'">
          <input
            ref="newitementryinputref"
            @keypress.enter="addNewIncludeOrExclude(tree)"
            maxlength="40"
            type="text"
            v-model="props.tree.single"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
        <template v-else>
          <input
            ref="newitementryinputref"
            @keydown.space.prevent
            @keypress.enter="addNewIncludeOrExclude(tree)"
            maxlength="40"
            type="text"
            v-model="props.tree.single"
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
    <template v-if="pastemultiplelineitems">
      <ReceiveFromClipboardAndShowPastedItemValidity></ReceiveFromClipboardAndShowPastedItemValidity>
    </template>
    <Pagination></Pagination>
    <DisplayPastedMultipleOrSingleWord></DisplayPastedMultipleOrSingleWord>
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