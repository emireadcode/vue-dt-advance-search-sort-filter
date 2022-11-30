<script setup lang="ts">
import {
  ref,
  nextTick,
  onBeforeMount,
  provide,
  shallowRef,
  triggerRef,
  type ShallowRef,
} from "vue";
import VisibleCalendarDatePicker from "./VisibleCalendarDatePicker.vue";
import PasteDD_MM_YY from "./PasteDD_MM_YY.vue";
import type { VisibleCalendarPropType, PositionTrackerType, DateSelectionsType, VisibleCalendarType, YearMonthClickable } from "../types/dd_mm_yy_types";
import { resetYearMonthDayCalendarHolder, buildCalendar } from "../utility/dd_mm_yy_utility_fns.vue";
import { differenceInCalendarDays, formatISO, format, getISOWeekYear, differenceInCalendarISOWeekYears, getMonth, getWeekYear, differenceInCalendarYears } from "date-fns";

const propsFromParent = defineProps<{
  maxdate: string;
  mindate: string;
  isoweek: boolean;
  format: "RANGE" | "MULTIPLE-OR-SINGLE";
  title: string;
  selections: DateSelectionsType;
}>();

provide('props', propsFromParent);

let visiblecalendar = shallowRef<VisibleCalendarType>(),
  clickformat = ref<"RANGE" | "MULTIPLE-OR-SINGLE">(),
  cupdatevcalendarvalue = ref(false),
  pupdatevcalendarvalue = ref(false);

function updateFormat(fmt: 'RANGE' | 'MULTIPLE-OR-SINGLE') {
  clickformat.value = fmt;
  cupdatevcalendarvalue.value = false;
  pupdatevcalendarvalue.value = false;
}

function updateVCalendarValueFn(vcalendarvalue: {vcalendar: VisibleCalendarType; pastedclickedornot: boolean; }, comingfrom: string) {
  (visiblecalendar.value as VisibleCalendarType) = vcalendarvalue.vcalendar;
  triggerRef(visiblecalendar);
  console.log(visiblecalendar.value);
  
  cupdatevcalendarvalue.value = false;
  pupdatevcalendarvalue.value = false;

  nextTick(() => {
    if(comingfrom === 'PASTED') {
      cupdatevcalendarvalue.value = true;
    }
    else {
      if(!vcalendarvalue.pastedclickedornot || (vcalendarvalue.pastedclickedornot && clickformat.value === 'MULTIPLE-OR-SINGLE')) {
        pupdatevcalendarvalue.value = true;
      }
    }
  });
}

function fillVisibleCalendarArray(maxdate: string, mindate: string, props: VisibleCalendarPropType) {
  let tempvisiblecalendar = shallowRef<VisibleCalendarType>();
  if (props.isoweek) {
    const maxISOWeekYear = getISOWeekYear(new Date(maxdate));
    const minISOWeekYear = getISOWeekYear(new Date(mindate));

    if (differenceInCalendarISOWeekYears(new Date(maxdate), new Date(mindate)) >= 1) {
      tempvisiblecalendar.value = {
        previous: {
          month: getMonth(new Date(mindate)),
          year: minISOWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<PositionTrackerType>,
        last: {
          month: getMonth(new Date(mindate)),
          year: minISOWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<{}>,
        current: {
          month: getMonth(new Date(maxdate)),
          year: maxISOWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<PositionTrackerType>,
        first: {
          month: getMonth(new Date(maxdate)),
          year: maxISOWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<{}>,
        selections: {} as DateSelectionsType,
      };
    } else {
      if (getMonth(new Date(mindate)) === getMonth(new Date(maxdate))) {
        if (getMonth(new Date(mindate)) === 0) {
          tempvisiblecalendar.value = {
            previous: {
              month: 11,
              year: minISOWeekYear - 1,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: 11,
              year: minISOWeekYear - 1,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<{}>,
            current: {
              month: 0,
              year: maxISOWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: 0,
              year: maxISOWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<{}>,
            selections: {} as DateSelectionsType,
          };
        } else {
          tempvisiblecalendar.value = {
            previous: {
              month: getMonth(new Date(mindate)) - 1,
              year: minISOWeekYear,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: getMonth(new Date(mindate)) - 1,
              year: minISOWeekYear,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<{}>,
            current: {
              month: getMonth(new Date(maxdate)),
              year: maxISOWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: getMonth(new Date(maxdate)),
              year: maxISOWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<{}>,
            selections: {} as DateSelectionsType,
          };
        }
      } else {
        tempvisiblecalendar.value = {
          previous: {
            month: getMonth(new Date(mindate)),
            year: minISOWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<PositionTrackerType>,
          last: {
            month: getMonth(new Date(mindate)),
            year: minISOWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<{}>,
          current: {
            month: getMonth(new Date(maxdate)),
            year: maxISOWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<PositionTrackerType>,
          first: {
            month: getMonth(new Date(maxdate)),
            year: maxISOWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<{}>,
          selections: {} as DateSelectionsType,
        };
      }
    }
  } else {
    const maxWeekYear = getWeekYear(new Date(maxdate));
    const minWeekYear = getWeekYear(new Date(mindate));
    if (differenceInCalendarYears(new Date(maxdate), new Date(mindate)) >= 1) {
      tempvisiblecalendar.value = {
        last: {
          month: getMonth(new Date(mindate)),
          year: minWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<{}>,
        previous: {
          month: getMonth(new Date(mindate)),
          year: minWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<PositionTrackerType>,
        current: {
          month: getMonth(new Date(maxdate)),
          year: maxWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<PositionTrackerType>,
        first: {
          month: getMonth(new Date(maxdate)),
          year: maxWeekYear,
          clickable: true,
          calendar: {},
        } as YearMonthClickable<{}>,
        selections: {} as DateSelectionsType,
      };
    } else {
      if (getMonth(new Date(mindate)) === getMonth(new Date(maxdate))) {
        if (getMonth(new Date(mindate)) === 0) {
          tempvisiblecalendar.value = {
            previous: {
              month: 11,
              year: minWeekYear - 1,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: 11,
              year: minWeekYear - 1,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<{}>,
            current: {
              month: 0,
              year: maxWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: 0,
              year: maxWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<{}>,
            selections: {} as DateSelectionsType,
          };
        } else {
          tempvisiblecalendar.value = {
            previous: {
              month: getMonth(new Date(mindate)) - 1,
              year: minWeekYear,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: getMonth(new Date(mindate)) - 1,
              year: minWeekYear,
              clickable: false,
              calendar: {},
            } as YearMonthClickable<{}>,
            current: {
              month: getMonth(new Date(maxdate)),
              year: maxWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: getMonth(new Date(maxdate)),
              year: maxWeekYear,
              clickable: true,
              calendar: {},
            } as YearMonthClickable<{}>,
            selections: {} as DateSelectionsType,
          };
        }
      } else {
        tempvisiblecalendar.value = {
          previous: {
            month: getMonth(new Date(mindate)),
            year: minWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<PositionTrackerType>,
          last: {
            month: getMonth(new Date(mindate)),
            year: minWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<{}>,
          current: {
            month: getMonth(new Date(maxdate)),
            year: maxWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<PositionTrackerType>,
          first: {
            month: getMonth(new Date(maxdate)),
            year: maxWeekYear,
            clickable: true,
            calendar: {},
          } as YearMonthClickable<{}>,
          selections: {} as DateSelectionsType,
        };
      }
    }
  }

  tempvisiblecalendar.value = {
    last: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.last,
      buildCalendar(
        tempvisiblecalendar.value.last.year,
        tempvisiblecalendar.value.last.month,
        false,
        "LAST-OR-FIRST",
        props,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ),
    first: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.first,
      buildCalendar(
        tempvisiblecalendar.value.first.year,
        tempvisiblecalendar.value.first.month,
        false,
        "LAST-OR-FIRST",
        props,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ),
    current: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.current,
      buildCalendar(
        tempvisiblecalendar.value.current.year,
        tempvisiblecalendar.value.current.month,
        false,
        "PREVIOUS-OR-CURRENT",
        props,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ) as YearMonthClickable<PositionTrackerType>,
    previous: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.previous,
      buildCalendar(
        tempvisiblecalendar.value.previous.year,
        tempvisiblecalendar.value.previous.month,
        false,
        "PREVIOUS-OR-CURRENT",
        props,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ) as YearMonthClickable<PositionTrackerType>,
    selections: tempvisiblecalendar.value.selections,
  };

  triggerRef(tempvisiblecalendar);

  return tempvisiblecalendar.value;
}

function findMaxAndMinDate(vcalendar: VisibleCalendarType) {
  let mindate = "", maxdate = "", count = 0, done = false;
  if(vcalendar.selections) {
    for(let year in vcalendar.selections) {
      for(let month in vcalendar.selections[year]) {
        for(let week in vcalendar.selections[year][month]) {
          for(let day in vcalendar.selections[year][month][week]) {
            if((vcalendar.selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).selected === "SELECTED") {
              if(count === 0) {
                mindate = (vcalendar.selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).date;
              }
              else {
                maxdate = (vcalendar.selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).date
              }
              count++;
              if(count === 2 && mindate && maxdate) {
                done = true;
                break;
              }
            }
          }
          if(done) break;
        }
        if(done) break;
      }
      if(done) break;
    }
  }
  return {maxdate, mindate};
}

function resetSelections(_selections: DateSelectionsType, maxdate: string, mindate: string, isoweek: string) {
  let selections = _selections;
  for(let year in selections) {
    for(let month in selections[year]) {
      for(let week in selections[year][month]) {
        for(let day in selections[year][month][week]) {
          if(
            differenceInCalendarDays(
              isoweek === "true"
                ? new Date(formatISO(new Date((selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).date), { representation: "date" }))
                : new Date(format(new Date((selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).date), "yyyy-MM-dd"))
              ,
              new Date(mindate)
            ) >= 0 && differenceInCalendarDays(
              isoweek === "true"
                ? new Date(formatISO(new Date((selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).date), { representation: "date" }))
                : new Date(format(new Date((selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).date), "yyyy-MM-dd"))
              ,
              new Date(maxdate)
            ) <= 0
          ) {
            if((selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).readonlystatus === "ENABLE") {
              (selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).status = "ENABLE";
            }
          }
          else {
            (selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).status = "DISABLE";
          }
        }
      }
    }
  }
  return selections;
}

onBeforeMount(() => {
  clickformat.value = propsFromParent.format;
  visiblecalendar.value = fillVisibleCalendarArray(propsFromParent.maxdate, propsFromParent.mindate, propsFromParent);
  triggerRef(visiblecalendar);
});

</script>

<template>
  <div class="d-block" style="padding: 0 10px;">
    <PasteDD_MM_YY
      :vcalendar="(visiblecalendar as VisibleCalendarType)"
      :updatevcalendarvalue="pupdatevcalendarvalue"
      @update:vcalendar-value="$vcalendarvalue => updateVCalendarValueFn($vcalendarvalue, 'PASTED')"
      @change:clickformat="$val => updateFormat($val)"
      :cformat="(clickformat as 'RANGE' | 'MULTIPLE-OR-SINGLE')"
    ></PasteDD_MM_YY>
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
      style="border: 1px solid gray"
    >
      <div class="flex-w-50 align-self-stretch">
        <a
          @click="() => updateFormat('RANGE')"
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="
            clickformat === 'RANGE' ? 'background-color:green;' : 'background-color:gray;'
          "
          style="color: #fff; padding: 2px 0"
        >
          Range
        </a>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <a
          @click="() => updateFormat('MULTIPLE-OR-SINGLE')"
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="
            clickformat === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          style="color: #fff; padding: 2px 0"
        >
          Multiple or Single
        </a>
      </div>
    </div>
    <div class="d-block" style="padding-bottom:2px;">
      <VisibleCalendarDatePicker
        :vcalendar="(visiblecalendar as VisibleCalendarType)"
        :cformat="(clickformat as 'RANGE' | 'MULTIPLE-OR-SINGLE')"
        :excludemode="(false as boolean)"
        :updatevcalendarvalue="cupdatevcalendarvalue"
        @update:vcalendar-value="$vcalendarvalue => updateVCalendarValueFn($vcalendarvalue, 'CALENDAR')"
      ></VisibleCalendarDatePicker>
    </div>
  </div>
</template>
