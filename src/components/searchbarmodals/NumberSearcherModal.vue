<script setup lang="ts">
import { 
  type ShallowRef,
  onBeforeMount, 
  type Ref,
  inject,
  ref,
  computed,
  provide,
} from "vue";
import type { 
  NumberSearchExcludeFromToType, 
  NumberSearchExcludeEqualToType, 
  NumberType,
} from "../types/SupportedDatatypesTypeDeclaration";
import Paste from "./Paste.vue";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";
import ReusableNumberSearch from "./ReusableNumberSearch.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";

let 
  index = inject("index") as number,
  accessibility = inject("accessibility") as {
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  },
  openexclude = ref(false),
  closefromtopastemodalsignal = ref(0),
  closeequaltopastemodalsignal = ref(0),
  equaltonewlypasteditems = ref<string[][]>([]),
  fromtonewlypasteditems = ref<string[][]>([]),
  cards = inject("cards") as ShallowRef<NumberType[]>,
  holder = ref<NumberType['search']>()
;

provide("mainnumbersearcherui", holder);

function resetExclude(action: boolean) {
  if(action) {
    
  }
}

function addLocalNewInputEntry(
  nonerangeorrange: 'RANGE' | 'NONE-RANGE',
  newinputentry: [string, string] | string,
  inputtype: 'EXCLUDE-FROM-TO' | 'EXCLUDE-EQUAL-TO'
) {
  addNewInputEntry(
    nonerangeorrange,
    newinputentry,
    inputtype,
    holder as Ref<NumberType['search']>
  );
}

function openExcludeWindow() {
  if (
    holder.value?.greaterthan ||
    holder.value?.lessthan ||
    (holder.value?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    holder.value?.notequalto?.single || (
      holder.value?.fromto?.from &&
      holder.value?.fromto?.to
    )
  ) {
    openexclude.value = true;
  }
}

function localDeleteSaved(
  index: number, 
  operator: "EXCLUDE-FROM-TO" | "EXCLUDE-EQUAL-TO"
) {
  /*deleteSaved(
    index,
    operator,
    numbersearcherui
  );*/
}

function localIncreaseIndexAndSavePrevious(
  rangeornonerange: "NONE-RANGE" | "RANGE",
  inputvalue: string | string[],
  operator: 'EXCLUDE-FROM-TO' | 'EXCLUDE-EQUAL-TO'
) {
  /*increaseIndexAndSavePrevious(
    rangeornonerange,
    inputvalue,
    operator,
    numbersearcherui
  );*/
}

const excludeAddNewFromTo = computed(() => {
  if (holder.value?.tab === "GREATER-THAN") {
    return (
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) <=
        parseFloat(cards.value[index].result.max) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) <
        parseFloat(cards.value[index].result.max) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) > parseFloat(holder.value?.greaterthan as string) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) < parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto)
    );
  } else if (holder.value?.tab === "LESS-THAN") {
    return (
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) >
        parseFloat(cards.value[index].result.min) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) >=
        parseFloat(cards.value[index].result.min) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) <= parseFloat(holder.value?.lessthan as string) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) < parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto)
    );
  } else {
    return (
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) > parseFloat(holder.value?.fromto?.from as string) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) < parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) < parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto)
    );
  }
});

const excludeAddNewEqualto = computed(() => {
  if (holder.value?.tab === "GREATER-THAN") {
    return (
      parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) >= parseFloat(holder.value?.greaterthan as string) &&
      parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) <= parseFloat(cards.value[index].result.max)
    );
  } else if (holder.value?.tab === "LESS-THAN") {
    return (
      parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) <= parseFloat(holder.value?.lessthan as string) &&
      parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) >= parseFloat(cards.value[index].result.min)
    );
  } else {
    return (
      parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) >= parseFloat(holder.value?.fromto?.from as string) &&
      parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) <= parseFloat(holder.value?.fromto?.to as string)
    );
  }
});

const excludeDone = computed(() => {
  if (holder.value?.tab === "GREATER-THAN") {
    return (
      (parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) > parseFloat(holder.value?.greaterthan as string) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) < parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) <
          parseFloat(cards.value[index].result.max) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) <=
          parseFloat(cards.value[index].result.max)) ||
      (parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) >= parseFloat(holder.value?.greaterthan as string) &&
        parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) <=
          parseFloat(cards.value[index].result.max)) ||
      (holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length  > 0 ||
      (holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length  > 0
    );
  } else if (holder.value?.tab === "LESS-THAN") {
    return (
      (parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) <= parseFloat(holder.value?.lessthan as string) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) < parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) >=
          parseFloat(cards.value[index].result.min) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) >
          parseFloat(cards.value[index].result.min)) ||
      (parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) <= parseFloat(holder.value?.lessthan as string) &&
        parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) >=
          parseFloat(cards.value[index].result.min)) ||
      (holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length  > 0 ||
      (holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length  > 0
    );
  } else {
    return (
      (parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) <= parseFloat(holder.value?.fromto?.to as string) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) < parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom) >= parseFloat(holder.value?.fromto?.from as string) &&
        parseFloat((holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto) > parseFloat(holder.value?.fromto?.from as string)) ||
      (parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) >= parseFloat(holder.value?.fromto?.from as string) &&
        parseFloat((holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single) <= parseFloat(holder.value?.fromto?.to as string)) ||
      (holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length  > 0 ||
      (holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length  > 0
    );
  }
});

const excludeClear = computed(() => {
  return (
    (holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom ||
    (holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).singleto ||
    (holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).single ||
    (holder.value?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length  > 0 ||
    (holder.value?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length  > 0
  );
});

const done = computed(() => {
  return (
    (parseFloat(holder.value?.greaterthan as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.greaterthan as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat(holder.value?.lessthan as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.lessthan as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (holder.value?.equalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.equalto?.single as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.equalto?.single as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (holder.value?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.notequalto?.single as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.notequalto?.single as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (
      parseFloat(holder.value?.fromto?.from as string) < parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat(holder.value?.fromto?.from as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.from as string) >= parseFloat(cards.value[index].result.min) &&
      parseFloat(holder.value?.fromto?.to as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.to as string) >= parseFloat(cards.value[index].result.min)
    )
  );
});

const exclude = computed(() => {
  return (
    (parseFloat(holder.value?.greaterthan as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.greaterthan as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat(holder.value?.lessthan as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.lessthan as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat(holder.value?.fromto?.from as string) < parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat(holder.value?.fromto?.from as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.from as string) >= parseFloat(cards.value[index].result.min) &&
      parseFloat(holder.value?.fromto?.to as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.to as string) >= parseFloat(cards.value[index].result.min)
    )
  );
});

const clear = computed(() => {
  return (
    (parseFloat(holder.value?.greaterthan as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.greaterthan as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat(holder.value?.lessthan as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.lessthan as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (holder.value?.equalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.equalto?.single as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.equalto?.single as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (holder.value?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.notequalto?.single as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.notequalto?.single as string) >= parseFloat(cards.value[index].result.min)
    ) ||
    (parseFloat(holder.value?.fromto?.from as string) < parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat(holder.value?.fromto?.from as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.from as string) >= parseFloat(cards.value[index].result.min) &&
      parseFloat(holder.value?.fromto?.to as string) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.to as string) >= parseFloat(cards.value[index].result.min)
    )
  );
});

onBeforeMount(() => {
  holder.value = JSON.parse(JSON.stringify(cards.value[index].search)) as NumberType['search'];
});

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
                style="background-color: #fff; padding: 5px 5px 0 5px;white-space: nowrap;"
                class="shadow-sm d-block overflow-x-scroll"
              >
                <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                  <li
                    class="flex-shrink-0 flex-grow-0 align-self-stretch"
                  >
                    <button 
                      aria-disabled="true" 
                      class="text-lowercase tab" 
                      style="padding:2.5px 8px;font-size:1em;background-color:#F0E68C;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                    >
                      {{ cards[index].info.name }}
                    </button>
                  </li>
                </ul>
              </div>
              <div class="d-block position-relative">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                  style="padding: 8px 0"
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
                <div v-if="openexclude" class="d-block position-absolute t-0 l-0" style="background-color:#fff;z-index:9000;">
                  <div class="d-block m-0 p-0">
                    <div class="d-block">
                      <div
                        class="shadow-sm d-block text-center"
                        style="background-color: blue;padding: 0 10px;"
                      >
                        <a
                          class="underline-none cursor-pointer align-middle"
                          @click="openexclude = false"
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
                                holder?.tab === "GREATER-THAN"
                                  ? cards[index].result.max
                                  : holder?.tab === "LESS-THAN"
                                  ? holder?.lessthan
                                  : holder?.fromto?.to
                              }}
                          </span>
                        </div>
                        <div class="flex-w-50">
                          <span
                            class="d-inline-block p-0 m-0 letter-spacing align-middle"
                          >
                            Min:
                              {{
                                holder?.tab === "LESS-THAN"
                                  ? cards[index].result.min
                                  : holder?.tab === "GREATER-THAN"
                                  ? holder?.greaterthan
                                  : holder?.fromto?.from
                              }}
                          </span>
                        </div>
                      </div>
                      <template
                        v-if="
                          holder?.tab === 'GREATER-THAN'
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
                            {{ holder?.greaterthan }}
                          </div>
                        </div>
                      </template>
                      <template
                        v-else-if="
                          holder?.tab === 'LESS-THAN'
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
                            {{ holder?.lessthan }}
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
                                            v-model.trim="(holder?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom"
                                            type="text"
                                            class="w-100 text-left"
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
                                            v-model.trim="(holder?.exclude?.fromto as NumberSearchExcludeFromToType).singleto"
                                            type="text"
                                            class="w-100 text-left"
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
                                          addLocalNewInputEntry(
                                            'RANGE',
                                            [
                                              (holder?.exclude?.fromto as NumberSearchExcludeFromToType)?.singlefrom,
                                              (holder?.exclude?.fromto as NumberSearchExcludeFromToType)?.singleto
                                            ],
                                            'EXCLUDE-FROM-TO'
                                          )
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
                                  @return:newlypasteditems="$val => { fromtonewlypasteditems = $val; }"
                                  :receiveclosepastemodalsignal="closefromtopastemodalsignal"
                                  title="none overlapping a-b range"
                                  :datatype="cards[index].info.datatype as 'Number'"
                                  :max="((
                                    holder?.tab ===
                                      'GREATER-THAN'
                                        ? cards[index].result.max
                                        : holder?.tab === 'LESS-THAN'
                                        ? holder?.lessthan
                                        : holder?.fromto?.to
                                  ) as string)"
                                  :min="((
                                    holder?.tab === 'LESS-THAN'
                                      ? cards[index].result.min
                                      : holder?.tab === 'GREATER-THAN'
                                      ? holder?.greaterthan
                                      : holder?.fromto?.from
                                  ) as string)"
                                  :text-area-height="'height:450px;'"
                                >
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
                                <PastedItemAndNewlyInputedEntryDisplayer
                                  :tree="(holder?.exclude?.fromto as NumberSearchExcludeFromToType)"
                                  treetype="NumberSearchExcludeFromToType"
                                  :display-area-height="'height: 167.9px;'"
                                  :scrollareaid="cards[index].scroll.areaid+'-exclude-from-to'"
                                ></PastedItemAndNewlyInputedEntryDisplayer>
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
                                      v-model.trim="(holder?.exclude?.equalto as NumberSearchExcludeEqualToType).single"
                                      type="text"
                                      @keydown.space.prevent
                                      class="w-100 text-left"
                                      style="height: 30px;z-index: 1110;"
                                    />
                                  </div>
                                  <div
                                    class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                                    style="outline: 1px solid rgba(0, 0, 0, 0.2)"
                                  >
                                    <button
                                      @click="
                                        addLocalNewInputEntry(
                                          'NONE-RANGE',
                                          (holder?.exclude?.equalto as NumberSearchExcludeEqualToType)?.single,
                                          'EXCLUDE-EQUAL-TO'
                                        )
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
                                  @return:newlypasteditems="$val => { equaltonewlypasteditems = $val; }"
                                  :receiveclosepastemodalsignal="closeequaltopastemodalsignal"
                                  title="numbers"
                                  :datatype="cards[index].info.datatype as 'Number'"
                                  :max="((
                                    holder?.tab === 'GREATER-THAN'
                                        ? cards[index].result.max
                                        : holder?.tab === 'LESS-THAN'
                                        ? holder?.lessthan
                                        : holder?.fromto?.to
                                  ) as string)"
                                  :min="((
                                    holder?.tab === 'LESS-THAN'
                                      ? cards[index].result.min
                                      : holder?.tab === 'GREATER-THAN'
                                      ? holder?.greaterthan
                                      : holder?.fromto?.from
                                  ) as string)"
                                  :text-area-height="'height:450px;'"
                                >
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
                                <PastedItemAndNewlyInputedEntryDisplayer
                                  :tree="(holder?.exclude?.equalto as NumberSearchExcludeEqualToType)"
                                  treetype="NumberSearchExcludeEqualToType"
                                  :display-area-height="'height: 167.9px;'"
                                  :scrollareaid="cards[index].scroll.areaid+'-exclude-equal-to'"
                                ></PastedItemAndNewlyInputedEntryDisplayer>
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