import {
  inject,
  triggerRef,
  ref,
  watch,
  customRef,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type ShallowRef,
  type WatchStopHandle,
} from "vue";
import type { PrimitiveType  } from "../types/SupportedDatatypesTypeDeclaration";


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

const cards = inject("cards") as ShallowRef<PrimitiveType[]>;

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
  unwatchpastefrommultipleincludetext: WatchStopHandle,
  actualpastedincludedata = "",
  unwatch: WatchStopHandle,
  unwatchcurrent: WatchStopHandle,
  unwatchpagination: WatchStopHandle,
  temporary = useDebouncedRef(props.tree);

export function useDebouncedRef(value, delay = 1) {
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
export function processPastedTextAndFindRejectedAndAcceptedLines(
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

  return [lines, removeDuplicateAndValidateLine(textareaacceptedtextArray)];
}
export function removeDuplicateAndValidateLine(acceptedArray) {
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
export function paginateFurther() {
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
export function addNewIncludeOrExclude(tree: {
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
export function openPasteArea() {
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
export function pasteMultilineWordsCopiedFromSomewhere(e) {
  pastefrommultipleincluderef.value.maxLength = 5000;
  actualpastedincludedata = handlePaste(e);
  let pastelengthresizetimer;
  clearTimeout(pastelengthresizetimer);
  pastelengthresizetimer = setTimeout(() => {
    pastefrommultipleincluderef.value.maxLength = 0;
    clearTimeout(pastelengthresizetimer);
  }, 10);
}
export function addPasted() {
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
export function saveEditedTooLong(item, i) {
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
export function handlePaste(e) {
  var clipboardData, pastedData;

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData("Text");

  return pastedData;
}
export function deletePasted(index) {
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
export function resetDoneClick(tree: {
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
export function deleteIncludeOrExclude(
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
export function previousOrNextClicked(previousornext: "PREVIOUS" | "NEXT" | "INPUT") {
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
export function scrollToElement(el) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollInclude(e) {
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

export function bottomReach(scrollarea: HTMLElement) {
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
