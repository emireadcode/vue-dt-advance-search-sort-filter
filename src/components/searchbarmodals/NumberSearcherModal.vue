<script setup lang="ts">
import { 
  type ShallowRef, 
  shallowRef, 
  onBeforeMount, 
  type Ref, 
  inject, 
  triggerRef, 
  ref, 
  watch,
  nextTick, 
  computed 
} from "vue";
import type { 
  NumberSearchExcludeFromToType, 
  NumberSearchExcludeEqualToType, 
  NumberType, 
  NumberSearchType, 
} from "../types/SupportedDatatypesTypeDeclaration";
import Paste from "./Paste.vue";
import ReusableNumberSearch from "./ReusableNumberSearch.vue";

let
  accessibility = inject("accessibility") as {
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  }
;

type NumberSearcherUIType = {
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO";
  openexclude: boolean;
  refequaltoinner: HTMLDivElement[] | [];
  refnotequaltoinner: HTMLDivElement[] | [];
  refexcludeequaltoinner: HTMLDivElement[] | [];
  refexcludefromtoinner: HTMLDivElement[] | [];
  refequalto: HTMLDivElement[] | [];
  refnotequalto: HTMLDivElement[] | [];
  refexcludeequalto: HTMLDivElement[] | [];
  refexcludefromto: HTMLDivElement[] | [];
  excludefromtoref: HTMLLIElement | null;
  excludeequaltoref: HTMLLIElement | null;
  equaltoref: HTMLLIElement | null;
  notequaltoref: HTMLLIElement | null;
  greaterthan: Ref<string>;
  lessthan: Ref<string>;
  equalto: Ref<string>;
  notequalto: Ref<string>;
  from: Ref<string>;
  to: Ref<string>;
  excludefromtofrom: Ref<string>;
  excludefromtoto: Ref<string>;
  excludeequalto: Ref<string>;
  treenotequalto: NumberSearchExcludeEqualToType;
  treeequalto: NumberSearchExcludeEqualToType;
  treeexcludeequalto: NumberSearchExcludeEqualToType;
  treeexcludefromto: NumberSearchExcludeFromToType;
};

let 
  numbersearcherui = shallowRef<NumberSearcherUIType>({
  tab: "GREATER-THAN",
  openexclude: false,
  refequaltoinner: [],
  refnotequaltoinner: [],
  refexcludeequaltoinner: [],
  refexcludefromtoinner: [],
  refequalto: [],
  refnotequalto: [],
  refexcludeequalto: [],
  refexcludefromto: [],
  excludefromtoref: null,
  excludeequaltoref: null,
  equaltoref: null,
  notequaltoref: null,
  greaterthan: ref(""),
  lessthan: ref(""),
  equalto: ref(""),
  notequalto: ref(""),
  from: ref(""),
  to: ref(""),
  excludefromtofrom: ref(""),
  excludefromtoto: ref(""),
  excludeequalto: ref(""),
  treenotequalto: {
    single: "",
    value: [],
    index: 0,
    disabled: [],
    show: [],
    loading: false,
    addloading: false,
  },
  treeequalto: {
    single: "",
    value: [],
    index: 0,
    disabled: [],
    show: [],
    loading: false,
    addloading: false,
  },
  treeexcludeequalto: {
    single: "",
    value: [],
    index: 0,
    disabled: [],
    show: [],
    loading: false,
    addloading: false,
  },
  treeexcludefromto: {
    singlefrom: "",
    singleto: "",
    from: [],
    to: [],
    index: 0,
    disabled: [],
    show: [],
    loading: false,
    addloading: false,
  },
})
;

const 
  props = defineProps<{
    index: number;
  }>(),
  cards = inject("cards") as ShallowRef<NumberType[]>
;

onBeforeMount(() => {
  (numbersearcherui.value as NumberSearcherUIType).openexclude = false;
  (numbersearcherui.value as NumberSearcherUIType).greaterthan.value = cards.value[props.index].search.greaterthan as string;
  (numbersearcherui.value as NumberSearcherUIType).lessthan.value = cards.value[props.index].search.lessthan as string;
  (numbersearcherui.value as NumberSearcherUIType).equalto.value = cards.value[props.index].search.equalto?.single as string;
  (numbersearcherui.value as NumberSearcherUIType).notequalto.value = cards.value[props.index].search.notequalto?.single as string;
  (numbersearcherui.value as NumberSearcherUIType).from.value = cards.value[props.index].search.fromto?.from as string;
  (numbersearcherui.value as NumberSearcherUIType).to.value = cards.value[props.index].search.fromto?.to as string;
  (numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value = cards.value[props.index].search.exclude?.fromto?.singlefrom as string;
  (numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value = cards.value[props.index].search.exclude?.fromto?.singleto as string;
  (numbersearcherui.value as NumberSearcherUIType).excludeequalto.value = cards.value[props.index].search.exclude?.equalto?.single as string;
  (numbersearcherui.value as NumberSearcherUIType).treenotequalto = cards.value[props.index].search.notequalto as NumberSearchExcludeEqualToType;
  (numbersearcherui.value as NumberSearcherUIType).treeequalto = cards.value[props.index].search.equalto as NumberSearchExcludeEqualToType;
  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto = cards.value[props.index].search.exclude?.equalto as NumberSearchExcludeEqualToType;
  (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto = cards.value[props.index].search.exclude?.fromto as NumberSearchExcludeFromToType
  triggerRef(numbersearcherui);
});

function openExcludeWindow() {
  if (
    (numbersearcherui.value as NumberSearcherUIType).greaterthan.value ||
    (numbersearcherui.value as NumberSearcherUIType).lessthan.value ||
    (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index > 0 ||
    (numbersearcherui.value as NumberSearcherUIType).notequalto.value || (
      (numbersearcherui.value as NumberSearcherUIType).from.value &&
      (numbersearcherui.value as NumberSearcherUIType).to.value
    )
  ) {
    (numbersearcherui.value as NumberSearcherUIType).openexclude = true;
    triggerRef(numbersearcherui);
  }
}

function setTabs(
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO"
) {
  (numbersearcherui.value as NumberSearcherUIType).tab = tab;
  triggerRef(numbersearcherui);
}

function triggerNumberSearcherUI() {
  triggerRef(numbersearcherui);
}

function scrollToElement(el: HTMLDivElement | HTMLLIElement) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function excludeFromToGuard(from: string, to: string) {
  if ((numbersearcherui.value as NumberSearcherUIType).tab === "GREATER-THAN") {
    let grt = (numbersearcherui.value as NumberSearcherUIType).greaterthan.value;
    if (parseFloat(from) > parseFloat(grt) && parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  } else if ((numbersearcherui.value as NumberSearcherUIType).tab === "LESS-THAN") {
    let lst = (numbersearcherui.value as NumberSearcherUIType).lessthan.value;
    if (parseFloat(to) <= parseFloat(lst) && parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  }
}

function deleteSaved(
  index: number,
  treetype: "NOT-EQUAL-TO" | "EXCLUDE-FROM-TO" | "EQUAL-TO" | "EXCLUDE-EQUAL-TO"
) {
  switch (treetype) {
    case "NOT-EQUAL-TO":
      for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value.length; i++) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
    case "EQUAL-TO":
      for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeequalto.value.length; i++) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.value.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
    case "EXCLUDE-EQUAL-TO":
      for (
        let i = 0;
        i < (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.length;
        i++
      ) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
    default:
      for (
        let i = 0;
        i < (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.length;
        i++
      ) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
  }
}

function increaseIndexAndSavePrevious(
  rangeornot: string,
  debouncedref: string | string[],
  buttontype: string
) {
  if (rangeornot === "RANGE") {
    let from = debouncedref[0],
      to = debouncedref[1];
    if (from && to) {
      if (excludeFromToGuard(from, to)) {
        if ((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.length === 0) {
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.length; i++) {
            if (
              parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) >= parseFloat(from) &&
              parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) <= parseFloat(to)
            ) {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[i]);
              (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled[i] = false;
              triggerRef(numbersearcherui);

              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled[i] = true;
                numbersearcherui.value = numbersearcherui.value;
                scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[i]);
                (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show[i] = false;
                triggerRef(numbersearcherui);
                clearTimeout(time);
              }, 100);
            }
          }
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.length; i++) {
            if (
              parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) >= parseFloat(from) &&
              parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) <= parseFloat(to)
            ) {
              let time: NodeJS.Timeout;
              time = setInterval(() => {
                if ((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show[i] === false) {
                  scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[i]);
                  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show.splice(i, 1);
                  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.splice(i, 1);
                  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled.splice(i, 1);
                  triggerRef(numbersearcherui);
                  clearInterval(time);
                }
              }, 50);
            }
          }
          (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.push(from);
          (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to.push(to);
          (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled.push(false);
          (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.show.push(true);
          (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index++;

          triggerRef(numbersearcherui);

          let time1: NodeJS.Timeout;
          time1 = setTimeout(() => {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).excludefromtoref as HTMLLIElement);
            clearTimeout(time1);
          }, 50);
        } else {
          let
            fromwithinpreviousrange = false,
            fromwithinpreviousrangeindex = 0
          ;
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.length; i++) {
            if (
              (
                parseFloat(from) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from[i])
                &&
                parseFloat(from) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to[i])
              )
              ||
              (
                parseFloat(from) < parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from[i])
                &&
                parseFloat(to) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from[i])
                &&
                (
                  parseFloat(to) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to[i]) 
                  ||
                  parseFloat(to) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to[i])
                )
              )
            ) {
              fromwithinpreviousrange = true;
              fromwithinpreviousrangeindex = i;
              break;
            }
          }
          if (!fromwithinpreviousrange) {
            for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.length; i++) {
              if (
                parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) >= parseFloat(from) 
                &&
                parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) <= parseFloat(to)
              ) {
                scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[i]);
                (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled[i] = false;
                triggerRef(numbersearcherui);

                let time: NodeJS.Timeout;
                time = setTimeout(() => {
                  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled[i] = true;
                  numbersearcherui.value = numbersearcherui.value;
                  scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[i]);
                  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show[i] = false;
                  triggerRef(numbersearcherui);
                  clearTimeout(time);
                }, 100);
              }
            }
            for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.length; i++) {
              if (
                parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) >= parseFloat(from) &&
                parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]) <= parseFloat(to)
              ) {
                let time: NodeJS.Timeout;
                time = setInterval(() => {
                  if ((numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show[i] === false) {
                    scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[i]);
                    (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show.splice(i, 1);
                    (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.splice(i, 1);
                    (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled.splice(i, 1);
                    triggerRef(numbersearcherui);
                    clearInterval(time);
                  }
                }, 50);
              }
            }
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.push(from);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to.push(to);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled.push(false);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.show.push(true);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index++;
            triggerRef(numbersearcherui);

            nextTick(() => {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).excludefromtoref as HTMLLIElement);
            });
          } else {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludefromto[fromwithinpreviousrangeindex]);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled[fromwithinpreviousrangeindex] = false;
            triggerRef(numbersearcherui);

            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[
                fromwithinpreviousrangeindex
              ].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled[fromwithinpreviousrangeindex] = true;
              numbersearcherui.value = numbersearcherui.value;

              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);

            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[fromwithinpreviousrangeindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[fromwithinpreviousrangeindex] !== null
              ) {
                if (
                  (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[fromwithinpreviousrangeindex].style
                    .backgroundColor !== "#fff"
                )
                (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[
                    fromwithinpreviousrangeindex
                  ].style.backgroundColor = "#fff";
              }
              clearTimeout(time2);
            }, 400);
            //excludefromtofrom.value = '';
            //excludefromtoto.value = '';
          }
        }
      }
    }
  } else {
    if (typeof debouncedref === 'string') {
      let found = false,
        foundindex = 0;
      for (
        let i = 0; 
        i < ((buttontype === 'EQUAL-TO') ?
          (numbersearcherui.value as NumberSearcherUIType).treeequalto.value.length
          : (
            buttontype === 'NOT-EQUAL-TO'?
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value.length
            :
            (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.length
          ))
        ; 
        i++
      ) {
        if (
          (
            (buttontype === 'EQUAL-TO') ?
              (numbersearcherui.value as NumberSearcherUIType).treeequalto.value[i]
              : (
                  (buttontype === 'NOT-EQUAL-TO') ?
                    (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value[i]
                    :
                    (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value[i]
                )
          )
          === debouncedref
        ) {
          found = true;
          foundindex = i;
          break;
        }
      }
      switch (buttontype) {
        case "EQUAL-TO":
          if (!found) {
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.value.push(debouncedref as string);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.disabled.push(false);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.show.push(true);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.index++;
            triggerRef(numbersearcherui);
            let time: NodeJS.Timeout;
            time = setTimeout(() => {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).equaltoref as HTMLLIElement);
              clearTimeout(time);
            }, 50);
          } else {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).refequalto[foundindex]);
            (numbersearcherui.value as NumberSearcherUIType).treeequalto.disabled[foundindex] = false;
            triggerRef(numbersearcherui);

            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType).refequaltoinner[foundindex].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType).treeequalto.disabled[foundindex] = true;
              numbersearcherui.value = numbersearcherui.value;
              triggerRef(numbersearcherui);
              clearTimeout(time1);
            });
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType).refequaltoinner[foundindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType).refequaltoinner[foundindex] !== null
              ) {
                if ((numbersearcherui.value as NumberSearcherUIType).refequaltoinner[foundindex].style.backgroundColor !== "#fff") {
                  (numbersearcherui.value as NumberSearcherUIType).refequaltoinner[foundindex].style.backgroundColor = "#fff";
                  triggerRef(numbersearcherui);
                }
              }
              clearTimeout(time2);
            }, 400);
          }
          (numbersearcherui.value as NumberSearcherUIType).equalto.value = "";
          break;
        case "NOT-EQUAL-TO":
          if (!found) {
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value.push(debouncedref);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.disabled.push(false);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.show.push(true);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index++;
            triggerRef(numbersearcherui);
            let time: NodeJS.Timeout;
            time = setTimeout(() => {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).notequaltoref as HTMLLIElement);
              clearTimeout(time);
            }, 50);
          } else {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).refnotequalto[foundindex]);
            (numbersearcherui.value as NumberSearcherUIType).treenotequalto.disabled[foundindex] = false;
            triggerRef(numbersearcherui);

            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).refnotequaltoinner[foundindex].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType).treenotequalto.disabled[foundindex] = true;
              numbersearcherui.value = numbersearcherui.value;
              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType).refnotequaltoinner[foundindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType).refnotequaltoinner[foundindex] !== null
              ) {
                if ((numbersearcherui.value as NumberSearcherUIType).refnotequaltoinner[foundindex].style.backgroundColor !== "#fff") {
                  (numbersearcherui.value as NumberSearcherUIType).refnotequaltoinner[foundindex].style.backgroundColor = "#fff";
                  triggerRef(numbersearcherui);
                }
              }
              clearTimeout(time2);
            }, 400);
          }
          (numbersearcherui.value as NumberSearcherUIType).notequalto.value = "";
          break;
        default:
          let fromwithinpreviousrange = false,
            fromwithinpreviousrangeindex = 0;
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from.length; i++) {
            if (
              parseFloat(debouncedref) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.from[i]) &&
              parseFloat(debouncedref) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.to[i])
            ) {
              fromwithinpreviousrange = true;
              fromwithinpreviousrangeindex = i;
              break;
            }
          }
          if (fromwithinpreviousrange) {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludefromto[fromwithinpreviousrangeindex]);
            (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled[fromwithinpreviousrangeindex] = false;
            triggerRef(numbersearcherui);

            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[
                fromwithinpreviousrangeindex
              ].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.disabled[fromwithinpreviousrangeindex] = true;
              numbersearcherui.value = numbersearcherui.value;

              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);

            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[fromwithinpreviousrangeindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[fromwithinpreviousrangeindex] !== null
              ) {
                if (
                  (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[fromwithinpreviousrangeindex].style
                    .backgroundColor !== "#fff"
                ) {
                  (numbersearcherui.value as NumberSearcherUIType).refexcludefromtoinner[
                    fromwithinpreviousrangeindex
                  ].style.backgroundColor = "#fff";
                  triggerRef(numbersearcherui);
                }
              }
              clearTimeout(time2);
            }, 400);
          } else {
            if (!found) {
              (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.value.push(debouncedref);
              (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled.push(false);
              (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.show.push(true);
              (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index++;
              triggerRef(numbersearcherui);
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                scrollToElement((numbersearcherui.value as NumberSearcherUIType).excludeequaltoref as HTMLLIElement);
                clearTimeout(time);
              }, 50);
            } else {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).refexcludeequalto[foundindex]);
              (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled[foundindex] = false;
              triggerRef(numbersearcherui);

              let time1: NodeJS.Timeout;
              time1 = setTimeout(() => {
                (numbersearcherui.value as NumberSearcherUIType).refexcludeequaltoinner[foundindex].style.backgroundColor = "#66bb6a";
                (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.disabled[foundindex] = true;
                numbersearcherui.value = numbersearcherui.value;
                triggerRef(numbersearcherui);
                clearTimeout(time1);
              },100);
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                if (
                  (numbersearcherui.value as NumberSearcherUIType).refexcludeequaltoinner[foundindex] !== undefined &&
                  (numbersearcherui.value as NumberSearcherUIType).refexcludeequaltoinner[foundindex] !== null
                ) {
                  if (
                    (numbersearcherui.value as NumberSearcherUIType).refexcludeequaltoinner[foundindex].style.backgroundColor !==
                    "#fff"
                  ) {
                    (numbersearcherui.value as NumberSearcherUIType).refexcludeequaltoinner[foundindex].style.backgroundColor =
                      "#fff";
                    triggerRef(numbersearcherui);
                  }
                }
                clearTimeout(time2);
              }, 400);
            }
          }
          (numbersearcherui.value as NumberSearcherUIType).excludeequalto.value = "";
          break;
      }
    }
  }
  triggerRef(numbersearcherui);
}

function resetOthers(pressedinput: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO") {
  if (pressedinput === "GREATER-THAN") {
    if((numbersearcherui.value as NumberSearcherUIType).greaterthan.value.length > 0) {
      (numbersearcherui.value as NumberSearcherUIType).lessthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).from.value = "";
      (numbersearcherui.value as NumberSearcherUIType).to.value = "";
      (numbersearcherui.value as NumberSearcherUIType).equalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).notequalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.index = 0;
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index = 0;
    }
  } else if (pressedinput === "LESS-THAN") {
    if((numbersearcherui.value as NumberSearcherUIType).lessthan.value.length > 0) {
      (numbersearcherui.value as NumberSearcherUIType).greaterthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).from.value = "";
      (numbersearcherui.value as NumberSearcherUIType).to.value = "";
      (numbersearcherui.value as NumberSearcherUIType).equalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).notequalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.index = 0;
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index = 0;
    }
  } else if (pressedinput === "EQUAL-TO") {
    if((numbersearcherui.value as NumberSearcherUIType).equalto.value.length > 0) {
      (numbersearcherui.value as NumberSearcherUIType).greaterthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).lessthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).from.value = "";
      (numbersearcherui.value as NumberSearcherUIType).to.value = "";
      (numbersearcherui.value as NumberSearcherUIType).notequalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index = 0;
    }
  } else if (pressedinput === "NOT-EQUAL-TO") {
    if((numbersearcherui.value as NumberSearcherUIType).notequalto.value.length > 0) {
      (numbersearcherui.value as NumberSearcherUIType).greaterthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).lessthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).from.value = "";
      (numbersearcherui.value as NumberSearcherUIType).to.value = "";
      (numbersearcherui.value as NumberSearcherUIType).equalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.index = 0;
    }
  } else {
    if(
      (numbersearcherui.value as NumberSearcherUIType).from.value.length > 0
      ||
      (numbersearcherui.value as NumberSearcherUIType).to.value.length > 0
    ) {
      (numbersearcherui.value as NumberSearcherUIType).greaterthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).lessthan.value = "";
      (numbersearcherui.value as NumberSearcherUIType).equalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).notequalto.value = "";
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.value = [];
      (numbersearcherui.value as NumberSearcherUIType).treeequalto.index = 0;
      (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index = 0;
    }
  }
  (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto = {
    singlefrom: "",
    singleto: "",
    from: [],
    to: [],
    index: 0,
    disabled: [],
    show: [],
    loading: false,
    addloading: false,
  } as NumberSearchExcludeFromToType;
  (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto = {
    single: "",
    value: [],
    index: 0,
    disabled: [],
    show: [],
    loading: false,
    addloading: false,
  } as NumberSearchExcludeEqualToType;
  setTabs(pressedinput);
  triggerRef(numbersearcherui);
}

const excludeAddNewFromTo = computed(() => {
  if ((numbersearcherui.value as NumberSearcherUIType).tab === "GREATER-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) <=
        parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) <
        parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value)
    );
  } else if ((numbersearcherui.value as NumberSearcherUIType).tab === "LESS-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) >
        parseFloat(cards.value[props.index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) >=
        parseFloat(cards.value[props.index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value)
    );
  } else {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value)
    );
  }
});

const excludeAddNewEqualto = computed(() => {
  if ((numbersearcherui.value as NumberSearcherUIType).tab === "GREATER-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) <= parseFloat(cards.value[props.index].result.max)
    );
  } else if ((numbersearcherui.value as NumberSearcherUIType).tab === "LESS-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) >= parseFloat(cards.value[props.index].result.min)
    );
  } else {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value)
    );
  }
});

const excludeDone = computed(() => {
  if ((numbersearcherui.value as NumberSearcherUIType).tab === "GREATER-THAN") {
    return (
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) <
          parseFloat(cards.value[props.index].result.max) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) <=
          parseFloat(cards.value[props.index].result.max)) ||
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) <=
          parseFloat(cards.value[props.index].result.max)) ||
      (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index > 0 ||
      (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index > 0
    );
  } else if ((numbersearcherui.value as NumberSearcherUIType).tab === "LESS-THAN") {
    return (
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) >=
          parseFloat(cards.value[props.index].result.min) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) >
          parseFloat(cards.value[props.index].result.min)) ||
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) >=
          parseFloat(cards.value[props.index].result.min)) ||
      (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index > 0 ||
      (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index > 0
    );
  } else {
    return (
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value)) ||
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value)) ||
      (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index > 0 ||
      (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index > 0
    );
  }
});

const excludeClear = computed(() => {
  return (
    (numbersearcherui.value as NumberSearcherUIType).excludefromtofrom ||
    (numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value ||
    (numbersearcherui.value as NumberSearcherUIType).excludeequalto ||
    (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index > 0 ||
    (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index > 0
  );
});

const done = computed(() => {
  return (
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).treeequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).equalto.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).equalto.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).notequalto.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).notequalto.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) >= parseFloat(cards.value[props.index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) >= parseFloat(cards.value[props.index].result.min)
    )
  );
});

const exclude = computed(() => {
  return (
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) >= parseFloat(cards.value[props.index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) >= parseFloat(cards.value[props.index].result.min)
    )
  );
});

const clear = computed(() => {
  return (
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).greaterthan.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).lessthan.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).treeequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).equalto.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).equalto.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).notequalto.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).notequalto.value) >= parseFloat(cards.value[props.index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).from.value) >= parseFloat(cards.value[props.index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) <= parseFloat(cards.value[props.index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).to.value) >= parseFloat(cards.value[props.index].result.min)
    )
  );
});

const equaltoAddNew = computed(() => {
  return (
    parseFloat((numbersearcherui.value as NumberSearcherUIType).equalto.value) <= parseFloat(cards.value[props.index].result.max) &&
    parseFloat((numbersearcherui.value as NumberSearcherUIType).equalto.value) >= parseFloat(cards.value[props.index].result.min)
  );
});

const notequaltoAddNew = computed(() => {
  return (
    parseFloat((numbersearcherui.value as NumberSearcherUIType).notequalto.value) <= parseFloat(cards.value[props.index].result.max) &&
    parseFloat((numbersearcherui.value as NumberSearcherUIType).notequalto.value) >= parseFloat(cards.value[props.index].result.min)
  );
});

watch(
  () => (numbersearcherui.value as NumberSearcherUIType).treeexcludeequalto.index,
  (x) => {
    (numbersearcherui.value as NumberSearcherUIType).excludeequalto.value = "";
    triggerRef(numbersearcherui);
  }
);
watch(
  () => (numbersearcherui.value as NumberSearcherUIType).treeexcludefromto.index,
  (x) => {
    (numbersearcherui.value as NumberSearcherUIType).excludefromtoto.value = "";
    (numbersearcherui.value as NumberSearcherUIType).excludefromtofrom.value = "";
    triggerRef(numbersearcherui);
  }
);
watch(
  () => (numbersearcherui.value as NumberSearcherUIType).treeequalto.index,
  (x) => {
    (numbersearcherui.value as NumberSearcherUIType).equalto.value = "";
    triggerRef(numbersearcherui);
  }
);
watch(
  () => (numbersearcherui.value as NumberSearcherUIType).treenotequalto.index,
  (x) => {
    (numbersearcherui.value as NumberSearcherUIType).notequalto.value = "";
    triggerRef(numbersearcherui);
  }
);

</script>

<template>  
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800"
    >
      <div class="modal-mask h-100 w-100 modal-mask-background-1">
        <div class="modal-wrapper text-center">
          <div class="modal-container d-block">
            <div class="d-block" style="height:585px;">
              <div
                style="background-color: #fff; padding: 10px 5px 0 5px;white-space: nowrap;"
                class="shadow-sm d-block overflow-x-scroll"
              >
                <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                  <li
                    class="flex-shrink-0 flex-grow-0 align-self-stretch"
                  >
                    <button 
                      aria-disabled="true" 
                      class="text-lowercase tab" 
                      style="padding:5px 8px;font-size:1em;background-color:#F0E68C;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                    >
                      {{ cards[index].info.name }}
                    </button>
                  </li>
                </ul>
              </div>
              <div class="d-block position-relative">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                  style="padding: 10px 0"
                >
                  <div class="flex-w-50">
                    <span
                      class="d-inline-block p-0 m-0 letter-spacing align-middle"
                    >
                      Max: 
                      {{ cards[index].result.max }}
                    </span>
                  </div>
                  <div class="flex-w-50">
                    <span
                      class="d-inline-block p-0 m-0 letter-spacing align-middle"
                    >
                      Min: 
                      {{ cards[index].result.min }}
                    </span>
                  </div>
                </div>
                <ReusableNumberSearch></ReusableNumberSearch>
                <div v-if="(numbersearcherui as NumberSearcherUIType).openexclude" class="d-block position-absolute t-0 l-0" style="background-color:#fff;z-index:9000;">
                  <div class="d-block m-0 p-0">
                    <div class="d-block">
                      <div
                        class="shadow-sm d-block text-center"
                        style="background-color: blue;padding: 0 10px;"
                      >
                        <a
                          class="underline-none cursor-pointer align-middle"
                          @click="() => { (numbersearcherui as NumberSearcherUIType).openexclude = false; triggerNumberSearcherUI(); }"
                        >
                          <img
                            src="/src/assets/icons/close.png"
                            class="align-middle"
                            style="width: 35px; height: 35px"
                          />
                        </a>
                      </div>
                      <div
                        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                        style="padding: 10px 0"
                      >
                        <div class="flex-w-50">
                          <span
                            class="d-inline-block p-0 m-0 letter-spacing align-middle"
                          >
                            Max:
                              {{
                                (numbersearcherui as NumberSearcherUIType).tab ===
                                "GREATER-THAN"
                                  ? cards[index].result.max
                                  : (numbersearcherui as NumberSearcherUIType).tab ===
                                    "LESS-THAN"
                                  ? (numbersearcherui as NumberSearcherUIType).lessthan.value
                                  : (numbersearcherui as NumberSearcherUIType).to.value
                              }}
                          </span>
                        </div>
                        <div class="flex-w-50">
                          <span
                            class="d-inline-block p-0 m-0 letter-spacing align-middle"
                          >
                            Min:
                              {{
                                (numbersearcherui as NumberSearcherUIType).tab === "LESS-THAN"
                                  ? cards[index].result.min
                                  : (numbersearcherui as NumberSearcherUIType).tab ===
                                    "GREATER-THAN"
                                  ? (numbersearcherui as NumberSearcherUIType).greaterthan.value
                                  : (numbersearcherui as NumberSearcherUIType).from.value
                              }}
                          </span>
                        </div>
                      </div>
                      <template
                        v-if="
                          (numbersearcherui as NumberSearcherUIType).tab === 'GREATER-THAN'
                        "
                      >
                        <div
                          class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center shadow-sm"
                          style="padding: 5px 10px"
                        >
                          <div
                            class="flex-shrink-0 flex-grow-0 align-middle p-0 m-0"
                          >
                            <img
                              src="/src/assets/icons/greater-than.png"
                              style="width: 25px; height: 25px"
                              class="align-middle"
                            />
                          </div>
                          <div
                            class="m-0 flex-shrink-0 flex-grow-0 letter-spacing font-bold align-middle"
                            style="padding: 5px 0 1px 5px"
                          >
                            {{ (numbersearcherui as NumberSearcherUIType).greaterthan.value }}
                          </div>
                        </div>
                      </template>
                      <template
                        v-else-if="
                          (numbersearcherui as NumberSearcherUIType).tab === 'LESS-THAN'
                        "
                      >
                        <div
                          class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center shadow-sm"
                          style="padding: 5px 10px"
                        >
                          <div
                            class="flex-shrink-0 flex-grow-0 align-middle p-0 m-0"
                          >
                            <img
                              src="/src/assets/icons/less-than.png"
                              style="width: 25px; height: 25px"
                              class="align-middle"
                            />
                          </div>
                          <div
                            class="m-0 flex-shrink-0 flex-grow-0 letter-spacing font-bold align-middle"
                            style="padding: 5px 0 1px 5px"
                          >
                            {{ (numbersearcherui as NumberSearcherUIType).lessthan.value }}
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="d-block shadow-sm text-center"
                          style="padding: 5px 10px"
                        >
                          <img
                            src="/src/assets/icons/range.png"
                            style="width: 25px; height: 25px"
                            class="align-middle"
                          />
                        </div>
                      </template>
                      <div
                        class="d-block text-center"
                        style="padding: 10px 0 5px 0"
                      >
                        <span
                          class="d-inline-block letter-spacing font-bold font-0-dot-70-rem"
                        >Exclude By</span>
                      </div>
                      <div class="d-block" style="padding: 5px">
                        <div class="d-block">
                          <div
                            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                          >
                            <div
                              class="flex-w-60"
                              style="padding-right: 5px"
                            >
                              <div
                                class="d-block text-center shadow-sm"
                                style="padding: 5px 0"
                              >
                                <span
                                  class="d-inline-block letter-spacing font-0-dot-80-rem"
                                >RANGE</span>
                              </div>
                              <div
                                class="d-block shadow-sm"
                                style="padding: 10px 5px 5px"
                              >
                                <div
                                  class="w-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                                >
                                  <div
                                    class="flex-fill p-0 m-0 align-self-stretch"
                                  >
                                    <div class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center">
                                      <div
                                        class="flex-w-50 p-0 m-0 align-self-stretch"
                                      >
                                        <div
                                          class="d-block"
                                          style="padding-bottom: 5px"
                                        >
                                          <label>From</label>
                                        </div>
                                        <div class="d-block">
                                          <input
                                            @keydown.space.prevent
                                            v-model.trim="
                                              (numbersearcherui as NumberSearcherUIType).excludefromtofrom.value
                                            "
                                            type="text"
                                            class="w-100 text-center"
                                            style="height: 30px;z-index: 1110;"
                                          />
                                        </div>
                                      </div>
                                      <div
                                        class="flex-w-50 p-0 m-0 align-self-stretch"
                                      >
                                        <div
                                          class="d-block"
                                          style="padding-bottom: 5px"
                                        >
                                          <label>To</label>
                                        </div>
                                        <div class="d-block">
                                          <input
                                            @keydown.space.prevent
                                            v-model.trim="(numbersearcherui as NumberSearcherUIType).excludefromtoto.value"
                                            type="text"
                                            class="w-100 text-center"
                                            style="height: 30px;z-index: 1110;"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                                  >
                                    <div
                                      class="d-block"
                                      style="padding-bottom: 5px"
                                    >
                                      <label>&nbsp;</label>
                                    </div>
                                    <div class="d-block" style="outline: 1px solid rgba(0, 0, 0, 0.2)">
                                      <button
                                        :style="
                                        excludeAddNewFromTo
                                          ? 'background-color: #F0E68C;'
                                          : 'background-color: #eee;'
                                        "
                                        :disabled="
                                          excludeAddNewFromTo
                                            ? false
                                            : true
                                        "
                                        @click="
                                          () => {
                                            increaseIndexAndSavePrevious(
                                              'RANGE',
                                              [
                                                (numbersearcherui as NumberSearcherUIType).excludefromtofrom.value,
                                                (numbersearcherui as NumberSearcherUIType).excludefromtoto.value,
                                              ],
                                              'EXCLUDE-FROM-TO'
                                            );
                                          }
                                        "
                                        class="btn w-100 shadow-sm font-0-dot-85-rem text-center"
                                        style="height:29px; padding:0 2px;"
                                      >
                                        <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <Paste
                                  title="range"
                                  :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
                                  :max="((
                                    (numbersearcherui as NumberSearcherUIType).tab ===
                                      'GREATER-THAN'
                                        ? cards[index].result.max
                                        : (numbersearcherui as NumberSearcherUIType).tab ===
                                          'LESS-THAN'
                                        ? (numbersearcherui as NumberSearcherUIType).lessthan.value
                                        : (numbersearcherui as NumberSearcherUIType).to.value
                                  ) as string)"
                                  :min="((
                                    (numbersearcherui as NumberSearcherUIType).tab === 'LESS-THAN'
                                      ? cards[index].result.min
                                      : (numbersearcherui as NumberSearcherUIType).tab ===
                                        'GREATER-THAN'
                                      ? (numbersearcherui as NumberSearcherUIType).greaterthan.value
                                      : (numbersearcherui as NumberSearcherUIType).from.value
                                  ) as string)"
                                  :text-area-height="'height:450px;'"
                                >
                                  <template v-slot:controlbuttons></template>
                                  <template v-slot:outcomeidentifier>
                                    <div
                                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                    >
                                      <div class="flex-fill text-center">
                                        <div
                                          class="d-inline-block align-middle"
                                          style="background-color: #fff; width: 15px; height: 15px"
                                        ></div>
                                        Pasted Lines
                                      </div>
                                      <div class="flex-fill text-center">
                                        <div
                                          class="d-inline-block align-middle"
                                          style="background-color: red; width: 15px; height: 15px"
                                        ></div>
                                        Invalid Numbers
                                      </div>
                                    </div>
                                  </template>
                                </Paste>
                                <div
                                  class="d-block overflow-y-auto overflow-x-hidden"
                                  style="height: 180px; z-index: 1000"
                                >
                                  <ul
                                    class="d-block list-style-none m-0"
                                    style="padding: 5px 0px"
                                  >
                                    <li
                                      class="w-100"
                                      v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).treeexcludefromto.from"
                                      :key="
                                        (numbersearcherui as NumberSearcherUIType).tab +
                                        '-EXCLUDE-FROM-TO' +
                                        dindex
                                      "
                                    >
                                      <Transition>
                                        <div
                                          :ref="
                                            (el) => {
                                              (numbersearcherui as NumberSearcherUIType).refexcludefromto[
                                                dindex
                                              ] = el as HTMLDivElement;
                                            }
                                          "
                                          v-if="
                                            (numbersearcherui as NumberSearcherUIType).treeexcludefromto.show[
                                              dindex
                                            ]
                                          "
                                          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                                          style="padding: 1px 5px"
                                          :class="{
                                            shake:
                                              (numbersearcherui as NumberSearcherUIType).treeexcludefromto
                                                .disabled[dindex],
                                          }"
                                        >
                                          <div
                                            class="flex-shrink-0 flex-grow-0"
                                          >
                                            <a
                                              @click="
                                                deleteSaved(
                                                  dindex,
                                                  'EXCLUDE-FROM-TO'
                                                )
                                              "
                                              class="remove-selected m-0 d-inline-block underline-none"
                                            >
                                              <img
                                                class="align-middle"
                                                src="/src/assets/icons/close.png"
                                                style="width: 25px;height: 25px;"
                                              />
                                            </a>
                                          </div>
                                          <div
                                            class="flex-fill"
                                            style="padding-left: 5px"
                                          >
                                            <div
                                              class="d-block"
                                              style="padding: 5px"
                                            >
                                              <div
                                                :ref="
                                                  (el) => {
                                                    (numbersearcherui as NumberSearcherUIType).refexcludefromtoinner[
                                                      dindex
                                                    ] = el as HTMLDivElement;
                                                  }
                                                "
                                                class="d-block text-wrap text-break shadow-sm"
                                                style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                                              >
                                                <label
                                                  class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                                                >
                                                  {{
                                                    (numbersearcherui as NumberSearcherUIType).treeexcludefromto.from[
                                                      dindex
                                                    ]
                                                  }}
                                                  -
                                                  {{
                                                    (numbersearcherui as NumberSearcherUIType).treeexcludefromto.to[
                                                      dindex
                                                    ]
                                                  }}
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Transition>
                                    </li>
                                    <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).excludefromtoref = el as HTMLLIElement"></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div
                              class="flex-w-40"
                              style="padding-left: 5px"
                            >
                              <div
                                class="d-block text-center shadow-sm"
                                style="padding: 5px 0"
                              >
                                <span
                                  class="d-inline-block letter-spacing font-0-dot-80-rem"
                                >EQUAL TO</span>
                              </div>
                              <div
                                class="d-block shadow-sm"
                                style="padding: 10px 5px 8px 5px"
                              >
                                <div
                                  class="d-block"
                                  style="padding-bottom: 5px"
                                >
                                  <img
                                    src="/src/assets/icons/equal-to.png"
                                    class="align-middle"
                                    style="width: 24px; height: 24px"
                                  />
                                </div>
                                <div
                                  class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                >
                                  <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right:2px;">
                                    <input
                                      v-model.trim="(numbersearcherui as NumberSearcherUIType).excludeequalto.value"
                                      type="text"
                                      @keydown.space.prevent
                                      class="w-100 text-center"
                                      style="height: 30px;z-index: 1110;"
                                    />
                                  </div>
                                  <div
                                    class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                                    style="outline: 1px solid rgba(0, 0, 0, 0.2)"
                                  >
                                    <button
                                      @click="
                                        () => {
                                          increaseIndexAndSavePrevious(
                                            'NON-RANGE',
                                            (numbersearcherui as NumberSearcherUIType).excludeequalto.value,
                                            'EXCLUDE-EQUAL-TO'
                                          );
                                        }
                                      "
                                      class="btn w-100 shadow-sm font-0-dot-85-rem"
                                      style="height:28px; padding:0 2px;"
                                      :style="
                                        excludeAddNewEqualto
                                          ? 'background-color: #F0E68C;'
                                          : 'background-color: #eee;'
                                      "
                                      :disabled="
                                        excludeAddNewEqualto
                                        ? false
                                        : true
                                      "
                                    >
                                      <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                                    </button>
                                  </div>
                                </div>
                                <Paste
                                  title="numbers"
                                  :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
                                  :max="((
                                    (numbersearcherui as NumberSearcherUIType).tab ===
                                      'GREATER-THAN'
                                        ? cards[index].result.max
                                        : (numbersearcherui as NumberSearcherUIType).tab ===
                                          'LESS-THAN'
                                        ? (numbersearcherui as NumberSearcherUIType).lessthan.value
                                        : (numbersearcherui as NumberSearcherUIType).to.value
                                  ) as string)"
                                  :min="((
                                    (numbersearcherui as NumberSearcherUIType).tab === 'LESS-THAN'
                                      ? cards[index].result.min
                                      : (numbersearcherui as NumberSearcherUIType).tab ===
                                        'GREATER-THAN'
                                      ? (numbersearcherui as NumberSearcherUIType).greaterthan.value
                                      : (numbersearcherui as NumberSearcherUIType).from.value
                                  ) as string)"
                                  :text-area-height="'height:450px;'"
                                >
                                  <template v-slot:controlbuttons></template>
                                  <template v-slot:outcomeidentifier>
                                    <div
                                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                    >
                                      <div class="flex-fill text-center">
                                        <div
                                          class="d-inline-block align-middle"
                                          style="background-color: #fff; width: 15px; height: 15px"
                                        ></div>
                                        Pasted Lines
                                      </div>
                                      <div class="flex-fill text-center">
                                        <div
                                          class="d-inline-block align-middle"
                                          style="background-color: red; width: 15px; height: 15px"
                                        ></div>
                                        Invalid Numbers
                                      </div>
                                    </div>
                                  </template>
                                </Paste>
                                <div
                                  class="d-block overflow-y-auto overflow-x-hidden"
                                  style="height: 180px; z-index: 1000"
                                >
                                  <ul
                                    class="d-block list-style-none m-0"
                                    style="padding: 5px 0px"
                                  >
                                    <li
                                      class="w-100"
                                      v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).treeexcludeequalto.value"
                                      :key="
                                      (numbersearcherui as NumberSearcherUIType).tab +
                                      '-EXCLUDE-EQUAL-TO' +
                                      dindex
                                      "
                                    >
                                      <Transition>
                                        <div
                                          :ref="
                                            (el) => {
                                              (numbersearcherui as NumberSearcherUIType).refexcludeequalto[
                                                dindex
                                              ] = el as HTMLDivElement;
                                            }
                                          "
                                          v-if="
                                            (numbersearcherui as NumberSearcherUIType).treeexcludeequalto.show[dindex]
                                          "
                                          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                                          style="padding: 1px 5px"
                                          :class="{
                                            shake:
                                              (numbersearcherui as NumberSearcherUIType).treeexcludeequalto.disabled[dindex],
                                          }"
                                        >
                                          <div
                                            class="flex-shrink-0 flex-grow-0"
                                          >
                                            <a
                                              @click="
                                                deleteSaved(
                                                  dindex,
                                                  'EXCLUDE-EQUAL-TO'
                                                )
                                              "
                                              class="m-0 d-inline-block underline-none"
                                            >
                                              <img
                                                class="align-middle"
                                                src="/src/assets/icons/close.png"
                                                style="width: 25px;height: 25px;"
                                              />
                                            </a>
                                          </div>
                                          <div
                                            class="flex-fill"
                                            style="padding-left: 5px"
                                          >
                                            <div
                                              class="d-block"
                                              style="padding: 5px"
                                            >
                                              <div
                                                :ref="
                                                  (el) => {
                                                    (numbersearcherui as NumberSearcherUIType).refexcludeequaltoinner[
                                                      dindex
                                                    ] = el as HTMLDivElement;
                                                  }
                                                "
                                                class="d-block text-wrap text-break shadow-sm"
                                                style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                                              >
                                                <label
                                                  class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                                                >{{ data }}</label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Transition>
                                    </li>
                                    <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).excludeequaltoref = el as HTMLLIElement"></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
              style="padding: 10px 10px 12px 10px;"
            >
              <div class="flex-w-100-over-3" style="padding-right:7.5px;">
                <button
                  :style="
                    done
                      ? 'background-color: #F0E68C;'
                      : 'background-color: #eee;'
                  "
                  :disabled="done ? false : true"
                  class="btn w-100 shadow-sm"
                  style="padding:6px;font-size:1rem;border-radius: 12px"
                >
                  Done
                </button>
              </div>
              <div class="flex-w-100-over-3" style="padding-right:2.5px;">
                <button
                  @click="openExcludeWindow()"
                  class="btn w-100 shadow-sm"
                  style="padding:6px;font-size:1rem;border-radius: 12px"
                  :style="
                    exclude
                      ? 'background-color: #2196F3;color:#fff;'
                      : 'background-color:#eee;'
                  "
                  :disabled="exclude ? false : true"
                >
                  Exclude
                </button>
              </div>
              <div class="flex-w-100-over-3" style="padding-left:5px;">
                <button
                  :disabled="clear ? false : true"
                  :style="
                    clear
                      ? 'background-color:red;color:#fff;'
                      : 'background-color:#eee;'
                  "
                  class="btn w-100 shadow-sm"
                  style="padding:6px;font-size:1rem;border-radius: 12px"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
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
  width: 550px;
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
</style>