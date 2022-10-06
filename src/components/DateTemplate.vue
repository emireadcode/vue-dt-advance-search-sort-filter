<script setup lang="ts">
import { watch, onMounted, onBeforeMount, onBeforeUnmount, provide, ref, triggerRef, inject, computed, type WatchStopHandle } from "vue";
import dd_mm_yyy from "./dd_mm_yy.vue";
import SearchByDaysMonthsYearsFormat from "./SearchByDaysMonthsYearsFormat.vue";
import Switchable from "./Switchable.vue";
import AscDescOrMix from "./AscDescOrMix.vue";
import FilterableResultDisplayer from "./FilterableResultDisplayer.vue";
import { format } from "date-fns";

const props = defineProps<{
  index: number;
}>();

provide("index", props.index);

let tobeexcluded = ref<boolean>(false),
  tobecanceled = ref<boolean>(false),
  doneforsearch = ref<boolean>(false),
  dayselected = ref<{ action: boolean; score: number; }>(),
  monthselected = ref<{ action: boolean; score: number; }>(),
  yearselected = ref<{ action: boolean; score: number; }>(),
  dd_mm_yyyy_selected = ref<{ mode: 'RANGE' | 'MULTIPLE-OR-SINGLE';  score: number;}>(),
  unwatchcformat: WatchStopHandle,
  unwatchdaysmonthsyears: WatchStopHandle,
  unwatchdd_mm_yyyy_selected: WatchStopHandle,
  cformat = ref<"DD/MM/YYYY" | "DAYS, MONTHS, YEARS">(),
  excludedatefor = ref<"ENABLE" | "DISABLE" | "">();

const cards = inject("cards") as any,
  open = ref(false),
  cmaxyear = computed(() => {
    return cards.value[props.index].result.max.split('-')[0];
  }),
  cminyear = computed(() => {
    return cards.value[props.index].result.min.split('-')[0];
  }),
  compDayMonthYearControl = computed(() => {
    if(
      (dayselected.value as { action: boolean; score: number; }).score > 0
      ||
      (monthselected.value as { action: boolean; score: number; }).score > 0
      ||
      (yearselected.value as { action: boolean; score: number; }).score > 0
    ) {
      return true;
    }
    else {
      return false;
    }
  })
;

function updateDDMMYYYYFormat(f: "RANGE" | "MULTIPLE-OR-SINGLE") {
  if(f === "MULTIPLE-OR-SINGLE") {
    excludedatefor.value = "DISABLE";
  }
  else {
    excludedatefor.value = "ENABLE";
  }
}

function updateFilterableResultDisplayer(card) {
  cards.value[props.index] = card;
  triggerRef(cards);
}

function openDateWindow() {
  if (!cards.value[props.index].search.format)
    cards.value[props.index].search.format = "DD/MM/YYYY";
  open.value = true;
}

function setAndOpenDateFormat(selformat: "DD/MM/YYYY" | "DAYS, MONTHS, YEARS") {
  cards.value[props.index].search.format = selformat;
  triggerRef(cards);
  cformat.value = selformat;
  excludedatefor.value = '';
}

function updateSortType(val) {
  cards.value[props.index].sorttype = val.sorttype;
  triggerRef(cards);
}

function updateTrueOrFalse(trueorfalse: boolean) {
  cards.value[props.index].search.trueorfalse = trueorfalse;
  triggerRef(cards);
}

onBeforeMount(() => {
  cformat.value = cards.value[props.index].search.format;
  dayselected.value = { action: false, score: 0};
  monthselected.value = { action: false, score: 0};
  yearselected.value = { action: false, score: 0};
  dd_mm_yyyy_selected.value = { mode: 'RANGE', score: 0 };
});

onBeforeUnmount(() => {
  unwatchcformat();
  unwatchdaysmonthsyears();
  unwatchdd_mm_yyyy_selected();
});

onMounted(() => {
  excludedatefor.value = "";
  unwatchdd_mm_yyyy_selected = watch(
    () => (dd_mm_yyyy_selected.value as { mode: 'RANGE' | 'MULTIPLE-OR-SINGLE'; score: number; }).score,
    (x) => {
      if((dd_mm_yyyy_selected.value as { mode: 'RANGE' | 'MULTIPLE-OR-SINGLE'; score: number; }).mode === 'RANGE') {
        if(x === 2) {
          tobeexcluded.value = true;
          doneforsearch.value = true;
          tobecanceled.value = true;
        }
        else {
          if(x === 1) {
            tobeexcluded.value = false;
            doneforsearch.value = false;
            tobecanceled.value = true;
          }
          else {
            tobeexcluded.value = false;
            doneforsearch.value = false;
            tobecanceled.value = false;
          }
        }
      }
      else {
        if(x > 0) {
          tobeexcluded.value = false;
          doneforsearch.value = true;
          tobecanceled.value = true;
        }
        else {
          tobeexcluded.value = false;
          doneforsearch.value = false;
          tobecanceled.value = false;
        }
      }
    }
  );
  unwatchcformat = watch(
    () => cformat.value,
    (x) => {
      dayselected.value = { action: false, score: 0};
      monthselected.value = { action: false, score: 0};
      yearselected.value = { action: false, score: 0};
      dd_mm_yyyy_selected.value = { mode: 'RANGE', score: 0 };
      tobeexcluded.value = false;
      tobecanceled.value = false;
      doneforsearch.value = false;
    }
  );
  unwatchdaysmonthsyears = watch(
    [
      () => (dayselected.value as { mode: 'MULTIPLE-OR-SINGLE' | 'RANGE'; action: boolean; score: number; }).action,
      () => (monthselected.value as { mode: 'MULTIPLE-OR-SINGLE' | 'RANGE'; action: boolean; score: number; }).action,
      () => (yearselected.value as { mode: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO"; action: boolean; score: number; }).action
    ],
    ([x, y, z]) => {
      if((x && y) && z) {
        tobeexcluded.value = true;
        doneforsearch.value = true;
      }
      else {
        tobeexcluded.value = false;
        doneforsearch.value = false;
      }
    }
  )
});

</script>

<template>
  <div class="d-block">
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center shadow-sm m-0"
      style="padding: 0.182291875rem 0"
    >
      <span
        class="m-0 p-0 text-capitalize text-center letter-spacing font-bold font-0-dot-80-rem"
        >{{ cards[index].info.name }}</span
      >
    </div>
    <div class="d-block" style="padding: 0 0.583333333rem !important">
      <AscDescOrMix
        :cards="cards[index]"
        @update:sorttype="
          ($val) => {
            updateSortType($val);
          }
        "
      ></AscDescOrMix>
      <div class="d-block" style="padding: 0.410156718rem 0">
        <div
          class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
          style="height: 1.75rem"
        >
          <div class="flex-w-3-dot-5-rem p-0 m-0 align-self-stretch">
            <Switchable
              truelabel="R"
              falselabel="U"
              :index="index"
              switchtype="ORDINARY"
              @update:trueorfalse="($trueorfalse) => updateTrueOrFalse($trueorfalse)"
            ></Switchable>
          </div>
          <div class="flex-fill p-0 m-0 align-self-stretch">
            <div
              class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center h-100"
            >
              <div class="flex-fill p-0 m-0 h-100" style="z-index: 700">
                <input
                  @focus="openDateWindow()"
                  type="text"
                  class="w-100 align-middle h-100"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem h-100 position-absolute t-0 p-0"
                style="z-index: 720"
              >
                <a class="cursor-pointer d-block text-center">
                  <img src="/src/assets/icons/close.png" class="wh-1-dot-25-rem" />
                </a>
              </div>
            </div>
          </div>
          <div
            class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
            style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
          >
            <a class="cursor-pointer d-block text-center">
              <img
                src="/src/assets/icons/search.png"
                class="wh-1-dot-25-rem align-middle"
              />
            </a>
          </div>
        </div>
        <Teleport to="body">
          <div v-if="open" class="d-block position-relative">
            <transition name="modal">
              <div
                class="position-fixed h-100 w-100 overflow-auto user-select-none"
                style="z-index: 1800"
              >
                <div class="modal-mask h-100 w-100">
                  <div class="modal-wrapper text-center">
                    <div class="modal-container d-block">
                      <div class="d-block" style="height: 585px;">
                        <div
                          class="d-block text-center font-bold letter-spacing m-0"
                          style="padding: 5px 0; font-size: 0.7rem"
                        >
                          {{ cards[index].info.name }}
                        </div>
                        <div class="d-block m-0 p-0">
                          <div
                            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center m-0"
                            style="padding: 2px 0;"
                          >
                            <div class="flex-w-50 p-0 m-0 align-self-stretch">
                              <div
                                class="d-inline-block p-0 m-0 letter-spacing align-middle font-bold"
                                style="font-size: 0.7rem; color: gray"
                              >
                                Min:
                                {{
                                  format(
                                    new Date(cards[index].result.min),
                                    cards[index].dateFormat
                                      .replace(/mmmm/g, "MMMM")
                                      .replace(/mmm/g, "MMM")
                                      .replace(/mm/g, "MM")
                                      .replace(/dddd/g, "EEEE")
                                      .replace(/ddd/g, "EEE")
                                  )
                                }}
                              </div>
                            </div>
                            <div class="flex-w-50 p-0 m-0 align-self-stretch">
                              <div
                                class="d-inline-block p-0 m-0 letter-spacing align-middle font-bold"
                                style="font-size: 0.7rem; color: gray"
                              >
                                Max:
                                {{
                                  format(
                                    new Date(cards[index].result.max),
                                    cards[index].dateFormat
                                      .replace(/mmmm/g, "MMMM")
                                      .replace(/mmm/g, "MMM")
                                      .replace(/mm/g, "MM")
                                      .replace(/dddd/g, "EEEE")
                                      .replace(/ddd/g, "EEE")
                                  )
                                }}
                              </div>
                            </div>
                          </div>
                          <div
                            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
                            style="border: 1px solid gray"
                          >
                            <div class="flex-w-50 align-self-stretch">
                              <a
                                @click="setAndOpenDateFormat('DD/MM/YYYY')"
                                class="font-family ellipsis date-format align-middle underline-none d-block cursor-pointer m-0"
                                style="
                                  outline: 1px solid rgba(0, 0, 0, 0.2);
                                  padding: 2px 0;
                                "
                                :style="
                                  cards[index].search.format === 'DD/MM/YYYY'
                                    ? 'background-color:green;color: #fff;'
                                    : 'background-color:gray;color: #fff;'
                                "
                              >
                                DD/MM/YYYY
                              </a>
                            </div>
                            <div class="flex-w-50 align-self-stretch">
                              <a
                                @click="setAndOpenDateFormat('DAYS, MONTHS, YEARS')"
                                class="font-family ellipsis date-format align-middle underline-none d-block cursor-pointer m-0"
                                style="
                                  outline: 1px solid rgba(0, 0, 0, 0.2);
                                  padding: 2px 0;
                                "
                                :style="
                                  cards[index].search.format === 'DAYS, MONTHS, YEARS'
                                    ? 'background-color:green;color: #fff;'
                                    : 'background-color:gray;color: #fff;'
                                "
                              >
                                Day(s), Month(s), Year(s)
                              </a>
                            </div>
                          </div>
                          <div
                            class="d-block text-wrap overflow-x-hidden overflow-y-auto"
                          >
                            <template v-if="cards[index].search.format === 'DD/MM/YYYY'">
                              <dd_mm_yyy
                                @update:excludedatefor="($f) => updateDDMMYYYYFormat($f)"
                                :excludedatefor="excludedatefor as '' | 'DISABLE' | 'ENABLE'"
                                :maxdate="cards[index].result.max"
                                :mindate="cards[index].result.min"
                                :title="cards[index].info.name"
                                isoweek="false"
                                :format="cards[index].search.dd_mm_yyyy.format"
                                :selections="cards[index].search.dd_mm_yyyy.dates"
                                @enable:dd_mm_yyyy_excludecanceldoneforsearchreadiness="$val => dd_mm_yyyy_selected = $val"
                              ></dd_mm_yyy>
                            </template>
                            <template v-else>
                              <SearchByDaysMonthsYearsFormat
                                :excludedatefor="excludedatefor as '' | 'DISABLE' | 'ENABLE'"
                                isoweek="true"
                                @enableday:daysmonthsyearsexcludecanceldonereadiness="$val => dayselected = $val"
                                @enablemonth:daysmonthsyearsexcludecanceldonereadiness="$val => monthselected = $val"
                                @enableyear:daysmonthsyearsexcludecanceldonereadiness="$val => yearselected = $val"
                                :maxyear="cmaxyear"
                                :minyear="cminyear"
                                :dayselectionsandformat="cards[index].search.days_months_years.days"
                                :yearselectionsandformat="cards[index].search.days_months_years.years"
                                :monthselectionsandformat="cards[index].search.days_months_years.months"
                              ></SearchByDaysMonthsYearsFormat>
                            </template>
                          </div>
                        </div>
                      </div>
                      <div class="d-block text-center" style="padding: 10px 10px 12px 10px;">
                        <div
                          class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
                        >
                          <template v-if="excludedatefor === 'ENABLE' || excludedatefor === ''">
                            <div class="flex-w-100-over-3 align-self-stretch" style="padding-right:7.5px;">
                              <button
                                class="btn shadow-sm w-100 font-family"
                                :class="[tobeexcluded? '': 'disabled']"
                                :disabled="tobeexcluded? false : true"
                                style="padding: 6px; font-size: 1rem;color:#fff;"
                                :style="
                                  (cformat==='DAYS, MONTHS, YEARS' && excludedatefor === 'ENABLE')?
                                  'background-color: gray;opacity: 40%;' :
                                  (tobeexcluded? 'opacity: 100%;background-color: rgb(0, 0, 48);' : 'background-color: rgb(0, 0, 48);opacity: 20%;')
                                "
                                @click="() => { excludedatefor = (cformat === 'DD/MM/YYYY')? 'DISABLE' : 'ENABLE'; }"
                              >
                                Exclude dates
                              </button>
                            </div>
                          </template>
                          <div 
                            :class="[excludedatefor === 'DISABLE'? 'flex-w-50' : 'flex-w-100-over-3']"
                            class="align-self-stretch"
                            style="padding-right: 2.5px;"
                          >
                            <button
                              class="btn shadow-sm w-100 font-family"
                              style="padding: 6px; font-size: 1rem;color: #fff;"
                              @click=""
                              :style="
                                (cformat==='DAYS, MONTHS, YEARS' && excludedatefor === 'ENABLE')?
                                'background-color: gray;opacity: 40%;' :
                                (doneforsearch? 'background-color: rgb(48, 8, 120);' : 'background-color: red;')
                              "
                            >
                              {{ doneforsearch? 'Done' : 'Close' }}
                            </button>
                          </div>
                          <div
                            :class="[excludedatefor === 'DISABLE'? 'flex-w-50' : 'flex-w-100-over-3']"
                            class="align-self-stretch"
                            style="padding-left: 5px;"
                          >
                            <button
                              class="btn shadow-sm w-100 font-family"
                              :class="[
                                (
                                  (cformat==='DD/MM/YYYY'&&tobecanceled)
                                  ||
                                  compDayMonthYearControl
                                )? '': 'disabled'
                              ]"
                              :disabled="
                                (
                                  (cformat==='DD/MM/YYYY'&&tobecanceled)
                                  ||
                                  compDayMonthYearControl
                                )
                                ? false : true
                              "
                              style="padding: 6px; font-size: 1rem;color:#fff;"
                              :style="
                                (cformat==='DAYS, MONTHS, YEARS' && excludedatefor === 'ENABLE')?
                                'background-color: gray;opacity: 40%;' :
                                (
                                  (cformat==='DD/MM/YYYY'&&tobecanceled)
                                  ||
                                  compDayMonthYearControl
                                )? 'opacity: 100%;background-color: rgb(144, 12, 63);' : 'opacity: 20%;background-color: rgb(144, 12, 63);'
                              "
                              @click="() => { (cformat==='DD/MM/YYYY' && excludedatefor === 'DISABLE')? excludedatefor = 'ENABLE' : '';}"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </Teleport>
      </div>
      <FilterableResultDisplayer
        :cards="cards[index]"
        @update:filterableresultdisplayer="
          ($val) => {
            updateFilterableResultDisplayer($val);
          }
        "
      ></FilterableResultDisplayer>
    </div>
  </div>
</template>

<style scoped>
.date-format {
  background-color: #dcdcdc;
  color: black;
}
.date-format:hover {
  background-color: #17a2b8;
}
.modal-mask {
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
