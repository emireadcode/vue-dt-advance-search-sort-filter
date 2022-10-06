<script setup lang="ts">
import { provide, ref, triggerRef, inject } from "vue";
import SearchableCalendarDatePicker from "./SearchableCalendarDatePicker.vue";
import SearchByDaysMonthsYearsFormat from "./SearchByDaysMonthsYearsFormat.vue";
import Switchable from "./Switchable.vue";
import AscDescOrMix from "./AscDescOrMix.vue";
import Datepicker from "vue3-date-time-picker";
import "vue3-date-time-picker/dist/main.css";
import FilterableResultDisplayer from "./FilterableResultDisplayer.vue";
import { format } from "date-fns";

const props = defineProps<{
  index: number;
}>();

type TimeType = {
  hours: any;
  minutes: any;
};

type TimeRangeType = [
  {
    hours: any;
    minutes: any;
  },
  {
    hours: any;
    minutes: any;
  }
];

provide("index", props.index);

const time = ref<TimeType>();

const timerange = ref<TimeRangeType>();

const cards = inject("cards") as any;

const open = ref(false);

function updateTrueOrFalse(trueorfalse) {
  cards.value[props.index].search.trueorfalse = trueorfalse;
  triggerRef(cards);
}

function openDateWindow() {
  cards.value[props.index].search.format = "DD/MM/YYYY";
  open.value = true;
}

function updateFilterableResultDisplayer(card) {
  cards.value[props.index] = card;
  triggerRef(cards);
}

function setAndOpenDateFormat(selformat: string) {
  if (selformat === "DD/MM/YYYY") {
    cards.value[props.index].search.format = "DD/MM/YYYY";
  } else if (selformat === "DAYS, MONTHS, YEARS") {
    cards.value[props.index].search.format = "DAYS, MONTHS, YEARS";
  } else {
    cards.value[props.index].search.format = "AGO";
  }
  triggerRef(cards);
}

function updateSortType(val) {
  cards.value[props.index].sorttype = val.sorttype;
  triggerRef(cards);
}
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
                      <div class="d-block">
                        <div class="d-block">
                          <a
                            class="font-bold letter-spacing d-block underline-none cursor-pointer shadow-sm align-middle"
                            @click="open = false"
                            style="background-color: red; color: #fff; padding: 3px 10px"
                          >
                            Close
                          </a>
                        </div>
                        <div
                          class="d-block text-center font-bold letter-spacing"
                          style="padding: 10px 0; font-size: 0.7rem"
                        >
                          {{ cards[index].info.name }}
                        </div>
                      </div>
                      <div class="d-block m-0 p-0">
                        <div
                          class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                          style="padding: 0 0 10px 0"
                        >
                          <div class="flex-w-50">
                            <span
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
                            </span>
                          </div>
                          <div class="flex-w-50">
                            <span
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
                            </span>
                          </div>
                        </div>
                        <Datepicker
                          v-model="timerange"
                          timePicker
                          range
                          inline
                          autoApply
                          menuClassName="w-100"
                        />
                      </div>
                      <div class="d-block m-0 p-0">
                        <div
                          class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
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
                          style="padding: 10px"
                        >
                          <template v-if="cards[index].search.format === 'DD/MM/YYYY'">
                            <div class="d-block" style="padding: 10px 0px">
                              <SearchableCalendarDatePicker
                                :maxdate="cards[index].result.max"
                                :mindate="cards[index].result.min"
                                :title="cards[index].info.name"
                                isoweek="true"
                                :format="cards[index].search.dd_mm_yyyy.format"
                                :selections="cards[index].search.dd_mm_yyyy.dates"
                              ></SearchableCalendarDatePicker>
                            </div>
                          </template>
                          <template v-else>
                            <SearchByDaysMonthsYearsFormat></SearchByDaysMonthsYearsFormat>
                          </template>
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
