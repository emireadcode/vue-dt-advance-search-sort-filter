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
  computed,
  provide,
} from "vue";
import type { 
  NumberSearchExcludeFromToType, 
  NumberSearchExcludeEqualToType, 
  NumberType,
  NumberSearcherUIType,
} from "../types/SupportedDatatypesTypeDeclaration";
import Paste from "./Paste.vue";
import {
  increaseIndexAndSavePrevious,
  deleteSaved
} from "../helperfunctions/numbersearcheruitypefns";
import ReusableNumberSearch from "./ReusableNumberSearch.vue";

let 
  accessibility = inject("accessibility") as {
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  },
  numbersearcherui = shallowRef<NumberSearcherUIType>({
    openexclude: false,
    main: {
      tab: "GREATER-THAN",
      refequaltoinner: [],
      refnotequaltoinner: [],
      refequalto: [],
      refnotequalto: [],
      equaltoref: null,
      notequaltoref: null,
      greaterthan: ref(""),
      lessthan: ref(""),
      equalto: ref(""),
      notequalto: ref(""),
      from: ref(""),
      to: ref(""),
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
    },
    exclude: {
      excludefromtofrom: ref(""),
      refexcludeequaltoinner: [],
      refexcludefromtoinner: [],
      refexcludeequalto: [],
      refexcludefromto: [],
      excludefromtoref: null,
      excludeequaltoref: null,
      excludefromtoto: ref(""),
      excludeequalto: ref(""),
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
    }
  })
;

const 
  props = defineProps<{
    index: number;
  }>(),
  cards = inject("cards") as ShallowRef<NumberType[]>,
  index = props.index,
  mainnumbersearcheruitype = shallowRef<NumberSearcherUIType["main"]>(numbersearcherui.value.main)
;

numbersearcherui.value.main = mainnumbersearcheruitype.value;

provide("mainnumbersearcheruitype", mainnumbersearcheruitype);
provide("index", index as number);

function triggerNumberSearcherUI() {
  triggerRef(numbersearcherui);
}

function resetExclude(action: boolean) {
  if(action) {
    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto = {
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
    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto = {
      single: "",
      value: [],
      index: 0,
      disabled: [],
      show: [],
      loading: false,
      addloading: false,
    } as NumberSearchExcludeEqualToType;
    triggerNumberSearcherUI();
  }
}

function localDeleteSaved(
  index: number, 
  operator: "EXCLUDE-FROM-TO" | "EXCLUDE-EQUAL-TO"
) {
  deleteSaved(
    index,
    operator,
    numbersearcherui
  );
}

function localIncreaseIndexAndSavePrevious(
  rangeornonerange: "NONE-RANGE" | "RANGE",
  inputvalue: string | string[],
  operator: 'EXCLUDE-FROM-TO' | 'EXCLUDE-EQUAL-TO'
) {
  increaseIndexAndSavePrevious(
    rangeornonerange,
    inputvalue,
    operator,
    numbersearcherui
  );
}

onBeforeMount(() => {
  (numbersearcherui.value as NumberSearcherUIType).openexclude = false;
  (numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value = cards.value[index].search.greaterthan as string;
  (numbersearcherui.value as NumberSearcherUIType).main.lessthan.value = cards.value[index].search.lessthan as string;
  (numbersearcherui.value as NumberSearcherUIType).main.equalto.value = cards.value[index].search.equalto?.single as string;
  (numbersearcherui.value as NumberSearcherUIType).main.notequalto.value = cards.value[index].search.notequalto?.single as string;
  (numbersearcherui.value as NumberSearcherUIType).main.from.value = cards.value[index].search.fromto?.from as string;
  (numbersearcherui.value as NumberSearcherUIType).main.to.value = cards.value[index].search.fromto?.to as string;
  (numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value = cards.value[index].search.exclude?.fromto?.singlefrom as string;
  (numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value = cards.value[index].search.exclude?.fromto?.singleto as string;
  (numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value = cards.value[index].search.exclude?.equalto?.single as string;
  (numbersearcherui.value as NumberSearcherUIType).main.treenotequalto = cards.value[index].search.notequalto as NumberSearchExcludeEqualToType;
  (numbersearcherui.value as NumberSearcherUIType).main.treeequalto = cards.value[index].search.equalto as NumberSearchExcludeEqualToType;
  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto = cards.value[index].search.exclude?.equalto as NumberSearchExcludeEqualToType;
  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto = cards.value[index].search.exclude?.fromto as NumberSearchExcludeFromToType
  triggerNumberSearcherUI();
});

function openExcludeWindow() {
  if (
    (numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value ||
    (numbersearcherui.value as NumberSearcherUIType).main.lessthan.value ||
    (numbersearcherui.value as NumberSearcherUIType).main.treenotequalto.index > 0 ||
    (numbersearcherui.value as NumberSearcherUIType).main.notequalto.value || (
      (numbersearcherui.value as NumberSearcherUIType).main.from.value &&
      (numbersearcherui.value as NumberSearcherUIType).main.to.value
    )
  ) {
    (numbersearcherui.value as NumberSearcherUIType).openexclude = true;
    triggerNumberSearcherUI();
  }
}

const excludeAddNewFromTo = computed(() => {
  if ((numbersearcherui.value as NumberSearcherUIType).main.tab === "GREATER-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) <=
        parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) <
        parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value)
    );
  } else if ((numbersearcherui.value as NumberSearcherUIType).main.tab === "LESS-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) >
        parseFloat(cards.value[index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) >=
        parseFloat(cards.value[index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value)
    );
  } else {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value)
    );
  }
});

const excludeAddNewEqualto = computed(() => {
  if ((numbersearcherui.value as NumberSearcherUIType).main.tab === "GREATER-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) <= parseFloat(cards.value[index].result.max)
    );
  } else if ((numbersearcherui.value as NumberSearcherUIType).main.tab === "LESS-THAN") {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) >= parseFloat(cards.value[index].result.min)
    );
  } else {
    return (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value)
    );
  }
});

const excludeDone = computed(() => {
  if ((numbersearcherui.value as NumberSearcherUIType).main.tab === "GREATER-THAN") {
    return (
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) <
          parseFloat(cards.value[index].result.max) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) <=
          parseFloat(cards.value[index].result.max)) ||
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) <=
          parseFloat(cards.value[index].result.max)) ||
      (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index > 0 ||
      (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index > 0
    );
  } else if ((numbersearcherui.value as NumberSearcherUIType).main.tab === "LESS-THAN") {
    return (
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) >=
          parseFloat(cards.value[index].result.min) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) >
          parseFloat(cards.value[index].result.min)) ||
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) >=
          parseFloat(cards.value[index].result.min)) ||
      (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index > 0 ||
      (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index > 0
    );
  } else {
    return (
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value) > parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value)) ||
      (parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) &&
        parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value)) ||
      (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index > 0 ||
      (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index > 0
    );
  }
});

const excludeClear = computed(() => {
  return (
    (numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom ||
    (numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value ||
    (numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto ||
    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index > 0 ||
    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index > 0
  );
});

const done = computed(() => {
  return (
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).main.treeequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.equalto.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.equalto.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).main.treenotequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.notequalto.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.notequalto.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) >= parseFloat(cards.value[index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) >= parseFloat(cards.value[index].result.min)
    )
  );
});

const exclude = computed(() => {
  return (
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) >= parseFloat(cards.value[index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) >= parseFloat(cards.value[index].result.min)
    )
  );
});

const clear = computed(() => {
  return (
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.greaterthan.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.lessthan.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).main.treeequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.equalto.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.equalto.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (numbersearcherui.value as NumberSearcherUIType).main.treenotequalto.index > 0 ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.notequalto.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.notequalto.value) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) < parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.from.value) >= parseFloat(cards.value[index].result.min) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) <= parseFloat(cards.value[index].result.max) &&
      parseFloat((numbersearcherui.value as NumberSearcherUIType).main.to.value) >= parseFloat(cards.value[index].result.min)
    )
  );
});

watch(
  () => (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index,
  (x) => {
    (numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value = "";
    triggerNumberSearcherUI();
  }
);

watch(
  () => (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index,
  (x) => {
    (numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoto.value = "";
    (numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtofrom.value = "";
    triggerNumberSearcherUI();
  }
);

</script>

<template>  
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800"
    >
      <div class="modal-mask h-100 w-100 modal-mask-background">
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
                <ReusableNumberSearch @reset:exclude="$val => resetExclude($val)" from="NUMBER-SEARCHER-MODAL"></ReusableNumberSearch>
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
                                (numbersearcherui as NumberSearcherUIType).main.tab ===
                                "GREATER-THAN"
                                  ? cards[index].result.max
                                  : (numbersearcherui as NumberSearcherUIType).main.tab ===
                                    "LESS-THAN"
                                  ? (numbersearcherui as NumberSearcherUIType).main.lessthan.value
                                  : (numbersearcherui as NumberSearcherUIType).main.to.value
                              }}
                          </span>
                        </div>
                        <div class="flex-w-50">
                          <span
                            class="d-inline-block p-0 m-0 letter-spacing align-middle"
                          >
                            Min:
                              {{
                                (numbersearcherui as NumberSearcherUIType).main.tab === "LESS-THAN"
                                  ? cards[index].result.min
                                  : (numbersearcherui as NumberSearcherUIType).main.tab ===
                                    "GREATER-THAN"
                                  ? (numbersearcherui as NumberSearcherUIType).main.greaterthan.value
                                  : (numbersearcherui as NumberSearcherUIType).main.from.value
                              }}
                          </span>
                        </div>
                      </div>
                      <template
                        v-if="
                          (numbersearcherui as NumberSearcherUIType).main.tab === 'GREATER-THAN'
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
                            {{ (numbersearcherui as NumberSearcherUIType).main.greaterthan.value }}
                          </div>
                        </div>
                      </template>
                      <template
                        v-else-if="
                          (numbersearcherui as NumberSearcherUIType).main.tab === 'LESS-THAN'
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
                            {{ (numbersearcherui as NumberSearcherUIType).main.lessthan.value }}
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
                                              (numbersearcherui as NumberSearcherUIType).exclude.excludefromtofrom.value
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
                                            v-model.trim="(numbersearcherui as NumberSearcherUIType).exclude.excludefromtoto.value"
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
                                            localIncreaseIndexAndSavePrevious(
                                              'RANGE',
                                              [
                                                (numbersearcherui as NumberSearcherUIType).exclude.excludefromtofrom.value,
                                                (numbersearcherui as NumberSearcherUIType).exclude.excludefromtoto.value,
                                              ],
                                              'EXCLUDE-FROM-TO'
                                            );
                                          }
                                        "
                                        class="btn w-100 shadow-sm font-0-dot-85-rem text-center"
                                        style="height:30px; padding:0 2px;"
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
                                    (numbersearcherui as NumberSearcherUIType).main.tab ===
                                      'GREATER-THAN'
                                        ? cards[index].result.max
                                        : (numbersearcherui as NumberSearcherUIType).main.tab ===
                                          'LESS-THAN'
                                        ? (numbersearcherui as NumberSearcherUIType).main.lessthan.value
                                        : (numbersearcherui as NumberSearcherUIType).main.to.value
                                  ) as string)"
                                  :min="((
                                    (numbersearcherui as NumberSearcherUIType).main.tab === 'LESS-THAN'
                                      ? cards[index].result.min
                                      : (numbersearcherui as NumberSearcherUIType).main.tab ===
                                        'GREATER-THAN'
                                      ? (numbersearcherui as NumberSearcherUIType).main.greaterthan.value
                                      : (numbersearcherui as NumberSearcherUIType).main.from.value
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
                                      v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.from"
                                      :key="
                                        (numbersearcherui as NumberSearcherUIType).main.tab +
                                        '-EXCLUDE-FROM-TO' +
                                        dindex
                                      "
                                    >
                                      <Transition>
                                        <div
                                          :ref="
                                            (el) => {
                                              (numbersearcherui as NumberSearcherUIType).exclude.refexcludefromto[
                                                dindex
                                              ] = el as HTMLDivElement;
                                            }
                                          "
                                          v-if="
                                            (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.show[
                                              dindex
                                            ]
                                          "
                                          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                                          style="padding: 1px 5px"
                                          :class="{
                                            shake:
                                              (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto
                                                .disabled[dindex],
                                          }"
                                        >
                                          <div
                                            class="flex-shrink-0 flex-grow-0"
                                          >
                                            <a
                                              @click="
                                                localDeleteSaved(
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
                                                    (numbersearcherui as NumberSearcherUIType).exclude.refexcludefromtoinner[
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
                                                    (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.from[
                                                      dindex
                                                    ]
                                                  }}
                                                  -
                                                  {{
                                                    (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.to[
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
                                    <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).exclude.excludefromtoref = el as HTMLLIElement"></li>
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
                                      v-model.trim="(numbersearcherui as NumberSearcherUIType).exclude.excludeequalto.value"
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
                                          localIncreaseIndexAndSavePrevious(
                                            'NONE-RANGE',
                                            (numbersearcherui as NumberSearcherUIType).exclude.excludeequalto.value,
                                            'EXCLUDE-EQUAL-TO'
                                          );
                                        }
                                      "
                                      class="btn w-100 shadow-sm font-0-dot-85-rem"
                                      style="height:30px; padding:0 2px;"
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
                                    (numbersearcherui as NumberSearcherUIType).main.tab ===
                                      'GREATER-THAN'
                                        ? cards[index].result.max
                                        : (numbersearcherui as NumberSearcherUIType).main.tab ===
                                          'LESS-THAN'
                                        ? (numbersearcherui as NumberSearcherUIType).main.lessthan.value
                                        : (numbersearcherui as NumberSearcherUIType).main.to.value
                                  ) as string)"
                                  :min="((
                                    (numbersearcherui as NumberSearcherUIType).main.tab === 'LESS-THAN'
                                      ? cards[index].result.min
                                      : (numbersearcherui as NumberSearcherUIType).main.tab ===
                                        'GREATER-THAN'
                                      ? (numbersearcherui as NumberSearcherUIType).main.greaterthan.value
                                      : (numbersearcherui as NumberSearcherUIType).main.from.value
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
                                      v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).exclude.treeexcludeequalto.value"
                                      :key="
                                      (numbersearcherui as NumberSearcherUIType).main.tab +
                                      '-EXCLUDE-EQUAL-TO' +
                                      dindex
                                      "
                                    >
                                      <Transition>
                                        <div
                                          :ref="
                                            (el) => {
                                              (numbersearcherui as NumberSearcherUIType).exclude.refexcludeequalto[
                                                dindex
                                              ] = el as HTMLDivElement;
                                            }
                                          "
                                          v-if="
                                            (numbersearcherui as NumberSearcherUIType).exclude.treeexcludeequalto.show[dindex]
                                          "
                                          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                                          style="padding: 1px 5px"
                                          :class="{
                                            shake:
                                              (numbersearcherui as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[dindex],
                                          }"
                                        >
                                          <div
                                            class="flex-shrink-0 flex-grow-0"
                                          >
                                            <a
                                              @click="
                                                localDeleteSaved(
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
                                                    (numbersearcherui as NumberSearcherUIType).exclude.refexcludeequaltoinner[
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
                                    <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).exclude.excludeequaltoref = el as HTMLLIElement"></li>
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
.modal-mask-background {
  background-color: rgba(0, 0, 0, 0.5);
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