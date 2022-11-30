<script lang="ts">
import {
  getDate,
  getWeeksInMonth,
  getDaysInMonth,
  startOfWeek,
  startOfISOWeek,
  differenceInCalendarDays,
  getMonth,
  getWeekYear,
  getISOWeekYear,
  format,
  formatISO,
} from "date-fns";
import {
  nextTick,
  type ShallowRef,
  type Ref,
  triggerRef,
} from "vue";
import type { VisibleCalendarPropType, VisibleCalendarType, PositionTrackerType, CalendarType, YearMonthClickable, RangeFirstSelectionType, DateSelectionsType } from "../types/dd_mm_yy_types";

export function removeDelimiters(item: string) {
  let newItem = item;
  let newItemArray = newItem
    .replace(/-/g, " ")
    .replace(/\//g, " ")
    .replace(/\.\s*/g, " ")
    .replace(/\./g, " ")
    .replace(/,\s*/g, " ")
    .split(" ");
  
  if (newItemArray.length === 3) {
    if (
      (parseInt(newItemArray[1]) < 13 && parseInt(newItemArray[2]) < 13) ||
      (parseInt(newItemArray[0]) < 13 && parseInt(newItemArray[1]) < 13)
    ) {
      return [
        newItem
          .replace(/-/g, " ")
          .replace(/\//g, " ")
          .replace(/\.\s*/g, " ")
          .replace(/\./g, " ")
          .replace(/,\s*/g, " "),
        false,
      ];
    } else {
      return [
        newItem
          .replace(/-/g, " ")
          .replace(/\//g, " ")
          .replace(/\.\s*/g, " ")
          .replace(/\./g, " ")
          .replace(/,\s*/g, " "),
        true,
      ];
    }
  } else {
    if(newItemArray.length === 1 || newItemArray.length === 2) {
      if(newItemArray.length === 1) {
        if(/^\d+$/g.test(newItemArray[0] as string)) {
          return [
            newItem
              .replace(/-/g, " ")
              .replace(/\//g, " ")
              .replace(/\.\s*/g, " ")
              .replace(/\./g, " ")
              .replace(/,\s*/g, " "),
            false,
          ];
        }
        else {
          return [
            newItem
              .replace(/-/g, " ")
              .replace(/\//g, " ")
              .replace(/\.\s*/g, " ")
              .replace(/\./g, " ")
              .replace(/,\s*/g, " "),
            true,
          ];
        }
      }
      else {
        if(/^\d+$/g.test(newItemArray[0] as string) && /^\d+$/g.test(newItemArray[1] as string)) {
          return [
            newItem
              .replace(/-/g, " ")
              .replace(/\//g, " ")
              .replace(/\.\s*/g, " ")
              .replace(/\./g, " ")
              .replace(/,\s*/g, " "),
            false,
          ];
        }
        else {
          return [
            newItem
              .replace(/-/g, " ")
              .replace(/\//g, " ")
              .replace(/\.\s*/g, " ")
              .replace(/\./g, " ")
              .replace(/,\s*/g, " "),
            true,
          ];
        }
      }
    }
    else {
      return [
        newItem
          .replace(/-/g, " ")
          .replace(/\//g, " ")
          .replace(/\.\s*/g, " ")
          .replace(/\./g, " ")
          .replace(/,\s*/g, " "),
        true,
      ];
    }
  }
}

export function countSelectedDateCells(vcalendar: ShallowRef<VisibleCalendarType>) {
  let total = 0;
  for(let year in vcalendar.value.selections) {
    for(let month in vcalendar.value.selections[year]) {
      for(let week in vcalendar.value.selections[year][month]) {
        for(let day in vcalendar.value.selections[year][month][week]) {
          if((vcalendar.value.selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).selected === 'SELECTED') {
            total++;
          }
        }
      }
    }
  }
  return total;
}

export function getYearMonthAndDate(pasteddate: string, clickedorpasted: boolean, props: VisibleCalendarPropType) {
  let year,
    month,
    day,
    teststringdate = "";
  if (clickedorpasted) {
    if (props.isoweek) {
      let splitedfdate = pasteddate.split("-");
      year = splitedfdate[0];
      month = parseInt(splitedfdate[1]) - 1;
      day = parseInt(splitedfdate[2]);
    } else {
      year = getWeekYear(new Date(pasteddate));
      month = getMonth(new Date(pasteddate));
      day = getDate(new Date(pasteddate));
    }
  } else {
    try {
      let fdate = format(new Date(pasteddate), "yyyy-MM-dd"),
        removedDelimiter = removeDelimiters(fdate),
        delimiterRemovedDateArray = (removedDelimiter[0] as string).split(" ");
      teststringdate =
        delimiterRemovedDateArray[0] +
        "-" +
        delimiterRemovedDateArray[1] +
        "-" +
        delimiterRemovedDateArray[2];
    } catch (ex) {
      let removedDelimiter = removeDelimiters(pasteddate),
        delimiterRemovedDateArray = (removedDelimiter[0] as string).split(" ");
      for (let i = 0; i < delimiterRemovedDateArray.length; i++) {
        for (let j = i + 1; j < delimiterRemovedDateArray.length; j++) {
          if (
            parseInt(delimiterRemovedDateArray[i]) <
            parseInt(delimiterRemovedDateArray[j])
          ) {
            let temp = delimiterRemovedDateArray[j];
            delimiterRemovedDateArray[j] = delimiterRemovedDateArray[i];
            delimiterRemovedDateArray[i] = temp;
          }
        }
      }
      teststringdate =
        delimiterRemovedDateArray[0] +
        "-" +
        delimiterRemovedDateArray[2] +
        "-" +
        delimiterRemovedDateArray[1];
    }
    if (props.isoweek) {
      year = getISOWeekYear(new Date(teststringdate));
      month = getMonth(new Date(teststringdate));
      day = getDate(new Date(teststringdate));
    } else {
      year = getWeekYear(new Date(teststringdate));
      month = getMonth(new Date(teststringdate));
      day = getDate(new Date(teststringdate));
    }
  }

  return {
    year: parseInt(''+year),
    month,
    day,
  };
}

export function deselectAll(rangefirstselection: Ref<RangeFirstSelectionType> | undefined, rangeselectcount: Ref<number> | undefined, multipleselectcount: Ref<number> | undefined, visiblecalendar: ShallowRef<VisibleCalendarType>) {
  if(rangeselectcount && multipleselectcount && rangefirstselection) {
    rangeselectcount.value = 0,
    multipleselectcount.value = 0;
    rangefirstselection.value = {year: 0, month: 0, day: 0, date: ""};
  }

  for (let year in visiblecalendar.value.selections) {
    for (let month in visiblecalendar.value.selections[year]) {
      for (let week in visiblecalendar.value.selections[year][month]) {
        for (let day in visiblecalendar.value.selections[year][month][week]) {
          if((visiblecalendar.value.selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).status === 'ENABLE') {
            (visiblecalendar.value.selections[year][month][week][day] as DateSelectionsType[number][number][number][number][number][number][number][number]).selected =
              "DESELECTED";
          }
        }
      }
    }
  }

  triggerRef(visiblecalendar);
}

export function destroySelections(visiblecalendar: ShallowRef<VisibleCalendarType>) {
  visiblecalendar.value.selections = {};
  triggerRef(visiblecalendar);
}

export function buildCalendar(
  _year: number,
  _month: number,
  forselection: boolean,
  holdertype: "LAST-OR-FIRST" | "PREVIOUS-OR-CURRENT" | "SELECTIONS",
  props: VisibleCalendarPropType,
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  let year = _year,
    month = _month,
    calendar = {} as CalendarType<PositionTrackerType> | CalendarType<{}>,
    diffBtwWkStartAndMnthStart,
    startDate,
    counter = 0,
    weeksInMonth = getWeeksInMonth(new Date(year, month, 1)),
    daysInMonth = getDaysInMonth(new Date(year, month, 1));

  if (props.isoweek) {
    diffBtwWkStartAndMnthStart = differenceInCalendarDays(
      new Date(year, month, 1),
      startOfISOWeek(new Date(year, month, 1))
    );
    startDate = getDate(startOfISOWeek(new Date(year, month, 1)));
  } else {
    diffBtwWkStartAndMnthStart = differenceInCalendarDays(
      new Date(year, month, 1),
      startOfWeek(new Date(year, month, 1))
    );
    startDate = getDate(startOfWeek(new Date(year, month, 1)));
  }

  for (let j = 0; j < weeksInMonth; j++) {
    let newWeekDate = 0;
    if (!(j in calendar)) {
      if (j === 0) {
        calendar = {
          [j]: [],
        };
      } else {
        calendar = {
          ...calendar,
          [j]: [],
        };
      }
    }

    for (let k = 0; k < 7; k++) {
      if (j === 0) {
        if (k < diffBtwWkStartAndMnthStart) {
          let sDate = startDate + k, mm = (month-1)<0? 11 : (month<10? "0"+month : month), yy = (month-1)<0? year-1 : year;
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: "DISABLE",
              readonlystatus: "DISABLE",
              day: sDate,
              date: yy+'-'+mm+'-'+sDate,
            } as CalendarType<{}>[number][number],
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
            } as CalendarType<{}>[number][number][number][number];
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            } as unknown as CalendarType<PositionTrackerType>[number][number];
          }
        } else {
          counter++;
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.mindate)
              ) >= 0 && differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              readonlystatus: differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.mindate)
              ) >= 0 && differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              day: counter,
              date:
                ''+(props.isoweek
                  ? formatISO(new Date(year, month, counter), { representation: "date" })
                  : format(new Date(year, month, counter), "yyyy-MM-dd")),
            } as CalendarType<{}>[number][number],
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
            } as CalendarType<{}>[number][number][number][number];
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            } as unknown as CalendarType<PositionTrackerType>[number][number];
          }
        }
      } else {
        counter++;
        if (counter <= daysInMonth) {
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.mindate)
              ) >= 0 && differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              readonlystatus: differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.mindate)
              ) >= 0 && differenceInCalendarDays(
                props.isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              day: counter,
              date:
                ''+(props.isoweek
                  ? formatISO(new Date(year, month, counter), { representation: "date" })
                  : format(new Date(year, month, counter), "yyyy-MM-dd")),
            } as CalendarType<{}>[number][number],
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
            } as CalendarType<{}>[number][number][number][number];
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            } as unknown as CalendarType<PositionTrackerType>[number][number];
          }
        } else {
          newWeekDate++;
          let yy = month+2 > 11 ? year+1 : year, mm = month+2 > 9? month+2 : '0'+(month+2);
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: "DISABLE",
              readonlystatus: "DISABLE",
              day: newWeekDate,
              date: yy+'-'+mm+'-0'+newWeekDate,
            } as CalendarType<{}>[number][number],
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
            } as CalendarType<{}>[number][number][number][number];
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            } as unknown as CalendarType<PositionTrackerType>[number][number];
          }
          if (newWeekDate === 7 && j == weeksInMonth - 1) {
            if ((calendar[j][0] as CalendarType<{}>[number][number][number][number] | CalendarType<PositionTrackerType>[number][number][number][number]).day === 1 && (calendar[j][6] as CalendarType<{}>[number][number][number][number] | CalendarType<PositionTrackerType>[number][number][number][number]).day === 7) {
              delete calendar[j];
            }
          }
        }
      }
    }
    if (j === weeksInMonth - 1 && counter < daysInMonth) {
      weeksInMonth++;
    }
  }

  if (holdertype === "PREVIOUS-OR-CURRENT") {
    nextTick(() => {
      getDimensions(visiblecalendar);
    });
  }

  return calendar;
}

export function getDimensions(visiblecalendar: ShallowRef<VisibleCalendarType>) {
  nextTick(() => {
    for (let w in visiblecalendar.value.previous.calendar) {
      for (let d in visiblecalendar.value.previous.calendar[w]) {
        if (w in visiblecalendar.value.previous.calendar) {
          if (d in visiblecalendar.value.previous.calendar[w]) {
            if ((visiblecalendar.value.previous.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).ref) {
              let offset = getOffset((visiblecalendar.value.previous.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).ref);
              if (offset) {
                (visiblecalendar.value.previous.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).x1 = offset.x1;
                (visiblecalendar.value.previous.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).y1 = offset.y1;
                (visiblecalendar.value.previous.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).x2 = offset.x2;
                (visiblecalendar.value.previous.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).y2 = offset.y2;
              }
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    }
    for (let w in visiblecalendar.value.current.calendar) {
      for (let d in visiblecalendar.value.current.calendar[w]) {
        if (w in visiblecalendar.value.current.calendar) {
          if (d in visiblecalendar.value.current.calendar[w]) {
            if ((visiblecalendar.value.current.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).ref) {
              let offset = getOffset((visiblecalendar.value.current.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).ref);
              if (offset) {
                (visiblecalendar.value.current.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).x1 = offset.x1;
                (visiblecalendar.value.current.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).y1 = offset.y1;
                (visiblecalendar.value.current.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).x2 = offset.x2;
                (visiblecalendar.value.current.calendar[w][d] as CalendarType<PositionTrackerType>[number][number][number][number]).y2 = offset.y2;
              }
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    }
    triggerRef(visiblecalendar);
  });
}

export function getOffset(el: HTMLLabelElement) {
  if (el) {
    const rect = el.getBoundingClientRect();
    return {
      x1: rect.left + window.scrollX,
      y1: rect.top + window.scrollY,
      x2: rect.left + window.scrollX + rect.width,
      y2: rect.top + window.scrollY + rect.height,
    };
  }
}

export function resetYearMonthDayCalendarHolder(holder: YearMonthClickable<PositionTrackerType> | YearMonthClickable<{}>, calendar: CalendarType<PositionTrackerType> | CalendarType<{}>) {
  return {
    month: holder.month,
    year: holder.year,
    clickable: holder.clickable,
    calendar: calendar,
  } as typeof holder;
}

export function addDate(rangefirstselection: Ref<RangeFirstSelectionType> | undefined, rangeselectcount: Ref<number> | undefined, multipleselectcount: Ref<number>, clickformat: Ref<"RANGE" | "MULTIPLE-OR-SINGLE">, item: string, clickedorpasted: boolean, highlightedorselected: boolean, props: VisibleCalendarPropType, visiblecalendar: ShallowRef<VisibleCalendarType>) {
  let result = getYearMonthAndDate(item, clickedorpasted, props),
    yFound = false,
    mFound = false,
    wFound = false,
    destroyed = false;

  if (Object.keys(visiblecalendar.value.selections).length > 0) {
    for (let year in visiblecalendar.value.selections) {
      if (parseInt(year) === result.year) {
        for (let month in visiblecalendar.value.selections[year]) {
          if (parseInt(month) === result.month) {
            for (let week in visiblecalendar.value.selections[year][month]) {
              for (let day in visiblecalendar.value.selections[year][month][week]) {
                if (
                  (
                    visiblecalendar.value.selections[year][month][week][day] as 
                    DateSelectionsType[number][number][number][number][number][number][number][number]
                  ).day === result.day &&
                  (
                    visiblecalendar.value.selections[year][month][week][day] as
                    DateSelectionsType[number][number][number][number][number][number][number][number]
                  ).status === "ENABLE"
                ) {
                  if(clickformat.value === 'RANGE') {
                    if(rangefirstselection && rangeselectcount && multipleselectcount) {
                      if(highlightedorselected) {
                        if(rangeselectcount.value < 2) {
                          if (
                            (
                              visiblecalendar.value.selections[year][month][week][day] as 
                              DateSelectionsType[number][number][number][number][number][number][number][number]
                            ).selected === "DESELECTED"
                            || 
                            (
                              visiblecalendar.value.selections[year][month][week][day] as 
                              DateSelectionsType[number][number][number][number][number][number][number][number]
                            ).selected === "HIGHLIGHTED"
                          ) {
                            if(rangeselectcount.value === 0) {
                              deselectAll(rangefirstselection, rangeselectcount, multipleselectcount, visiblecalendar);
                            }

                            (
                              visiblecalendar.value.selections[year][month][week][day] as 
                              DateSelectionsType[number][number][number][number][number][number][number][number]
                            ).selected = "SELECTED";

                            rangeselectcount.value++;

                            if(rangeselectcount.value === 1) {
                              rangefirstselection.value = {
                                date: (
                                  visiblecalendar.value.selections[year][month][week][day] as 
                                  DateSelectionsType[number][number][number][number][number][number][number][number]
                                ).date,
                                day: (
                                  visiblecalendar.value.selections[year][month][week][day] as 
                                  DateSelectionsType[number][number][number][number][number][number][number][number]
                                ).day,
                                year: result.year,
                                month: result.month,
                              };
                            }
                            else {
                              rangefirstselection.value = {year: 0, month: 0, day: 0, date: ""};
                            }
                          }
                          else {
                            (
                              visiblecalendar.value.selections[year][month][week][day] as 
                              DateSelectionsType[number][number][number][number][number][number][number][number]
                            ).selected = "DESELECTED";
                              
                            rangefirstselection.value = {year: 0, month: 0, day: 0, date: ""};
                            rangeselectcount.value = 0;
                            destroySelections(visiblecalendar);
                            destroyed = true;
                            break;
                          }
                        }
                        else {
                          deselectAll(rangefirstselection, rangeselectcount, multipleselectcount, visiblecalendar);
                          
                          (
                            visiblecalendar.value.selections[year][month][week][day] as 
                            DateSelectionsType[number][number][number][number][number][number][number][number]
                          ).selected = "SELECTED";

                          rangeselectcount.value = 1;
                          rangefirstselection.value = {
                            date: (
                              visiblecalendar.value.selections[year][month][week][day] as 
                              DateSelectionsType[number][number][number][number][number][number][number][number]
                            ).date,
                            day: (
                              visiblecalendar.value.selections[year][month][week][day] as 
                              DateSelectionsType[number][number][number][number][number][number][number][number]
                            ).day,
                            year: result.year,
                            month: result.month,
                          };
                        }
                      }
                      else {
                        (
                          visiblecalendar.value.selections[year][month][week][day] as 
                          DateSelectionsType[number][number][number][number][number][number][number][number]
                        ).selected = "HIGHLIGHTED";
                      }
                    }
                  }
                  else {
                    if(clickedorpasted) {
                      if (
                        (
                          visiblecalendar.value.selections[year][month][week][day] as 
                          DateSelectionsType[number][number][number][number][number][number][number][number]
                        ).selected === "DESELECTED"
                      ) {
                        (
                          visiblecalendar.value.selections[year][month][week][day] as 
                          DateSelectionsType[number][number][number][number][number][number][number][number]
                        ).selected = "SELECTED";

                        multipleselectcount.value++;
                      }
                      else {
                        (
                          visiblecalendar.value.selections[year][month][week][day] as 
                          DateSelectionsType[number][number][number][number][number][number][number][number]
                        ).selected = "DESELECTED";

                        multipleselectcount.value--;
                      }
                    }
                    else {
                      if (
                        (
                          visiblecalendar.value.selections[year][month][week][day] as 
                          DateSelectionsType[number][number][number][number][number][number][number][number]
                        ).selected === "DESELECTED"
                      ) {
                        (
                          visiblecalendar.value.selections[year][month][week][day] as 
                          DateSelectionsType[number][number][number][number][number][number][number][number]
                        ).selected = "SELECTED";

                        multipleselectcount.value++;
                      }
                    }
                  }
                  wFound = true;

                  triggerRef(visiblecalendar);
                  break;
                }
              }
              if(wFound || destroyed) break;
            }
            mFound = true;
            break;
          }
        }
        yFound = true;
        break;
      }
    }

    if (yFound) {
      if(mFound === false) {
        visiblecalendar.value.selections[result.year] = {
          ...visiblecalendar.value.selections[result.year],
          [result.month]: buildCalendar(result.year, result.month, true, "SELECTIONS", props, visiblecalendar),
        } as DateSelectionsType[number];
        addDate(rangefirstselection, rangeselectcount, multipleselectcount, clickformat, item, clickedorpasted, highlightedorselected, props, visiblecalendar);
      }
    } else {
      visiblecalendar.value.selections = {
        ...visiblecalendar.value.selections,
        [result.year]: {
          [result.month]: buildCalendar(result.year, result.month, true, "SELECTIONS", props, visiblecalendar),
        },
      } as DateSelectionsType;
      addDate(rangefirstselection, rangeselectcount, multipleselectcount, clickformat, item, clickedorpasted, highlightedorselected, props, visiblecalendar);
    }
  } else {
    visiblecalendar.value.selections  = {
      [result.year]: {
        [result.month]: buildCalendar(result.year, result.month, true, "SELECTIONS", props, visiblecalendar),
      },
    } as unknown as DateSelectionsType;
    addDate(rangefirstselection, rangeselectcount, multipleselectcount, clickformat, item, clickedorpasted, highlightedorselected, props, visiblecalendar);
  }
}


</script>