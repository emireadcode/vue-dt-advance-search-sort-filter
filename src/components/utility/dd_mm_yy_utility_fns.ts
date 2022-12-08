import {
  getDate,
  getWeeksInMonth,
  getDaysInMonth,
  getMonth,
  startOfWeek,
  startOfISOWeek,
  getWeekYear,
  getISOWeekYear,
  format,
  formatISO,
  differenceInCalendarDays,
  differenceInCalendarYears,
  differenceInCalendarISOWeekYears
} from "date-fns";
import {
  nextTick,
  type ShallowRef,
  type Ref,
  triggerRef,
  shallowRef,
  ref,
} from "vue";
import type { RangeSelectionParamsType, VisibleCalendarType, PositionTrackerType, YearMonthClickable, RangeFirstAndLastSelectionType} from "../types/dd_mm_yy_types";

const loadingMovement = ref(false);

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

export function getYearMonthAndDate(isoweek: boolean, pastedorclickeddate: string, isclickedstatus: boolean) {
  let year,
    month,
    day,
    teststringdate = "";
  if (isclickedstatus) {
    if (isoweek) {
      let splitedfdate = pastedorclickeddate.split("-");
      year = splitedfdate[0];
      month = parseInt(splitedfdate[1]) - 1;
      day = parseInt(splitedfdate[2]);
    } else {
      year = getWeekYear(new Date(pastedorclickeddate));
      month = getMonth(new Date(pastedorclickeddate));
      day = getDate(new Date(pastedorclickeddate));
    }
  } else {
    try {
      let fdate = format(new Date(pastedorclickeddate), "yyyy-MM-dd"),
        removedDelimiter = removeDelimiters(fdate),
        delimiterRemovedDateArray = (removedDelimiter[0] as string).split(" ");
      teststringdate =
        delimiterRemovedDateArray[0] +
        "-" +
        delimiterRemovedDateArray[1] +
        "-" +
        delimiterRemovedDateArray[2];
    } catch (ex) {
      let removedDelimiter = removeDelimiters(pastedorclickeddate),
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
    if (isoweek) {
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

export function deselectAll(visiblecalendar: ShallowRef<VisibleCalendarType>) {
  for (let year in visiblecalendar.value.selections) {
    for (let month in visiblecalendar.value.selections[year]) {
      for (let week in visiblecalendar.value.selections[year][month]) {
        for (let day in (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].days) {
          if((visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].days[day].status === 'ENABLE') {
            (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].days[day].selected =
              "DESELECTED";
          }
        }
      }
    }
  }
  triggerRef(visiblecalendar);
}

export function buildCalendar(
  year: number,
  month: number,
  holdertype: "LAST-OR-FIRST" | "PREVIOUS-OR-CURRENT" | "SELECTIONS",
  isoweek: boolean,
  mindate: string,
  maxdate: string,
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  let
    calendar = {} as YearMonthClickable<PositionTrackerType>['calendar'] | YearMonthClickable<{}>['calendar'],
    diffBtwWkStartAndMnthStart,
    startDate,
    counter = 0,
    weeksInMonth = getWeeksInMonth(new Date(year, month, 1)),
    daysInMonth = getDaysInMonth(new Date(year, month, 1))
  ;

  if (isoweek) {
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
          [j]: {
            days: {},
            checked: false
          } as YearMonthClickable<PositionTrackerType>['calendar'][number] | YearMonthClickable<{}>['calendar'][number]
        } as YearMonthClickable<PositionTrackerType>['calendar'] | YearMonthClickable<{}>['calendar'];
      } else {
        calendar = {
          ...calendar,
          [j]: {
            days: {},
            checked: false
          } as YearMonthClickable<PositionTrackerType>['calendar'][number] | YearMonthClickable<{}>['calendar'][number]
        } as YearMonthClickable<PositionTrackerType>['calendar'] | YearMonthClickable<{}>['calendar'];
      }
    }

    for (let k = 0; k < 7; k++) {
      if (j === 0) {
        if (k < diffBtwWkStartAndMnthStart) {
          let sDate = startDate + k, mm = (month-1)<0? 11 : (month<10? "0"+month : month), yy = (month-1)<0? year-1 : year;
          if(k === 0) {
            calendar[j].days = {
              [k]: {
                status: "DISABLE",
                readonlystatus: "DISABLE",
                day: sDate,
                date: yy+'-'+mm+'-'+sDate,
              }
            };
          }
          else {
            calendar[j].days = {
              ...calendar[j].days,
              [k]: {
                status: "DISABLE",
                readonlystatus: "DISABLE",
                day: sDate,
                date: yy+'-'+mm+'-'+sDate,
              }
            };
          }
        } else {
          counter++;
          calendar[j].days = {
            ...calendar[j].days,
            [k]: {
              status: differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(mindate)
              ) >= 0 && differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              readonlystatus: differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(mindate)
              ) >= 0 && differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              day: counter,
              date:
                ''+(isoweek
                  ? formatISO(new Date(year, month, counter), { representation: "date" })
                  : format(new Date(year, month, counter), "yyyy-MM-dd")),
            },
          }
        }
        if (holdertype === "PREVIOUS-OR-CURRENT") {
          calendar[j].days[k] = {
            ...calendar[j].days[k],
            ref: undefined,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          } as YearMonthClickable<PositionTrackerType>['calendar'][number]['days'][number];
        }
        else {
          if(holdertype === 'SELECTIONS') {
            calendar[j].days[k] = {
              ...calendar[j].days[k],
              selected: "DESELECTED",
            };
          }
        }
      } else {
        counter++;
        if (counter <= daysInMonth) {
          calendar[j].days = {
            ...calendar[j].days,
            [k]: {
              status: differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(mindate)
              ) >= 0 && differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              readonlystatus: differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(mindate)
              ) >= 0 && differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              day: counter,
              date:
                ''+(isoweek
                  ? formatISO(new Date(year, month, counter), { representation: "date" })
                  : format(new Date(year, month, counter), "yyyy-MM-dd")),
            }
          };
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j].days[k] = {
              ...calendar[j].days[k],
              ref: undefined,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
          else {
            if(holdertype === 'SELECTIONS') {
              calendar[j].days[k] = {
                ...calendar[j].days[k],
                selected: "DESELECTED",
              };
            }
          }
        } else {
          newWeekDate++;
          let yy = month+2 > 11 ? year+1 : year, mm = month+2 > 9? month+2 : '0'+(month+2);
          calendar[j].days = {
            ...calendar[j].days,
            [k]: {
              status: "DISABLE",
              readonlystatus: "DISABLE",
              day: newWeekDate,
              date: yy+'-'+mm+'-0'+newWeekDate,
            },
          };
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j].days[k] = {
              ...calendar[j].days[k],
              ref: undefined,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
          else {
            if(holdertype === 'SELECTIONS') {
              calendar[j].days[k] = {
                ...calendar[j].days[k],
                selected: "DESELECTED",
              };
            }
          }
          if (newWeekDate === 7 && j == weeksInMonth - 1) {
            if (calendar[j].days[0].day === 1 && calendar[j].days[6].day === 7) {
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
      for (let d in visiblecalendar.value.previous.calendar[w].days) {
        if (w in visiblecalendar.value.previous.calendar) {
          if (d in visiblecalendar.value.previous.calendar[w].days) {
            if (visiblecalendar.value.previous.calendar[w].days[d].ref as HTMLLabelElement) {
              let offset = getOffset(visiblecalendar.value.previous.calendar[w].days[d].ref as HTMLLabelElement);
              if (offset) {
                visiblecalendar.value.previous.calendar[w].days[d].x1 = offset.x1;
                visiblecalendar.value.previous.calendar[w].days[d].y1 = offset.y1;
                visiblecalendar.value.previous.calendar[w].days[d].x2 = offset.x2;
                visiblecalendar.value.previous.calendar[w].days[d].y2 = offset.y2;
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
      for (let d in visiblecalendar.value.current.calendar[w].days) {
        if (w in visiblecalendar.value.current.calendar) {
          if (d in visiblecalendar.value.current.calendar[w].days) {
            if (visiblecalendar.value.current.calendar[w].days[d].ref as HTMLLabelElement) {
              let offset = getOffset(visiblecalendar.value.current.calendar[w].days[d].ref as HTMLLabelElement);
              if (offset) {
                visiblecalendar.value.current.calendar[w].days[d].x1 = offset.x1;
                visiblecalendar.value.current.calendar[w].days[d].y1 = offset.y1;
                visiblecalendar.value.current.calendar[w].days[d].x2 = offset.x2;
                visiblecalendar.value.current.calendar[w].days[d].y2 = offset.y2;
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

function getOffset(el: HTMLLabelElement) {
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

function resetYearMonthDayCalendarHolder(holder: YearMonthClickable<PositionTrackerType> | YearMonthClickable<{}>, calendar: YearMonthClickable<PositionTrackerType>['calendar'] | YearMonthClickable<{}>['calendar']) {
  return {
    month: holder.month,
    year: holder.year,
    clickable: holder.clickable,
    calendar: calendar,
  } as typeof holder;
}

function handleMultipleSelectionByPaste(
  multipleselectcount: Ref<number>,
  day: number,
  week: number,
  month: number,
  year: number,
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  if (
    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].days[day].selected === "DESELECTED"
  ) {
    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].days[day].selected = "SELECTED";
    multipleselectcount.value++;
  }
}

function handleMultipleSelectionByClick(
  multipleselectcount: Ref<number>, 
  day: number,
  week: number,
  month: number,
  year: number,
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  if (
    (
      visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
    )[week].days[day].selected === "DESELECTED"
  ) {
    (
      visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
    )[week].days[day].selected = "SELECTED";

    multipleselectcount.value++;
  }
  else {
    (
      visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
    )[week].days[day].selected = "DESELECTED";

    multipleselectcount.value--;
  }
}

function checkAWeekCheckBox(visiblecalendar: ShallowRef<VisibleCalendarType>, day: number, week: number, month: number, year: number) {
  ((visiblecalendar.value as VisibleCalendarType).selections[year][month] as YearMonthClickable<PositionTrackerType>)['calendar'][week].checked = true;
  triggerRef(visiblecalendar);
}

function handleRangeSelection(
  result: { year: number; month: number; day: number; },
  params: ShallowRef<RangeSelectionParamsType>,
  day: number,
  week: number,
  month: number,
  year: number,
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  if(params.value.excludedates) {
    if (
      (
        visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
      )[week].days[day].selected !== "SELECTED"
    ) {
      if(
        (
          visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
        )[week].days[day].selected === "HIGHLIGHTED"
      ) {
        (
          visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
        )[week].days[day].selected = "DESELECTED";
      }
      else {
        (
          visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
        )[week].days[day].selected = "HIGHLIGHTED";
      }
      triggerRef(visiblecalendar);
    }
    nextTick(() => {
      let deselectedcount = 0;
      if(
        year === params.value.rangefirstselection.year && month === params.value.rangefirstselection.month && week === params.value.rangefirstselection.week
        ||
        year === params.value.rangelastselection.year && month === params.value.rangelastselection.month && week === params.value.rangelastselection.week
      ) {
        if(
          year === params.value.rangefirstselection.year && month === params.value.rangefirstselection.month && week === params.value.rangefirstselection.week
        ) {
          if(year === params.value.rangelastselection.year) {
            if(month === params.value.rangelastselection.month) {
              if(week === params.value.rangelastselection.week) {
                if(params.value.rangefirstselection.day > params.value.rangelastselection.day) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangelastselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangelastselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(week > params.value.rangelastselection.week) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[week].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[week].days[d].day <= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[week].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    )[week].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[week].days[d].day >= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[week].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              let deselected = false;
              if(month > params.value.rangelastselection.month) {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      ((visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }
                if(week === 0) {
                  if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year]) {
                    if((month-1) === params.value.rangelastselection.month) {
                      if(
                        (
                          Object.values(
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month-1
                            ] as YearMonthClickable<{}>['calendar']
                          ).length - 1
                        ) === params.value.rangelastselection.week
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            week
                          ].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month-1
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].days
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month-1
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year
                                    ][
                                      month-1
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).length - 1
                                )
                              ].days[d].day >= params.value.rangelastselection.day
                              &&
                              !(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month-1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                              )
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month - 1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              params.value.rangefirstselection.week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                      else {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            week
                          ].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month-1
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].days
                          ) {
                            if(
                              !(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month-1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                              )
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month - 1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                    else {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[0].day !== 1
                      ) {
                        for(let d in (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month-1
                                ] as YearMonthClickable<{}>['calendar']
                              ).length - 1
                            )
                          ].days
                        ) {
                          if(
                            !(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year
                                    ][
                                      month - 1
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).length - 1
                                )
                              ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                            )
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year
                                    ][
                                      month - 1
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).length - 1
                                )
                              ].days[d].selected === 'DESELECTED'
                            ) {
                              deselectedcount++;
                              break;
                            }
                          }
                        }
                        if(deselectedcount > 0 || deselected) {
                          (visiblecalendar.value.selections[year][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar'])[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              ).length - 1
                            )
                          ].checked = false;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar'])[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              ).length - 1
                            )
                          ].checked = true;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                      else {
                        if(deselected) {
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<{}>['calendar'])[
                      week
                    ].checked = false;
                  }
                  else {
                    
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<{}>['calendar'])[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      !(((visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }
                if(week === (
                  Object.values(
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).length - 1
                )) {
                  if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year]) {
                    if((month+1) === params.value.rangelastselection.month) {
                      if(params.value.rangelastselection.week === 0) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month + 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].day <= params.value.rangelastselection.day
                              &&
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month + 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[0].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar'])[0].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[0].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                      else {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month + 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month + 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[0].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar'])[0].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[0].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                    else {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month + 1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].days[0].day !== 1
                      ) {
                        for(let d in (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month + 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].selected === 'DESELECTED'
                            ) {
                              deselectedcount++;
                              break;
                            }
                          }
                        }
                        if(deselectedcount > 0 || deselected) {
                          (visiblecalendar.value.selections[year][
                            month + 1
                          ] as YearMonthClickable<{}>['calendar'])[0].checked = false;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            month + 1
                          ] as YearMonthClickable<{}>['calendar'])[0].checked = true;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                      else {
                        if(deselected) {
                          (visiblecalendar.value.selections[year][
                            params.value.rangefirstselection.month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            params.value.rangefirstselection.month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                        week
                      ].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                        week
                      ].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                      week
                    ].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
          else {
            let deselected = false;
            if(year > params.value.rangelastselection.year) {
              if(month === 0) {
                if(week === 0) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    )[
                      week
                    ].days[0].day !== 1
                  ) {
                    if((year - 1) in (visiblecalendar.value as VisibleCalendarType).selections) {
                      if(
                        11 in (visiblecalendar.value as VisibleCalendarType).selections[year - 1]
                      ) {
                        for(let d in (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year - 1
                            ][
                              11
                            ] as YearMonthClickable<PositionTrackerType>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ]
                              ).length - 1
                            )
                          ].days
                        ) {
                          if(
                            !((
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year-1
                              ][
                                11
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year-1
                                  ][
                                    11
                                  ]
                                ).length - 1
                              )
                            ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year-1
                                    ][
                                      11
                                    ]
                                  ).length - 1
                                )
                              ].days[d].selected === 'DESELECTED'
                            ) {
                              deselectedcount++;
                              break;
                            }
                          }
                        }
                        if(deselectedcount > 0 || deselected) {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year-1
                            ][
                              11
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ]
                              ).length - 1
                            )
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year-1
                            ][
                              11
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ]
                              ).length - 1
                            )
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                      else {
                        if(deselected) {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(week === 0) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    )[
                      week
                    ].days[0].day !== 1
                  ) {
                    if(
                      (month - 1) in (visiblecalendar.value as VisibleCalendarType).selections[year]
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month - 1
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[
                          (
                            Object.values(
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ]
                            ).length - 1
                          )
                        ].days
                      ) {
                        if(
                          !((
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ]
                              ).length - 1
                            )
                          ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ]
                                ).length - 1
                              )
                            ].days[d].selected === 'DESELECTED'
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          (
                            Object.values(
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ]
                            ).length - 1
                          )
                        ].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          (
                            Object.values(
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ]
                            ).length - 1
                          )
                        ].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(month === 11) {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }
                if(week === (
                  Object.values(
                    (
                      visiblecalendar.value as VisibleCalendarType
                    ).selections[year][month] as YearMonthClickable<{}>['calendar']
                  ).length - 1
                )) {
                  if((year + 1) === params.value.rangelastselection.year && params.value.rangelastselection.month === 0 && params.value.rangelastselection.week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year + 1
                        ][
                          0
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        0
                      ].days[0].day !== 1
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year + 1
                          ][
                            0
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[0].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year+1
                            ][
                              0
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                          &&
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year+1
                            ][
                              0
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day <= params.value.rangelastselection.day
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year+1
                              ][
                                0
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].selected === 'DESELECTED'
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year + 1
                        ][
                          0
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        0
                      ].days[0].day !== 1
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year + 1
                          ][
                            0
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[0].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year+1
                            ][
                              0
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year+1
                              ][
                                0
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].selected === 'DESELECTED'
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }
                if(week === (
                  Object.values(
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).length - 1
                )) {
                  if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year]) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month+1
                        ] as YearMonthClickable<{}>['calendar']
                      )[0].days[0].day !== 1
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month+1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month+1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month+1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].selected === "DESELECTED"
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month+1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month+1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
        }
        else {
          









          if(year === params.value.rangelastselection.year) {
            if(month === params.value.rangelastselection.month) {
              if(week === params.value.rangelastselection.week) {
                if(params.value.rangefirstselection.day > params.value.rangelastselection.day) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangelastselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangelastselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(week > params.value.rangelastselection.week) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[week].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[week].days[d].day <= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[week].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    )[week].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[week].days[d].day >= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[week].days[d].selected === 'DESELECTED'
                      ) {
                        deselectedcount++;
                        break;
                      }
                    }
                  }
                  if(deselectedcount > 0) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              let deselected = false;
              if(month > params.value.rangelastselection.month) {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      ((visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }
                if(week === 0) {
                  if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year]) {
                    if((month-1) === params.value.rangelastselection.month) {
                      if(
                        (
                          Object.values(
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month-1
                            ] as YearMonthClickable<{}>['calendar']
                          ).length - 1
                        ) === params.value.rangelastselection.week
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            week
                          ].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month-1
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].days
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month-1
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year
                                    ][
                                      month-1
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).length - 1
                                )
                              ].days[d].day >= params.value.rangelastselection.day
                              &&
                              !(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month-1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                              )
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month - 1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              params.value.rangefirstselection.week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                      else {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            week
                          ].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month-1
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].days
                          ) {
                            if(
                              !(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month-1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month-1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                              )
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[
                                  (
                                    Object.values(
                                      (visiblecalendar.value as VisibleCalendarType).selections[
                                        year
                                      ][
                                        month - 1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).length - 1
                                  )
                                ].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar'])[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ] as YearMonthClickable<{}>['calendar']
                                ).length - 1
                              )
                            ].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                    else {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[0].day !== 1
                      ) {
                        for(let d in (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month-1
                                ] as YearMonthClickable<{}>['calendar']
                              ).length - 1
                            )
                          ].days
                        ) {
                          if(
                            !(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year
                                    ][
                                      month - 1
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).length - 1
                                )
                              ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                            )
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year
                                    ][
                                      month - 1
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).length - 1
                                )
                              ].days[d].selected === 'DESELECTED'
                            ) {
                              deselectedcount++;
                              break;
                            }
                          }
                        }
                        if(deselectedcount > 0 || deselected) {
                          (visiblecalendar.value.selections[year][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar'])[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              ).length - 1
                            )
                          ].checked = false;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar'])[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ] as YearMonthClickable<{}>['calendar']
                              ).length - 1
                            )
                          ].checked = true;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                      else {
                        if(deselected) {
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<{}>['calendar'])[
                      week
                    ].checked = false;
                  }
                  else {
                    
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<{}>['calendar'])[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      !(((visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar'])[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }
                if(week === (
                  Object.values(
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).length - 1
                )) {
                  if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year]) {
                    if((month+1) === params.value.rangelastselection.month) {
                      if(params.value.rangelastselection.week === 0) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month + 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].day <= params.value.rangelastselection.day
                              &&
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month + 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[0].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar'])[0].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[0].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<{}>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                      else {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[0].day !== 1
                        ) {
                          for(let d in (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month + 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                            ) {
                              if(
                                (
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month + 1
                                  ] as YearMonthClickable<{}>['calendar']
                                )[0].days[d].selected === 'DESELECTED'
                              ) {
                                deselectedcount++;
                                break;
                              }
                            }
                          }
                          if(deselectedcount > 0 || deselected) {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar'])[0].checked = false;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month + 1
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[0].checked = true;
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                        else {
                          if(deselected) {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = false;
                          }
                          else {
                            (visiblecalendar.value.selections[year][
                              month
                            ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                              week
                            ].checked = true;
                          }
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                    else {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month + 1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].days[0].day !== 1
                      ) {
                        for(let d in (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month + 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month + 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month + 1
                                ] as YearMonthClickable<{}>['calendar']
                              )[0].days[d].selected === 'DESELECTED'
                            ) {
                              deselectedcount++;
                              break;
                            }
                          }
                        }
                        if(deselectedcount > 0 || deselected) {
                          (visiblecalendar.value.selections[year][
                            month + 1
                          ] as YearMonthClickable<{}>['calendar'])[0].checked = false;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            month + 1
                          ] as YearMonthClickable<{}>['calendar'])[0].checked = true;
                          (visiblecalendar.value.selections[year][
                            month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                      else {
                        if(deselected) {
                          (visiblecalendar.value.selections[year][
                            params.value.rangefirstselection.month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][
                            params.value.rangefirstselection.month
                          ] as YearMonthClickable<{}>['calendar'])[
                            week
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                        week
                      ].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                        week
                      ].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                      week
                    ].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar'])[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
          else {
            let deselected = false;
            if(year > params.value.rangelastselection.year) {
              if(month === 0) {
                if(week === 0) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    )[
                      week
                    ].days[0].day !== 1
                  ) {
                    if((year - 1) in (visiblecalendar.value as VisibleCalendarType).selections) {
                      if(
                        11 in (visiblecalendar.value as VisibleCalendarType).selections[year - 1]
                      ) {
                        for(let d in (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year - 1
                            ][
                              11
                            ] as YearMonthClickable<PositionTrackerType>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ]
                              ).length - 1
                            )
                          ].days
                        ) {
                          if(
                            !((
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year-1
                              ][
                                11
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year-1
                                  ][
                                    11
                                  ]
                                ).length - 1
                              )
                            ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                          ) {
                            if(
                              (
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ] as YearMonthClickable<{}>['calendar']
                              )[
                                (
                                  Object.values(
                                    (visiblecalendar.value as VisibleCalendarType).selections[
                                      year-1
                                    ][
                                      11
                                    ]
                                  ).length - 1
                                )
                              ].days[d].selected === 'DESELECTED'
                            ) {
                              deselectedcount++;
                              break;
                            }
                          }
                        }
                        if(deselectedcount > 0 || deselected) {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year-1
                            ][
                              11
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ]
                              ).length - 1
                            )
                          ].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year-1
                            ][
                              11
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year-1
                                ][
                                  11
                                ]
                              ).length - 1
                            )
                          ].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                      else {
                        if(deselected) {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        }
                        else {
                          (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        }
                        triggerRef(visiblecalendar);
                      }
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(week === 0) {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    )[
                      week
                    ].days[0].day !== 1
                  ) {
                    if(
                      (month - 1) in (visiblecalendar.value as VisibleCalendarType).selections[year]
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month - 1
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[
                          (
                            Object.values(
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ]
                            ).length - 1
                          )
                        ].days
                      ) {
                        if(
                          !((
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month - 1
                            ] as YearMonthClickable<{}>['calendar']
                          )[
                            (
                              Object.values(
                                (visiblecalendar.value as VisibleCalendarType).selections[
                                  year
                                ][
                                  month - 1
                                ]
                              ).length - 1
                            )
                          ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ] as YearMonthClickable<{}>['calendar']
                            )[
                              (
                                Object.values(
                                  (visiblecalendar.value as VisibleCalendarType).selections[
                                    year
                                  ][
                                    month - 1
                                  ]
                                ).length - 1
                              )
                            ].days[d].selected === 'DESELECTED'
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          (
                            Object.values(
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ]
                            ).length - 1
                          )
                        ].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          (
                            Object.values(
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month - 1
                              ]
                            ).length - 1
                          )
                        ].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  for(let d in (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ][
                        month
                      ] as YearMonthClickable<PositionTrackerType>['calendar']
                    )[
                      week
                    ].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day <= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(month === 11) {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }

                if(week === (
                  Object.values(
                    (
                      visiblecalendar.value as VisibleCalendarType
                    ).selections[year][month] as YearMonthClickable<{}>['calendar']
                  ).length - 1
                )) {
                  if((year + 1) === params.value.rangelastselection.year && params.value.rangelastselection.month === 0 && params.value.rangelastselection.week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year + 1
                        ][
                          0
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        0
                      ].days[0].day !== 1
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year + 1
                          ][
                            0
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[0].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year+1
                            ][
                              0
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                          &&
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year+1
                            ][
                              0
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day <= params.value.rangelastselection.day
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year+1
                              ][
                                0
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].selected === 'DESELECTED'
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year + 1
                        ][
                          0
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        0
                      ].days[0].day !== 1
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year + 1
                          ][
                            0
                          ] as YearMonthClickable<PositionTrackerType>['calendar']
                        )[0].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year+1
                            ][
                              0
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year+1
                              ][
                                0
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].selected === 'DESELECTED'
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year+1
                          ][
                            0
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                for(let d in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<PositionTrackerType>['calendar']
                  )[
                    week
                  ].days
                ) {
                  if(week === 0) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                  else {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<PositionTrackerType>['calendar']
                      )[
                        week
                      ].days[d].day >= params.value.rangefirstselection.day 
                      &&
                      !((
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month
                        ] as YearMonthClickable<{}>['calendar']
                      )[
                        week
                      ].days[d].day in [1, 2, 3, 4, 5, 6, 7])
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        )[
                          week
                        ].days[d].selected === 'DESELECTED'
                      ) {
                        deselected = true;
                        break;
                      }
                    }
                  }
                }

                if(week === (
                  Object.values(
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ][
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).length - 1
                )) {
                  if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year]) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ][
                          month+1
                        ] as YearMonthClickable<{}>['calendar']
                      )[0].days[0].day !== 1
                    ) {
                      for(let d in (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month+1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ][
                              month+1
                            ] as YearMonthClickable<{}>['calendar']
                          )[0].days[d].day in [1, 2, 3, 4, 5, 6, 7]
                        ) {
                          if(
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ][
                                month+1
                              ] as YearMonthClickable<{}>['calendar']
                            )[0].days[d].selected === "DESELECTED"
                          ) {
                            deselectedcount++;
                            break;
                          }
                        }
                      }
                      if(deselectedcount > 0 || deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month+1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ][
                            month+1
                          ] as YearMonthClickable<{}>['calendar']
                        )[0].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                    else {
                      if(deselected) {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                      }
                      else {
                        (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                      }
                      triggerRef(visiblecalendar);
                    }
                  }
                  else {
                    if(deselected) {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                    }
                    else {
                      (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                    }
                    triggerRef(visiblecalendar);
                  }
                }
                else {
                  if(deselected) {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = false;
                  }
                  else {
                    (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[week].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
          }









        }
      }
      else {

      }
    });
  }
  else {
    if(params.value.inselectionmode) {
      if(params.value.rangeselectcount < 2) {
        if (
          (
            visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
          )[week].days[day].selected === "DESELECTED"
          || 
          (
            visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
          )[week].days[day].selected === "HIGHLIGHTED"
        ) {
          if(params.value.rangeselectcount === 0) {
            deselectAll(visiblecalendar);
            params.value.rangefirstselection = {year: 0, month: 0, day: 0, date: "", week: 0};
            params.value.rangelastselection = {year: 0, month: 0, day: 0, date: "", week: 0};
            triggerRef(params);
          }
          (
            visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
          )[week].days[day].selected = "SELECTED";
    
          params.value.rangeselectcount++;
    
          if(params.value.rangeselectcount === 1) {
            params.value.rangefirstselection = {
              date: (
                visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
              )[week].days[day].date,
              day: (
                visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
              )[week].days[day].day,
              year: result.year,
              month: result.month,
              week
            };
          }
          else {
            params.value.rangelastselection = {
              date: (
                visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
              )[week].days[day].date,
              day: (
                visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
              )[week].days[day].day,
              year: result.year,
              month: result.month,
              week
            };
          }
        }
        else {
          (
            visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
          )[week].days[day].selected = "DESELECTED";

          params.value.rangefirstselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
          params.value.rangelastselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
          params.value.rangeselectcount = 0;
          visiblecalendar.value.selections = {};
        }
      }
      else {
        deselectAll(visiblecalendar);
        params.value.rangeselectcount = 0,
        params.value.rangefirstselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
        params.value.rangelastselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
        
        (
          visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
        )[week].days[day].selected = "SELECTED";

        params.value.rangeselectcount = 1;
        params.value.rangefirstselection = {
          date: (
            visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
          )[week].days[day].date,
          day: (
            visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
          )[week].days[day].day,
          year: result.year,
          month: result.month,
          week
        };
      }
      triggerRef(params);
    }
    else {
      (
        visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
      )[week].days[day].selected = "HIGHLIGHTED";
    }
  }
}

export function handleDateSelectHighlightDeselect(
  params: ShallowRef<RangeSelectionParamsType> | Ref<number>,
  isoweek: boolean,
  selectionformat: "RANGE" | "MULTIPLE-OR-SINGLE", 
  pastedorclickeddate: string,
  isclickedstatus: boolean,
  mindate: string,
  maxdate: string,
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  let
    result = getYearMonthAndDate(isoweek, pastedorclickeddate, isclickedstatus),
    yFound = false,
    mFound = false,
    wFound = false
  ;

  if (Object.keys(visiblecalendar.value.selections).length > 0) {
    for (let year in visiblecalendar.value.selections) {
      if (parseInt(year) === result.year) {
        for (let month in visiblecalendar.value.selections[year]) {
          if (parseInt(month) === result.month) {
            for (let week in visiblecalendar.value.selections[year][month]) {
              for (let day in (visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar'])[week].days) {
                if (
                  (
                    visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
                  )[week].days[day].day === result.day
                  &&
                  (
                    visiblecalendar.value.selections[year][month] as YearMonthClickable<PositionTrackerType>['calendar']
                  )[week].days[day].status === "ENABLE"
                ) {
                  if(selectionformat === 'RANGE') {
                    handleRangeSelection(
                      result,
                      params as ShallowRef<RangeSelectionParamsType>,
                      parseInt(day) as number, 
                      parseInt(week) as number,
                      parseInt(month) as number,
                      parseInt(year) as number,
                      visiblecalendar
                    );
                  }
                  else {
                    if(isclickedstatus) {
                      //multiple select mode by click
                      handleMultipleSelectionByClick(
                        params as Ref<number>, 
                        parseInt(day) as number, 
                        parseInt(week) as number,
                        parseInt(month) as number,
                        parseInt(year) as number,
                        visiblecalendar
                      );
                    }
                    else {
                      //still in multiple selection mode but not being clicked
                      // instead pasted
                      handleMultipleSelectionByPaste(
                        params as Ref<number>, 
                        parseInt(day) as number,
                        parseInt(week) as number,
                        parseInt(month) as number,
                        parseInt(year) as number,
                        visiblecalendar
                      );
                    }
                  }
                  wFound = true;

                  triggerRef(visiblecalendar);
                  break;
                }
              }
              if(wFound) break;
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
          [result.month]: buildCalendar(
            result.year,
            result.month,
            "SELECTIONS",
            isoweek,
            mindate,
            maxdate,
            visiblecalendar
          ),
        } as VisibleCalendarType['selections'][number];
        handleDateSelectHighlightDeselect(
          params,
          isoweek,
          selectionformat, 
          pastedorclickeddate,
          isclickedstatus,
          mindate,
          maxdate,
          visiblecalendar
        );
      }
    } else {
      visiblecalendar.value.selections = {
        ...visiblecalendar.value.selections,
        [result.year]: {
          [result.month]: buildCalendar(
            result.year,
            result.month,
            "SELECTIONS",
            isoweek,
            mindate,
            maxdate,
            visiblecalendar
          ),
        },
      } as VisibleCalendarType['selections'];
      handleDateSelectHighlightDeselect(
        params,
        isoweek,
        selectionformat, 
        pastedorclickeddate,
        isclickedstatus,
        mindate,
        maxdate,
        visiblecalendar
      );
    }
  } else {
    visiblecalendar.value.selections  = {
      [result.year]: {
        [result.month]: buildCalendar(
          result.year,
          result.month,
          "SELECTIONS",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar
        ),
      },
    } as unknown as VisibleCalendarType['selections'];
    handleDateSelectHighlightDeselect(
      params,
      isoweek,
      selectionformat, 
      pastedorclickeddate,
      isclickedstatus,
      mindate,
      maxdate,
      visiblecalendar
    );
  }
}

export function fillVisibleCalendarArray(maxdate: string, mindate: string, isoweek: boolean) {
  let tempvisiblecalendar = shallowRef<VisibleCalendarType>();
  if (isoweek) {
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
        selections: {},
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
            selections: {},
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
            selections: {},
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
          selections: {},
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
        selections: {},
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
            selections: {},
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
            selections: {},
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
          selections: {},
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
        "LAST-OR-FIRST",
        isoweek,
        mindate,
        maxdate,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ),
    first: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.first,
      buildCalendar(
        tempvisiblecalendar.value.first.year,
        tempvisiblecalendar.value.first.month,
        "LAST-OR-FIRST",
        isoweek,
        mindate,
        maxdate,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ),
    current: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.current,
      buildCalendar(
        tempvisiblecalendar.value.current.year,
        tempvisiblecalendar.value.current.month,
        "PREVIOUS-OR-CURRENT",
        isoweek,
        mindate,
        maxdate,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ) as YearMonthClickable<PositionTrackerType>,
    previous: resetYearMonthDayCalendarHolder(
      tempvisiblecalendar.value.previous,
      buildCalendar(
        tempvisiblecalendar.value.previous.year,
        tempvisiblecalendar.value.previous.month,
        "PREVIOUS-OR-CURRENT",
        isoweek,
        mindate,
        maxdate,
        tempvisiblecalendar as ShallowRef<VisibleCalendarType>
      )
    ) as YearMonthClickable<PositionTrackerType>,
    selections: tempvisiblecalendar.value.selections,
  };

  triggerRef(tempvisiblecalendar);

  return tempvisiblecalendar.value;
}

export function mouseMovement(
  params: ShallowRef<RangeSelectionParamsType>,
  event: { pageX: number; pageY: number; },
  isoweek: boolean, 
  mindate: string, 
  maxdate: string, 
  selectionformat: 'RANGE',
  visiblecalendar: ShallowRef<VisibleCalendarType>
) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (selectionformat === "RANGE") {
        if ((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date) {
          let mousePointedDate = whereisMouse(event.pageX, event.pageY, visiblecalendar);
          buildHighlightedCalendar(
            isoweek,
            mindate,
            maxdate,
            visiblecalendar,
            mousePointedDate, 
            params.value.rangefirstselection as RangeFirstAndLastSelectionType
          );
          
          if(mousePointedDate.date && mousePointedDate.status === 'ENABLE') {
            if(
              differenceInCalendarDays(
                new Date(mousePointedDate.date),
                new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
              ) >= 0
            ) {
              for(let year in visiblecalendar.value.selections) {
                for(let month in visiblecalendar.value.selections[year]) {
                  for(let week in visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar']) {
                    for(let day in (visiblecalendar.value.selections[year][month] as YearMonthClickable<{}>['calendar'])[parseInt(week)].days) {
                      if(
                        new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) > new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                        &&
                        new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) <= new Date(mousePointedDate.date)
                        && (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].status === 'ENABLE'
                      ) {
                        //highlight this dates
                        handleDateSelectHighlightDeselect(
                          params,
                          isoweek,
                          selectionformat,
                          (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date,
                          true, //true means it is clicked, false means pasted 
                          mindate,
                          maxdate,
                          visiblecalendar as ShallowRef<VisibleCalendarType>
                        );
                      }
                      else {
                        if(
                          (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].selected === "HIGHLIGHTED"
                          && (
                            new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) > new Date(mousePointedDate.date)
                          || new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) < new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                          )
                          && (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].status === 'ENABLE'
                        ) {
                          (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].selected = "DESELECTED";
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
                    for(let day in (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days) {
                      if(
                        new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) >= new Date(mousePointedDate.date)
                        &&
                        new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) < new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                        && (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].status === 'ENABLE'
                      ) {
                        //highlight this dates
                        handleDateSelectHighlightDeselect(
                          params,
                          isoweek,
                          selectionformat, 
                          (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date,
                          true, //true means it is clicked, false means pasted
                          mindate,
                          maxdate,
                          visiblecalendar as ShallowRef<VisibleCalendarType>
                        );
                      }
                      else {
                        if(
                          (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].selected === "HIGHLIGHTED"
                          && ( new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) < new Date(mousePointedDate.date)
                          || new Date((visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].date) > new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                          )
                          && (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].status === 'ENABLE'
                        ) {
                          (visiblecalendar.value.selections[year][month][week] as YearMonthClickable<{}>['calendar'][number]).days[day].selected = "DESELECTED";
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

export function weekHasEnable(week: YearMonthClickable<PositionTrackerType>['calendar'][number]) {
  let hasenable = false;
  Object.values(week.days).forEach((day, i) => {
    if(day.status === 'ENABLE') {
      hasenable = true;
      return;
    }
    if(hasenable) return;
  });
  if(hasenable)
    return false;
  else 
    return true;
}

export function weekCheckboxClicked(week: YearMonthClickable<PositionTrackerType>['calendar'][number], vcalendartype: 'CURRENT' | 'PREVIOUS') {
  console.log(week.checked);
}

function buildHighlightedCalendar(isoweek: boolean, mindate: string, maxdate: string, visiblecalendar: ShallowRef<VisibleCalendarType>, mPointedDate: { date: string; status: string; day: string; month: string; year: string; }, rfirstselection: RangeFirstAndLastSelectionType) {
  if(parseInt(mPointedDate.year) === rfirstselection.year) {
    if(parseInt(mPointedDate.month) > rfirstselection.month) {
      for(let j=rfirstselection.month; j<=parseInt(mPointedDate.month); j++) {
        if(!(j in visiblecalendar.value.selections[rfirstselection.year])) {
          visiblecalendar.value.selections[rfirstselection.year] = {
            ...visiblecalendar.value.selections[rfirstselection.year],
            [j]: buildCalendar(rfirstselection.year, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
          };
        }
      }
    }
    else {
      for(let j=parseInt(mPointedDate.month); j<=rfirstselection.month; j++) {
        if(!(j in visiblecalendar.value.selections[rfirstselection.year])) {
          visiblecalendar.value.selections[rfirstselection.year] = {
            ...visiblecalendar.value.selections[rfirstselection.year],
            [j]: buildCalendar(rfirstselection.year, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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
                  [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    }
                  } as YearMonthClickable<{}>;
                }
                else {
                  if(!(j in visiblecalendar.value.selections[i])) {
                    visiblecalendar.value.selections[i] = {
                      ...visiblecalendar.value.selections[i],
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    };
                  }
                }
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  }
                } as YearMonthClickable<{}>;
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
            else {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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
                  [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    }
                  } as YearMonthClickable<{}>;
                }
                else {
                  if(!(j in visiblecalendar.value.selections[i])) {
                    visiblecalendar.value.selections[i] = {
                      ...visiblecalendar.value.selections[i],
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    };
                  }
                }
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  }
                } as YearMonthClickable<{}>;
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
            else {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
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

function whereisMouse(pointx: number, pointy: number, visiblecalendar: ShallowRef<VisibleCalendarType>) {
  let result = {date: "", status: "", day: "", month: "", year: ""}, found = false;
  for(let week in visiblecalendar.value.previous.calendar) {
    for(let day in visiblecalendar.value.previous.calendar[week].days) {
      if(
        (
          parseInt(week) === 0
          && (
            pointy <= visiblecalendar.value.previous.calendar[week].days[day].y2
            &&
            pointx >= visiblecalendar.value.previous.calendar[week].days[day].x1
            &&
            pointx <= visiblecalendar.value.previous.calendar[week].days[day].x2
          )
        )
        ||
        (
          (parseInt(week) === Object.keys(visiblecalendar.value.previous.calendar).length - 1)
          && (
            pointx >= visiblecalendar.value.previous.calendar[week].days[day].x1
            &&
            pointx <= visiblecalendar.value.previous.calendar[week].days[day].x2
          )
        )
        ||
        (
          (parseInt(week) !== Object.keys(visiblecalendar.value.previous.calendar).length - 1)
          && (
            pointx >= visiblecalendar.value.previous.calendar[week].days[day].x1
            &&
            pointx <= visiblecalendar.value.previous.calendar[week].days[day].x2
            &&
            pointy >= visiblecalendar.value.previous.calendar[week].days[day].y1
            &&
            pointy <= visiblecalendar.value.previous.calendar[week].days[day].y2
          )
        )
      ) {
        result = {
          date: visiblecalendar.value.previous.calendar[week].days[day].date,
          status: visiblecalendar.value.previous.calendar[week].days[day].status as 'ENABLE' | 'DISABLE',
          year: visiblecalendar.value.previous.year+'',
          month: visiblecalendar.value.previous.month+'',
          day: visiblecalendar.value.previous.calendar[week].days[day].day+'',
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
      for(let day in visiblecalendar.value.current.calendar[week].days) {
        if(
          (
            parseInt(week) === 0
            && (
              pointy <= visiblecalendar.value.current.calendar[week].days[day].y2
              &&
              pointx >= visiblecalendar.value.current.calendar[week].days[day].x1
              &&
              pointx <= visiblecalendar.value.current.calendar[week].days[day].x2
            )
          )
          ||
          (
            (parseInt(week) === Object.keys(visiblecalendar.value.current.calendar).length - 1)
            && (
              pointx >= visiblecalendar.value.current.calendar[week].days[day].x1
              &&
              pointx <= visiblecalendar.value.current.calendar[week].days[day].x2
            )
          )
          ||
          (
            (parseInt(week) !== Object.keys(visiblecalendar.value.current.calendar).length - 1)
            && (
              pointx >= visiblecalendar.value.current.calendar[week].days[day].x1
              &&
              pointx <= visiblecalendar.value.current.calendar[week].days[day].x2
              &&
              pointy >= visiblecalendar.value.current.calendar[week].days[day].y1
              &&
              pointy <= visiblecalendar.value.current.calendar[week].days[day].y2
            )
          )
        ) {
          result = {
            date: visiblecalendar.value.current.calendar[week].days[day].date,
            status: visiblecalendar.value.current.calendar[week].days[day].status  as 'ENABLE' | 'DISABLE',
            day: visiblecalendar.value.current.calendar[week].days[day].day+"",
            year: visiblecalendar.value.current.year+"",
            month: visiblecalendar.value.current.month+"",
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

export function clickForward(isoweek: boolean, maxdate: string, mindate: string, visiblecalendar: ShallowRef<VisibleCalendarType>) {
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
        visiblecalendar.value.current.month - visiblecalendar.value.previous.month > 1
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
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      previous: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.previous,
        buildCalendar(
          visiblecalendar.value.previous.year,
          visiblecalendar.value.previous.month,
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      selections: visiblecalendar.value.selections,
    };

    triggerRef(visiblecalendar);
  }
}

export function clickBackward(isoweek: boolean, maxdate: string, mindate: string, visiblecalendar: ShallowRef<VisibleCalendarType>) {
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
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      previous: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.previous,
        buildCalendar(
          visiblecalendar.value.previous.year,
          visiblecalendar.value.previous.month,
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      selections: visiblecalendar.value.selections,
    };

    triggerRef(visiblecalendar);
  }
}

export function assignRef(prevorcur: YearMonthClickable<PositionTrackerType>, el: HTMLLabelElement, weekindex: number, dayindex: number) {
  if (weekindex in prevorcur.calendar && el) {
    prevorcur.calendar[weekindex].days[dayindex].ref = el as HTMLLabelElement;
  }
}

function resetSelections(selections: VisibleCalendarType['selections'], maxdate: string, mindate: string, isoweek: string) {
  for(let year in selections) {
    for(let month in selections[year]) {
      for(let week in selections[year][month]) {
        for(let day in (selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days) {
          if(
            differenceInCalendarDays(
              isoweek === "true"
                ? new Date(formatISO(new Date((selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].date), { representation: "date" }))
                : new Date(format(new Date((selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].date), "yyyy-MM-dd"))
              ,
              new Date(mindate)
            ) >= 0 && differenceInCalendarDays(
              isoweek === "true"
                ? new Date(formatISO(new Date((selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].date), { representation: "date" }))
                : new Date(format(new Date((selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].date), "yyyy-MM-dd"))
              ,
              new Date(maxdate)
            ) <= 0
          ) {
            if((selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].readonlystatus === "ENABLE") {
              (selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].status = "ENABLE";
            }
          }
          else {
            (selections[year][month] as YearMonthClickable<{}>['calendar'])[week].days[day].status = "DISABLE";
          }
        }
      }
    }
  }
  return selections;
}


export function findRangeSelectionMaxAndMinDate(params: ShallowRef<RangeSelectionParamsType>) {
  let mindate = "", maxdate = "";
  
  if(
    new Date(format(new Date(((params.value as RangeSelectionParamsType).rangefirstselection as RangeFirstAndLastSelectionType).date), "yyyy-MM-dd"))
    >
    new Date(format(new Date(((params.value as RangeSelectionParamsType).rangelastselection as RangeFirstAndLastSelectionType).date), "yyyy-MM-dd"))
  ) {
    maxdate = ((params.value as RangeSelectionParamsType).rangefirstselection as RangeFirstAndLastSelectionType).date;
    mindate = ((params.value as RangeSelectionParamsType).rangelastselection as RangeFirstAndLastSelectionType).date;
  }
  else {
    mindate = ((params.value as RangeSelectionParamsType).rangefirstselection as RangeFirstAndLastSelectionType).date;
    maxdate = ((params.value as RangeSelectionParamsType).rangelastselection as RangeFirstAndLastSelectionType).date;
  }

  return {maxdate, mindate};
}
