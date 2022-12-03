<script setup lang="ts">
import {
  type ShallowRef,
  type Ref,
  provide,
  shallowRef,
  triggerRef,
  ref,
  nextTick,
  onBeforeMount,
} from "vue";
import DayPicker from "./DayPicker.vue";
import MonthPicker from "./MonthPicker.vue";
import YearPicker from "./YearPicker.vue";
import type { DaySelectionFormat, MonthSelectionFormat, YearSelectionFormat, YearSelectionType, MonthSelectionType, DaySelectionType } from "../types/days_months_years_types";
import { getDayDimensions, getMonthDimensions, calculateRemainder, getYearDimensions } from "../utility/days_months_years_utility_fns";

const props = defineProps<{
  excludedates: boolean;
}>();

provide("yearprops", {
  maxyear: props.maxyear,
  minyear: props.minyear,
  yearselectionsandformat: props.yearselectionsandformat
});

provide("monthprops", props.monthselectionsandformat);

provide("dayprops", props.dayselectionsandformat);

let years = shallowRef<YearSelectionType>(),
  months = shallowRef<MonthSelectionType>(),
  days = shallowRef<DaySelectionType>(),
  monthNames = [
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
  yearpage = ref(0),
  dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  isodayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  yearformat = ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN">(),
  monthformat = ref<"RANGE" | "MULTIPLE-OR-SINGLE">(),
  dayformat = ref<"RANGE" | "MULTIPLE-OR-SINGLE">();

function updateYYearsValueFn(y: {years: YearSelectionType; page: number;}) {
  years.value = y.years;
  yearpage.value = y.page;
  triggerRef(years);
}

function updateDaysValueFn(dayvalue: DaySelectionType) {
  days.value = dayvalue as DaySelectionType;
  triggerRef(days);
}

function updateMonthsValueFn(monthvalue: MonthSelectionType) {
  months.value = monthvalue as MonthSelectionType;
  triggerRef(months);
}

function fillYearArray() {
  let index = 0, row = 0, col = 0, counter = 0;

  //let remainder = calculateRemainder(2022, 2000), maxyear = 2022 + remainder;
  //for(let year=2000; year<=maxyear; year++) {

  let 
    remainder = calculateRemainder(
      parseInt(props.maxyear), 
      parseInt(props.minyear)
    ), 
    maxyear = parseInt(props.maxyear) + remainder
  ;
  
  for(let year=parseInt(props.minyear); year<=maxyear; year++) {
    if(years.value) {
      if(index in years.value) {
        if(row in years.value[index]) {
          years.value[index][row] = {
            ...years.value[index][row],
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              year: year,
              status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
              selected: "DESELECTED",
            }
          } as YearSelectionType[number][number];
        }
        else {
          years.value[index] = {
            ...years.value[index],
            [row]: {
              [col]: {
                ref: null,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                year: year,
                status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
                selected: "DESELECTED",
              }
            }
          } as YearSelectionType[number];
        }
        col++;
      }
      else {
        years.value = {
          ...years.value,
          [index]: {
            [row]: {
              [col]: {
                ref: null,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                year: year,
                status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
                selected: "DESELECTED",
              }
            }
          }
        } as YearSelectionType;
        col++;
      }
    }
    else {
      years.value = {
        [index]: {
          [row]: {
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              year: year,
              status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
              selected: "DESELECTED",
            }
          }
        }
      } as unknown as YearSelectionType;
      col++;
    }
    if(col === 5) {
      row++;
      col = 0;
      counter++;
    }
    if(counter === 3) {
      index++;
      counter = 0;
      row = 0;
    }
  }

  yearpage.value = Object.keys(years.value as YearSelectionType).length-1;

  if(yearformat.value === 'RANGE') {
    nextTick(() => {
      getYearDimensions(years as ShallowRef<YearSelectionType>, yearpage as Ref<number>);
    });
  }

  triggerRef(years);
}

function fillMonthArray() {
  let row = 0, col = 0;
  for(let index=0; index<monthNames.length; index++) {
    if(months.value) {
      if(row in months.value) {
        (months as ShallowRef<MonthSelectionType>).value[row] = {
          ...months.value[row],
          [col]: {
            monthnumber: index,
            monthname: monthNames[index],
            selected: "DESELECTED",
            ref: null,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          },
        } as MonthSelectionType[number];
        col++;
      }
      else {
        months.value = {
          ...months.value,
          [row]: {
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              monthname: monthNames[index],
              monthnumber: index,
              selected: "DESELECTED",
            }
          },
        } as MonthSelectionType;
        col++;
      }
    }
    else {
      months.value = {
        [row]: {
          [col]: {
            ref: null,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            monthname: monthNames[index],
            monthnumber: index,
            selected: "DESELECTED",
          }
        },
      } as unknown as MonthSelectionType;
      col++
    }
    if(col === 4) {
      row++;
      col = 0;
    }
  }
  if(monthformat.value === "RANGE") {
    nextTick(() => {
      getMonthDimensions(months as ShallowRef<MonthSelectionType>);
    });
  }
  triggerRef(months);
}

function fillDayArray() {
  for(let index=0; index< ((props.isoweek)? isodayNames.length: dayNames.length); index++) {
    days.value = {
      ...days.value,
      [index]: {
        ref: null,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        name: (props.isoweek)? isodayNames[index] : dayNames[index],
        selected: "DESELECTED",
      },
    } as DaySelectionType;
  }

  if(dayformat.value === "RANGE") {
    nextTick(() => getDayDimensions(days as ShallowRef<DaySelectionType>));
  }
  triggerRef(days);
}

onBeforeMount(() => {
  yearformat.value = props.yearselectionsandformat?.format;
  monthformat.value = props.monthselectionsandformat?.format;
  dayformat.value = props.dayselectionsandformat?.format;
  fillYearArray();
  fillMonthArray();
  fillDayArray();

  /*

  cmaxyear = computed(() => {
    return ((cards.value[props.index] as DateType).result.max as string).split('-')[0];
  }),

  cminyear = computed(() => {
    return (cards.value[props.index].result.min as string).split('-')[0];
  })

  isoweek: boolean;
  maxyear: string;
  minyear: string;
  dayselectionsandformat?: DaySelectionFormat | undefined;
  monthselectionsandformat?: MonthSelectionFormat | undefined;
  yearselectionsandformat?: YearSelectionFormat | undefined;


  :isoweek="((cards[index] as DateType).isoweek as boolean)"
  :maxyear="cmaxyear"
  :minyear="cminyear"
  :yearselectionsandformat="((cards[index] as DateType).search.days_months_years?.years as YearSelectionFormat)"
  :dayselectionsandformat="((cards[index] as DateType).search.days_months_years?.days as DaySelectionFormat)"
  :monthselectionsandformat="((cards[index] as DateType).search.days_months_years?.months as MonthSelectionFormat)"

  */

});

</script>

<template>
  <div class="d-block position-relative" style="padding: 0 10px;">
    <div class="d-block" style="padding: 12px 0px 5px 0px;">
      <DayPicker
        :isoweek="isoweek"
        :ddays="(days as DaySelectionType)"
        :dformat="dayformat as 'RANGE' | 'MULTIPLE-OR-SINGLE'"
        @update:days-value="$val => updateDaysValueFn($val)"
      ></DayPicker>
    </div>
    <div class="d-block" style="padding: 7px 0px 5px 0px;">
      <MonthPicker
        :mmonths="(months as MonthSelectionType)"
        :mformat="monthformat as 'RANGE' | 'MULTIPLE-OR-SINGLE'"
        @update:months-value="$val => updateMonthsValueFn($val)"
      ></MonthPicker>
    </div>
    <div class="d-block" style="padding: 7px 0px 2px 0px;">
      <YearPicker
        :yyears="(years as YearSelectionType)"
        :yformat="yearformat as 'RANGE' | 'MULTIPLE-OR-SINGLE' | 'GREATER-THAN' | 'LESS-THAN' | 'FROM-TO'"
        :ppage="yearpage"
        @update:yyears-and-page-value="$val => updateYYearsValueFn($val)"
        @forward:format="$val => (yearformat as 'RANGE' | 'MULTIPLE-OR-SINGLE' | 'GREATER-THAN' | 'LESS-THAN' | 'FROM-TO') = $val"
      ></YearPicker>
    </div>
  </div>
</template>

<style scoped>
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
</style>