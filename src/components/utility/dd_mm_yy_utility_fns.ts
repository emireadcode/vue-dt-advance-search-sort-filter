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

const 
  loadingMovement = ref(false),
  xpoint = ref(),
  ypoint = ref()
;

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
  for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
    for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
      for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
        for (let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
          if(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].readonlystatus === 'ENABLE') {
            ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].selected = "DESELECTED";
          }
        }
        (
          (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].checked = false;
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
    calendar = {
      weeks: {},
      tm: [false, false, false, false, false, false, false]
    } as YearMonthClickable<PositionTrackerType>['calendar'] | YearMonthClickable<{}>['calendar'],
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
    if (!(j in calendar.weeks)) {
      if (j === 0) {
        calendar.weeks = {
          [j]: {
            days: {},
            checked: false
          } as YearMonthClickable<PositionTrackerType>['calendar']['weeks'][number] | YearMonthClickable<{}>['calendar']['weeks'][number]
        }
      } else {
        calendar.weeks = {
          ...calendar.weeks,
          [j]: {
            days: {},
            checked: false
          } as YearMonthClickable<PositionTrackerType>['calendar']['weeks'][number] | YearMonthClickable<{}>['calendar']['weeks'][number]
        } as YearMonthClickable<PositionTrackerType>['calendar'] | YearMonthClickable<{}>['calendar'];
      }
    }

    for (let k = 0; k < 7; k++) {
      if (j === 0) {
        if (k < diffBtwWkStartAndMnthStart) {
          let sDate = startDate + k, mm = (month-1)<0? 12 : (month<10? "0"+month : month), yy = (month-1)<0? year-1 : year;
          if(k === 0) {
            calendar.weeks[j].days = {
              [k]: {
                status: "DISABLE",
                readonlystatus: "DISABLE",
                day: sDate,
                date: yy+'-'+mm+'-'+sDate,
              }
            };
          }
          else {
            calendar.weeks[j].days = {
              ...calendar.weeks[j].days,
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
          calendar.weeks[j].days = {
            ...calendar.weeks[j].days,
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
          calendar.weeks[j].days[k] = {
            ...calendar.weeks[j].days[k],
            ref: undefined,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          } as YearMonthClickable<PositionTrackerType>['calendar']['weeks'][number]['days'][number];
        }
        else {
          if(holdertype === 'SELECTIONS') {
            calendar.weeks[j].days[k] = {
              ...calendar.weeks[j].days[k],
              selected: "DESELECTED",
            };
          }
        }
      } else {
        counter++;
        if (counter <= daysInMonth) {
          calendar.weeks[j].days = {
            ...calendar.weeks[j].days,
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
            calendar.weeks[j].days[k] = {
              ...calendar.weeks[j].days[k],
              ref: undefined,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
          else {
            if(holdertype === 'SELECTIONS') {
              calendar.weeks[j].days[k] = {
                ...calendar.weeks[j].days[k],
                selected: "DESELECTED",
              };
            }
          }
        } else {
          newWeekDate++;
          let yy = month+2 > 12? year+1 : year, mm = month+2 > 12? '01' : (month+2 < 10? '0'+(month+2) : month+2);
          calendar.weeks[j].days = {
            ...calendar.weeks[j].days,
            [k]: {
              status: "DISABLE",
              readonlystatus: "DISABLE",
              day: newWeekDate,
              date: yy+'-'+mm+'-0'+newWeekDate,
            },
          };
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar.weeks[j].days[k] = {
              ...calendar.weeks[j].days[k],
              ref: undefined,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
          else {
            if(holdertype === 'SELECTIONS') {
              calendar.weeks[j].days[k] = {
                ...calendar.weeks[j].days[k],
                selected: "DESELECTED",
              };
            }
          }

          if (newWeekDate === 7 && j == weeksInMonth - 1) {
            if (calendar.weeks[j].days[0].day === 1 && calendar.weeks[j].days[6].day === 7) {
              delete calendar.weeks[j];
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
    for (let w in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
      for (let d in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days) {
        if (w in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          if (d in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days) {
            if ((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days[d].ref as HTMLLabelElement) {
              let offset = getOffset((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days[d].ref as HTMLLabelElement);
              if (offset) {
                (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days[d].x1 = offset.x1;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days[d].y1 = offset.y1;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days[d].x2 = offset.x2;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(w)].days[d].y2 = offset.y2;
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
    for (let w in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
      for (let d in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days) {
        if (w in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          if (d in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days) {
            if ((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days[d].ref as HTMLLabelElement) {
              let offset = getOffset((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days[d].ref as HTMLLabelElement);
              if (offset) {
                (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days[d].x1 = offset.x1;
                (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days[d].y1 = offset.y1;
                (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days[d].x2 = offset.x2;
                (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(w)].days[d].y2 = offset.y2;
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
    ty: [false, false, false, false, false, false, false],
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
    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[week].days[day].selected === "DESELECTED"
  ) {
    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[week].days[day].selected = "SELECTED";
    multipleselectcount.value++;
  }
}

function handleMultipleSelectionByClick(
  multipleselectcount: Ref<number>, 
  day: number,
  week: number,
  month: number,
  year: number,
  visiblecalendar: ShallowRef<VisibleCalendarType>,
  isoweek: boolean,
  mindate: string,
  maxdate: string
) {
  if (
    (
      (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
    ).weeks[week].days[day].selected === "DESELECTED"
  ) {
    (
      (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
    ).weeks[week].days[day].selected = "SELECTED";
    multipleselectcount.value++;
  }
  else {
    (
      (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
    ).weeks[week].days[day].selected = "DESELECTED";
    multipleselectcount.value--;
  }
  triggerRef(visiblecalendar);
  nextTick(() => {
    selectOrDeselectDaysInWeekForMultipleSelection(
      undefined,
      year,
      month,
      week,
      visiblecalendar,
      'CELL-BOX',
      isoweek,
      mindate,
      maxdate
    );
  });
}

export function selectOrDeselectDaysInWeekForMultipleSelection(
  checked: boolean | undefined,
  year: number,
  month: number,
  week: number,
  visiblecalendar: ShallowRef<VisibleCalendarType>, 
  boxtype: 'WEEK-BOX' | 'CELL-BOX',
  isoweek: boolean,
  mindate: string,
  maxdate: string
) {
  let deselected = false, deselectedcount = 0;
  if (Object.keys((visiblecalendar.value as VisibleCalendarType).selections).length > 0) {
    if(year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!(month in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
        (visiblecalendar.value as VisibleCalendarType).selections[year].months = {
          ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
          [month]: buildCalendar(
            year,
            month,
            "SELECTIONS",
            isoweek,
            mindate,
            maxdate,
            visiblecalendar
          ),
        };
        triggerRef(visiblecalendar);
        if(month === 0) {
          if(week === 0) {
            if(!((year-1) in (visiblecalendar.value as VisibleCalendarType).selections)) {
              (visiblecalendar.value as VisibleCalendarType).selections  = {
                ...(visiblecalendar.value as VisibleCalendarType).selections,
                [year-1]: {
                  months: {
                    [11]: buildCalendar(
                      year-1,
                      11,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  },
                  ty: [false, false, false, false, false, false, false],
                },
              } as VisibleCalendarType['selections'];
              triggerRef(visiblecalendar);
            }
            else {
              if(!(11 in (visiblecalendar.value as VisibleCalendarType).selections[year - 1].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year-1].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year-1].months,
                  [11]: buildCalendar(
                    year-1,
                    11,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
          }
          else {
            if (week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(!((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                  [month+1]: buildCalendar(
                    year,
                    month+1,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
          }
        }
        else {
          if(month === 11) {
            if(week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(!((year+1) in (visiblecalendar.value as VisibleCalendarType).selections)) {
                (visiblecalendar.value as VisibleCalendarType).selections = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections,
                  [year+1]: {
                    months: {
                      [0]: buildCalendar(
                        year+1,
                        0,
                        "SELECTIONS",
                        isoweek,
                        mindate,
                        maxdate,
                        visiblecalendar
                      ),
                    },
                    ty: [false, false, false, false, false, false, false]
                  }
                } as VisibleCalendarType['selections'];
                triggerRef(visiblecalendar);
              }
              else {
                if(!(0 in (visiblecalendar.value as VisibleCalendarType).selections[year+1].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[year+1].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[year+1].months,
                    [0]: buildCalendar(
                      year+1,
                      0,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  };
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(week === 0) {
                if(!((month - 1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                    [month - 1]: buildCalendar(
                      year,
                      month - 1,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  };
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
          else {
            if (week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(!((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                  [month+1]: buildCalendar(
                    year,
                    month+1,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
            else {
              if(week === 0) {
                if(!((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                    [month-1]: buildCalendar(
                      year,
                      month-1,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  };
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
        }
      }
      else {
        if(month === 0) {
          if(week === 0) {
            if(!((year-1) in (visiblecalendar.value as VisibleCalendarType).selections)) {
              (visiblecalendar.value as VisibleCalendarType).selections  = {
                ...(visiblecalendar.value as VisibleCalendarType).selections,
                [year-1]: {
                  months: {
                    [11]: buildCalendar(
                      year-1,
                      11,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  },
                  ty: [false, false, false, false, false, false, false],
                },
              } as VisibleCalendarType['selections'];
              triggerRef(visiblecalendar);
            }
            else {
              if(!(11 in (visiblecalendar.value as VisibleCalendarType).selections[year - 1].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year-1].months  = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year-1].months,
                  [11]: buildCalendar(
                    year-1,
                    11,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                }
                triggerRef(visiblecalendar);
              }
            }
          }
          else {
            if (week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(!((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                  [month+1]: buildCalendar(
                    year,
                    month+1,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
          }
        }
        else {
          if(month === 11) {
            if(week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(!((year+1) in (visiblecalendar.value as VisibleCalendarType).selections)) {
                (visiblecalendar.value as VisibleCalendarType).selections = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections,
                  [year+1]: {
                    months: {
                      [0]: buildCalendar(
                        year+1,
                        0,
                        "SELECTIONS",
                        isoweek,
                        mindate,
                        maxdate,
                        visiblecalendar
                      ),
                    },
                    ty: [false, false, false, false, false, false, false]
                  }
                } as VisibleCalendarType['selections'];
                triggerRef(visiblecalendar);
              }
              else {
                if(!(0 in (visiblecalendar.value as VisibleCalendarType).selections[year+1].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[year+1].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[year+1].months,
                    [0]: buildCalendar(
                      year+1,
                      0,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  };
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(week === 0) {
                if(!((month - 1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                    [month - 1]: buildCalendar(
                      year,
                      month - 1,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  };
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
          else {
            if (week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(!((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                  [month+1]: buildCalendar(
                    year,
                    month+1,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
            else {
              if(week === 0) {
                if(!((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                    [month-1]: buildCalendar(
                      year,
                      month-1,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  };
                  triggerRef(visiblecalendar);
                }
              }
            }
          }
        }
      }
    }
    else {
      (visiblecalendar.value as VisibleCalendarType).selections = {
        ...(visiblecalendar.value as VisibleCalendarType).selections,
        [year]: {
          months: {
            [month]: buildCalendar(
              year,
              month,
              "SELECTIONS",
              isoweek,
              mindate,
              maxdate,
              visiblecalendar
            ),
          },
          ty: [false, false, false, false, false, false, false],
        }
      } as VisibleCalendarType['selections'];
      triggerRef(visiblecalendar);
      if(month === 0) {
        if(week === 0) {
          if(!((year-1) in (visiblecalendar.value as VisibleCalendarType).selections)) {
            (visiblecalendar.value as VisibleCalendarType).selections  = {
              ...(visiblecalendar.value as VisibleCalendarType).selections,
              [year-1]: {
                months: {
                  [11]: buildCalendar(
                    year-1,
                    11,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                },
                ty: [false, false, false, false, false, false, false]
              },
            } as VisibleCalendarType['selections'];
            triggerRef(visiblecalendar);
          }
          else {
            if(!(11 in (visiblecalendar.value as VisibleCalendarType).selections[year-1].months)) {
              (visiblecalendar.value as VisibleCalendarType).selections[year-1].months  = {
                ...(visiblecalendar.value as VisibleCalendarType).selections[year-1].months,
                [11]: buildCalendar(
                  year-1,
                  11,
                  "SELECTIONS",
                  isoweek,
                  mindate,
                  maxdate,
                  visiblecalendar
                ),
              };
              triggerRef(visiblecalendar);
            }
          }
        }
        else {
          if (week === Object.values(
              ((visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
            ).length - 1
          ) {
            if(!((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
              (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                [month+1]: buildCalendar(
                  year,
                  month+1,
                  "SELECTIONS",
                  isoweek,
                  mindate,
                  maxdate,
                  visiblecalendar
                ),
              };
              triggerRef(visiblecalendar);
            }
          }
        }
      }
      else {
        if(month === 11) {
          if (week === Object.values(
              ((visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
            ).length - 1
          ) {
            if(!((year+1) in (visiblecalendar.value as VisibleCalendarType).selections)) {
              (visiblecalendar.value as VisibleCalendarType).selections  = {
                ...(visiblecalendar.value as VisibleCalendarType).selections,
                [year+1]: {
                  months: {
                    [0]: buildCalendar(
                      year+1,
                      0,
                      "SELECTIONS",
                      isoweek,
                      mindate,
                      maxdate,
                      visiblecalendar
                    ),
                  },
                  ty: [false, false, false, false, false, false, false],
                },
              } as VisibleCalendarType['selections'];
              triggerRef(visiblecalendar);
            }
            else {
              if(!(0 in (visiblecalendar.value as VisibleCalendarType).selections[year+1].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year+1].months  = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year+1].months,
                  [0]: buildCalendar(
                    year+1,
                    0,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
          }
          else {
            if(week === 0) {
              if(!((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                  [month - 1]: buildCalendar(
                    year,
                    month - 1,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
          }
        }
        else {
          if (week === Object.values(
              ((visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
            ).length - 1
          ) {
            if(!((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
              (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                [month+1]: buildCalendar(
                  year,
                  month+1,
                  "SELECTIONS",
                  isoweek,
                  mindate,
                  maxdate,
                  visiblecalendar
                ),
              };
              triggerRef(visiblecalendar);
            }
          }
          else {
            if(week === 0) {
              if(!((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
                  [month-1]: buildCalendar(
                    year,
                    month-1,
                    "SELECTIONS",
                    isoweek,
                    mindate,
                    maxdate,
                    visiblecalendar
                  ),
                };
                triggerRef(visiblecalendar);
              }
            }
          }
        }
      }
    }
  }
  else {
    (visiblecalendar.value as VisibleCalendarType).selections = {
      [year]: {
        months: {
          [month]: buildCalendar(
            year,
            month,
            "SELECTIONS",
            isoweek,
            mindate,
            maxdate,
            visiblecalendar
          ),
        },
        ty: [false, false, false, false, false, false, false]
      },
    } as unknown as VisibleCalendarType['selections'];
    triggerRef(visiblecalendar);
    if(month === 0) {
      if(week === 0) {
        (visiblecalendar.value as VisibleCalendarType).selections  = {
          ...(visiblecalendar.value as VisibleCalendarType).selections,
          [year-1]: {
            months: {
              [11]: buildCalendar(
                year-1,
                11,
                "SELECTIONS",
                isoweek,
                mindate,
                maxdate,
                visiblecalendar
              ),
            },
            ty: [false, false, false, false, false, false, false]
          },
        } as VisibleCalendarType['selections'];
        triggerRef(visiblecalendar);
      }
      else {
        if (week === Object.values(
            ((visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
          ).length - 1
        ) {
          (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
            ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
            [month+1]: buildCalendar(
              year,
              month+1,
              "SELECTIONS",
              isoweek,
              mindate,
              maxdate,
              visiblecalendar
            ),
          };
          triggerRef(visiblecalendar);
        }
      }
    }
    else {
      if(month === 11) {
        if (week === Object.values(
            ((visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
          ).length - 1
        ) {
          (visiblecalendar.value as VisibleCalendarType).selections  = {
            ...(visiblecalendar.value as VisibleCalendarType).selections,
            [year+1]: {
              months: {
                [0]: buildCalendar(
                  year+1,
                  0,
                  "SELECTIONS",
                  isoweek,
                  mindate,
                  maxdate,
                  visiblecalendar
                ),
              },
              ty: [false, false, false, false, false, false, false]
            },
          } as VisibleCalendarType['selections'];
          triggerRef(visiblecalendar);
        }
        else {
          if(week === 0) {
            (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
              ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
              [month - 1]: buildCalendar(
                year,
                month - 1,
                "SELECTIONS",
                isoweek,
                mindate,
                maxdate,
                visiblecalendar
              ),
            };
            triggerRef(visiblecalendar);
          }
        }
      }
      else {
        if (week === Object.values(
            ((visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
          ).length - 1
        ) {
          (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
            ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
            [month+1]: buildCalendar(
              year,
              month+1,
              "SELECTIONS",
              isoweek,
              mindate,
              maxdate,
              visiblecalendar
            ),
          };
          triggerRef(visiblecalendar);
        }
        else {
          if(week === 0) {
            (visiblecalendar.value as VisibleCalendarType).selections[year].months  = {
              ...(visiblecalendar.value as VisibleCalendarType).selections[year].months,
              [month-1]: buildCalendar(
                year,
                month-1,
                "SELECTIONS",
                isoweek,
                mindate,
                maxdate,
                visiblecalendar
              ),
            };
            triggerRef(visiblecalendar);
          }
        }
      }
    }
  }

  deselected = loopThroughWeekForMultipleSelection(
    checked,
    year,
    month,
    week,
    'DESELECTED-STATUS',
    visiblecalendar,
    boxtype
  ) as boolean;
  if(month === 0) {
    if(week === 0) {
      if(
        (
          (visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[0].day !== 1
      ) {
        if((year-1) in (visiblecalendar.value as VisibleCalendarType).selections) {
          if(11 in (visiblecalendar.value as VisibleCalendarType).selections[year-1].months) {
            deselectedcount = loopThroughWeekForMultipleSelection(
              checked,
              year-1,
              11,
              (
                Object.values(
                  ((visiblecalendar.value as VisibleCalendarType).selections[
                    year-1
                  ].months[11] as YearMonthClickable<{}>['calendar']).weeks
                ).length - 1
              ),
              'COUNTER',
              visiblecalendar,
              boxtype
            ) as number;

            if(deselectedcount > 0 || deselected) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = false;
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year-1
                ].months[11] as YearMonthClickable<{}>['calendar']
              ).weeks[
                (
                  Object.values(
                    ((visiblecalendar.value as VisibleCalendarType).selections[
                      year-1
                    ].months[11] as YearMonthClickable<{}>['calendar']).weeks
                  ).length - 1
                )
              ].checked = false;
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = true;
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year-1
                ].months[11] as YearMonthClickable<{}>['calendar']
              ).weeks[
                (
                  Object.values(
                    ((visiblecalendar.value as VisibleCalendarType).selections[
                      year-1
                    ].months[11] as YearMonthClickable<{}>['calendar']).weeks
                  ).length - 1
                )
              ].checked = true;
            }
            triggerRef(visiblecalendar);
          }
          else {
            if(deselected) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = false;
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = true;
            }
            triggerRef(visiblecalendar);
          }
        }
        else {
          if(deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
      }
      else {
        if(deselected) {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = false;
        }
        else {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = true;
        }
        triggerRef(visiblecalendar);
      }
    }
    else {
      if(week === 
        (
          Object.values(
            ((visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
          ).length - 1
        )
      ) {
        if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
          deselectedcount = loopThroughWeekForMultipleSelection(
            checked,
            year,
            month+1,
            0,
            'COUNTER',
            visiblecalendar,
            boxtype
          ) as number;
          
          if(deselectedcount > 0 || deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[month+1] as YearMonthClickable<{}>['calendar']
            ).weeks[0].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[month+1] as YearMonthClickable<{}>['calendar']
            ).weeks[0].checked = true;
          }
          triggerRef(visiblecalendar);
        }
        else {
          if(deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
      }
      else {
        if(deselected) {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = false;
        }
        else {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = true;
        }
        triggerRef(visiblecalendar);
      }
    }
  }
  else if(month === 11) {
    if(week === 0) {
      if(
        (
          (visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[0].day !== 1
      ) {
        if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
          deselectedcount = loopThroughWeekForMultipleSelection(
            checked,
            year,
            month-1,
            (
              Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ),
            'COUNTER',
            visiblecalendar,
            boxtype
          ) as number;

          if(deselectedcount > 0 || deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[month-1] as YearMonthClickable<{}>['calendar']
            ).weeks[
              (
                Object.values(
                  ((visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                ).length - 1
              )
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[month-1] as YearMonthClickable<{}>['calendar']
            ).weeks[
              (
                Object.values(
                  ((visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                ).length - 1
              )
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
        else {
          if(deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
      }
      else {
        if(deselected) {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = false;
        }
        else {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = true;
        }
        triggerRef(visiblecalendar);
      }
    }
    else {
      if(week === 
        (
          Object.values(
            ((visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
          ).length - 1
        )
      ) {
        if((year+1) in (visiblecalendar.value as VisibleCalendarType).selections) {
          if(0 in (visiblecalendar.value as VisibleCalendarType).selections[year+1].months) {
            deselectedcount = loopThroughWeekForMultipleSelection(
              checked,
              year+1,
              0,
              0,
              'COUNTER',
              visiblecalendar, 
              boxtype
            ) as number;

            if(deselectedcount > 0 || deselected) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = false;
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year+1
                ].months[0] as YearMonthClickable<{}>['calendar']
              ).weeks[0].checked = false;
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = true;
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year+1
                ].months[0] as YearMonthClickable<{}>['calendar']
              ).weeks[0].checked = true;
            }
            triggerRef(visiblecalendar);
          }
          else {
            if(deselected) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = false;
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = true;
            }
            triggerRef(visiblecalendar);
          }
        }
        else {
          if(deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
      }
      else {
        if(deselected) {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = false;
        }
        else {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = true;
        }
        triggerRef(visiblecalendar);
      }
    }
  }
  else {
    if(week === 0) {
      if(
        (
          (visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[0].day !== 1
      ) {
        if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
          deselectedcount = loopThroughWeekForMultipleSelection(
            checked,
            year,
            month-1,
            (
              Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ),
            'COUNTER',
            visiblecalendar,
            boxtype
          ) as number;

          if(deselectedcount > 0 || deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[month-1] as YearMonthClickable<{}>['calendar']
            ).weeks[
              (
                Object.values(
                  ((visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                ).length - 1
              )
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[month-1] as YearMonthClickable<{}>['calendar']
            ).weeks[
              (
                Object.values(
                  ((visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                ).length - 1
              )
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
        else {
          if(deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
      }
      else {
        if(deselected) {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = false;
        }
        else {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = true;
        }
        triggerRef(visiblecalendar);
      }
    }
    else {
      if(week === 
        (
          Object.values(
            ((visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
          ).length - 1
        )
      ) {
        if(
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[month+1] as YearMonthClickable<{}>['calendar']
          ).weeks[0].days[0].day !== 1
        ) {
          if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
            deselectedcount = loopThroughWeekForMultipleSelection(
              checked,
              year,
              month+1,
              0,
              'COUNTER',
              visiblecalendar, 
              boxtype
            ) as number;
            
            if(deselectedcount > 0 || deselected) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = false;
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[month+1] as YearMonthClickable<{}>['calendar']
              ).weeks[0].checked = false;
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = true;
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[month+1] as YearMonthClickable<{}>['calendar']
              ).weeks[0].checked = true;
            }
            triggerRef(visiblecalendar);
          }
          else {
            if(deselected) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = false;
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[
                week
              ].checked = true;
            }
            triggerRef(visiblecalendar);
          }
        }
        else {
          if(deselected) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = false;
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[
              week
            ].checked = true;
          }
          triggerRef(visiblecalendar);
        }
      }
      else {
        if(deselected) {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = false;
        }
        else {
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[
            week
          ].checked = true;
        }
        triggerRef(visiblecalendar);
      }
    }
  }
}

function loopThroughWeekForMultipleSelection(
  checked: boolean | undefined,
  year: number,
  month: number,
  week: number,
  returnType: 'COUNTER' | 'DESELECTED-STATUS',
  visiblecalendar: ShallowRef<VisibleCalendarType>, 
  boxtype: 'WEEK-BOX' | 'CELL-BOX'
) {
  let deselectedcount = 0, deselected = false;
  for(let d in (
      (visiblecalendar.value as VisibleCalendarType).selections[
        year
      ].months[
        month
      ] as YearMonthClickable<{}>['calendar']
    ).weeks[week].days
  ) {
    if(week === 0) {
      if(
        (
          (visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[
            month
          ] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7]
      ) {
        if(boxtype === 'WEEK-BOX') {
          if(typeof checked === 'boolean') {
            if(checked) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected = "SELECTED";
              if(returnType === "COUNTER") {
                deselectedcount = 0;
              }
              else {
                deselected = false;
              }
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected = "DESELECTED";
              if(returnType === "COUNTER") {
                deselectedcount = 1;
              }
              else {
                deselected = true;
              }
            }
          }
        }
        else {
          if(
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].selected === "DESELECTED"
            &&
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].status === "ENABLE"
          ) {
            if(returnType === "COUNTER") {
              deselectedcount++;
            }
            else {
              deselected = true;
            }
            break;
          }
        }
      }
    }
    else if(week === (
      Object.values(((visiblecalendar.value as VisibleCalendarType).selections[
        year
      ].months[
        month
      ] as YearMonthClickable<{}>['calendar']).weeks).length - 1
    )) {
      if(
        !((
          (visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[
            month
          ] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7])
      ) {
        if(boxtype === 'WEEK-BOX') {
          if(typeof checked === 'boolean') {
            if(checked) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected = "SELECTED";
              if(returnType === "COUNTER") {
                deselectedcount = 0;
              }
              else {
                deselected = false;
              }
            }
            else {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected = "DESELECTED";
              if(returnType === "COUNTER") {
                deselectedcount = 1;
              }
              else {
                deselected = true;
              }
            }
          }
        }
        else {
          if(
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].selected === "DESELECTED"
            &&
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].status === "ENABLE"
          ) {
            if(returnType === "COUNTER") {
              deselectedcount++;
            }
            else {
              deselected = true;
            }
            break;
          }
        } 
      }
    }
    else {
      if(boxtype === 'WEEK-BOX') {
        if(typeof checked === 'boolean') {
          if(checked) {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].selected = "SELECTED";
            if(returnType === "COUNTER") {
              deselectedcount = 0;
            }
            else {
              deselected = false;
            }
          }
          else {
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].selected = "DESELECTED";
            if(returnType === "COUNTER") {
              deselectedcount = 1;
            }
            else {
              deselected = true;
            }
          }
        }
      }
      else {
        if(
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[
              month
            ] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[d].selected === "DESELECTED"
          &&
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[
              month
            ] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[d].status === "ENABLE"
        ) {
          if(returnType === "COUNTER") {
            deselectedcount++;
          }
          else {
            deselected = true;
          }
          break;
        }
      }
    }
  }
  if(returnType === 'COUNTER')
    return deselectedcount;
  else 
    return deselected;
}

function loopThroughWeekForRangeSelection(
  checked: boolean | undefined,
  rules: string[] | string, 
  visiblecalendar: ShallowRef<VisibleCalendarType>, 
  year: number,
  month: number,
  week: number,
  returnType: 'COUNTER' | 'DESELECTED-STATUS',
  rangefirstselection: RangeFirstAndLastSelectionType | undefined, 
  rangelastselection: RangeFirstAndLastSelectionType | undefined,
  boxtype: 'WEEK-BOX' | 'CELL-BOX'
) {
  let deselectedcount = 0, deselected = false;
  for(let d in (
      (visiblecalendar.value as VisibleCalendarType).selections[
        year
      ].months[
        month
      ] as YearMonthClickable<{}>['calendar']
    ).weeks[week].days
  ) {
    if(typeof rules === 'string') {
      if(rules === '') {
        if(week === 0) {
          if(
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7]
          ) {
            if(boxtype === 'WEEK-BOX') {
              if(typeof checked === 'boolean') {
                if(checked) {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "HIGHLIGHTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 0;
                  }
                  else {
                    deselected = false;
                  }
                }
                else {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "DESELECTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 1;
                  }
                  else {
                    deselected = true;
                  }
                }
              }
            }
            else {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected === "DESELECTED"
              ) {
                if(returnType === "COUNTER") {
                  deselectedcount++;
                }
                else {
                  deselected = true;
                }
                break;
              }
            }
          }
        }
        else if(week === (
          Object.values(((visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[
            month
          ] as YearMonthClickable<{}>['calendar']).weeks).length - 1
        )) {
          if(
            !((
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7])
          ) {
            if(boxtype === 'WEEK-BOX') {
              if(typeof checked === 'boolean') {
                if(checked) {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "HIGHLIGHTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 0;
                  }
                  else {
                    deselected = false;
                  }
                }
                else {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "DESELECTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 1;
                  }
                  else {
                    deselected = true;
                  }
                }
              }
            }
            else {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected === "DESELECTED"
              ) {
                if(returnType === "COUNTER") {
                  deselectedcount++;
                }
                else {
                  deselected = true;
                }
                break;
              }
            }
          }
        }
        else {
          if(boxtype === 'WEEK-BOX') {
            if(typeof checked === 'boolean') {
              if(checked) {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "HIGHLIGHTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 0;
                }
                else {
                  deselected = false;
                }
              }
              else {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "DESELECTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 1;
                }
                else {
                  deselected = true;
                }
              }
            }
          }
          else {
            if(
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected === "DESELECTED"
            ) {
              if(returnType === "COUNTER") {
                deselectedcount++;
              }
              else {
                deselected = true;
              }
              break;
            }
          }
        }
      }
      else {
        if(week === 0) {
          if(
            (
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7]
            &&
            (
              rules === '>=rangelastselection.day'?
              (
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangelastselection as RangeFirstAndLastSelectionType).day
              )
              : (
                rules === '<=rangelastselection.day'?
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].day < (rangelastselection as RangeFirstAndLastSelectionType).day
                )
                : (
                  rules === '<=rangefirstselection.day'?
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ].months[
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days[d].day < (rangefirstselection as RangeFirstAndLastSelectionType).day
                  )
                  :
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ].months[
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days[d].day > (rangefirstselection as RangeFirstAndLastSelectionType).day
                  )
                )
              )
            )
          ) {
            if(boxtype === 'WEEK-BOX') {
              if(typeof checked === 'boolean') {
                if(checked) {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "HIGHLIGHTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 0;
                  }
                  else {
                    deselected = false;
                  }
                }
                else {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "DESELECTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 1;
                  }
                  else {
                    deselected = true;
                  }
                }
              }
            }
            else {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected === "DESELECTED"
              ) {
                if(returnType === "COUNTER") {
                  deselectedcount++;
                }
                else {
                  deselected = true;
                }
                break;
              }
            }
          }
        }
        else if(week === (
          Object.values(((visiblecalendar.value as VisibleCalendarType).selections[
            year
          ].months[
            month
          ] as YearMonthClickable<{}>['calendar']).weeks).length - 1
        )) {
          if(
            !((
              (visiblecalendar.value as VisibleCalendarType).selections[
                year
              ].months[
                month
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7])
            &&
            (
              rules === '>=rangelastselection.day'?
                ((
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangelastselection as RangeFirstAndLastSelectionType).day)
                :
                (
                  rules === '<=rangelastselection.day'?
                    ((
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ].months[
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days[d].day < (rangelastselection as RangeFirstAndLastSelectionType).day)
                    :
                    (
                      rules === '<=rangefirstselection.day'?
                        ((
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[d].day < (rangefirstselection as RangeFirstAndLastSelectionType).day)
                        :
                        ((
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[d].day > (rangefirstselection as RangeFirstAndLastSelectionType).day)
                    )
                )
            )
          ) {
            if(boxtype === 'WEEK-BOX') {
              if(typeof checked === 'boolean') {
                if(checked) {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "HIGHLIGHTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 0;
                  }
                  else {
                    deselected = false;
                  }
                }
                else {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "DESELECTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 1;
                  }
                  else {
                    deselected = true;
                  }
                }
              }
            }
            else {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected === "DESELECTED"
              ) {
                if(returnType === "COUNTER") {
                  deselectedcount++;
                }
                else {
                  deselected = true;
                }
                break;
              }
            }
          }
        }
        else {
          if(
            (
              rules === '>=rangelastselection.day'?
                ((
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangelastselection as RangeFirstAndLastSelectionType).day)
                :
                (
                  rules === '<=rangelastselection.day'?
                    ((
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        year
                      ].months[
                        month
                      ] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days[d].day < (rangelastselection as RangeFirstAndLastSelectionType).day)
                    :
                    (
                      rules === '<=rangefirstselection.day'?
                        ((
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[d].day < (rangefirstselection as RangeFirstAndLastSelectionType).day)
                        :
                        ((
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[d].day > (rangefirstselection as RangeFirstAndLastSelectionType).day)
                    )
                )
            )
          ) {
            if(boxtype === 'WEEK-BOX') {
              if(typeof checked === 'boolean') {
                if(checked) {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "HIGHLIGHTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 0;
                  }
                  else {
                    deselected = false;
                  }
                }
                else {
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      year
                    ].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[d].selected = "DESELECTED";
                  if(returnType === "COUNTER") {
                    deselectedcount = 1;
                  }
                  else {
                    deselected = true;
                  }
                }
              }
            }
            else {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected === "DESELECTED"
              ) {
                if(returnType === "COUNTER") {
                  deselectedcount++;
                }
                else {
                  deselected = true;
                }
                break;
              }
            }
          }
        }
      }
    }
    else {
      if(week === 0) {
        if(
          (
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[
              month
            ] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7]
          &&
          (
            (rules[0] === '<=rangefirstselection.day' && rules[1] === '>=rangelastselection.day') ?
              (
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangelastselection as RangeFirstAndLastSelectionType).day
                &&
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day < (rangefirstselection as RangeFirstAndLastSelectionType).day
              )
              :
              (
                //[0]<=rangelastselection.day
                //[1]>=rangefirstselection.day
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day < (rangelastselection as RangeFirstAndLastSelectionType).day
                &&
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangefirstselection as RangeFirstAndLastSelectionType).day
              )
          )
        ) {
          if(boxtype === 'WEEK-BOX') {
            if(typeof checked === 'boolean') {
              if(checked) {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "HIGHLIGHTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 0;
                }
                else {
                  deselected = false;
                }
              }
              else {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "DESELECTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 1;
                }
                else {
                  deselected = true;
                }
              }
            }
          }
          else {
            if(
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected === "DESELECTED"
            ) {
              if(returnType === 'COUNTER') {
                deselectedcount++;
              }
              else {
                deselected = true;
              }
              break;
            }
          }
        }
      }
      else if(week === (
        Object.values(((visiblecalendar.value as VisibleCalendarType).selections[
          year
        ].months[
          month
        ] as YearMonthClickable<{}>['calendar']).weeks).length - 1
      )) {
        if(
          !((
            (visiblecalendar.value as VisibleCalendarType).selections[
              year
            ].months[
              month
            ] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[d].day in [1, 2, 3, 4, 5, 6, 7, 7])
          &&
          (
            (rules[0] === '<=rangefirstselection.day' && rules[1] === '>=rangelastselection.day') ?
              (
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangelastselection as RangeFirstAndLastSelectionType).day
                &&
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day < (rangefirstselection as RangeFirstAndLastSelectionType).day
              )
              :
              (
                //[0]<=rangelastselection.day
                //[1]>=rangefirstselection.day
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day < (rangelastselection as RangeFirstAndLastSelectionType).day
                &&
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangefirstselection as RangeFirstAndLastSelectionType).day
              )
          )
        ) {
          if(boxtype === 'WEEK-BOX') {
            if(typeof checked === 'boolean') {
              if(checked) {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "HIGHLIGHTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 0;
                }
                else {
                  deselected = false;
                }
              }
              else {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "DESELECTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 1;
                }
                else {
                  deselected = true;
                }
              }
            }
          }
          else {
            if(
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected === "DESELECTED"
            ) {
              if(returnType === 'COUNTER') {
                deselectedcount++;
              }
              else {
                deselected = true;
              }
              break;
            }
          }
        }
      }
      else {
        if(
          (
            (rules[0] === '<=rangefirstselection.day' && rules[1] === '>=rangelastselection.day') ?
              (
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangelastselection as RangeFirstAndLastSelectionType).day
                &&
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day < (rangefirstselection as RangeFirstAndLastSelectionType).day
              )
              :
              (
                //[0]<=rangelastselection.day
                //[1]>=rangefirstselection.day
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day < (rangelastselection as RangeFirstAndLastSelectionType).day
                &&
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].day > (rangefirstselection as RangeFirstAndLastSelectionType).day
              )
          )
        ) {
          if(boxtype === 'WEEK-BOX') {
            if(typeof checked === 'boolean') {
              if(checked) {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "HIGHLIGHTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 0;
                }
                else {
                  deselected = false;
                }
              }
              else {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[d].selected = "DESELECTED";
                if(returnType === "COUNTER") {
                  deselectedcount = 1;
                }
                else {
                  deselected = true;
                }
              }
            }
          }
          else {
            if(
              (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  year
                ].months[
                  month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[d].selected === "DESELECTED"
            ) {
              if(returnType === 'COUNTER') {
                deselectedcount++;
              }
              else {
                deselected = true;
              }
              break;
            }
          }
        }
      }
    }
  }
  if(returnType === 'COUNTER')
    return deselectedcount;
  else 
    return deselected;
}

export function highlightOrDeselectDaysInWeekForRangeSelection(
  checked: boolean | undefined,
  year: number, 
  month: number, 
  week: number, 
  rangefirstselection: RangeFirstAndLastSelectionType, 
  rangelastselection: RangeFirstAndLastSelectionType, 
  visiblecalendar: ShallowRef<VisibleCalendarType>,
  boxtype: 'WEEK-BOX' | 'CELL-BOX'
) {
  let deselectedcount = 0, deselected = false;
  
  if(
    (
      year === rangefirstselection.year 
      && 
      month === rangefirstselection.month
      &&
      week === rangefirstselection.week
    )
    &&
    (
      year === rangelastselection.year
      &&
      month === rangelastselection.month
      &&
      week === rangelastselection.week
    )
  ) {
    deselectedcount = loopThroughWeekForRangeSelection(
      checked,
      (rangefirstselection.day > rangelastselection.day)?
      ['<=rangefirstselection.day','>=rangelastselection.day']
      :
      ['>=rangelastselection.day','<=rangefirstselection.day']
      , 
      visiblecalendar, 
      year,
      month,
      week,
      'COUNTER',
      rangefirstselection as RangeFirstAndLastSelectionType, 
      rangelastselection as RangeFirstAndLastSelectionType,
      boxtype
    ) as number;
    if(deselectedcount > 0) {
      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[week].checked = false;
    }
    else {
      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[week].checked = true;
    }
    triggerRef(visiblecalendar);
  }
  else {
    if(
      (
        year === rangefirstselection.year 
        && 
        month === rangefirstselection.month
      )
      &&
      (
        year === rangelastselection.year
        &&
        month === rangelastselection.month
      )
    ) {
      if(
        (
          week === rangefirstselection.week
          ||
          week === rangelastselection.week
        )
      ) {
        deselectedcount = loopThroughWeekForRangeSelection(
          checked,
          (
            week === rangefirstselection.week 
            &&
            rangefirstselection.week > rangelastselection.week
          )?
          '<=rangefirstselection.day'
          : (
            (
              week === rangefirstselection.week 
              &&
              rangefirstselection.week < rangelastselection.week
            )?
            '>=rangefirstselection.day'
            : (
              week === rangelastselection.week 
              &&
              rangelastselection.week > rangefirstselection.week
            )?
            '<=rangelastselection.day'
            :
            '>=rangelastselection.day'
          ), 
          visiblecalendar, 
          year,
          month,
          week,
          'COUNTER',
          rangefirstselection as RangeFirstAndLastSelectionType, 
          rangelastselection as RangeFirstAndLastSelectionType,
          boxtype
        ) as number;
      }
      else {
        deselectedcount = loopThroughWeekForRangeSelection(
          checked,
          '', 
          visiblecalendar, 
          year,
          month,
          week,
          'COUNTER',
          rangefirstselection as RangeFirstAndLastSelectionType, 
          rangelastselection as RangeFirstAndLastSelectionType,
          boxtype
        ) as number;
      }
      if(deselectedcount > 0) {
        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[week].checked = false;
      }
      else {
        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[week].checked = true;
      }
      triggerRef(visiblecalendar);
    }
    else {
      if(year === rangefirstselection.year && year === rangelastselection.year) {
        if(
          month === rangefirstselection.month 
          || 
          month === rangelastselection.month
        ) {
          deselected = loopThroughWeekForRangeSelection(
            checked,
            (
              (rangefirstselection.month > rangelastselection.month)?
              (
                (
                  (
                    month === rangefirstselection.month
                    &&
                    week === rangefirstselection.week
                  )
                  ||
                  (
                    month === rangelastselection.month
                    &&
                    week === rangelastselection.week
                  )
                )?
                (
                  (
                    month === rangefirstselection.month
                    &&
                    week === rangefirstselection.week
                  )?
                  '<=rangefirstselection.day'
                  :
                  '>=rangelastselection.day'
                )
                :
                ''
              )
              : (
                (
                  (
                    month === rangefirstselection.month
                    &&
                    week === rangefirstselection.week
                  )
                  ||
                  (
                    month === rangelastselection.month
                    &&
                    week === rangelastselection.week
                  )
                )?
                (
                  (
                    month === rangefirstselection.month
                    &&
                    week === rangefirstselection.week
                  )?
                  '>=rangefirstselection.day'
                  :
                  '<=rangelastselection.day'
                )
                :
                ''
              )
            )
            , 
            visiblecalendar, 
            year,
            month,
            week,
            'DESELECTED-STATUS',
            rangefirstselection as RangeFirstAndLastSelectionType, 
            rangelastselection as RangeFirstAndLastSelectionType,
            boxtype
          ) as boolean;
          if(week === 0) {
            if(
              (
                (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[0].day !== 1
            ) {
              if((month-1) >= 0 && (month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                if(
                  ( 
                    (month-1) === rangelastselection.month 
                    &&
                    rangelastselection.week === Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1
                  )
                  ||
                  (
                    (month-1) === rangefirstselection.month
                    &&
                    rangefirstselection.week === Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1
                  )
                ) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    (
                      rangefirstselection.month === (month-1)
                    )? 
                    '>=rangefirstselection.day'
                    : 
                    '>=rangelastselection.day'
                    , 
                    visiblecalendar, 
                    year,
                    month-1,
                    (Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1),
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                else {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month-1,
                    (Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1),
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                if(deselectedcount > 0 || deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month - 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    (
                      Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          month - 1
                        ] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ].checked = false;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month - 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    (
                      Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          month - 1
                        ] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ].checked = true;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else if(
            week === Object.values(
              ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
            ).length - 1
          ) {
            if((month+1) <= 11 && (month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[month+1] as YearMonthClickable<{}>['calendar']
                ).weeks[0].days[0].day !== 1
              ) {
                if(
                  ( 
                    (month+1) === rangelastselection.month 
                    &&
                    rangelastselection.week === 0
                  )
                  ||
                  (
                    (month+1) ===  rangefirstselection.month
                    &&
                    rangefirstselection.week === 0
                  ) 
                ) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    (
                      rangefirstselection.month === (month+1)
                    )? 
                    '<=rangefirstselection.day'
                    :
                    '<=rangelastselection.day',
                    visiblecalendar, 
                    year,
                    month+1,
                    0,
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                else {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month+1,
                    0,
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                if(deselectedcount > 0 || deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month + 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    0
                  ].checked = false;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month + 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    0
                  ].checked = true;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else {
            if(deselected) {
              ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                month
              ] as YearMonthClickable<{}>['calendar']).weeks[
                week
              ].checked = false;
            }
            else {
              ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                month
              ] as YearMonthClickable<{}>['calendar']).weeks[
                week
              ].checked = true;
            }
            triggerRef(visiblecalendar);
          }
        }
        else {
          deselected = loopThroughWeekForRangeSelection(
            checked,
            '', 
            visiblecalendar, 
            year,
            month,
            week,
            'DESELECTED-STATUS',
            rangefirstselection as RangeFirstAndLastSelectionType, 
            rangelastselection as RangeFirstAndLastSelectionType,
            boxtype
          ) as boolean;
          if(week === 0) {
            if(
              (
                (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[0].day !== 1
            ) {
              if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                if(
                  (
                    rangefirstselection.month === (month-1)
                    &&
                    rangefirstselection.week ===  Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1
                  )
                  ||
                  (
                    rangelastselection.month === (month-1)
                    &&
                    rangelastselection.week === Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1
                  )
                ) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    (
                      rangefirstselection.month === (month-1)
                    )? 
                    '>=rangefirstselection.day'
                    : 
                    '>=rangelastselection.day', 
                    visiblecalendar, 
                    year,
                    month-1,
                    (Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1),
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                else {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month-1,
                    (Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1),
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                if(deselectedcount > 0 || deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month - 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    (
                      Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          month - 1
                        ] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ].checked = false;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month - 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    (
                      Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          month - 1
                        ] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ].checked = true;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else if(
            week === Object.values(
              ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
            ).length - 1
          ) {
            if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[month+1] as YearMonthClickable<{}>['calendar']
                ).weeks[0].days[0].day !== 1
              ) {
                if(
                  ( 
                    rangelastselection.month === (month+1) 
                    &&
                    rangelastselection.week === 0
                  )
                  ||
                  (
                    rangefirstselection.month === (month+1)
                    &&
                    rangefirstselection.week === 0
                  ) 
                ) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    (
                      rangefirstselection.month === (month+1)
                    )?
                    '<=rangefirstselection.day'
                    : 
                    '<=rangelastselection.day'
                    ,  
                    visiblecalendar, 
                    year,
                    month+1,
                    0,
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                else {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month+1,
                    0,
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                }
                if(deselectedcount > 0 || deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month + 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    0
                  ].checked = false;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month + 1
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    0
                  ].checked = true;
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
          }
          else {
            if(deselected) {
              ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                month
              ] as YearMonthClickable<{}>['calendar']).weeks[
                week
              ].checked = false;
            }
            else {
              ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                month
              ] as YearMonthClickable<{}>['calendar']).weeks[
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
            rangefirstselection.year === year 
            &&
            month === rangefirstselection.month 
          )
          || 
          (
            rangelastselection.year === year
            &&
            month === rangelastselection.month
          )
        ) {
          deselected = loopThroughWeekForRangeSelection(
            checked,
            (
              (rangefirstselection.year === rangelastselection.year)?
              (
                (month === rangefirstselection.month)?
                (
                  week === rangefirstselection.week?
                  (
                    rangefirstselection.month < rangelastselection.month?
                    '>=rangefirstselection.day'
                    :
                    '<=rangefirstselection.day'
                  )
                  :
                  ''
                )
                : (
                  week === rangelastselection.week?
                  (
                    rangefirstselection.month < rangelastselection.month?
                    '<=rangelastselection.day'
                    :
                    '>=rangelastselection.day'
                  )
                  :
                  ''
                )
              )
              : (
                (rangefirstselection.year < rangelastselection.year)?
                (
                  (
                    (
                      year === rangefirstselection.year 
                      &&
                      month === rangefirstselection.month
                      &&
                      week === rangefirstselection.week
                    )
                    || 
                    (
                      year === rangelastselection.year
                      &&
                      month === rangelastselection.month
                      &&
                      week === rangelastselection.week
                    )
                  )?
                  (
                    (
                      year === rangefirstselection.year 
                      &&
                      month === rangefirstselection.month
                      &&
                      week === rangefirstselection.week
                    )?
                    '>=rangefirstselection.day'
                    :
                    '<=rangelastselection.day'
                  )
                  :
                  ''
                )
                : (
                  (
                    (
                      year === rangefirstselection.year 
                      &&
                      month === rangefirstselection.month
                      &&
                      week === rangefirstselection.week
                    )
                    || 
                    (
                      year === rangelastselection.year
                      &&
                      month === rangelastselection.month
                      &&
                      week === rangelastselection.week
                    )
                  )?
                  (
                    (
                      year === rangefirstselection.year 
                      &&
                      month === rangefirstselection.month
                      &&
                      week === rangefirstselection.week
                    )?
                    '<=rangefirstselection.day'
                    :
                    '>=rangelastselection.day'
                  )
                  :
                  ''
                )
              )
            ),
            visiblecalendar, 
            year,
            month,
            week,
            'DESELECTED-STATUS',
            rangefirstselection as RangeFirstAndLastSelectionType, 
            rangelastselection as RangeFirstAndLastSelectionType,
            boxtype
          ) as boolean;
          if(month === 0) {
            if(week === 0) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[0].day !== 1
              ) {
                if(
                  (year-1) in (visiblecalendar.value as VisibleCalendarType).selections
                  &&
                  11 in (visiblecalendar.value as VisibleCalendarType).selections[year-1].months
                ) {
                  if(
                    ( 
                      rangelastselection.year === (year-1)
                      &&
                      rangelastselection.month === 11
                      &&
                      rangelastselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                    ||
                    (
                      rangefirstselection.year === (year-1)
                      &&
                      rangefirstselection.month === 11
                      &&
                      rangefirstselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.year === (year-1)
                      )? 
                      '>=rangefirstselection.day'
                      : 
                      '>=rangelastselection.day'
                      , 
                      visiblecalendar, 
                      year-1,
                      11,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year-1,
                      11,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[
                      11
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year-1
                          ].months[
                            11
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[
                      11
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year-1
                          ].months[
                            11
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else if(
              week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                if(
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[year].months[month+1] as YearMonthClickable<{}>['calendar']
                  ).weeks[0].days[0].day !== 1
                ) {
                  if(
                    ( 
                      (month+1) === rangelastselection.month 
                      &&
                      rangelastselection.week === 0
                    )
                    ||
                    (
                      (month+1) ===  rangefirstselection.month
                      &&
                      rangefirstselection.week === 0
                    ) 
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.month === (month+1)
                      )? 
                      '<=rangefirstselection.day'
                      :
                      '<=rangelastselection.day',
                      visiblecalendar, 
                      year,
                      month+1,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year,
                      month+1,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  if(deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else if(month === 11) {
            if(week === 0) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[0].day !== 1
              ) {
                if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  if(
                    ( 
                      rangelastselection.year === year
                      &&
                      rangelastselection.month === (month-1)
                      &&
                      rangelastselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                    ||
                    (
                      rangefirstselection.year === year
                      &&
                      rangefirstselection.month === (month-1)
                      &&
                      rangefirstselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.month === (month-1)
                      )? 
                      '>=rangefirstselection.day'
                      : 
                      '>=rangelastselection.day'
                      , 
                      visiblecalendar, 
                      year,
                      month-1,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year,
                      month-1,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else if(
              week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(
                (year+1) in (visiblecalendar.value as VisibleCalendarType).selections
                &&
                0 in (visiblecalendar.value as VisibleCalendarType).selections[year+1].months
              ) {
                if(
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[year+1].months[0] as YearMonthClickable<{}>['calendar']
                  ).weeks[0].days[0].day !== 1
                ) {
                  if(
                    ( 
                      rangelastselection.year === (year+1)
                      &&
                      rangelastselection.month === 0
                      &&
                      rangelastselection.week === 0
                    )
                    ||
                    (
                      rangefirstselection.year === (year+1)
                      &&
                      rangefirstselection.month === 0
                      &&
                      rangefirstselection.week === 0
                    ) 
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.year === (year+1)
                      )? 
                      '<=rangefirstselection.day'
                      :
                      '<=rangelastselection.day',
                      visiblecalendar, 
                      year+1,
                      0,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year+1,
                      0,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year+1].months[
                      0
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year+1].months[
                      0
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  if(deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else {
            if(week === 0) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[0].day !== 1
              ) {
                if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  if(
                    (
                      rangefirstselection.month === (month-1)
                      &&
                      rangefirstselection.week ===  Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                    ||
                    (
                      rangelastselection.month === (month-1)
                      &&
                      rangelastselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.month === (month-1)
                      )? 
                      '>=rangefirstselection.day'
                      : 
                      '>=rangelastselection.day', 
                      visiblecalendar, 
                      year,
                      month-1,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year,
                      month-1,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else if(
              week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                if(
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[year].months[month+1] as YearMonthClickable<{}>['calendar']
                  ).weeks[0].days[0].day !== 1
                ) {
                  if(
                    ( 
                      rangelastselection.month === (month+1) 
                      &&
                      rangelastselection.week === 0
                    )
                    ||
                    (
                      rangefirstselection.month === (month+1)
                      &&
                      rangefirstselection.week === 0
                    ) 
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.month === (month+1)
                      )?
                      '<=rangefirstselection.day'
                      : 
                      '<=rangelastselection.day'
                      ,  
                      visiblecalendar, 
                      year,
                      month+1,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year,
                      month+1,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  if(deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
        }
        else {
          deselected = loopThroughWeekForRangeSelection(
            checked,
            '', 
            visiblecalendar, 
            year,
            month,
            week,
            'DESELECTED-STATUS',
            rangefirstselection as RangeFirstAndLastSelectionType, 
            rangelastselection as RangeFirstAndLastSelectionType,
            boxtype
          ) as boolean;

          if(month === 0) {
            if(week === 0) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[0].day !== 1
              ) {
                if(
                  (year-1) in (visiblecalendar.value as VisibleCalendarType).selections
                  &&
                  11 in (visiblecalendar.value as VisibleCalendarType).selections[year-1].months
                ) {
                  if(
                    ( 
                      rangelastselection.year === (year-1)
                      &&
                      rangelastselection.month === 11
                      &&
                      rangelastselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                    ||
                    (
                      rangefirstselection.year === (year-1)
                      &&
                      rangefirstselection.month === 11
                      &&
                      rangefirstselection.week === Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1
                    )
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.year === (year-1)
                      )? 
                      '>=rangefirstselection.day'
                      : 
                      '>=rangelastselection.day'
                      , 
                      visiblecalendar, 
                      year-1,
                      11,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year-1,
                      11,
                      (Object.values(
                        ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[11] as YearMonthClickable<{}>['calendar']).weeks
                      ).length - 1),
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[
                      11
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year-1
                          ].months[
                            11
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year-1].months[
                      11
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year-1
                          ].months[
                            11
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else if(
              week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                if(
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[year].months[month+1] as YearMonthClickable<{}>['calendar']
                  ).weeks[0].days[0].day !== 1
                ) {
                  if(
                    ( 
                      rangelastselection.year === year
                      &&
                      rangelastselection.month === (month+1) 
                      &&
                      rangelastselection.week === 0
                    )
                    ||
                    (
                      rangefirstselection.year === year
                      &&
                      rangefirstselection.month === (month+1)
                      &&
                      rangefirstselection.week === 0
                    ) 
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.month === (month+1)
                      )?
                      '<=rangefirstselection.day'
                      : 
                      '<=rangelastselection.day'
                      ,  
                      visiblecalendar, 
                      year,
                      month+1,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year,
                      month+1,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  if(deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else if(month === 11) {
            if(week === 0) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[0].day !== 1
              ) {
                if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month-1,
                    (Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1),
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else if(
              week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if(
                (year+1) in (visiblecalendar.value as VisibleCalendarType).selections
                &&
                0 in (visiblecalendar.value as VisibleCalendarType).selections[year+1].months
              ) {
                if(
                  (
                    ((visiblecalendar.value as VisibleCalendarType).selections[year+1].months[0] as YearMonthClickable<{}>['calendar']).weeks
                  )[0].days[0].day !== 1
                ) {
                  if(
                    ( 
                      rangelastselection.year === (year+1)
                      &&
                      rangelastselection.month === 0
                      &&
                      rangelastselection.week === 0
                    )
                    ||
                    (
                      rangefirstselection.year === (year+1)
                      &&
                      rangefirstselection.month === 0
                      &&
                      rangefirstselection.week === 0
                    ) 
                  ) {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      (
                        rangefirstselection.year === (year+1)
                      )? 
                      '<=rangefirstselection.day'
                      :
                      '<=rangelastselection.day',
                      visiblecalendar, 
                      year+1,
                      0,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  else {
                    deselectedcount = loopThroughWeekForRangeSelection(
                      checked,
                      '', 
                      visiblecalendar, 
                      year+1,
                      0,
                      0,
                      'COUNTER',
                      rangefirstselection as RangeFirstAndLastSelectionType, 
                      rangelastselection as RangeFirstAndLastSelectionType,
                      boxtype
                    ) as number;
                  }
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year+1].months[
                      0
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year+1].months[
                      0
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  if(deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
          else {
            if(week === 0) {
              if(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[0].day !== 1
              ) {
                if((month-1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month-1,
                    (Object.values(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month-1] as YearMonthClickable<{}>['calendar']).weeks
                    ).length - 1),
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month - 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      (
                        Object.values(
                          ((visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            month - 1
                          ] as YearMonthClickable<{}>['calendar']).weeks
                        ).length - 1
                      )
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
              else {
                if(deselected) {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = false;
                }
                else {
                  ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                    month
                  ] as YearMonthClickable<{}>['calendar']).weeks[
                    week
                  ].checked = true;
                }
                triggerRef(visiblecalendar);
              }
            }
            else if(
              week === Object.values(
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks
              ).length - 1
            ) {
              if((month+1) in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                if(
                  (
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[month+1] as YearMonthClickable<{}>['calendar']).weeks
                  )[0].days[0].day !== 1
                ) {
                  deselectedcount = loopThroughWeekForRangeSelection(
                    checked,
                    '', 
                    visiblecalendar, 
                    year,
                    month+1,
                    0,
                    'COUNTER',
                    rangefirstselection as RangeFirstAndLastSelectionType, 
                    rangelastselection as RangeFirstAndLastSelectionType,
                    boxtype
                  ) as number;
                  if(deselectedcount > 0 || deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = false;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month + 1
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      0
                    ].checked = true;
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
                else {
                  if(deselected) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = false;
                  }
                  else {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                      month
                    ] as YearMonthClickable<{}>['calendar']).weeks[
                      week
                    ].checked = true;
                  }
                  triggerRef(visiblecalendar);
                }
              }
            }
            else {
              if(deselected) {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = false;
              }
              else {
                ((visiblecalendar.value as VisibleCalendarType).selections[year].months[
                  month
                ] as YearMonthClickable<{}>['calendar']).weeks[
                  week
                ].checked = true;
              }
              triggerRef(visiblecalendar);
            }
          }
        }
      }
    }  
  }
}

function checkNextMonthFirstDayIsHighlighted(week: VisibleCalendarType['selections'][number]['months'][number]['weeks'][number]) {
  let firstdayishighlighted = false;
  if(
    week.days[0].day === 1
    &&
    week.days[0].status === 'ENABLE'
    &&
    week.days[0].selected === 'HIGHLIGHTED'
  ) {
    firstdayishighlighted = true;
  }
  else {
    for(let d in week.days) {
      if(week.days[d].day === 1) {
        if(
          week.days[d].selected === 'HIGHLIGHTED'
          &&
          week.days[d].status === 'ENABLE'
        ) {
          firstdayishighlighted = true;
        }
        break;
      }
    }
  }
  return firstdayishighlighted;
}

function checkPreviousMonthLastDayIsHighlighted(week: VisibleCalendarType['selections'][number]['months'][number]['weeks'][number]) {
  let lastdayishighlighted = false;
  if(
    !(
      week.days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
    )
  ) {
    if(
      week.days[6].status === 'ENABLE'
      &&
      week.days[6].selected === 'HIGHLIGHTED'
    ) {
      lastdayishighlighted = true;
    }
  }
  else {
    for(let d in week.days) {
      if(week.days[d].day === 1) {
        if(
          week.days[parseInt(d) - 1].selected === 'HIGHLIGHTED'
          &&
          week.days[parseInt(d) - 1].status === 'ENABLE'
        ) {
          lastdayishighlighted = true;
          break;
        }
      }
    }
  }
  return lastdayishighlighted;
}

function handleForwardEdgeCase(params: ShallowRef<RangeSelectionParamsType>, visiblecalendar: ShallowRef<VisibleCalendarType>) {
  let startcheckingwherehighlightstop = false;
  for(let y in visiblecalendar.value.selections) {
    for(let m in visiblecalendar.value.selections[y].months) {
      for(let w in (
          visiblecalendar.value.selections[y].months[
            m
          ] as YearMonthClickable<{}>['calendar']
        ).weeks
      ) {
        for(let d in (
            visiblecalendar.value.selections[y].months[
              m
            ] as YearMonthClickable<{}>['calendar']
          ).weeks[w].days
        ) {
          if(
            params.value.rangefirstselection.year === parseInt(y)
            &&
            params.value.rangefirstselection.month === parseInt(m)
            &&
            params.value.rangefirstselection.week === parseInt(w)
            &&
            params.value.rangefirstselection.date === (
              visiblecalendar.value.selections[y].months[
                m
              ] as YearMonthClickable<{}>['calendar']
            ).weeks[w].days[d].date
          ) {
            startcheckingwherehighlightstop = true;
          }
          else {
            if(startcheckingwherehighlightstop) {
              if(
                (
                  visiblecalendar.value.selections[y].months[
                    m
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[w].days[d].selected !== 'HIGHLIGHTED'
              ) {

              }
            }
          }
        }
      }
    }
  }
}

function handleBackwardEdgeCase(params: ShallowRef<RangeSelectionParamsType>, visiblecalendar: ShallowRef<VisibleCalendarType>) {
  
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
        (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
      ).weeks[week].days[day].selected !== "SELECTED"
    ) {
      if(
        (
          (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[day].selected === "HIGHLIGHTED"
      ) {
        (
          (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[day].selected = "DESELECTED";
      }
      else {
        (
          (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[day].selected = "HIGHLIGHTED";
      }
      triggerRef(visiblecalendar);
    }
    nextTick(() => {
      highlightOrDeselectDaysInWeekForRangeSelection(
        undefined,
        year, 
        month, 
        week, 
        params.value.rangefirstselection, 
        params.value.rangelastselection, 
        visiblecalendar,
        'CELL-BOX'
      );
    });
  }
  else {
    if(params.value.inselectionmode) {
      if(params.value.rangeselectcount < 2) {
        if (
          (
            (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[day].selected === "DESELECTED"
          || 
          (
            (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[day].selected === "HIGHLIGHTED"
        ) {
          if(params.value.rangeselectcount === 0) {
            deselectAll(visiblecalendar);
            params.value.rangefirstselection = {year: 0, month: 0, day: 0, date: "", week: 0};
            params.value.rangelastselection = {year: 0, month: 0, day: 0, date: "", week: 0};
            triggerRef(params);
          }
    
          params.value.rangeselectcount++;
    
          if(params.value.rangeselectcount === 1) {
            deselectAll(visiblecalendar);
            (
              (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
            ).weeks[week].days[day].selected = "SELECTED";
            params.value.rangefirstselection = {
              date: (
                (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[day].date,
              day: (
                (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[day].day,
              year: result.year,
              month: result.month,
              week
            };
          }
          else {
            let avoidedgecases = whereisMouse(xpoint.value, ypoint.value, visiblecalendar);
            if(
              avoidedgecases.date === 
              (
                (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[day].date
            ) {
              (
                (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
              ).weeks[week].days[day].selected = "SELECTED";
              params.value.rangelastselection = {
                date: (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[day].date,
                day: (
                  (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days[day].day,
                year: result.year,
                month: result.month,
                week
              };
            }
            else {
              let bothsideisnothighlighted = false, onesideishighlighted = false;
              for(let y in visiblecalendar.value.selections) {
                for(let m in visiblecalendar.value.selections[y].months) {
                  if(
                    parseInt(y) === params.value.rangefirstselection.year
                    &&
                    parseInt(m) === params.value.rangefirstselection.month
                  ) {
                    for(let d in (visiblecalendar.value.selections[y].months[m] as YearMonthClickable<{}>['calendar']).weeks[params.value.rangefirstselection.week].days) {
                      if(params.value.rangefirstselection.date === (visiblecalendar.value.selections[y].months[m] as YearMonthClickable<{}>['calendar']).weeks[params.value.rangefirstselection.week].days[d].date) {
                        if(params.value.rangefirstselection.week === 0) {
                          if(params.value.rangefirstselection.month === 0) {
                            if(
                              (
                                visiblecalendar.value.selections[y].months[
                                  m
                                ] as YearMonthClickable<{}>['calendar']
                              ).weeks[params.value.rangefirstselection.week].days[d].day !== 1
                            ) {
                              if(parseInt(d) < 6) {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar)
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar)
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                              else {
                                if ( 
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week+1].days[0].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week+1].days[0].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week+1].days[0].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week+1].days[0].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                            }
                            else {
                              if(
                                (
                                  (params.value.rangefirstselection.year - 1) in visiblecalendar.value.selections
                                  &&
                                  11 in visiblecalendar.value.selections[params.value.rangefirstselection.year - 1]
                                  &&
                                  checkPreviousMonthLastDayIsHighlighted(
                                    (
                                      visiblecalendar.value.selections[params.value.rangefirstselection.year - 1].months[
                                        11
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[
                                      Object.values(
                                        (
                                          visiblecalendar.value.selections[params.value.rangefirstselection.year - 1].months[
                                            11
                                          ] as YearMonthClickable<{}>['calendar']
                                        ).weeks
                                      ).length - 1
                                    ]
                                  )
                                )
                                ||
                                (
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                )
                              ) {
                                if
                                (
                                  (params.value.rangefirstselection.year - 1) in visiblecalendar.value.selections
                                  &&
                                  11 in visiblecalendar.value.selections[params.value.rangefirstselection.year - 1]
                                  &&
                                  checkPreviousMonthLastDayIsHighlighted(
                                    (
                                      visiblecalendar.value.selections[params.value.rangefirstselection.year - 1].months[
                                        11
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[
                                      Object.values(
                                        (
                                          visiblecalendar.value.selections[params.value.rangefirstselection.year - 1].months[
                                            11
                                          ] as YearMonthClickable<{}>['calendar']
                                        ).weeks
                                      ).length - 1
                                    ]
                                  )
                                ) {
                                  handleBackwardEdgeCase(params, visiblecalendar);
                                }
                                else {
                                  handleForwardEdgeCase(params, visiblecalendar);
                                }
                                onesideishighlighted = true;
                                break;
                              }
                              else {
                                bothsideisnothighlighted = true;
                                break;
                              }
                            }
                          }
                          else {
                            if(
                              (
                                visiblecalendar.value.selections[y].months[
                                  m
                                ] as YearMonthClickable<{}>['calendar']
                              ).weeks[params.value.rangefirstselection.week].days[d].day !== 1
                            ) {
                              if(parseInt(d) < 6) {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                              else {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week + 1].days[0].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week + 1].days[0].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week + 1].days[0].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week + 1].days[0].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                            }
                            else {
                              if(
                                (
                                  (params.value.rangefirstselection.month - 1) in visiblecalendar.value.selections[params.value.rangefirstselection.year]
                                  &&
                                  checkPreviousMonthLastDayIsHighlighted(
                                    (
                                      visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                        params.value.rangefirstselection.month - 1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[
                                      Object.values(
                                        (
                                          visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                            params.value.rangefirstselection.month - 1
                                          ] as YearMonthClickable<{}>['calendar']
                                        ).weeks
                                      ).length - 1
                                    ]
                                  )
                                )
                                ||
                                (
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                )
                              ) {
                                if(
                                  (params.value.rangefirstselection.month - 1) in visiblecalendar.value.selections[params.value.rangefirstselection.year]
                                  &&
                                  checkPreviousMonthLastDayIsHighlighted(
                                    (
                                      visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                        params.value.rangefirstselection.month - 1
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[
                                      Object.values(
                                        (
                                          visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                            params.value.rangefirstselection.month - 1
                                          ] as YearMonthClickable<{}>['calendar']
                                        ).weeks
                                      ).length - 1
                                    ]
                                  )
                                ) {
                                  handleBackwardEdgeCase(params, visiblecalendar);
                                }
                                else {
                                  handleForwardEdgeCase(params, visiblecalendar);
                                }
                                onesideishighlighted = true;
                                break;
                              }
                              else {
                                bothsideisnothighlighted = true;
                                break;
                              }
                            }
                          }
                        }
                        else if(
                          params.value.rangefirstselection.week === (
                            Object.values(
                              (visiblecalendar.value.selections[params.value.rangefirstselection.year].months[params.value.rangefirstselection.month] as YearMonthClickable<{}>['calendar']).weeks
                            ).length - 1
                          )
                        ) {
                          if(params.value.rangefirstselection.month === 11) {
                            if(
                              parseInt(d) > 0 && parseInt(d) < 6
                            ) {
                              if(
                                !(
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].day in [1, 2, 3, 4, 5, 6, 7, 7]
                                )
                              ) {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                              else {
                                if(
                                  (
                                    (params.value.rangefirstselection.year + 1) in visiblecalendar.value.selections
                                    &&
                                    0 in visiblecalendar.value.selections[params.value.rangefirstselection.year + 1]
                                    &&
                                    checkNextMonthFirstDayIsHighlighted(
                                      (
                                        visiblecalendar.value.selections[(params.value.rangefirstselection.year + 1)].months[
                                          0
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[0]
                                    )
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (params.value.rangefirstselection.year + 1) in visiblecalendar.value.selections
                                    &&
                                    0 in visiblecalendar.value.selections[params.value.rangefirstselection.year + 1]
                                    &&
                                    checkNextMonthFirstDayIsHighlighted(
                                      (
                                        visiblecalendar.value.selections[(params.value.rangefirstselection.year + 1)].months[
                                          0
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[0]
                                    )
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                            }
                            else {
                              if(parseInt(d) === 0) {
                                if(
                                  !(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].day in [1, 2, 3, 4, 5, 6, 7, 7]
                                  )
                                ) {
                                  if(
                                    (
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    )
                                    ||
                                    (
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                    )
                                  ) {
                                    if(
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                    ) {
                                      handleForwardEdgeCase(params, visiblecalendar);
                                    }
                                    else {
                                      handleBackwardEdgeCase(params, visiblecalendar);
                                    }
                                    onesideishighlighted = true;
                                    break;
                                  }
                                  else {
                                    bothsideisnothighlighted = true;
                                    break;
                                  }
                                }
                                else {
                                  if(
                                    (
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    )
                                    ||
                                    (
                                      (params.value.rangefirstselection.year + 1) in visiblecalendar.value.selections
                                      &&
                                      0 in visiblecalendar.value.selections[(params.value.rangefirstselection.year + 1)]
                                      &&
                                      checkNextMonthFirstDayIsHighlighted(
                                        (
                                          visiblecalendar.value.selections[(params.value.rangefirstselection.year + 1)].months[
                                            0
                                          ] as YearMonthClickable<{}>['calendar']
                                        ).weeks[0]
                                      )
                                    )
                                  ) {
                                    if(
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    ) {
                                      handleBackwardEdgeCase(params, visiblecalendar);
                                    }
                                    else {
                                      handleForwardEdgeCase(params, visiblecalendar);
                                    }
                                    onesideishighlighted = true;
                                    break;
                                  }
                                  else {
                                    bothsideisnothighlighted = true;
                                    break;
                                  }
                                }
                              }
                              else {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (params.value.rangefirstselection.year + 1) in visiblecalendar.value.selections
                                    &&
                                    0 in visiblecalendar.value.selections[(params.value.rangefirstselection.year + 1)]
                                    &&
                                    checkNextMonthFirstDayIsHighlighted(
                                      (
                                        visiblecalendar.value.selections[(params.value.rangefirstselection.year + 1)].months[
                                          0
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[0]
                                    )
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                            }
                          }
                          else {
                            if(
                              parseInt(d) > 0 && parseInt(d) < 6
                            ) {
                              if(
                                !(
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].day in [1, 2, 3, 4, 5, 6, 7, 7]
                                )
                              ) {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                              else {
                                if(
                                  (
                                    (params.value.rangefirstselection.month + 1) in visiblecalendar.value.selections[params.value.rangefirstselection.year]
                                    &&
                                    checkNextMonthFirstDayIsHighlighted(
                                      (
                                        visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                          params.value.rangefirstselection.month + 1
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[0]
                                    )
                                  )
                                  ||
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                ) {
                                  if(
                                    (params.value.rangefirstselection.month + 1) in visiblecalendar.value.selections[params.value.rangefirstselection.year]
                                    &&
                                    checkNextMonthFirstDayIsHighlighted(
                                      (
                                        visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                          params.value.rangefirstselection.month + 1
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[0]
                                    )
                                  ) {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                            }
                            else {
                              if(parseInt(d) === 0) {
                                if(
                                  !(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].day in [1, 2, 3, 4, 5, 6, 7, 7]
                                  )
                                ) {
                                  if(
                                    (
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    )
                                    ||
                                    (
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                    )
                                  ) {
                                    if(
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    ) {
                                      handleBackwardEdgeCase(params, visiblecalendar);
                                    }
                                    else {
                                      handleForwardEdgeCase(params, visiblecalendar);
                                    }
                                    onesideishighlighted = true;
                                    break;
                                  }
                                  else {
                                    bothsideisnothighlighted = true;
                                    break;
                                  }
                                }
                                else {
                                  if(
                                    (
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    )
                                    ||
                                    (
                                      (params.value.rangefirstselection.month + 1) in visiblecalendar.value.selections[params.value.rangefirstselection.year]
                                      &&
                                      checkNextMonthFirstDayIsHighlighted(
                                        (
                                          visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                            (params.value.rangefirstselection.month + 1)
                                          ] as YearMonthClickable<{}>['calendar']
                                        ).weeks[0]
                                      )
                                    )
                                  ) {
                                    if(
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                      &&
                                      (
                                        visiblecalendar.value.selections[y].months[
                                          m
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                    ) {
                                      handleBackwardEdgeCase(params, visiblecalendar);
                                    }
                                    else {
                                      handleForwardEdgeCase(params, visiblecalendar);
                                    }
                                    onesideishighlighted = true;
                                    break;
                                  }
                                  else {
                                    bothsideisnothighlighted = true;
                                    break;
                                  }
                                }
                              }
                              else {
                                if(
                                  (
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  )
                                  ||
                                  (
                                    (params.value.rangefirstselection.month + 1) in visiblecalendar.value.selections[params.value.rangefirstselection.year]
                                    &&
                                    checkNextMonthFirstDayIsHighlighted(
                                      (
                                        visiblecalendar.value.selections[params.value.rangefirstselection.year].months[
                                          (params.value.rangefirstselection.month + 1)
                                        ] as YearMonthClickable<{}>['calendar']
                                      ).weeks[0]
                                    )
                                  )
                                ) {
                                  if(
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                    &&
                                    (
                                      visiblecalendar.value.selections[y].months[
                                        m
                                      ] as YearMonthClickable<{}>['calendar']
                                    ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                  ) {
                                    handleBackwardEdgeCase(params, visiblecalendar);
                                  }
                                  else {
                                    handleForwardEdgeCase(params, visiblecalendar);
                                  }
                                  onesideishighlighted = true;
                                  break;
                                }
                                else {
                                  bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                            }
                          }
                        }
                        else {
                          if(
                            parseInt(d) > 0 && parseInt(d) < 6
                          ) {
                            if(
                              (
                                (
                                  visiblecalendar.value.selections[y].months[
                                    m
                                  ] as YearMonthClickable<{}>['calendar']
                                ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                &&
                                (
                                  visiblecalendar.value.selections[y].months[
                                    m
                                  ] as YearMonthClickable<{}>['calendar']
                                ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                              )
                              ||
                              (
                                (
                                  visiblecalendar.value.selections[y].months[
                                    m
                                  ] as YearMonthClickable<{}>['calendar']
                                ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                &&
                                (
                                  visiblecalendar.value.selections[y].months[
                                    m
                                  ] as YearMonthClickable<{}>['calendar']
                                ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                              )
                            ) {
                              if(
                                (
                                  visiblecalendar.value.selections[y].months[
                                    m
                                  ] as YearMonthClickable<{}>['calendar']
                                ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                &&
                                (
                                  visiblecalendar.value.selections[y].months[
                                    m
                                  ] as YearMonthClickable<{}>['calendar']
                                ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                              ) {
                                handleBackwardEdgeCase(params, visiblecalendar);
                              }
                              else {
                                handleForwardEdgeCase(params, visiblecalendar);
                              }
                              onesideishighlighted = true;
                              break;
                            }
                            else {
                              bothsideisnothighlighted = true;
                              break;
                            }
                          }
                          else {
                            if(parseInt(d) === 0) {
                              if(
                                (
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                )
                                ||
                                (
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)+1].selected === 'HIGHLIGHTED'
                                )
                              ) {
                                if(
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week-1].days[6].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week-1].days[6].selected === 'HIGHLIGHTED'
                                ) {
                                  handleBackwardEdgeCase(params, visiblecalendar);
                                }
                                else {
                                  handleForwardEdgeCase(params, visiblecalendar);
                                }
                                onesideishighlighted = true;
                                break;
                              }
                              else {
                                bothsideisnothighlighted = true;
                                break;
                              }
                            }
                            else {
                              if(
                                (
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                )
                                ||
                                (
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week+1].days[0].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week+1].days[0].selected === 'HIGHLIGHTED'
                                )
                              ) {
                                if(
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].status === 'ENABLE'
                                  &&
                                  (
                                    visiblecalendar.value.selections[y].months[
                                      m
                                    ] as YearMonthClickable<{}>['calendar']
                                  ).weeks[params.value.rangefirstselection.week].days[parseInt(d)-1].selected === 'HIGHLIGHTED'
                                ) {
                                  handleBackwardEdgeCase(params, visiblecalendar);
                                }
                                else {
                                  handleForwardEdgeCase(params, visiblecalendar);
                                }
                                onesideishighlighted = true;
                                break;
                              }
                              else {
                                bothsideisnothighlighted = true;
                                break;
                              }
                            }
                          }
                        }
                      } 
                    }
                  }
                  if(bothsideisnothighlighted || onesideishighlighted) break;
                }
                if(bothsideisnothighlighted || onesideishighlighted) break;
              }
              if(bothsideisnothighlighted) {
                deselectAll(visiblecalendar);
                params.value.rangefirstselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
                params.value.rangelastselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
                params.value.rangeselectcount = 0;
                (visiblecalendar.value as VisibleCalendarType).selections = {};
              }
            }
          }
        }
        else {
          deselectAll(visiblecalendar);
          params.value.rangefirstselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
          params.value.rangelastselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
          params.value.rangeselectcount = 0;
          (visiblecalendar.value as VisibleCalendarType).selections = {};
        }
      }
      else {
        deselectAll(visiblecalendar);
        params.value.rangeselectcount = 0;
        params.value.rangefirstselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
        params.value.rangelastselection = {week: 0, year: 0, month: 0, day: 0, date: ""};
        
        (
          (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
        ).weeks[week].days[day].selected = "SELECTED";

        params.value.rangeselectcount = 1;
        params.value.rangefirstselection = {
          date: (
            (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[day].date,
          day: (
            (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
          ).weeks[week].days[day].day,
          year: result.year,
          month: result.month,
          week
        };
      }
      triggerRef(params);
    }
    else {
      (
        (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
      ).weeks[week].days[day].selected = "HIGHLIGHTED";
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

  if (Object.keys((visiblecalendar.value as VisibleCalendarType).selections).length > 0) {
    for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if (parseInt(year) === result.year) {
        for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
          if (parseInt(month) === result.month) {
            for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
              for (let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                if (
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                  ).weeks[parseInt(week)].days[day].day === result.day
                  &&
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']
                  ).weeks[parseInt(week)].days[day].status === "ENABLE"
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
                        visiblecalendar,
                        isoweek,
                        mindate,
                        maxdate
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
        (visiblecalendar.value as VisibleCalendarType).selections[result.year].months = {
          ...(visiblecalendar.value as VisibleCalendarType).selections[result.year].months,
          [result.month]: buildCalendar(
            result.year,
            result.month,
            "SELECTIONS",
            isoweek,
            mindate,
            maxdate,
            visiblecalendar
          ),
        } as VisibleCalendarType['selections'][number]['months'];
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
      (visiblecalendar.value as VisibleCalendarType).selections = {
        ...(visiblecalendar.value as VisibleCalendarType).selections,
        [result.year]: {
          months: {
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
          ty: [false, false, false, false, false, false, false],
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
    (visiblecalendar.value as VisibleCalendarType).selections  = {
      [result.year]: {
        months: {
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
        ty: [false, false, false, false, false, false, false]
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
          ty: [false, false, false, false, false, false, false],
          calendar: {},
        } as YearMonthClickable<PositionTrackerType>,
        last: {
          month: getMonth(new Date(mindate)),
          year: minISOWeekYear,
          clickable: true,
          ty: [false, false, false, false, false, false, false],
          calendar: {},
        } as YearMonthClickable<{}>,
        current: {
          month: getMonth(new Date(maxdate)),
          year: maxISOWeekYear,
          clickable: true,
          ty: [false, false, false, false, false, false, false],
          calendar: {},
        } as YearMonthClickable<PositionTrackerType>,
        first: {
          month: getMonth(new Date(maxdate)),
          year: maxISOWeekYear,
          clickable: true,
          ty: [false, false, false, false, false, false, false],
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
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: 11,
              year: minISOWeekYear - 1,
              clickable: false,
              calendar: {},
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<{}>,
            current: {
              month: 0,
              year: maxISOWeekYear,
              clickable: true,
              calendar: {},
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: 0,
              year: maxISOWeekYear,
              clickable: true,
              calendar: {},
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<{}>,
            selections: {},
          };
        } else {
          tempvisiblecalendar.value = {
            previous: {
              month: getMonth(new Date(mindate)) - 1,
              year: minISOWeekYear,
              clickable: false,
              ty: [false, false, false, false, false, false, false],
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: getMonth(new Date(mindate)) - 1,
              year: minISOWeekYear,
              clickable: false,
              ty: [false, false, false, false, false, false, false],
              calendar: {},
            } as YearMonthClickable<{}>,
            current: {
              month: getMonth(new Date(maxdate)),
              year: maxISOWeekYear,
              clickable: true,
              ty: [false, false, false, false, false, false, false],
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: getMonth(new Date(maxdate)),
              year: maxISOWeekYear,
              clickable: true,
              ty: [false, false, false, false, false, false, false],
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
            ty: [false, false, false, false, false, false, false],
          } as YearMonthClickable<PositionTrackerType>,
          last: {
            month: getMonth(new Date(mindate)),
            year: minISOWeekYear,
            clickable: true,
            calendar: {},
            ty: [false, false, false, false, false, false, false],
          } as YearMonthClickable<{}>,
          current: {
            month: getMonth(new Date(maxdate)),
            year: maxISOWeekYear,
            clickable: true,
            calendar: {},
            ty: [false, false, false, false, false, false, false],
          } as YearMonthClickable<PositionTrackerType>,
          first: {
            month: getMonth(new Date(maxdate)),
            year: maxISOWeekYear,
            clickable: true,
            ty: [false, false, false, false, false, false, false],
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
          ty: [false, false, false, false, false, false, false],
        } as YearMonthClickable<{}>,
        previous: {
          month: getMonth(new Date(mindate)),
          year: minWeekYear,
          clickable: true,
          calendar: {},
          ty: [false, false, false, false, false, false, false],
        } as YearMonthClickable<PositionTrackerType>,
        current: {
          month: getMonth(new Date(maxdate)),
          year: maxWeekYear,
          clickable: true,
          calendar: {},
          ty: [false, false, false, false, false, false, false],
        } as YearMonthClickable<PositionTrackerType>,
        first: {
          month: getMonth(new Date(maxdate)),
          year: maxWeekYear,
          clickable: true,
          calendar: {},
          ty: [false, false, false, false, false, false, false],
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
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: 11,
              year: minWeekYear - 1,
              clickable: false,
              calendar: {},
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<{}>,
            current: {
              month: 0,
              year: maxWeekYear,
              clickable: true,
              calendar: {},
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: 0,
              year: maxWeekYear,
              clickable: true,
              calendar: {},
              ty: [false, false, false, false, false, false, false],
            } as YearMonthClickable<{}>,
            selections: {},
          };
        } else {
          tempvisiblecalendar.value = {
            previous: {
              month: getMonth(new Date(mindate)) - 1,
              year: minWeekYear,
              clickable: false,
              ty: [false, false, false, false, false, false, false],
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            last: {
              month: getMonth(new Date(mindate)) - 1,
              year: minWeekYear,
              clickable: false,
              ty: [false, false, false, false, false, false, false],
              calendar: {},
            } as YearMonthClickable<{}>,
            current: {
              month: getMonth(new Date(maxdate)),
              year: maxWeekYear,
              clickable: true,
              ty: [false, false, false, false, false, false, false],
              calendar: {},
            } as YearMonthClickable<PositionTrackerType>,
            first: {
              month: getMonth(new Date(maxdate)),
              year: maxWeekYear,
              clickable: true,
              ty: [false, false, false, false, false, false, false],
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
            ty: [false, false, false, false, false, false, false],
            calendar: {},
          } as YearMonthClickable<PositionTrackerType>,
          last: {
            month: getMonth(new Date(mindate)),
            year: minWeekYear,
            clickable: true,
            ty: [false, false, false, false, false, false, false],
            calendar: {},
          } as YearMonthClickable<{}>,
          current: {
            month: getMonth(new Date(maxdate)),
            year: maxWeekYear,
            clickable: true,
            ty: [false, false, false, false, false, false, false],
            calendar: {},
          } as YearMonthClickable<PositionTrackerType>,
          first: {
            month: getMonth(new Date(maxdate)),
            year: maxWeekYear,
            clickable: true,
            ty: [false, false, false, false, false, false, false],
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
          xpoint.value = event.pageX;
          ypoint.value = event.pageY;
          if(mousePointedDate.date && mousePointedDate.status === 'ENABLE') {
            if(
              differenceInCalendarDays(
                new Date(mousePointedDate.date),
                new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
              ) >= 0
            ) {
              for(let year in (visiblecalendar.value as VisibleCalendarType).selections) {
                for(let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    for(let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                      if(
                        new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) > new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                        &&
                        new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) <= new Date(mousePointedDate.date)
                        && ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status === 'ENABLE'
                      ) {
                        //highlight this dates
                        handleDateSelectHighlightDeselect(
                          params,
                          isoweek,
                          selectionformat,
                          ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date,
                          true, //true means it is clicked, false means pasted 
                          mindate,
                          maxdate,
                          visiblecalendar as ShallowRef<VisibleCalendarType>
                        );
                      }
                      else {
                        if(
                          ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].selected === "HIGHLIGHTED"
                          && (
                            ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status === 'ENABLE' 
                            && (
                              new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) > new Date(mousePointedDate.date)
                            || new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) < new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                            )
                          )
                        ) {
                          ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].selected = "DESELECTED";
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                  }
                }
              }
            }
            else {
              for(let year in (visiblecalendar.value as VisibleCalendarType).selections) {
                for(let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    for(let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                      if(
                        new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) >= new Date(mousePointedDate.date)
                        &&
                        new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) < new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                        && ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status === 'ENABLE'
                      ) {
                        //highlight this dates
                        handleDateSelectHighlightDeselect(
                          params,
                          isoweek,
                          selectionformat, 
                          ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date,
                          true, //true means it is clicked, false means pasted
                          mindate,
                          maxdate,
                          visiblecalendar as ShallowRef<VisibleCalendarType>
                        );
                      }
                      else {
                        if(
                          ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].selected === "HIGHLIGHTED"
                          && (((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status === 'ENABLE'
                          && ( new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) < new Date(mousePointedDate.date)
                          || new Date(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date) > new Date((params.value.rangefirstselection as RangeFirstAndLastSelectionType).date)
                          ))
                        ) {
                          ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].selected = "DESELECTED";
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

export function weekHasEnable(week: YearMonthClickable<PositionTrackerType>['calendar']['weeks'][number]) {
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

function buildHighlightedCalendar(isoweek: boolean, mindate: string, maxdate: string, visiblecalendar: ShallowRef<VisibleCalendarType>, mPointedDate: { date: string; status: string; day: string; month: string; year: string; }, rfirstselection: RangeFirstAndLastSelectionType) {
  if(parseInt(mPointedDate.year) === rfirstselection.year) {
    if(parseInt(mPointedDate.month) > rfirstselection.month) {
      for(let j=rfirstselection.month; j<=parseInt(mPointedDate.month); j++) {
        if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[rfirstselection.year].months)) {
          (visiblecalendar.value as VisibleCalendarType).selections[rfirstselection.year].months = {
            ...(visiblecalendar.value as VisibleCalendarType).selections[rfirstselection.year].months,
            [j]: buildCalendar(rfirstselection.year, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
          };
        }
      }
    }
    else {
      for(let j=parseInt(mPointedDate.month); j<=rfirstselection.month; j++) {
        if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[rfirstselection.year].months)) {
          (visiblecalendar.value as VisibleCalendarType).selections[rfirstselection.year].months = {
            ...(visiblecalendar.value as VisibleCalendarType).selections[rfirstselection.year].months,
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
              if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
                  [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                };
              }
            }
          }
          else {
            for(let j=0; j<=parseInt(mPointedDate.month); j++) {
              if(j === 0) {
                if(!(i in (visiblecalendar.value as VisibleCalendarType).selections)) {
                  (visiblecalendar.value as VisibleCalendarType).selections = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections,
                    [i]: {
                      months: {
                        [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                      },
                      ty: [false, false, false, false, false, false, false]
                    }
                  } as VisibleCalendarType['selections'];
                }
                else {
                  if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                    (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                      ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    };
                  }
                }
              }
              else {
                if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
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
              if(!(i in (visiblecalendar.value as VisibleCalendarType).selections)) {
                (visiblecalendar.value as VisibleCalendarType).selections = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections,
                  [i]: {
                    months: {
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>),
                    },
                    ty: [false, false, false, false, false, false, false]
                  }
                } as VisibleCalendarType['selections'];
              }
              else {
                if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
            else {
              if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
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
              if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
                  [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                };
              }
            }
          }
          else {
            for(let j=11; j>=parseInt(mPointedDate.month); j--) {
              if(j === 11) {
                if(!(i in (visiblecalendar.value as VisibleCalendarType).selections)) {
                  (visiblecalendar.value as VisibleCalendarType).selections = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections,
                    [i]: {
                      months: {
                        [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>),
                      },
                      ty: [false, false, false, false, false, false, false]
                    }
                  } as VisibleCalendarType['selections'];
                }
                else {
                  if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                    (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                      ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                    };
                  }
                }
              }
              else {
                if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
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
              if(!(i in (visiblecalendar.value as VisibleCalendarType).selections)) {
                (visiblecalendar.value as VisibleCalendarType).selections = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections,
                  [i]: {
                    months: {
                      [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>),
                    },
                    ty: [false, false, false, false, false, false, false],
                  }
                } as VisibleCalendarType['selections'];
              }
              else {
                if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                  (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                    ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
                    [j]: buildCalendar(i, j, "SELECTIONS", isoweek, mindate, maxdate, visiblecalendar as ShallowRef<VisibleCalendarType>)
                  };
                }
              }
            }
            else {
              if(!(j in (visiblecalendar.value as VisibleCalendarType).selections[i].months)) {
                (visiblecalendar.value as VisibleCalendarType).selections[i].months = {
                  ...(visiblecalendar.value as VisibleCalendarType).selections[i].months,
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
  for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
    for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days) {
      if(
        (
          parseInt(week) === 0
          && (
            pointy <= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].y2
            &&
            pointx >= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].x1
            &&
            pointx <= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].x2
          )
        )
        ||
        (
          (parseInt(week) === Object.keys((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks).length-1)
          && (
            pointx >= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].x1
            &&
            pointx <= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].x2
          )
        )
        ||
        (
          (parseInt(week) !== 0 && parseInt(week) !== Object.keys((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks).length-1)
          && (
            pointx >= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].x1
            &&
            pointx <= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].x2
            &&
            pointy >= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].y1
            &&
            pointy <= (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].y2
          )
        )
      ) {
        result = {
          date: (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].date,
          status: (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].status  as 'ENABLE' | 'DISABLE',
          day: (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(week)].days[day].day+"",
          year: (visiblecalendar.value as VisibleCalendarType).previous.year+"",
          month: (visiblecalendar.value as VisibleCalendarType).previous.month+"",
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
    for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
      for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days) {
        if(
          (
            parseInt(week) === 0
            && (
              pointy <= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].y2
              &&
              pointx >= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].x1
              &&
              pointx <= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].x2
            )
          )
          ||
          (
            (parseInt(week) === Object.keys((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks).length-1)
            && (
              pointx >= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].x1
              &&
              pointx <= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].x2
            )
          )
          ||
          (
            (parseInt(week) !== 0 && parseInt(week) !== Object.keys((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks).length-1)
            && (
              pointx >= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].x1
              &&
              pointx <= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].x2
              &&
              pointy >= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].y1
              &&
              pointy <= (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].y2
            )
          )
        ) {
          result = {
            date: (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].date,
            status: (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].status  as 'ENABLE' | 'DISABLE',
            day: (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(week)].days[day].day+"",
            year: (visiblecalendar.value as VisibleCalendarType).current.year+"",
            month: (visiblecalendar.value as VisibleCalendarType).current.month+"",
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
  if ((visiblecalendar.value as VisibleCalendarType).last.clickable) {
    if ((visiblecalendar.value as VisibleCalendarType).current.year > (visiblecalendar.value as VisibleCalendarType).previous.year) {
      //current year is greater than previous year
      if ((visiblecalendar.value as VisibleCalendarType).previous.month + 1 < 12) {
        (visiblecalendar.value as VisibleCalendarType).previous.month++; //keep increasing the month
      } else {
        if (
          (visiblecalendar.value as VisibleCalendarType).previous.year + 1 <
          (visiblecalendar.value as VisibleCalendarType).current.year
        ) {
          (visiblecalendar.value as VisibleCalendarType).previous.month = 0; //set month to jan and increase year
          (visiblecalendar.value as VisibleCalendarType).previous.year++;
        } else {
          //previous year + 1 is equal to current year
          if ((visiblecalendar.value as VisibleCalendarType).first.year > (visiblecalendar.value as VisibleCalendarType).current.year) {
            (visiblecalendar.value as VisibleCalendarType).previous.month = 0; //set month to jan and increase year
            (visiblecalendar.value as VisibleCalendarType).previous.year++;
            if (
              (visiblecalendar.value as VisibleCalendarType).previous.month === (visiblecalendar.value as VisibleCalendarType).current.month
            ) {
              (visiblecalendar.value as VisibleCalendarType).current.month++;
            }
          } else {
            if ((visiblecalendar.value as VisibleCalendarType).current.month > 0) {
              (visiblecalendar.value as VisibleCalendarType).previous.year++;
              (visiblecalendar.value as VisibleCalendarType).previous.month = 0;
            } else {
              if (
                (visiblecalendar.value as VisibleCalendarType).first.month > (visiblecalendar.value as VisibleCalendarType).current.month
              ) {
                (visiblecalendar.value as VisibleCalendarType).previous.year++;
                (visiblecalendar.value as VisibleCalendarType).previous.month = 0;
                (visiblecalendar.value as VisibleCalendarType).current.month++;
              }
            }
          }
        }
      }
    } else {
      //current year is equal to previous year
      if (
        (visiblecalendar.value as VisibleCalendarType).current.month - (visiblecalendar.value as VisibleCalendarType).previous.month > 1
      ) {
        //keep increasing the month of the previous until it is less than 1
        (visiblecalendar.value as VisibleCalendarType).previous.month++;
      } else {
        //difference between current and previous month of the same year is 1
        if ((visiblecalendar.value as VisibleCalendarType).first.year > (visiblecalendar.value as VisibleCalendarType).current.year) {
          //check if the current can be increased as well as the previous
          (visiblecalendar.value as VisibleCalendarType).previous = JSON.parse(
            JSON.stringify((visiblecalendar.value as VisibleCalendarType).current)
          ) as YearMonthClickable<PositionTrackerType>;
          if ((visiblecalendar.value as VisibleCalendarType).current.month + 1 < 12) {
            (visiblecalendar.value as VisibleCalendarType).current.month++;
          } else {
            (visiblecalendar.value as VisibleCalendarType).current.month = 0;
            (visiblecalendar.value as VisibleCalendarType).current.year++;
          }
        } else {
          //current is equal to first
          if ((visiblecalendar.value as VisibleCalendarType).first.month > (visiblecalendar.value as VisibleCalendarType).current.month) {
            (visiblecalendar.value as VisibleCalendarType).previous = JSON.parse(
              JSON.stringify((visiblecalendar.value as VisibleCalendarType).current)
            ) as YearMonthClickable<PositionTrackerType>;
            (visiblecalendar.value as VisibleCalendarType).current.month++;
          }
        }
      }
    }
    
    visiblecalendar.value = {
      last: (visiblecalendar.value as VisibleCalendarType).last,
      first: (visiblecalendar.value as VisibleCalendarType).first,
      current: resetYearMonthDayCalendarHolder(
        (visiblecalendar.value as VisibleCalendarType).current,
        buildCalendar(
          (visiblecalendar.value as VisibleCalendarType).current.year,
          (visiblecalendar.value as VisibleCalendarType).current.month,
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      previous: resetYearMonthDayCalendarHolder(
        (visiblecalendar.value as VisibleCalendarType).previous,
        buildCalendar(
          (visiblecalendar.value as VisibleCalendarType).previous.year,
          (visiblecalendar.value as VisibleCalendarType).previous.month,
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      selections: (visiblecalendar.value as VisibleCalendarType).selections,
    };

    triggerRef(visiblecalendar);
  }
}

export function clickBackward(isoweek: boolean, maxdate: string, mindate: string, visiblecalendar: ShallowRef<VisibleCalendarType>) {
  if ((visiblecalendar.value as VisibleCalendarType).last.clickable) {
    if ((visiblecalendar.value as VisibleCalendarType).previous.year < (visiblecalendar.value as VisibleCalendarType).current.year) {
      if ((visiblecalendar.value as VisibleCalendarType).current.month - 1 > -1) {
        (visiblecalendar.value as VisibleCalendarType).current.month--;
      } else {
        if (
          (visiblecalendar.value as VisibleCalendarType).current.year - 1 >
          (visiblecalendar.value as VisibleCalendarType).previous.year
        ) {
          (visiblecalendar.value as VisibleCalendarType).current.month = 11;
          (visiblecalendar.value as VisibleCalendarType).current.year--;
        } else {
          //current year - 1 is equal to previous year
          if ((visiblecalendar.value as VisibleCalendarType).previous.year > (visiblecalendar.value as VisibleCalendarType).last.year) {
            (visiblecalendar.value as VisibleCalendarType).current.month = 11;
            (visiblecalendar.value as VisibleCalendarType).current.year--;
            if (
              (visiblecalendar.value as VisibleCalendarType).previous.month === (visiblecalendar.value as VisibleCalendarType).current.month
            ) {
              (visiblecalendar.value as VisibleCalendarType).previous.month--;
            }
          } else {
            if ((visiblecalendar.value as VisibleCalendarType).previous.month < 11) {
              (visiblecalendar.value as VisibleCalendarType).current.month = 11;
              (visiblecalendar.value as VisibleCalendarType).current.year--;
            } else {
              if (
                (visiblecalendar.value as VisibleCalendarType).previous.month > (visiblecalendar.value as VisibleCalendarType).last.month
              ) {
                (visiblecalendar.value as VisibleCalendarType).current.month = 11;
                (visiblecalendar.value as VisibleCalendarType).current.year--;
                (visiblecalendar.value as VisibleCalendarType).previous.month--;
              }
            }
          }
        }
      }
    } else {
      //previous year is equal to current year
      if (
        (visiblecalendar.value as VisibleCalendarType).current.month - (visiblecalendar.value as VisibleCalendarType).previous.month >
        1
      ) {
        //keep reducing current
        (visiblecalendar.value as VisibleCalendarType).current.month--;
      } else {
        if ((visiblecalendar.value as VisibleCalendarType).previous.year > (visiblecalendar.value as VisibleCalendarType).last.year) {
          (visiblecalendar.value as VisibleCalendarType).current = JSON.parse(
            JSON.stringify((visiblecalendar.value as VisibleCalendarType).previous)
          ) as YearMonthClickable<PositionTrackerType>;
          if ((visiblecalendar.value as VisibleCalendarType).previous.month - 1 > -1) {
            (visiblecalendar.value as VisibleCalendarType).previous.month--;
          } else {
            (visiblecalendar.value as VisibleCalendarType).previous.month = 11;
            (visiblecalendar.value as VisibleCalendarType).previous.year--;
          }
        } else {
          if ((visiblecalendar.value as VisibleCalendarType).previous.month > (visiblecalendar.value as VisibleCalendarType).last.month) {
            (visiblecalendar.value as VisibleCalendarType).current = JSON.parse(
              JSON.stringify((visiblecalendar.value as VisibleCalendarType).previous)
            );
            (visiblecalendar.value as VisibleCalendarType).previous.month--;
          }
        }
      }
    }
    
    visiblecalendar.value = {
      last: (visiblecalendar.value as VisibleCalendarType).last,
      first: (visiblecalendar.value as VisibleCalendarType).first,
      current: resetYearMonthDayCalendarHolder(
        (visiblecalendar.value as VisibleCalendarType).current,
        buildCalendar(
          (visiblecalendar.value as VisibleCalendarType).current.year,
          (visiblecalendar.value as VisibleCalendarType).current.month,
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      previous: resetYearMonthDayCalendarHolder(
        (visiblecalendar.value as VisibleCalendarType).previous,
        buildCalendar(
          (visiblecalendar.value as VisibleCalendarType).previous.year,
          (visiblecalendar.value as VisibleCalendarType).previous.month,
          "PREVIOUS-OR-CURRENT",
          isoweek,
          mindate,
          maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        )
      ) as YearMonthClickable<PositionTrackerType>,
      selections: (visiblecalendar.value as VisibleCalendarType).selections,
    };

    triggerRef(visiblecalendar);
  }
}

export function assignRef(prevorcur: YearMonthClickable<PositionTrackerType>, el: HTMLLabelElement, weekindex: number, dayindex: number) {
  if ((prevorcur.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks && weekindex in prevorcur.calendar.weeks && el) {
    prevorcur.calendar.weeks[weekindex].days[dayindex].ref = el as HTMLLabelElement;
  }
}

export function resetSelections(resetarea: 'SELECTIONS' | 'CALENDAR', _selectionsorcalendar: VisibleCalendarType['selections'] | YearMonthClickable<PositionTrackerType>['calendar'], maxdate: string, mindate: string, isoweek: boolean) {
  let selectionsorcalendar = _selectionsorcalendar;
  if(resetarea === 'SELECTIONS') {
    for(let year in selectionsorcalendar) {
      for(let month in (selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months) {
        for(let week in ((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
          for(let day in ((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
            if(
              differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date), { representation: "date" }))
                  : new Date(format(new Date(((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date), "yyyy-MM-dd"))
                ,
                new Date(mindate)
              ) >= 0 && differenceInCalendarDays(
                isoweek
                  ? new Date(formatISO(new Date(((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date), { representation: "date" }))
                  : new Date(format(new Date(((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].date), "yyyy-MM-dd"))
                ,
                new Date(maxdate)
              ) <= 0
            ) {
              if(((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].readonlystatus === "ENABLE") {
                ((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status = "ENABLE";
              }
            }
            else {
              ((selectionsorcalendar as VisibleCalendarType['selections'])[parseInt(''+year) as number].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status = "DISABLE";
            }
          }
        }
      }
    }
  }
  else {
    for(let week in (selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks) {
      for(let day in (selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days) {
        if(
          differenceInCalendarDays(
            isoweek
              ? new Date(formatISO(new Date((selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].date), { representation: "date" }))
              : new Date(format(new Date((selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].date), "yyyy-MM-dd"))
            ,
            new Date(mindate)
          ) >= 0 && differenceInCalendarDays(
            isoweek
              ? new Date(formatISO(new Date((selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].date), { representation: "date" }))
              : new Date(format(new Date((selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].date), "yyyy-MM-dd"))
            ,
            new Date(maxdate)
          ) <= 0
        ) {
          if((selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
            (selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].status = "ENABLE";
          }
        }
        else {
          (selectionsorcalendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[parseInt(''+week)].days[day].status = "DISABLE";
        }
      }
    }
  }
  return selectionsorcalendar;
}

export function findRangeSelectionMaxAndMinDate(params: ShallowRef<RangeSelectionParamsType>) {
  let min = "", max = "";
  
  if(
    new Date(format(new Date(((params.value as RangeSelectionParamsType).rangefirstselection as RangeFirstAndLastSelectionType).date), "yyyy-MM-dd"))
    >
    new Date(format(new Date(((params.value as RangeSelectionParamsType).rangelastselection as RangeFirstAndLastSelectionType).date), "yyyy-MM-dd"))
  ) {
    max = ((params.value as RangeSelectionParamsType).rangefirstselection as RangeFirstAndLastSelectionType).date;
    min = ((params.value as RangeSelectionParamsType).rangelastselection as RangeFirstAndLastSelectionType).date;
  }
  else {
    min = ((params.value as RangeSelectionParamsType).rangefirstselection as RangeFirstAndLastSelectionType).date;
    max = ((params.value as RangeSelectionParamsType).rangelastselection as RangeFirstAndLastSelectionType).date;
  }

  return {max, min};
}
