<script setup lang="ts">
import {
  differenceInCalendarDays,
} from "date-fns";
import {
  watch,
  ref,
  nextTick,
  triggerRef,
  shallowRef,
  inject,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  type WatchStopHandle,
  type ShallowRef,
  type Ref,
} from "vue";
import type { CalendarType, VisibleCalendarPropType, VisibleCalendarType, RangeFirstSelectionType, PositionTrackerType, YearMonthClickable } from "../types/dd_mm_yy_types.vue";
import { countSelectedDateCells, destroySelections, resetYearMonthDayCalendarHolder, buildCalendar, addDate, deselectAll, getDimensions } from "../utility/dd_mm_yy_utility_fns.vue";

const props1 = defineProps<{
  vcalendar: VisibleCalendarType;
  cformat: "RANGE" | "MULTIPLE-OR-SINGLE";
  excludemode: boolean;
  updatevcalendarvalue: boolean;
}>();

const emits = defineEmits<{
  (e: "update:vcalendar-value", action: { vcalendar: VisibleCalendarType; pastedclickedornot: boolean; }): void;
  (e: "send:dd_mm_yyyy_excludecanceldoneforsearchreadiness", action: { mode: 'RANGE' | 'MULTIPLE-OR-SINGLE'; score: number; }): void;
}>();

const props = inject('props') as VisibleCalendarPropType;

let months = [
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
  currentdateformat = ref(),
  visiblecalendar = shallowRef(),
  rangeselectcount = ref(0),
  multipleselectcount = ref(0),
  loadingMovement = ref(false),
  unwatchcurrentdateformat: WatchStopHandle,
  rangefirstselection = ref<RangeFirstSelectionType>(),
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchupdatecalendarvalue: WatchStopHandle,
  unwatchrangeselectcount: WatchStopHandle;

function buildHighlightedCalendar(mPointedDate: { date: string; status: string; day: string; month: string; year: string; }, rfirstselection: RangeFirstSelectionType) {
  if(parseInt(mPointedDate.year) === rfirstselection.year) {
    if(parseInt(mPointedDate.month) > rfirstselection.month) {
      for(let j=rfirstselection.month; j<=parseInt(mPointedDate.month); j++) {
        if(!(j in visiblecalendar.value.selections[rfirstselection.year])) {
          visiblecalendar.value.selections[rfirstselection.year] = {
            ...visiblecalendar.value.selections[rfirstselection.year],
            [j]: buildCalendar(rfirstselection.year, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
          };
        }
      }
    }
    else {
      for(let j=parseInt(mPointedDate.month); j<=rfirstselection.month; j++) {
        if(!(j in visiblecalendar.value.selections[rfirstselection.year])) {
          visiblecalendar.value.selections[rfirstselection.year] = {
            ...visiblecalendar.value.selections[rfirstselection.year],
            [j]: buildCalendar(rfirstselection.year, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
          };
        }
      }
    }
  }
  else {
    if(parseInt(mPointedDate.year) > (rfirstselection.year)) {
      for(let i=rfirstselection.year; i<=parseInt(mPointedDate.year); i++) {
        if(i === rfirstselection.year || i === parseInt(mPointedDate.year)) {
          if(i === rfirstselection.year) {
            for(let j=rfirstselection.month; j<12; j++) {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                };
              }
            }
          }
          else {
            for(let j=0; j<=parseInt(mPointedDate.month); j++) {
              if(j === 0) {
                if(!(i in visiblecalendar.value.selections)) {
                  visiblecalendar.value.selections = {
                    ...visiblecalendar.value.selections,
                    [i]: {
                      [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    }
                  };
                }
                else {
                  if(!(j in visiblecalendar.value.selections[i])) {
                    visiblecalendar.value.selections[i] = {
                      ...visiblecalendar.value.selections[i],
                      [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    };
                  }
                }
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
          }
        }
        else {
          for(let j=0; j<12; j++) {
            if(j === 0) {
              if(!(i in visiblecalendar.value.selections)) {
                visiblecalendar.value.selections = {
                  ...visiblecalendar.value.selections,
                  [i]: {
                    [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  }
                };
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
            else {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                };
              }
            }
          }
        }
      }
    }
    else {
      for(let i=parseInt(mPointedDate.year); i<=rfirstselection.year; i++) {
        if(i === rfirstselection.year || i === parseInt(mPointedDate.year)) {
          if(i === rfirstselection.year) {
            for(let j=rfirstselection.month; j>=0; j--) {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                };
              }
            }
          }
          else {
            for(let j=11; j>=parseInt(mPointedDate.month); j--) {
              if(j === 11) {
                if(!(i in visiblecalendar.value.selections)) {
                  visiblecalendar.value.selections = {
                    ...visiblecalendar.value.selections,
                    [i]: {
                      [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    }
                  };
                }
                else {
                  if(!(j in visiblecalendar.value.selections[i])) {
                    visiblecalendar.value.selections[i] = {
                      ...visiblecalendar.value.selections[i],
                      [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    };
                  }
                }
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
          }
        }
        else {
          for(let j=0; j<12; j++) {
            if(j === 0) {
              if(!(i in visiblecalendar.value.selections)) {
                visiblecalendar.value.selections = {
                  ...visiblecalendar.value.selections,
                  [i]: {
                    [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  }
                };
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
            else {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS", props, visiblecalendar as ShallowRef<VisibleCalendarType>)
                };
              }
            }
          }
        }
      }
    }
  }

  triggerRef(visiblecalendar);
}

function whereisMouse(pointx: number, pointy: number) {
  let result = {date: "", status: "", day: "", month: "", year: ""}, found = false;
  for(let week in visiblecalendar.value.previous.calendar) {
    for(let day in visiblecalendar.value.previous.calendar[week]) {
      if(
        (
          parseInt(week) === 0
          && (
            pointy <= parseFloat(visiblecalendar.value.previous.calendar[week][day].y2)
            &&
            pointx >= parseFloat(visiblecalendar.value.previous.calendar[week][day].x1)
            &&
            pointx <= parseFloat(visiblecalendar.value.previous.calendar[week][day].x2)
          )
        )
        ||
        (
          (parseInt(week) === Object.keys(visiblecalendar.value.previous.calendar).length - 1)
          && (
            pointx >= parseFloat(visiblecalendar.value.previous.calendar[week][day].x1)
            &&
            pointx <= parseFloat(visiblecalendar.value.previous.calendar[week][day].x2)
          )
        )
        ||
        (
          (parseInt(week) !== Object.keys(visiblecalendar.value.previous.calendar).length - 1)
          && (
            pointx >= parseFloat(visiblecalendar.value.previous.calendar[week][day].x1)
            &&
            pointx <= parseFloat(visiblecalendar.value.previous.calendar[week][day].x2)
            &&
            pointy >= parseFloat(visiblecalendar.value.previous.calendar[week][day].y1)
            &&
            pointy <= parseFloat(visiblecalendar.value.previous.calendar[week][day].y2)
          )
        )
      ) {
        result = {
          date: visiblecalendar.value.previous.calendar[week][day].date,
          status: visiblecalendar.value.previous.calendar[week][day].status,
          year: visiblecalendar.value.previous.year,
          month: visiblecalendar.value.previous.month,
          day: visiblecalendar.value.previous.calendar[week][day].day,
        };
        found = true;
        break;
      }
    }
    if(found) break;
  }
  if(found) {
    return result;
  }
  else {
    for(let week in visiblecalendar.value.current.calendar) {
      for(let day in visiblecalendar.value.current.calendar[week]) {
        if(
          (
            parseInt(week) === 0
            && (
              pointy <= parseFloat(visiblecalendar.value.current.calendar[week][day].y2)
              &&
              pointx >= parseFloat(visiblecalendar.value.current.calendar[week][day].x1)
              &&
              pointx <= parseFloat(visiblecalendar.value.current.calendar[week][day].x2)
            )
          )
          ||
          (
            (parseInt(week) === Object.keys(visiblecalendar.value.current.calendar).length - 1)
            && (
              pointx >= parseFloat(visiblecalendar.value.current.calendar[week][day].x1)
              &&
              pointx <= parseFloat(visiblecalendar.value.current.calendar[week][day].x2)
            )
          )
          ||
          (
            (parseInt(week) !== Object.keys(visiblecalendar.value.current.calendar).length - 1)
            && (
              pointx >= parseFloat(visiblecalendar.value.current.calendar[week][day].x1)
              &&
              pointx <= parseFloat(visiblecalendar.value.current.calendar[week][day].x2)
              &&
              pointy >= parseFloat(visiblecalendar.value.current.calendar[week][day].y1)
              &&
              pointy <= parseFloat(visiblecalendar.value.current.calendar[week][day].y2)
            )
          )
        ) {
          result = {
            date: visiblecalendar.value.current.calendar[week][day].date,
            status: visiblecalendar.value.current.calendar[week][day].status,
            day: visiblecalendar.value.current.calendar[week][day].day,
            year: visiblecalendar.value.current.year,
            month: visiblecalendar.value.current.month,
          };
          found = true;
          break;
        }
      }
      if(found) break;
    }
    return result;
  }
}

function clickForward() {
  if (visiblecalendar.value.last.clickable) {
    if (visiblecalendar.value.current.year > visiblecalendar.value.previous.year) {
      //current year is greater than previous year
      if (visiblecalendar.value.previous.month + 1 < 12) {
        visiblecalendar.value.previous.month++; //keep increasing the month
      } else {
        if (
          visiblecalendar.value.previous.year + 1 <
          visiblecalendar.value.current.year
        ) {
          visiblecalendar.value.previous.month = 0; //set month to jan and increase year
          visiblecalendar.value.previous.year++;
        } else {
          //previous year + 1 is equal to current year
          if (visiblecalendar.value.first.year > visiblecalendar.value.current.year) {
            visiblecalendar.value.previous.month = 0; //set month to jan and increase year
            visiblecalendar.value.previous.year++;
            if (
              visiblecalendar.value.previous.month === visiblecalendar.value.current.month
            ) {
              visiblecalendar.value.current.month++;
            }
          } else {
            if (visiblecalendar.value.current.month > 0) {
              visiblecalendar.value.previous.year++;
              visiblecalendar.value.previous.month = 0;
            } else {
              if (
                visiblecalendar.value.first.month > visiblecalendar.value.current.month
              ) {
                visiblecalendar.value.previous.year++;
                visiblecalendar.value.previous.month = 0;
                visiblecalendar.value.current.month++;
              }
            }
          }
        }
      }
    } else {
      //current year is equal to previous year
      if (
        visiblecalendar.value.current.month - visiblecalendar.value.previous.month >
        1
      ) {
        //keep increasing the month of the previous until it is less than 1
        visiblecalendar.value.previous.month++;
      } else {
        //difference between current and previous month of the same year is 1
        if (visiblecalendar.value.first.year > visiblecalendar.value.current.year) {
          //check if the current can be increased as well as the previous
          visiblecalendar.value.previous = JSON.parse(
            JSON.stringify(visiblecalendar.value.current)
          ) as YearMonthClickable<PositionTrackerType>;
          if (visiblecalendar.value.current.month + 1 < 12) {
            visiblecalendar.value.current.month++;
          } else {
            visiblecalendar.value.current.month = 0;
            visiblecalendar.value.current.year++;
          }
        } else {
          //current is equal to first
          if (visiblecalendar.value.first.month > visiblecalendar.value.current.month) {
            visiblecalendar.value.previous = JSON.parse(
              JSON.stringify(visiblecalendar.value.current)
            ) as YearMonthClickable<PositionTrackerType>;
            visiblecalendar.value.current.month++;
          }
        }
      }
    }
    
    visiblecalendar.value = {
      last: visiblecalendar.value.last,
      first: visiblecalendar.value.first,
      current: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.current,
        buildCalendar(
          visiblecalendar.value.current.year,
          visiblecalendar.value.current.month,
          false,
          "PREVIOUS-OR-CURRENT",
          props,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ),
      previous: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.previous,
        buildCalendar(
          visiblecalendar.value.previous.year,
          visiblecalendar.value.previous.month,
          false,
          "PREVIOUS-OR-CURRENT",
          props,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ),
      selections: visiblecalendar.value.selections,
    };

    triggerRef(visiblecalendar);
    
    emits("update:vcalendar-value", { vcalendar: visiblecalendar.value as VisibleCalendarType, pastedclickedornot: false });
  }
}

function clickBackward() {
  if (visiblecalendar.value.last.clickable) {
    if (visiblecalendar.value.previous.year < visiblecalendar.value.current.year) {
      if (visiblecalendar.value.current.month - 1 > -1) {
        visiblecalendar.value.current.month--;
      } else {
        if (
          visiblecalendar.value.current.year - 1 >
          visiblecalendar.value.previous.year
        ) {
          visiblecalendar.value.current.month = 11;
          visiblecalendar.value.current.year--;
        } else {
          //current year - 1 is equal to previous year
          if (visiblecalendar.value.previous.year > visiblecalendar.value.last.year) {
            visiblecalendar.value.current.month = 11;
            visiblecalendar.value.current.year--;
            if (
              visiblecalendar.value.previous.month === visiblecalendar.value.current.month
            ) {
              visiblecalendar.value.previous.month--;
            }
          } else {
            if (visiblecalendar.value.previous.month < 11) {
              visiblecalendar.value.current.month = 11;
              visiblecalendar.value.current.year--;
            } else {
              if (
                visiblecalendar.value.previous.month > visiblecalendar.value.last.month
              ) {
                visiblecalendar.value.current.month = 11;
                visiblecalendar.value.current.year--;
                visiblecalendar.value.previous.month--;
              }
            }
          }
        }
      }
    } else {
      //previous year is equal to current year
      if (
        visiblecalendar.value.current.month - visiblecalendar.value.previous.month >
        1
      ) {
        //keep reducing current
        visiblecalendar.value.current.month--;
      } else {
        if (visiblecalendar.value.previous.year > visiblecalendar.value.last.year) {
          visiblecalendar.value.current = JSON.parse(
            JSON.stringify(visiblecalendar.value.previous)
          ) as YearMonthClickable<PositionTrackerType>;
          if (visiblecalendar.value.previous.month - 1 > -1) {
            visiblecalendar.value.previous.month--;
          } else {
            visiblecalendar.value.previous.month = 11;
            visiblecalendar.value.previous.year--;
          }
        } else {
          if (visiblecalendar.value.previous.month > visiblecalendar.value.last.month) {
            visiblecalendar.value.current = JSON.parse(
              JSON.stringify(visiblecalendar.value.previous)
            );
            visiblecalendar.value.previous.month--;
          }
        }
      }
    }
    
    visiblecalendar.value = {
      last: visiblecalendar.value.last,
      first: visiblecalendar.value.first,
      current: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.current,
        buildCalendar(
          visiblecalendar.value.current.year,
          visiblecalendar.value.current.month,
          false,
          "PREVIOUS-OR-CURRENT",
          props,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ),
      previous: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.previous,
        buildCalendar(
          visiblecalendar.value.previous.year,
          visiblecalendar.value.previous.month,
          false,
          "PREVIOUS-OR-CURRENT",
          props,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ),
      selections: visiblecalendar.value.selections,
    };

    triggerRef(visiblecalendar);
    
    emits("update:vcalendar-value", { vcalendar: visiblecalendar.value as VisibleCalendarType, pastedclickedornot: false });
  }
}

function assignRef(holder: YearMonthClickable<PositionTrackerType> | YearMonthClickable<{}>, el: HTMLLabelElement, weekindex: number, dayindex: number) {
  if (weekindex in holder.calendar && el) {
    (holder.calendar[weekindex][dayindex] as CalendarType<PositionTrackerType>[number][number][number][number]).ref = el as HTMLLabelElement;
  }
}

function addDateByClick(holder: CalendarType<PositionTrackerType>[number][number][number][number]) {
  if(holder.status === 'ENABLE') {
    addDate(rangefirstselection as Ref<RangeFirstSelectionType>, rangeselectcount, multipleselectcount, currentdateformat, holder.date, true, true, props, visiblecalendar as ShallowRef<VisibleCalendarType>);
    
  }
}

function processDimensions() {
  getDimensions(visiblecalendar as ShallowRef<VisibleCalendarType>);
}

function unTrackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    (document.getElementById("currentvisiblecalendarbox") as HTMLDivElement).removeEventListener("mousemove", mouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    (document
      .getElementById("previousvisiblecalendarbox") as HTMLDivElement)
      .removeEventListener("mousemove", mouseMovement, true);
  }
}

function trackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    (document
      .getElementById("currentvisiblecalendarbox") as HTMLDivElement)
      .addEventListener("mousemove", mouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    (document
      .getElementById("previousvisiblecalendarbox") as HTMLDivElement)
      .addEventListener("mousemove", mouseMovement, true);
  }
}

function mouseMovement(event: { pageX: number; pageY: number; }) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (currentdateformat.value === "RANGE") {
        if ((rangefirstselection.value as RangeFirstSelectionType).date) {
          let mousePointedDate = whereisMouse(event.pageX, event.pageY);
          //console.log(mousePointedDate);
          buildHighlightedCalendar(mousePointedDate, rangefirstselection.value as RangeFirstSelectionType);
          if(mousePointedDate.date && mousePointedDate.status === 'ENABLE') {
            if(
              differenceInCalendarDays(
                new Date(mousePointedDate.date),
                new Date((rangefirstselection.value as RangeFirstSelectionType).date)
              ) >= 0
            ) {
              for(let year in visiblecalendar.value.selections) {
                for(let month in visiblecalendar.value.selections[year]) {
                  for(let week in visiblecalendar.value.selections[year][month]) {
                    for(let day in visiblecalendar.value.selections[year][month][week]) {
                      if(
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) > new Date((rangefirstselection.value as RangeFirstSelectionType).date)
                        &&
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) <= new Date(mousePointedDate.date)
                        && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                      ) {
                        addDate(rangefirstselection as Ref<RangeFirstSelectionType>, rangeselectcount, multipleselectcount, currentdateformat, visiblecalendar.value.selections[year][month][week][day].date, true, false, props, visiblecalendar as ShallowRef<VisibleCalendarType>);
                        //console.log('HIGHLIGHT ME');
                      }
                      else {
                        if(
                          visiblecalendar.value.selections[year][month][week][day].selected === "HIGHLIGHTED"
                          && (
                            new Date(visiblecalendar.value.selections[year][month][week][day].date) > new Date(mousePointedDate.date)
                          || new Date(visiblecalendar.value.selections[year][month][week][day].date) < new Date((rangefirstselection.value as RangeFirstSelectionType).date)
                          )
                          && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                        ) {
                          visiblecalendar.value.selections[year][month][week][day].selected = "DESELECTED";
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                  }
                }
              }
            }
            else {
              for(let year in visiblecalendar.value.selections) {
                for(let month in visiblecalendar.value.selections[year]) {
                  for(let week in visiblecalendar.value.selections[year][month]) {
                    for(let day in visiblecalendar.value.selections[year][month][week]) {
                      if(
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) >= new Date(mousePointedDate.date)
                        &&
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) < new Date((rangefirstselection.value as RangeFirstSelectionType).date)
                        && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                      ) {
                        addDate(rangefirstselection as Ref<RangeFirstSelectionType>, rangeselectcount, multipleselectcount, currentdateformat, visiblecalendar.value.selections[year][month][week][day].date, true, false, props, visiblecalendar as ShallowRef<VisibleCalendarType>);
                      }
                      else {
                        if(
                          visiblecalendar.value.selections[year][month][week][day].selected === "HIGHLIGHTED"
                          && ( new Date(visiblecalendar.value.selections[year][month][week][day].date) < new Date(mousePointedDate.date)
                          || new Date(visiblecalendar.value.selections[year][month][week][day].date) > new Date((rangefirstselection.value as RangeFirstSelectionType).date)
                          )
                          && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                        ) {
                          visiblecalendar.value.selections[year][month][week][day].selected = "DESELECTED";
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      loadingMovement.value = false;
    }
  });
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
  currentdateformat.value = props1.cformat;
  visiblecalendar.value  = props1.vcalendar as VisibleCalendarType;
});

onMounted(() => {
  unwatchupdatecalendarvalue = watch(
    () => props1.updatevcalendarvalue,
    (x) => {
      if(x) {
        visiblecalendar.value = props1.vcalendar as VisibleCalendarType;
        if(currentdateformat.value === 'MULTIPLE-OR-SINGLE') {
          if(visiblecalendar.value.selections) {
            multipleselectcount.value = countSelectedDateCells(visiblecalendar as ShallowRef<VisibleCalendarType>);
          }
        }
        nextTick(() => {
          triggerRef(visiblecalendar);
        });
      }
    }
  );
  unwatchcurrentdateformat = watch(
    () => props1.cformat,
    (x) => {
      currentdateformat.value = x;
      multipleselectcount.value = 0;
      rangeselectcount.value = 0;
      rangefirstselection.value = {year: 0, month: 0, day: 0, date: ""};
      destroySelections(visiblecalendar);
      unTrackVisibleCalendarMouseMovement();
    }
  );
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if(currentdateformat.value === "MULTIPLE-OR-SINGLE") {
        if(x > 0) {

        }
        else {
          
        }
      }
    }
  );
  unwatchrangeselectcount = watch(
    () => rangeselectcount.value,
    (x) => {
      if (currentdateformat.value === "RANGE") {
        if (x === 1) {
          trackVisibleCalendarMouseMovement();
        } else {
          unTrackVisibleCalendarMouseMovement();
          if(x === 2) {
            emits("update:vcalendar-value", { vcalendar: visiblecalendar.value as VisibleCalendarType, pastedclickedornot: true });
          }
          else {
            emits("send:dd_mm_yyyy_excludecanceldoneforsearchreadiness", { mode:props1.cformat, score: x });
          }
        }
      }
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});

onBeforeUnmount(() => {
  unwatchupdatecalendarvalue();
  unwatchrangeselectcount();
  unwatchmultipleselectcount();
  unwatchcurrentdateformat();
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
            @click="clickBackward()"
            style="height: 25px; width: 25px; border-radius: 50%"
            class="flex-box align-items-center justify-content-center underline-none cursor-pointer text-center"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="
                height: 20px;
                width: 20px;
                color: black;
                stroke: currentcolor;
                fill: currentcolor;
              "
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
                {{ months[visiblecalendar.previous.month] }}
              </a>
            </div>
            <div class="flex-w-50 align-self-stretch">
              <a class="d-block font-family underline-none cursor-pointer">
                {{ visiblecalendar.previous.year }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <div
          class="flex-w-14-dot-285714 overflow-hidden"
          v-for="(day, dayindex) in props.isoweek === 'true' ? isodays : days"
          :key="'dayname' + dayindex"
        >
          {{ props.isoweek === "true" ? isodays[dayindex] : days[dayindex] }}
        </div>
      </div>
      <div
        id="previousvisiblecalendarbox"
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <template v-for="(week, weekindex) in visiblecalendar.previous.calendar">
          <div class="flex-w-100">
            <div
              class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
            >
              <div
                class="flex-w-14-dot-285714 overflow-hidden"
                v-for="(day, dayindex) in week"
                :key="
                  'dayprev' +
                  dayindex +
                  'weekprev' +
                  weekindex +
                  'monthprev' +
                  visiblecalendar.previous.month +
                  'yearprev' +
                  visiblecalendar.previous.year
                "
                style="float: left; outline: 1px solid #fff;"
              >
                <label
                  :ref="
                    (el) => assignRef(visiblecalendar.previous, el as HTMLLabelElement, weekindex, dayindex)
                  "
                  @click="addDateByClick(day as CalendarType<PositionTrackerType>[number][number][number][number])"
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
                          visiblecalendar.selections[visiblecalendar.previous.year][
                            visiblecalendar.previous.month
                          ][weekindex][dayindex].day &&
                        visiblecalendar.selections[visiblecalendar.previous.year][
                          visiblecalendar.previous.month
                        ][weekindex][dayindex].selected === 'SELECTED' &&
                        visiblecalendar.selections[visiblecalendar.previous.year][
                          visiblecalendar.previous.month
                        ][weekindex][dayindex].status === 'ENABLE'
                          ? 'background-color:green;color: #fff !important'
                          : day.day ===
                              visiblecalendar.selections[visiblecalendar.previous.year][
                                visiblecalendar.previous.month
                              ][weekindex][dayindex].day &&
                            visiblecalendar.selections[visiblecalendar.previous.year][
                              visiblecalendar.previous.month
                            ][weekindex][dayindex].selected === 'DESELECTED' &&
                            visiblecalendar.selections[visiblecalendar.previous.year][
                              visiblecalendar.previous.month
                            ][weekindex][dayindex].status === 'ENABLE'
                          ? 'color: black !important;text-shadow:none'
                          : day.day ===
                              visiblecalendar.selections[visiblecalendar.previous.year][
                                visiblecalendar.previous.month
                              ][weekindex][dayindex].day &&
                            visiblecalendar.selections[visiblecalendar.previous.year][
                              visiblecalendar.previous.month
                            ][weekindex][dayindex].selected === 'HIGHLIGHTED' &&
                            visiblecalendar.selections[visiblecalendar.previous.year][
                              visiblecalendar.previous.month
                            ][weekindex][dayindex].status === 'ENABLE'
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
                {{ months[visiblecalendar.current.month] }}
              </a>
            </div>
            <div class="flex-w-50 align-self-stretch">
              <a class="d-block font-family underline-none cursor-pointer">
                {{ visiblecalendar.current.year }}
              </a>
            </div>
          </div>
        </div>
        <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
          <a
            @click="clickForward()"
            style="height: 25px; width: 25px; border-radius: 50%"
            class="flex-box align-items-center justify-content-center underline-none cursor-pointer text-center"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="
                height: 20px;
                width: 20px;
                color: black;
                stroke: currentcolor;
                fill: currentcolor;
              "
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
        <div
          class="flex-w-14-dot-285714 overflow-hidden"
          v-for="(day, dayindex) in props.isoweek === 'true' ? isodays : days"
          :key="'dayname' + dayindex"
          style="border-radius: 4px"
        >
          {{ props.isoweek === "true" ? isodays[dayindex] : days[dayindex] }}
        </div>
      </div>
      <div
        id="currentvisiblecalendarbox"
        class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
      >
        <template v-for="(week, weekindex) in visiblecalendar.current.calendar">
          <div class="flex-w-100">
            <div
              class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
            >
              <div
                class="flex-w-14-dot-285714 overflow-hidden"
                v-for="(day, dayindex) in week"
                :key="
                  'daycur' +
                  dayindex +
                  'weekcur' +
                  weekindex +
                  'monthcur' +
                  visiblecalendar.current.month +
                  'yearcur' +
                  visiblecalendar.current.year
                "
                style="float: left; outline: 1px solid #fff;"
              >
                <label
                  :ref="
                    (el) => assignRef(visiblecalendar.current, el as HTMLLabelElement, weekindex, dayindex)
                  "
                  @click="addDateByClick(day as CalendarType<PositionTrackerType>[number][number][number][number])"
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
                          visiblecalendar.selections[visiblecalendar.current.year][
                            visiblecalendar.current.month
                          ][weekindex][dayindex].day &&
                        visiblecalendar.selections[visiblecalendar.current.year][
                          visiblecalendar.current.month
                        ][weekindex][dayindex].selected === 'SELECTED' &&
                        visiblecalendar.selections[visiblecalendar.current.year][
                          visiblecalendar.current.month
                        ][weekindex][dayindex].status === 'ENABLE'
                          ? 'background-color:green;color: #fff !important'
                          : day.day ===
                              visiblecalendar.selections[visiblecalendar.current.year][
                                visiblecalendar.current.month
                              ][weekindex][dayindex].day &&
                            visiblecalendar.selections[visiblecalendar.current.year][
                              visiblecalendar.current.month
                            ][weekindex][dayindex].selected === 'DESELECTED' &&
                            visiblecalendar.selections[visiblecalendar.current.year][
                              visiblecalendar.current.month
                            ][weekindex][dayindex].status === 'ENABLE'
                          ? 'color: black !important;text-shadow:none'
                          : day.day ===
                              visiblecalendar.selections[visiblecalendar.current.year][
                                visiblecalendar.current.month
                              ][weekindex][dayindex].day &&
                            visiblecalendar.selections[visiblecalendar.current.year][
                              visiblecalendar.current.month
                            ][weekindex][dayindex].selected === 'HIGHLIGHTED' &&
                            visiblecalendar.selections[visiblecalendar.current.year][
                              visiblecalendar.current.month
                            ][weekindex][dayindex].status === 'ENABLE'
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
