<script setup lang="ts">
import {
  watch,
  ref,
  nextTick,
  triggerRef,
  shallowRef,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  type WatchStopHandle,
  type ShallowRef,
  type Ref,
} from "vue";
import type {
  DateType
} from "../types/SupportedDatatypesTypeDeclaration";
import type {
  VisibleCalendarType, 
  RangeFirstAndLastSelectionType,
  RangeSelectionParamsType,
  YearMonthClickable,
  PositionTrackerType,
} from "../types/dd_mm_yy_types";
import { 
  mouseMovement,
  clickBackward,
  clickForward,
  assignRef,
  findRangeSelectionMaxAndMinDate,
  getDimensions,
  handleDateSelectHighlightDeselect,
  weekHasEnable,
  weekCheckboxClicked,
  fillVisibleCalendarArray,
} from "../utility/dd_mm_yy_utility_fns";

const 
  props = defineProps<{
    selections: DateType['search']['dd_mm_yyyy']['dates'];
    excludedates: boolean;
    isoweek: boolean;
    selectionformat: 'RANGE' | 'MULTIPLE-OR-SINGLE';
    mindate: string;
    maxdate: string;
  }>(),
  emits = defineEmits<{
    (e: "update:selections", selections: DateType['search']['dd_mm_yyyy']['dates']): void;
  }>(),
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  isodays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  visiblecalendar = shallowRef<VisibleCalendarType>(),
  rangeselectionparams = shallowRef<RangeSelectionParamsType>({
    rangefirstselection: {
      date: '',
      year: 0,
      month: 0,
      day: 0,
    },
    rangelastselection: {
      date: '',
      year: 0,
      month: 0,
      day: 0,
    },
    rangeselectcount: 0,
    inselectionmode: true,
    excludedates: props.excludedates,
  }),
  multipleselectcount = ref(0)
;

let
  unwatchselectionformat: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchrangeselectcount: WatchStopHandle,
  unwatchexcludedates: WatchStopHandle,
  maxdate = '',
  mindate = ''
;

function handleDateClick(day: YearMonthClickable<PositionTrackerType>['calendar'][number]['days'][number]) {
  if(day.status === 'ENABLE') {
    if(!(rangeselectionparams.value as RangeSelectionParamsType).inselectionmode) {
      (rangeselectionparams.value as RangeSelectionParamsType).inselectionmode = true;
      triggerRef(rangeselectionparams);
    }
    nextTick(() => {
      if(props.selectionformat === 'RANGE') {
        handleDateSelectHighlightDeselect(
          rangeselectionparams as ShallowRef<RangeSelectionParamsType>,
          props.isoweek,
          props.selectionformat,
          day.date,
          true,
          mindate as string,
          maxdate as string,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      }
      else {
        handleDateSelectHighlightDeselect(
          multipleselectcount,
          props.isoweek,
          props.selectionformat,
          day.date,
          true,
          props.mindate,
          props.maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      }
    });
  }
}

function clickNext() {
  clickForward(
    props.isoweek, 
    maxdate, 
    mindate, 
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
}

function clickPrevious() {
  clickBackward(
    props.isoweek, 
    maxdate, 
    mindate, 
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
}

function processDimensions() {
  getDimensions(
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
}

function trackMouseMovement(event: { pageX: number; pageY: number; }) {
  if((rangeselectionparams.value as RangeSelectionParamsType).inselectionmode) {
    (rangeselectionparams.value as RangeSelectionParamsType).inselectionmode = false;
    triggerRef(rangeselectionparams);
  }
  mouseMovement(
    rangeselectionparams as ShallowRef<RangeSelectionParamsType>,
    event,
    props.isoweek, 
    mindate, 
    maxdate, 
    props.selectionformat as 'RANGE',
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
}

function unTrackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    (document.getElementById("currentvisiblecalendarbox") as HTMLDivElement).removeEventListener("mousemove", trackMouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    (document.getElementById("previousvisiblecalendarbox") as HTMLDivElement).removeEventListener("mousemove", trackMouseMovement, true);
  }
}

function trackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    (document
      .getElementById("currentvisiblecalendarbox") as HTMLDivElement)
      .addEventListener("mousemove", trackMouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    (document
      .getElementById("previousvisiblecalendarbox") as HTMLDivElement)
      .addEventListener("mousemove", trackMouseMovement, true);
  }
}

const previousyearandmonthinselections = computed(() => {
  if (!((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections)) {
    return false;
  } else {
    if (
      !(
        (visiblecalendar.value as VisibleCalendarType).previous.month in
        (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year]
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
});

const currentyearandmonthinselections = computed(() => {
  if (!((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections)) {
    return false;
  } else {
    if (
      !(
        (visiblecalendar.value as VisibleCalendarType).current.month in
        (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year]
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
});

onBeforeMount(() => {
  (maxdate as string) = props.maxdate;
  (mindate as string) = props.mindate;
  ((rangeselectionparams.value as RangeSelectionParamsType).excludedates as boolean) = props.excludedates;
  triggerRef(rangeselectionparams);
  visiblecalendar.value = fillVisibleCalendarArray(
    maxdate,
    mindate,
    props.isoweek
  );
  (visiblecalendar.value as VisibleCalendarType).selections = props.selections as VisibleCalendarType['selections'];
});
  
onMounted(() => {
  unwatchexcludedates = watch(
    () => props.excludedates,
    (x) => {
      (rangeselectionparams.value as RangeSelectionParamsType).excludedates = x;
      const maxmin = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (maxdate as string) = maxmin.maxdate;
      (mindate as string) = maxmin.mindate;

      if(x) {

      }
    }
  );
  unwatchselectionformat = watch(
    () => props.selectionformat,
    (x) => {
      multipleselectcount.value = 0;
      rangeselectionparams.value.rangeselectcount = 0;
      rangeselectionparams.value.rangefirstselection = {year: 0, month: 0, day: 0, date: ""};
      (visiblecalendar.value as VisibleCalendarType).selections = {};
      triggerRef(visiblecalendar);
      unTrackVisibleCalendarMouseMovement();
    }
  );
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if(props.selectionformat === "MULTIPLE-OR-SINGLE") {
        if(x > 0) {

        }
        else {

        }
      }
    }
  );
  unwatchrangeselectcount = watch(
    () => (rangeselectionparams.value as RangeSelectionParamsType).rangeselectcount,
    (x) => {
      if (props.selectionformat === "RANGE") {
        if (x === 1) {
          trackVisibleCalendarMouseMovement();
        } else {
          unTrackVisibleCalendarMouseMovement();
          if(x === 2) {
            emits("update:selections", (visiblecalendar.value as VisibleCalendarType).selections);
          }
          else {

          }
        }
      }
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});

onBeforeUnmount(() => {
  unwatchexcludedates();
  unwatchrangeselectcount();
  unwatchmultipleselectcount();
  unwatchselectionformat();
  unTrackVisibleCalendarMouseMovement();
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
});

</script>

<template>
  <div
    style="height: 341.2px;"
    class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
  >
    <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
      <div
        style="padding: 10px 0"
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      >
        <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
          <a
            @click="clickPrevious()"
            style="height: 25px; width: 25px; border-radius: 50%"
            class="flex-box align-items-center justify-content-center underline-none cursor-pointer text-center"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="height: 20px;width: 20px;color: black;stroke: currentcolor;fill: currentcolor;"
            >
              <path
                d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
              ></path>
            </svg>
          </a>
        </div>
        <div class="flex-fill align-self-stretch">
          <div
            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
          >
            <div class="flex-w-50 align-self-stretch">
              <a class="d-block font-family underline-none cursor-pointer">
                {{ months[(visiblecalendar as VisibleCalendarType).previous.month] }}
              </a>
            </div>
            <div class="flex-w-50 align-self-stretch">
              <a class="d-block font-family underline-none cursor-pointer">
                {{ (visiblecalendar as VisibleCalendarType).previous.year }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <template v-if="props.excludedates">
          <div
            class="flex-w-12-dot-5 overflow-hidden"
          ></div>
        </template>
        <div
          :class="props.excludedates? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
          class="overflow-hidden"
          v-for="(_day, dayindex) in props.isoweek ? isodays : days"
          :key="'dayname' + dayindex"
        >
          {{ props.isoweek ? isodays[dayindex] : days[dayindex] }}
        </div>
      </div>
      <div
        id="previousvisiblecalendarbox"
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <template v-for="(week, weekindex) in (visiblecalendar as VisibleCalendarType).previous.calendar">
          <div class="flex-w-100">
            <div
              class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
            >
              <template v-if="props.excludedates">
                <div
                  class="flex-w-12-dot-5 overflow-hidden m-0 align-self-stretch" style="padding:0 2px 0 0;"
                >
                  <div
                    class="p-0 m-0 w-100 h-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                  >
                    <input v-model="week.checked" class="m-0 p-0 border flex-w-100 h-100 align-self-stretch" :key="(visiblecalendar as VisibleCalendarType).previous.year+'_'+(visiblecalendar as VisibleCalendarType).previous.month+'_'+weekindex" @change="weekCheckboxClicked(week, 'PREVIOUS')" :disabled="weekHasEnable(week)" type="checkbox" />
                  </div>
                </div>
              </template>
              <div
                :class="props.excludedates? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
                class="overflow-hidden"
                v-for="(day, dayindex) in week.days"
                :key="
                  'dayprev' +
                  dayindex +
                  'weekprev' +
                  weekindex +
                  'monthprev' +
                  (visiblecalendar as VisibleCalendarType).previous.month +
                  'yearprev' +
                  (visiblecalendar as VisibleCalendarType).previous.year
                "
                style="float: left; outline: 1px solid #fff;"
              >
                <label
                  :ref="
                    (el) => assignRef((visiblecalendar as VisibleCalendarType).previous, el as HTMLLabelElement, weekindex as number, dayindex as number)
                  "
                  @click="handleDateClick(day)"
                  :disabled="day.status === 'DISABLE' ? true : false"
                  class="w-100"
                  style="float: left; line-height: 2.805em; height: 2.805em;"
                >
                  <input
                    @click.stop=""
                    :disabled="day.status === 'DISABLE' ? true : false"
                    type="checkbox"
                    class="position-absolute d-none"
                    style="pointer-events: auto;"
                  />
                  <template v-if="previousyearandmonthinselections">
                    <span
                      :class="[day.status === 'ENABLE'? 'cursor-pointer' : '']"
                      class="font-family text-center d-block letter-spacing"
                      style="font-size: 1rem; line-height: 2.805em; height: 2.805em; outline: 1px solid #fff;"
                      :style="
                        day.day ===
                          ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                            (visiblecalendar as VisibleCalendarType).previous.month
                          ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].day &&
                        ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                          (visiblecalendar as VisibleCalendarType).previous.month
                        ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].selected === 'SELECTED' &&
                        ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                          (visiblecalendar as VisibleCalendarType).previous.month
                        ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].status === 'ENABLE'
                          ? 'background-color:green;color: #fff !important'
                          : day.day ===
                              ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].day &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].selected === 'DESELECTED' &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].status === 'ENABLE'
                          ? 'color: black !important;text-shadow:none'
                          : day.day ===
                              ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].day &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].selected === 'HIGHLIGHTED' &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year][
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].status === 'ENABLE'
                          ? 'background-color:grey;color: #fff !important'
                          : 'color: gray !important;text-shadow:none'
                      "
                    >
                      {{ day.day }}
                    </span>
                  </template>
                  <template v-else>
                    <span
                      :class="[day.status === 'ENABLE'? 'cursor-pointer' : '']"
                      class="font-family text-center d-block letter-spacing"
                      style="font-size: 1rem; line-height: 2.805em; height: 2.805em; outline: 1px solid #fff;"
                      :style="
                        day.status === 'DISABLE'
                          ? 'color: gray !important;text-shadow:none'
                          : 'color: black !important;text-shadow:none'
                      "
                    >
                      {{ day.day }}
                    </span>
                  </template>
                </label>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
      <div
        style="padding: 10px 0"
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      >
        <div class="flex-fill align-self-stretch">
          <div
            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
          >
            <div class="flex-w-50 align-self-stretch">
              <a class="d-block font-family underline-none cursor-pointer">
                {{ months[(visiblecalendar as VisibleCalendarType).current.month] }}
              </a>
            </div>
            <div class="flex-w-50 align-self-stretch">
              <a class="d-block font-family underline-none cursor-pointer">
                {{ (visiblecalendar as VisibleCalendarType).current.year }}
              </a>
            </div>
          </div>
        </div>
        <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
          <a
            @click="clickNext()"
            style="height: 25px; width: 25px; border-radius: 50%"
            class="flex-box align-items-center justify-content-center underline-none cursor-pointer text-center"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="height: 20px;width: 20px;color: black;stroke: currentcolor;fill: currentcolor;"
            >
              <path
                d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <template v-if="props.excludedates">
          <div
            class="flex-w-12-dot-5 overflow-hidden"
          ></div>
        </template>
        <div
          :class="props.excludedates? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
          class="overflow-hidden"
          v-for="(_day, dayindex) in props.isoweek ? isodays : days"
          :key="'dayname-' + dayindex"
          style="border-radius: 4px"
        >
          {{ props.isoweek ? isodays[dayindex] : days[dayindex] }}
        </div>
      </div>
      <div
        id="currentvisiblecalendarbox"
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <template v-for="(week, weekindex) in (visiblecalendar as VisibleCalendarType).current.calendar">
          <div class="flex-w-100">
            <div
              class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
            >
              <template v-if="props.excludedates">
                <div
                  class="flex-w-12-dot-5 overflow-hidden m-0 align-self-stretch" style="padding:0 2px 0 0;"
                >
                  <div
                    class="p-0 m-0 w-100 h-100 flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
                  >
                    <input v-model="week.checked" class="m-0 p-0 border flex-w-100 h-100 align-self-stretch" :key="(visiblecalendar as VisibleCalendarType).current.year+'_'+(visiblecalendar as VisibleCalendarType).current.month+'_'+weekindex" @change="weekCheckboxClicked(week, 'CURRENT')" :disabled="weekHasEnable(week)" type="checkbox" />
                  </div>
                </div>
              </template>
              <div
                :class="props.excludedates? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
                class="overflow-hidden align-self-stretch"
                v-for="(day, dayindex) in week.days"
                :key="
                  'daycur' +
                  dayindex +
                  'weekcur' +
                  weekindex +
                  'monthcur' +
                  (visiblecalendar as VisibleCalendarType).current.month +
                  'yearcur' +
                  (visiblecalendar as VisibleCalendarType).current.year
                "
                style="float: left; outline: 1px solid #fff;"
              >
                <label
                  :ref="
                    (el) => assignRef((visiblecalendar as VisibleCalendarType).current, el as HTMLLabelElement, weekindex as number, dayindex as number)
                  "
                  @click="handleDateClick(day)"
                  :disabled="day.status === 'DISABLE' ? true : false"
                  class="w-100"
                  style="float: left; line-height: 2.805em; height: 2.805em;"
                >
                  <input
                    @click.stop=""
                    :disabled="day.status === 'DISABLE' ? true : false"
                    type="checkbox"
                    class="position-absolute d-none"
                    style="pointer-events: auto;"
                  />
                  <template v-if="currentyearandmonthinselections">
                    <span
                      :class="[day.status === 'ENABLE'? 'cursor-pointer' : '']"
                      class="font-family text-center d-block letter-spacing"
                      style="font-size: 1rem; line-height: 2.805em; height: 2.805em; outline: 1px solid #fff;"
                      :style="
                        day.day ===
                          ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                            (visiblecalendar as VisibleCalendarType).current.month
                          ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].day &&
                        ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                          (visiblecalendar as VisibleCalendarType).current.month
                        ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].selected === 'SELECTED' &&
                        ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                          (visiblecalendar as VisibleCalendarType).current.month
                        ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].status === 'ENABLE'
                          ? 'background-color:green;color: #fff !important'
                          : day.day ===
                              ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].day &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].selected === 'DESELECTED' &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].status === 'ENABLE'
                          ? 'color: black !important;text-shadow:none'
                          : day.day ===
                              ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].day &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].selected === 'HIGHLIGHTED' &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year][
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[weekindex].days[dayindex].status === 'ENABLE'
                          ? 'background-color:grey;color: #fff !important'
                          : 'color: gray !important;text-shadow:none'
                      "
                    >
                      {{ day.day }}
                    </span>
                  </template>
                  <template v-else>
                    <span
                      :class="[day.status === 'ENABLE'? 'cursor-pointer' : '']"
                      class="font-family text-center d-block letter-spacing"
                      style="font-size: 1rem; line-height: 2.805em; height: 2.805em; outline: 1px solid #fff;"
                      :style="
                        day.status === 'DISABLE'
                          ? 'color: gray !important;text-shadow:none'
                          : 'color: black !important;text-shadow:none'
                      "
                    >
                      {{ day.day }}
                    </span>
                  </template>
                </label>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
label input + span {
  color: #fff;
}
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
