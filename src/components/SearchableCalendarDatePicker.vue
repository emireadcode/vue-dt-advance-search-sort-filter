<script setup lang="ts">
import {
  getDate,
  getWeeksInMonth,
  getDaysInMonth,
  startOfWeek,
  startOfISOWeek,
  differenceInCalendarDays,
  getMonth,
  differenceInCalendarYears,
  getWeekYear,
  differenceInCalendarISOWeekYears,
  getISOWeekYear,
  format,
  formatISO,
} from "date-fns";
import {
  watch,
  ref,
  shallowRef,
  nextTick,
  onBeforeMount,
  triggerRef,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";

const emits = defineEmits<{
  (e: "close:open", action: boolean): void;
}>();

const props = defineProps<{
  maxdate: string;
  mindate: string;
  isoweek: string;
  format: "RANGE" | "MULTIPLE-OR-SINGLE";
  title: string;
  selections:
    | {
        //key is years
        [key: string | number]: {
          //key is months
          [key: string | number]: {
            //key is week number
            [key: string | number]: {
              //key is day number in a week 0 - 6
              [key: string | number]: {
                status: boolean;
                selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
                date?: string | undefined;
                day: number;
              }[];
            }[];
          }[];
        }[];
      }
    | {};
}>();

let pastemultiplelines = ref(false),
  pasteboxref = ref(),
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
  pastedmultiplelinesoftext = ref(""),
  pastedmultiplelinesloading = ref(false),
  actualpasteddata = "",
  clickformat = ref(),
  hassomethingtopaste = ref(false),
  duplicateCheckerObject = {},
  processedpasteedit = ref([]),
  processedpaste = ref([]),
  processedpasteerror = ref(0),
  processedpasteoutofrange = ref(0),
  processedpasteindeterminate = ref(0),
  processedpastelines = ref(0),
  pastemultiplelinescounter = ref(0),
  pastemultiplelinesexpand = ref(false),
  rangeselectcount = ref(0),
  loadingMovement = ref(false),
  doneLooping = ref(true),
  rangefirstselection = ref<{
    date: string;
    year: number | string;
    month: number | String;
    day: number | string;
  }>(),
  unwatchpastedmultiplelinesoftext,
  unwatchclickformat,
  unwatchrangeselectcount;

function getYearMonthAndDate(pasteddate, clickedorpasted) {
  let year,
    month,
    day,
    teststringdate = "";
  if (clickedorpasted) {
    if (props.isoweek === "true") {
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
        delimiterRemovedDateArray = removedDelimiter[0].split(" ");
      teststringdate =
        delimiterRemovedDateArray[0] +
        "-" +
        delimiterRemovedDateArray[1] +
        "-" +
        delimiterRemovedDateArray[2];
    } catch (ex) {
      let removedDelimiter = removeDelimiters(pasteddate),
        delimiterRemovedDateArray = removedDelimiter[0].split(" ");
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
    if (props.isoweek === "true") {
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
    year,
    month,
    day,
  };
}

function buildHighlightedCalendar(mPointedDate, rfirstselection) {
  if(parseInt(mPointedDate.year) === parseInt(rfirstselection.year)) {
    if(parseInt(mPointedDate.month) > parseInt(rfirstselection.month)) {
      for(let j=parseInt(rfirstselection.month); j<=parseInt(mPointedDate.month); j++) {
        if(!(j in visiblecalendar.value.selections[parseInt(rfirstselection.year)])) {
          visiblecalendar.value.selections[parseInt(rfirstselection.year)] = {
            ...visiblecalendar.value.selections[parseInt(rfirstselection.year)],
            [j]: buildCalendar(rfirstselection.year, j, true, "SELECTIONS")
          };
        }
      }
    }
    else {
      for(let j=parseInt(mPointedDate.month); j<=parseInt(rfirstselection.month); j++) {
        if(!(j in visiblecalendar.value.selections[parseInt(rfirstselection.year)])) {
          visiblecalendar.value.selections[parseInt(rfirstselection.year)] = {
            ...visiblecalendar.value.selections[parseInt(rfirstselection.year)],
            [j]: buildCalendar(rfirstselection.year, j, true, "SELECTIONS")
          };
        }
      }
    }
  }
  else {
    if(parseInt(mPointedDate.year) > (rfirstselection.year)) {
      for(let i=parseInt(rfirstselection.year); i<=parseInt(mPointedDate.year); i++) {
        if(i === parseInt(rfirstselection.year) || i === parseInt(mPointedDate.year)) {
          if(i === parseInt(rfirstselection.year)) {
            for(let j=parseInt(rfirstselection.month); j<12; j++) {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS")
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
                      [j]: buildCalendar(i, j, true, "SELECTIONS")
                    }
                  };
                }
                else {
                  if(!(j in visiblecalendar.value.selections[i])) {
                    visiblecalendar.value.selections[i] = {
                      ...visiblecalendar.value.selections[i],
                      [j]: buildCalendar(i, j, true, "SELECTIONS")
                    };
                  }
                }
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS")
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
                    [j]: buildCalendar(i, j, true, "SELECTIONS")
                  }
                };
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS")
                  };
                }
              }
            }
            else {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS")
                };
              }
            }
          }
        }
      }
    }
    else {
      for(let i=parseInt(mPointedDate.year); i<=parseInt(rfirstselection.year); i++) {
        if(i === parseInt(rfirstselection.year) || i === parseInt(mPointedDate.year)) {
          if(i === parseInt(rfirstselection.year)) {
            for(let j=parseInt(rfirstselection.month); j>=0; j--) {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS")
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
                      [j]: buildCalendar(i, j, true, "SELECTIONS")
                    }
                  };
                }
                else {
                  if(!(j in visiblecalendar.value.selections[i])) {
                    visiblecalendar.value.selections[i] = {
                      ...visiblecalendar.value.selections[i],
                      [j]: buildCalendar(i, j, true, "SELECTIONS")
                    };
                  }
                }
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS")
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
                    [j]: buildCalendar(i, j, true, "SELECTIONS")
                  }
                };
              }
              else {
                if(!(j in visiblecalendar.value.selections[i])) {
                  visiblecalendar.value.selections[i] = {
                    ...visiblecalendar.value.selections[i],
                    [j]: buildCalendar(i, j, true, "SELECTIONS")
                  };
                }
              }
            }
            else {
              if(!(j in visiblecalendar.value.selections[i])) {
                visiblecalendar.value.selections[i] = {
                  ...visiblecalendar.value.selections[i],
                  [j]: buildCalendar(i, j, true, "SELECTIONS")
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

function mouseMovement(event) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (clickformat.value === "RANGE") {
        if (rangefirstselection.value.date) {
          let mousePointedDate = whereisMouse(event.pageX, event.pageY);
          buildHighlightedCalendar(mousePointedDate, rangefirstselection.value);
          if(mousePointedDate.date && mousePointedDate.status === 'ENABLE') {
            if(
              differenceInCalendarDays(
                new Date(mousePointedDate.date),
                new Date(rangefirstselection.value.date)
              ) >= 0
            ) {
              for(let year in visiblecalendar.value.selections) {
                doneLooping.value = false;
                for(let month in visiblecalendar.value.selections[year]) {
                  for(let week in visiblecalendar.value.selections[year][month]) {
                    for(let day in visiblecalendar.value.selections[year][month][week]) {
                      if(
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) > new Date(rangefirstselection.value.date)
                        &&
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) <= new Date(mousePointedDate.date)
                        && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                      ) {
                        addDate(visiblecalendar.value.selections[year][month][week][day].date, true, false);
                      }
                      else {
                        if(
                          visiblecalendar.value.selections[year][month][week][day].selected === "HIGHLIGHTED"
                          && (
                            new Date(visiblecalendar.value.selections[year][month][week][day].date) > new Date(mousePointedDate.date)
                          || new Date(visiblecalendar.value.selections[year][month][week][day].date) < new Date(rangefirstselection.value.date)
                          )
                          && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                        ) {
                          visiblecalendar.value.selections[year][month][week][day].selected = "DESELECTED";
                          visiblecalendar.value.selections[year][month][week][day].animate = "";
                          
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                  }
                }
              }
              doneLooping.value = true;
            }
            else {
              for(let year in visiblecalendar.value.selections) {
                doneLooping.value = false;
                for(let month in visiblecalendar.value.selections[year]) {
                  for(let week in visiblecalendar.value.selections[year][month]) {
                    for(let day in visiblecalendar.value.selections[year][month][week]) {
                      if(
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) >= new Date(mousePointedDate.date)
                        &&
                        new Date(visiblecalendar.value.selections[year][month][week][day].date) < new Date(rangefirstselection.value.date)
                        && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                      ) {
                        addDate(visiblecalendar.value.selections[year][month][week][day].date, true, false);
                      }
                      else {
                        if(
                          visiblecalendar.value.selections[year][month][week][day].selected === "HIGHLIGHTED"
                          && ( new Date(visiblecalendar.value.selections[year][month][week][day].date) < new Date(mousePointedDate.date)
                          || new Date(visiblecalendar.value.selections[year][month][week][day].date) > new Date(rangefirstselection.value.date)
                          )
                          && visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE'
                        ) {
                          visiblecalendar.value.selections[year][month][week][day].selected = "DESELECTED";
                          visiblecalendar.value.selections[year][month][week][day].animate = "";
                          
                          triggerRef(visiblecalendar);
                        }
                      }
                    }
                  }
                }
              }
              doneLooping.value = true;
            }
          }
        }
      }
      loadingMovement.value = false;
    }
  });
}

function whereisMouse(pointx: number, pointy: number) {
  let result = {date: "", status: "", day: "", month: "", year: ""}, found = false;
  for(let week in visiblecalendar.value.previous.calendar) {
    for(let day in visiblecalendar.value.previous.calendar[week]) {
      if(
        pointx >= parseFloat(visiblecalendar.value.previous.calendar[week][day].x1)
        &&
        pointx <= parseFloat(visiblecalendar.value.previous.calendar[week][day].x2)
        &&
        pointy >= parseFloat(visiblecalendar.value.previous.calendar[week][day].y1)
        &&
        pointy <= parseFloat(visiblecalendar.value.previous.calendar[week][day].y2)
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
          parseFloat(pointx) >= parseFloat(visiblecalendar.value.current.calendar[week][day].x1)
          &&
          parseFloat(pointx) <= parseFloat(visiblecalendar.value.current.calendar[week][day].x2)
          &&
          parseFloat(pointy) >= parseFloat(visiblecalendar.value.current.calendar[week][day].y1)
          &&
          parseFloat(pointy) <= parseFloat(visiblecalendar.value.current.calendar[week][day].y2)
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

onBeforeUnmount(() => {
  unwatchpastedmultiplelinesoftext();
  unwatchclickformat();
  unwatchrangeselectcount();
  unTrackVisibleCalendarMouseMovement();
  window.removeEventListener('resize', getDimensions, true);
  window.removeEventListener('scroll', getDimensions, true);
});

function deselectAll() {
  for (let year in visiblecalendar.value.selections) {
    for (let month in visiblecalendar.value.selections[year]) {
      for (let week in visiblecalendar.value.selections[year][month]) {
        for (let day in visiblecalendar.value.selections[year][month][week]) {
          if(visiblecalendar.value.selections[year][month][week][day].status === 'ENABLE') {
            visiblecalendar.value.selections[year][month][week][day].selected =
              "DESELECTED";
            visiblecalendar.value.selections[year][month][week][day].animate = "";
          }
        }
      }
    }
  }
  rangeselectcount.value = 0;
  rangefirstselection.value = {year: "", month: "", day: "", date: ""};

  triggerRef(visiblecalendar);
}

function ensureNotMoreThan2CellsSelected() {
  let selectedcount = 0;
  for (let year in visiblecalendar.value.selections) {
    for (let month in visiblecalendar.value.selections[year]) {
      for (let week in visiblecalendar.value.selections[year][month]) {
        for (let day in visiblecalendar.value.selections[year][month][week]) {
          if (
            visiblecalendar.value.selections[year][month][week][day].selected ===
            "SELECTED"
          ) {
            selectedcount++;
          }
        }
      }
    }
  }
  if (selectedcount > 1) {
    deselectAll();
  }
}

function addDate(item, clickedorpasted, highlightedorselected) {
  let result = getYearMonthAndDate(item, clickedorpasted),
    yFound = false,
    mFound = false,
    wFound = false,
    dFound = false,
    wFoundIndex = 0,
    dFoundIndex = 0,
    selectiondestroyed = false,
    dSelected = false;
  
  if (clickformat.value === "RANGE" && highlightedorselected) {
    ensureNotMoreThan2CellsSelected();
  }
  else {
    if(clickformat.value === "MULTIPLE-OR-SINGLE") {
      doneLooping.value = true;
    }
  }

  if (Object.keys(visiblecalendar.value.selections).length > 0) {
    for (let year in visiblecalendar.value.selections) {
      if (parseInt(year) === parseInt(result.year)) {
        for (let month in visiblecalendar.value.selections[year]) {
          if (parseInt(month) === parseInt(result.month)) {
            for (let week in visiblecalendar.value.selections[year][month]) {
              for (let day in visiblecalendar.value.selections[year][month][week]) {
                if (
                  parseInt(
                    visiblecalendar.value.selections[year][month][week][day].day
                  ) === parseInt(result.day) &&
                  visiblecalendar.value.selections[year][month][week][day].status ===
                    "ENABLE"
                ) {
                  if(highlightedorselected) {
                    if(doneLooping.value) {
                      if (
                        visiblecalendar.value.selections[year][month][week][day].selected ===
                        "SELECTED"
                      ) {
                        dSelected = true;
                        if (clickedorpasted) {
                          visiblecalendar.value.selections[year][month][week][day].selected =
                            "DESELECTED";
                          visiblecalendar.value.selections[year][month][week][day].animate =
                            "";
                          if (clickformat.value === "RANGE") {
                            rangeselectcount.value--;
                            if (rangeselectcount.value === 0) {
                              selectiondestroyed = true;
                              visiblecalendar.value.selections = {};
                              rangefirstselection.value = {year: "", month: "", day: "", date: ""};
                              triggerRef(visiblecalendar);
                              break;
                            }
                          }
                        } else {
                          visiblecalendar.value.selections[year][month][week][day].animate =
                            "DUPLICATED-ANIMATION";
                        }
                        
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                  wFound = true;
                  dFound = true;
                  wFoundIndex = parseInt(week);
                  dFoundIndex = parseInt(day);
                  break;
                }
              }
              if(selectiondestroyed) break;
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
      if (mFound) {
        if (dSelected === false && wFound && dFound) {
          if(highlightedorselected) {
            if(doneLooping.value) {
              if(
                visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                  dFoundIndex
                ].status === "ENABLE"
              ) {
                visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                  dFoundIndex
                ].selected = "SELECTED";
                visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                  dFoundIndex
                ].animate = "NEWLY-SELECTED-ANIMATION";
                if (clickformat.value === "RANGE") {
                  rangeselectcount.value++;
                  if (rangeselectcount.value === 1) {
                    deleteEverythingExceptAMonthInAYear(result.year, result.month);
                    rangefirstselection.value = {
                      date: visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                        dFoundIndex
                      ].date,
                      day: visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                        dFoundIndex
                      ].day,
                      year: result.year,
                      month: result.month,
                    };
                  }
                }
              }
            }
          }
          else {
            if(
              visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                dFoundIndex
              ].status === "ENABLE"
            ) {
              visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                dFoundIndex
              ].selected = "HIGHLIGHTED";
              visiblecalendar.value.selections[result.year][result.month][wFoundIndex][
                dFoundIndex
              ].animate = "NEWLY-HIGHLIGHTED-ANIMATION";
            }
          }
          triggerRef(visiblecalendar);
        }
      } else {
        visiblecalendar.value.selections[result.year] = {
          ...visiblecalendar.value.selections[result.year],
          [result.month]: buildCalendar(result.year, result.month, true, "SELECTIONS"),
        };
        selectCalendarCell(result.year, result.month, result.day, highlightedorselected, doneLooping.value);
      }
    } else {
      visiblecalendar.value.selections = {
        ...visiblecalendar.value.selections,
        [result.year]: {
          [result.month]: buildCalendar(result.year, result.month, true, "SELECTIONS"),
        },
      };
      selectCalendarCell(result.year, result.month, result.day, highlightedorselected, doneLooping.value);
    }
  } else {
    visiblecalendar.value.selections = {
      [result.year]: {
        [result.month]: buildCalendar(result.year, result.month, true, "SELECTIONS"),
      },
    };
    selectCalendarCell(result.year, result.month, result.day, highlightedorselected, doneLooping.value);
  }
}

function deleteEverythingExceptAMonthInAYear(year, month) {
  for(let y in visiblecalendar.value.selections) {
    for(let m in visiblecalendar.value.selections[y]) {
      if(parseInt(y) === parseInt(year)) {
        if(parseInt(m) !== parseInt(month)) {
          delete visiblecalendar.value.selections[y][m];
        }
      }
      else {
        delete visiblecalendar.value.selections[y];
      }
    }
  }
  triggerRef(visiblecalendar);
}

function addPasted() {
  clickformat.value = "MULTIPLE-OR-SINGLE";
  nextTick(() => {
    for (let i = 0; i < processedpaste.value.length; i++) {
      let item = processedpaste.value[i];
      if (
        item[1] !== "ERROR" &&
        item[1] !== "OUT-OF-DATE-RANGE" &&
        item[1] !== "INDETERMINATE" &&
        item[0].trim() !== ""
      ) {
        //addDate(item, pasted, selected)
        addDate(item[0], false, true);
      }
    }
    pastemultiplelines.value = false;
    pastemultiplelinesexpand.value = false;
    pastedmultiplelinesoftext.value = "";
    pastemultiplelinescounter.value = 0;
    pastedmultiplelinesloading.value = false;
    duplicateCheckerObject = {};
  });
}

function selectCalendarCell(ryear, rmonth, rday, highlightedorselected, dLooping) {
  for (let year in visiblecalendar.value.selections) {
    if (parseInt(year) === parseInt(ryear)) {
      for (let month in visiblecalendar.value.selections[year]) {
        if (parseInt(month) === parseInt(rmonth)) {
          for (let week in visiblecalendar.value.selections[year][month]) {
            for (let day in visiblecalendar.value.selections[year][month][week]) {
              if (
                parseInt(visiblecalendar.value.selections[year][month][week][day].day) ===
                  parseInt(rday) && (
                visiblecalendar.value.selections[year][month][week][day].selected ===
                  "DESELECTED" ||
                visiblecalendar.value.selections[year][month][week][day].selected ===
                  "HIGHLIGHTED"
                ) &&
                visiblecalendar.value.selections[year][month][week][day].status ===
                  "ENABLE"
              ) {
                if(highlightedorselected) {
                  if(dLooping) {
                    visiblecalendar.value.selections[year][month][week][day].selected =
                      "SELECTED";
                    visiblecalendar.value.selections[year][month][week][day].animate =
                      "NEWLY-SELECTED-ANIMATION";
                
                    triggerRef(visiblecalendar);

                    if (clickformat.value === "RANGE") {
                      rangeselectcount.value++;
                      if (rangeselectcount.value === 1) {
                        deleteEverythingExceptAMonthInAYear(ryear, rmonth);
                        rangefirstselection.value = {
                          date: visiblecalendar.value.selections[year][month][week][day].date,
                          day: visiblecalendar.value.selections[year][month][week][day].day,
                          year: year,
                          month: month,
                        };
                      }
                    }
                  }
                }
                else {
                  if(
                    visiblecalendar.value.selections[year][month][week][day].status ===
                  "ENABLE"
                  ) {
                    visiblecalendar.value.selections[year][month][week][day].selected =
                      "HIGHLIGHTED";
                    visiblecalendar.value.selections[year][month][week][day].animate =
                      "NEWLY-HIGHLIGHTED-ANIMATION";
                
                    triggerRef(visiblecalendar);
                  }
                }
                break;
              }
            }
          }
          break;
        }
      }
      break;
    }
  }
}

function processPastedTextAndFindRejectedAndAcceptedLines(
  actualtext,
  textareaacceptedtext
) {
  let actualtextArray = actualtext.split("\n");
  let textareaacceptedtextArray = textareaacceptedtext.split("\n");

  if (textareaacceptedtextArray[textareaacceptedtextArray.length - 1].trim() !== "") {
    if (
      textareaacceptedtextArray[textareaacceptedtextArray.length - 1] !==
      actualtextArray[textareaacceptedtextArray.length - 1]
    ) {
      textareaacceptedtextArray.splice(textareaacceptedtextArray.length - 1, 1);
      actualtextArray.splice(textareaacceptedtextArray.length - 1, 1);
    }
  }

  let lines = textareaacceptedtextArray.length;

  for (let i = 0; i < textareaacceptedtextArray.length; i++) {
    if (textareaacceptedtextArray[i].trim() === "") {
      textareaacceptedtextArray.splice(i, 1);
      continue;
    }
  }

  return [lines, removeDuplicateAndValidateLine(textareaacceptedtextArray)];
}

function removeDelimiters(item) {
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

function testInvalidDateValidity(pasteddate) {
  try {
    let delimiterRemovedDate = removeDelimiters(pasteddate),
      delimiterRemovedDateArray = delimiterRemovedDate[0].split(" "),
      teststringdate = "";
    if (delimiterRemovedDateArray.length === 3) {
      if (
        (parseInt(delimiterRemovedDateArray[1]) < 13 &&
          parseInt(delimiterRemovedDateArray[2]) < 13) ||
        (parseInt(delimiterRemovedDateArray[0]) < 13 &&
          parseInt(delimiterRemovedDateArray[1]) < 13)
      ) {
        return "INDETERMINATE";
      } else {
        for (let i = delimiterRemovedDateArray.length - 1; i >= 0; i--) {
          teststringdate += delimiterRemovedDateArray[i];
          if (i > 0) {
            teststringdate += " ";
          }
        }
        if (
          format(new Date(teststringdate), "yyyy-MM-dd") >=
            format(new Date(props.mindate), "yyyy-MM-dd") &&
          format(new Date(teststringdate), "yyyy-MM-dd") <=
            format(new Date(props.maxdate), "yyyy-MM-dd")
        ) {
          return "VALID";
        } else {
          return "OUT-OF-DATE-RANGE";
        }
      }
    } else {
      return "ERROR";
    }
  } catch (ex) {
    return "ERROR";
  }
}

function removeDuplicateAndValidateLine(acceptedArray) {
  let newArray = [],
    index = 0,
    error = 0,
    outofrange = 0,
    indeterminate = 0;
  acceptedArray.forEach((item, i) => {
    if (item.trim() !== "") {
      if (
        duplicateCheckerObject["" + item] === undefined ||
        duplicateCheckerObject["" + item] === null
      ) {
        try {
          let removedDelimiter = removeDelimiters(item);
          if (removedDelimiter[1]) {
            if (
              format(new Date(removedDelimiter[0]), "yyyy-MM-dd") >=
                format(new Date(props.mindate), "yyyy-MM-dd") &&
              format(new Date(removedDelimiter[0]), "yyyy-MM-dd") <=
                format(new Date(props.maxdate), "yyyy-MM-dd")
            ) {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "DATE"];
              processedpasteedit.value[index] = false;
              hassomethingtopaste.value = true;
            } else {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "OUT-OF-DATE-RANGE"];
              processedpasteedit.value[index] = false;
              outofrange++;
            }
          } else {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "INDETERMINATE"];
            processedpasteedit.value[index] = false;
            indeterminate++;
          }
        } catch (ex) {
          let invaliddatetest = testInvalidDateValidity(item);

          if (invaliddatetest === "VALID") {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "DATE"];
            processedpasteedit.value[index] = false;
            hassomethingtopaste.value = true;
          } else if (invaliddatetest === "OUT-OF-DATE-RANGE") {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "OUT-OF-DATE-RANGE"];
            processedpasteedit.value[index] = false;
            outofrange++;
          } else if (invaliddatetest === "INDETERMINATE") {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "INDETERMINATE"];
            processedpasteedit.value[index] = false;
            indeterminate++;
          } else {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "ERROR"];
            processedpasteedit.value[index] = false;
            error++;
          }
        }
        index++;
      }
    }
  });

  return [newArray, error, outofrange, indeterminate];
}

function unTrackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    document
      .getElementById("currentvisiblecalendarbox")
      .removeEventListener("mousemove", mouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    document
      .getElementById("previousvisiblecalendarbox")
      .removeEventListener("mousemove", mouseMovement, true);
  }
}

function trackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    document
      .getElementById("currentvisiblecalendarbox")
      .addEventListener("mousemove", mouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    document
      .getElementById("previousvisiblecalendarbox")
      .addEventListener("mousemove", mouseMovement, true);
  }
}

onMounted(() => {
  unwatchrangeselectcount = watch(
    () => rangeselectcount.value,
    (x) => {
      if (clickformat.value === "RANGE") {
        if (x === 1) {
          trackVisibleCalendarMouseMovement();
        } else {
          unTrackVisibleCalendarMouseMovement();
        }
      }
    }
  );
  unwatchclickformat = watch(
    () => clickformat.value,
    (x) => {
      deselectAll();
      if (x === "MULTIPLE-OR-SINGLE") {
        unTrackVisibleCalendarMouseMovement();
      }
    }
  );
  unwatchpastedmultiplelinesoftext = watch(
    () => pastedmultiplelinesoftext.value,
    (text) => {
      if (pastemultiplelinescounter.value === 0) {
        pastedmultiplelinesloading.value = true;
        pastemultiplelinescounter.value = 1;
        let pt;
        clearTimeout(pt);
        pt = setTimeout(() => {
          pastedmultiplelinesloading.value = false;
          pastemultiplelinesexpand.value = true;
          let result = processPastedTextAndFindRejectedAndAcceptedLines(
            actualpasteddata,
            pastedmultiplelinesoftext.value
          );
          processedpaste.value = result[1][0];
          processedpasteerror.value = result[1][1];
          processedpasteoutofrange.value = result[1][2];
          processedpasteindeterminate.value = result[1][3];
          processedpastelines.value = result[0];
          clearTimeout(pt);
        }, 200);
      }
    }
  );
  window.addEventListener('resize', getDimensions, true);
  window.addEventListener('scroll', getDimensions, true);
});

function openPasteArea() {
  pastemultiplelines.value = true;
  pastemultiplelinesexpand.value = false;
  pastedmultiplelinesoftext.value = "";
  pastemultiplelinescounter.value = 0;
  pastedmultiplelinesloading.value = false;
  duplicateCheckerObject = {};

  let tt;
  clearTimeout(tt);
  tt = setTimeout(() => {
    pasteboxref.value.focus();
    clearTimeout(tt);
  }, 50);
}

function handlePaste(e) {
  var clipboardData, pastedData;

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData("Text");

  return pastedData;
}

function pasteMultilineWordsCopiedFromSomewhere(e) {
  pasteboxref.value.maxLength = 5000;
  actualpasteddata = handlePaste(e);
  let pastelengthresizetimer;
  clearTimeout(pastelengthresizetimer);
  pastelengthresizetimer = setTimeout(() => {
    pasteboxref.value.maxLength = 0;
    clearTimeout(pastelengthresizetimer);
  }, 10);
}

type YearMonthClickable<T> = {
  month: number;
  year: number;
  clickable: boolean;
  calendar: {
    [key: string | number]: {
      [key: string | number]: (T & {
        status: boolean;
        date: string;
        day: number;
      })[];
    }[];
  };
};

type VisibleCalendarType = {
  previous: YearMonthClickable<PositionTrackerType>;
  current: YearMonthClickable<PositionTrackerType>;
  last: YearMonthClickable<{}>;
  first: YearMonthClickable<{}>;
  selections:
    | {
        //key is years
        [key: string | number]: {
          //key is months
          [key: string | number]: {
            //key is week number
            [key: string | number]: {
              //key is day number in a week 0 - 6
              [key: string | number]: {
                selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
                date: string;
                day: number;
                animate: string;
              }[];
            }[];
          }[];
        }[];
      }
    | {};
};

type PositionTrackerType = {
  ref: HTMLLabelElement;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

let visiblecalendar = shallowRef<VisibleCalendarType | undefined>();

const previousyearandmonthinselections = computed(() => {
  if (!(visiblecalendar.value.previous.year in visiblecalendar.value.selections)) {
    return false;
  } else {
    if (
      !(
        visiblecalendar.value.previous.month in
        visiblecalendar.value.selections[visiblecalendar.value.previous.year]
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
});

const currentyearandmonthinselections = computed(() => {
  if (!(visiblecalendar.value.current.year in visiblecalendar.value.selections)) {
    return false;
  } else {
    if (
      !(
        visiblecalendar.value.current.month in
        visiblecalendar.value.selections[visiblecalendar.value.current.year]
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
});

onBeforeMount(() => {
  //visiblecalendar.value.selections = props.selections;
  clickformat.value = props.format;
  
  fillVisibleCalendarArray(); 
  
  console.log(visiblecalendar.value);
});

function fillVisibleCalendarArray() {
  const maxdate = props.maxdate;
  const mindate = props.mindate;
  if (props.isoweek === "true") {
    const maxISOWeekYear = getISOWeekYear(new Date(maxdate));
    const minISOWeekYear = getISOWeekYear(new Date(mindate));

    if (differenceInCalendarISOWeekYears(new Date(maxdate), new Date(mindate)) >= 1) {
      visiblecalendar.value = {
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
          visiblecalendar.value = {
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
          visiblecalendar.value = {
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
        visiblecalendar.value = {
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
      visiblecalendar.value = {
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
          visiblecalendar.value = {
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
          visiblecalendar.value = {
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
        visiblecalendar.value = {
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

  visiblecalendar.value = {
    last: resetYearMonthDayCalendarHolder(
      visiblecalendar.value.last,
      buildCalendar(
        visiblecalendar.value.last.year,
        visiblecalendar.value.last.month,
        false,
        "LAST-OR-FIRST"
      )
    ),
    first: resetYearMonthDayCalendarHolder(
      visiblecalendar.value.first,
      buildCalendar(
        visiblecalendar.value.first.year,
        visiblecalendar.value.first.month,
        false,
        "LAST-OR-FIRST"
      )
    ),
    current: resetYearMonthDayCalendarHolder(
      visiblecalendar.value.current,
      buildCalendar(
        visiblecalendar.value.current.year,
        visiblecalendar.value.current.month,
        false,
        "PREVIOUS-OR-CURRENT"
      )
    ),
    previous: resetYearMonthDayCalendarHolder(
      visiblecalendar.value.previous,
      buildCalendar(
        visiblecalendar.value.previous.year,
        visiblecalendar.value.previous.month,
        false,
        "PREVIOUS-OR-CURRENT"
      )
    ),
    selections: visiblecalendar.value.selections,
  };

  triggerRef(visiblecalendar);
}

function resetYearMonthDayCalendarHolder(holder, calendar) {
  return {
    month: holder.month,
    year: holder.year,
    clickable: holder.clickable,
    calendar: calendar,
  };
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
          "PREVIOUS-OR-CURRENT"
        )
      ),
      previous: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.previous,
        buildCalendar(
          visiblecalendar.value.previous.year,
          visiblecalendar.value.previous.month,
          false,
          "PREVIOUS-OR-CURRENT"
        )
      ),
      selections: visiblecalendar.value.selections,
    };

    triggerRef(visiblecalendar);
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
          "PREVIOUS-OR-CURRENT"
        )
      ),
      previous: resetYearMonthDayCalendarHolder(
        visiblecalendar.value.previous,
        buildCalendar(
          visiblecalendar.value.previous.year,
          visiblecalendar.value.previous.month,
          false,
          "PREVIOUS-OR-CURRENT"
        )
      ),
      selections: visiblecalendar.value.selections,
    };

    triggerRef(visiblecalendar);
  }
}

function buildCalendar(
  _year,
  _month,
  forselection,
  holdertype: "LAST-OR-FIRST" | "PREVIOUS-OR-CURRENT" | "SELECTIONS"
) {
  let year = _year,
    month = _month,
    calendar = {},
    diffBtwWkStartAndMnthStart,
    startDate,
    counter = 0,
    weeksInMonth = getWeeksInMonth(new Date(year, month, 1)),
    daysInMonth = getDaysInMonth(new Date(year, month, 1));

  if (props.isoweek === "true") {
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
          let sDate = startDate + k, mm = (parseInt(month)-1)<0? 11 : (parseInt(month)<10? "0"+parseInt(month) : parseInt(month)), yy = (parseInt(month)-1)<0? parseInt(year)-1 : parseInt(year);
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: "DISABLE",
              day: sDate,
              date: yy+'-'+mm+'-'+sDate,
            },
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
              animate: "",
            };
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
        } else {
          counter++;
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: differenceInCalendarDays(
                props.isoweek === "true"
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.mindate)
              ) >= 0 && differenceInCalendarDays(
                props.isoweek === "true"
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              day: counter,
              date:
                props.isoweek === "true"
                  ? formatISO(new Date(year, month, counter), { representation: "date" })
                  : format(new Date(year, month, counter), "yyyy-MM-dd"),
            },
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
              animate: "",
            };
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
        }
      } else {
        counter++;
        if (counter <= daysInMonth) {
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: differenceInCalendarDays(
                props.isoweek === "true"
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.mindate)
              ) >= 0 && differenceInCalendarDays(
                props.isoweek === "true"
                  ? new Date(formatISO(new Date(year, month, counter), { representation: "date" }))
                  : new Date(format(new Date(year, month, counter), "yyyy-MM-dd"))
                ,
                new Date(props.maxdate)
              ) <= 0 ? "ENABLE" : "DISABLE",
              day: counter,
              date:
                props.isoweek === "true"
                  ? formatISO(new Date(year, month, counter), { representation: "date" })
                  : format(new Date(year, month, counter), "yyyy-MM-dd"),
            },
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
              animate: "",
            };
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
        } else {
          newWeekDate++;
          let yy = parseInt(month)+2 > 11 ? parseInt(year)+1 : year, mm = parseInt(month)+2 > 9? parseInt(month)+2 : '0'+(parseInt(month)+2);
          calendar[j] = {
            ...calendar[j],
            [k]: {
              status: "DISABLE",
              day: newWeekDate,
              date: yy+'-'+mm+'-0'+newWeekDate,
            },
          };
          if (forselection) {
            calendar[j][k] = {
              ...calendar[j][k],
              selected: "DESELECTED",
              animate: "",
            };
          }
          if (holdertype === "PREVIOUS-OR-CURRENT") {
            calendar[j][k] = {
              ...calendar[j][k],
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            };
          }
          if (newWeekDate === 7 && j == weeksInMonth - 1) {
            if (calendar[j][0].day === 1 && calendar[j][6].day === 7) {
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
      getDimensions();
    });
  }

  return calendar;
}

function getDimensions() {
  nextTick(() => {
    for (let w in visiblecalendar.value.previous.calendar) {
      for (let d in visiblecalendar.value.previous.calendar[w]) {
        if (w in visiblecalendar.value.previous.calendar) {
          if (d in visiblecalendar.value.previous.calendar[w]) {
            if (visiblecalendar.value.previous.calendar[w][d].ref) {
              let offset = getOffset(visiblecalendar.value.previous.calendar[w][d].ref);
              if (offset) {
                visiblecalendar.value.previous.calendar[w][d].x1 = offset.x1;
                visiblecalendar.value.previous.calendar[w][d].y1 = offset.y1;
                visiblecalendar.value.previous.calendar[w][d].x2 = offset.x2;
                visiblecalendar.value.previous.calendar[w][d].y2 = offset.y2;
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
            if (visiblecalendar.value.current.calendar[w][d].ref) {
              let offset = getOffset(visiblecalendar.value.current.calendar[w][d].ref);
              if (offset) {
                visiblecalendar.value.current.calendar[w][d].x1 = offset.x1;
                visiblecalendar.value.current.calendar[w][d].y1 = offset.y1;
                visiblecalendar.value.current.calendar[w][d].x2 = offset.x2;
                visiblecalendar.value.current.calendar[w][d].y2 = offset.y2;
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

function assignRef(holder, el, weekindex, dayindex) {
  if (weekindex in holder.calendar && el) {
    holder.calendar[weekindex][dayindex].ref = el;
  }
}
</script>

<template>
  <div class="d-block position-relative">
    <template v-if="pastemultiplelines">
      <div
        class="w-100 t-0 l-0 position-absolute"
        style="height: 500px; padding: 10px 10px;"
      >
        <div class="d-block shadow-sm" style="background-color: #fff; border: 1px solid #fff;">
          <div
            class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            style="height: 30px"
          >
            <div class="flex-fill" style="font-size: 0.8rem">
              Press Ctrl + V on a PC or Command + V on an Apple Mac.
            </div>
            <div class="flex-grow-0 flex-shrink-0 text-center">
              <a
                @click="pastemultiplelines = false"
                class="d-inline-block cursor-pointer"
                title="Close"
              >
                <img
                  src="/src/assets/icons/close.png"
                  style="width: 20px; height: 20px"
                  class="align-middle"
                />
              </a>
            </div>
          </div>
          <div class="d-block position-relative" style="height: 428px">
            <div class="d-block h-100" style="z-index: 800">
              <textarea
                :ref="(el) => (pasteboxref = el)"
                style="border: 1px solid gray; padding: 5px; resize: none"
                class="w-100 h-100 text-left d-inline-block overflow-auto"
                maxlength="0"
                v-model="pastedmultiplelinesoftext"
                @paste="(e) => pasteMultilineWordsCopiedFromSomewhere(e)"
              ></textarea>
            </div>
            <template v-if="pastedmultiplelinesloading">
              <div
                style="padding: 114px 0px; z-index: 900"
                class="t-0 l-0 w-100 position-absolute m-0 h-100 modal-mask-background-1"
              >
                <img
                  src="/src/assets/icons/loading.gif"
                  style="width: 200px; height: 200px"
                  class="align-middle"
                />
              </div>
            </template>
          </div>
          <div
            class="d-block"
            style="background-color: #fff; height: 25px; padding: 2px 0; font-size: 0.8rem"
          >
            Max letters per line = 40, Total Max letters for all lines = 5000
          </div>
        </div>
      </div>
      <Teleport to="body">
        <div v-if="pastemultiplelinesexpand" class="d-block position-relative">
          <transition name="modal">
            <div
              class="position-fixed h-100 w-100 overflow-auto user-select-none"
              style="z-index: 1800"
            >
              <div class="modal-mask h-100 w-100 modal-mask-background-2">
                <div class="modal-wrapper text-center">
                  <div
                    class="modal-container d-block shadow"
                    style="height: auto; width: 560px"
                  >
                    <div class="d-block m-0 p-0">
                      <div
                        class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                        style="height: 30px; padding: 0 3px"
                      >
                        <div class="text-left flex-fill" style="font-size: 0.8rem">
                          <div
                            class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                          >
                            <div class="flex-fill text-center">
                              Pasted Lines = {{ processedpastelines }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="background-color: red; width: 15px; height: 15px"
                              ></div>
                              Invalid Dates = {{ processedpasteerror }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="
                                  background-color: yellow;
                                  width: 15px;
                                  height: 15px;
                                "
                              ></div>
                              Out of Range = {{ processedpasteoutofrange }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="background-color: pink; width: 15px; height: 15px"
                              ></div>
                              Indeterminate =
                              {{ processedpasteindeterminate }}
                            </div>
                          </div>
                        </div>
                        <div class="flex-grow-0 flex-shrink-0 text-center">
                          <a
                            @click="
                              () => {
                                pastedmultiplelinesoftext = '';
                                pastemultiplelinescounter = 0;
                                pastedmultiplelinesloading = false;
                                pastemultiplelinesexpand = false;
                                pastemultiplelines = false;
                                duplicateCheckerObject = {};
                              }
                            "
                            class="d-inline-block cursor-pointer"
                            title="Close"
                          >
                            <img
                              src="/src/assets/icons/close.png"
                              style="width: 20px; height: 20px"
                              class="align-middle"
                            />
                          </a>
                        </div>
                      </div>
                      <div class="d-block" style="padding: 10px">
                        <div
                          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                        >
                          <div class="flex-w-50" style="padding-right: 2px">
                            <button
                              @click=""
                              class="btn shadow-sm d-inline-block w-100"
                              style="background-color: green; color: #fff"
                            >
                              Choose format for Indeterminate
                            </button>
                          </div>
                          <div class="flex-w-50" style="padding-left: 2px">
                            <button
                              @click="() => { hassomethingtopaste? addPasted() : ''}"
                              class="btn shadow-sm d-inline-block w-100"
                              :style="hassomethingtopaste? 'background-color: green; color: #fff' : 'background-color: grey; color: #fff'"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="d-block">
                        <ul class="d-block list-style-none m-0 p-0">
                          <li
                            v-for="(item, i) in processedpaste"
                            :key="'expand-include-' + i"
                          >
                            <div class="d-block" style="padding: 5px">
                              <template v-if="processedpasteedit[i]">
                                <div
                                  class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
                                >
                                  <div class="flex-fill p-0 m-0 align-self-stretch">
                                    <input
                                      type="text"
                                      class="w-100"
                                      v-model="item[0]"
                                      style="
                                        border-radius: 20px;
                                        padding: 8px;
                                        background-color: #ffcccb;
                                      "
                                    />
                                  </div>
                                  <div
                                    class="position-absolute flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                                    style="
                                      background-color: #eee;
                                      outline: 1px solid rgba(0, 0, 0, 0.2);
                                      border-top-right-radius: 20px;
                                      border-bottom-right-radius: 20px;
                                    "
                                  >
                                    <a
                                      class="cursor-pointer d-block text-center"
                                      style="padding: 7px 0"
                                      @click="saveEditedDate(item[0], i)"
                                    >
                                      <img
                                        src="/src/assets/icons/save.png"
                                        class="wh-1-dot-25-rem align-middle"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </template>
                              <template v-else>
                                <div
                                  :style="
                                    item[1] === 'ERROR'
                                      ? 'background-color:red;color:#fff;'
                                      : item[1] === 'OUT-OF-DATE-RANGE'
                                      ? 'background-color:yellow;color:black;'
                                      : item[1] === 'INDETERMINATE'
                                      ? 'background-color:pink;color:black;'
                                      : 'background-color:#fff;'
                                  "
                                  class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                  style="border-radius: 20px; padding: 8px"
                                >
                                  <div
                                    class="ellipsis overflow-hidden text-left flex-fill letter-spacing font-0-dot-875-rem"
                                  >
                                    {{ item[0] }}
                                  </div>
                                  <div
                                    class="flex-shrink-0 flex-grow-0 flex-w-3-dot-5-rem"
                                  >
                                    <div
                                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
                                    >
                                      <template v-if="item[1] === 'OUT-OF-DATE-RANGE'">
                                        <div
                                          class="flex-shrink-0 flex-grow-0"
                                          style="padding-right: 4px"
                                        >
                                          <a
                                            @click="processedpasteedit[i] = true"
                                            class="d-inline-block cursor-pointer"
                                          >
                                            <img
                                              src="/src/assets/icons/edit.png"
                                              style="width: 18px; height: 18px"
                                              class="align-middle"
                                            />
                                          </a>
                                        </div>
                                      </template>
                                      <div
                                        class="flex-shrink-0 flex-grow-0"
                                        style="padding-left: 4px"
                                      >
                                        <a
                                          @click="deletePasted(i)"
                                          class="d-inline-block cursor-pointer"
                                        >
                                          <img
                                            src="/src/assets/icons/delete.png"
                                            style="width: 18px; height: 18px"
                                            class="align-middle"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </Teleport>
    </template>
    <div class="d-block" style="padding: 0 10px;">
      <div class="d-block text-center" style="padding: 34.5px 0 34.5px 0">
        <button
          class="btn shadow-sm w-100"
          style="border-radius: 50px; padding: 12px; font-size: 1.2rem; background-color: #f0e68c;"
          @click="openPasteArea()"
        >
          Paste multiple lines of
          <span class="text-lowercase">{{ title }}</span>
        </button>
      </div>
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
        style="border: 1px solid gray"
      >
        <div class="flex-w-50 align-self-stretch">
          <a
            @click="clickformat = 'RANGE'"
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
            @click="clickformat = 'MULTIPLE-OR-SINGLE'"
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
      <div
        style="height: 340px;"
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
              v-for="(day, dayindex) in isoweek === 'true' ? isodays : days"
              :key="'dayname' + dayindex"
            >
              {{ isoweek === "true" ? isodays[dayindex] : days[dayindex] }}
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
                    style="border-radius: 4px; float: left; padding: 1px;"
                  >
                    <label
                      :ref="
                        (el) => assignRef(visiblecalendar.previous, el, weekindex, dayindex)
                      "
                      @click="() => {day.status==='ENABLE'? addDate(day.date, true, true) : ''}"
                      :disabled="day.status === 'DISABLE' ? true : false"
                      class="w-100"
                      style="float: left; line-height: 2.5em; height: 2.5em;"
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
                          :ref="
                            (el) =>
                              assignRef(visiblecalendar.previous, el, weekindex, dayindex)
                          "
                          class="font-family text-center d-block letter-spacing"
                          style="font-size: 1rem; line-height: 2.5em; height: 2.5em; outline: 1px solid #fff;"
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
                              : 'color: gray !important'
                          "
                        >
                          {{ day.day }}
                        </span>
                      </template>
                      <template v-else>
                        <span
                          :class="[day.status === 'ENABLE'? 'cursor-pointer' : '']"
                          :ref="
                            (el) =>
                              assignRef(visiblecalendar.previous, el, weekindex, dayindex)
                          "
                          class="font-family text-center d-block letter-spacing"
                          style="font-size: 1rem; line-height: 2.5em; height: 2.5em; outline: 1px solid #fff;"
                          :style="
                            day.status === 'DISABLE'
                              ? 'color: gray !important'
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
              v-for="(day, dayindex) in isoweek === 'true' ? isodays : days"
              :key="'dayname' + dayindex"
              style="border-radius: 4px"
            >
              {{ isoweek === "true" ? isodays[dayindex] : days[dayindex] }}
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
                    style="border-radius: 4px; float: left; padding: 1px;"
                  >
                    <label
                      @click="() => {day.status==='ENABLE'? addDate(day.date, true, true) : ''}"
                      :disabled="day.status === 'DISABLE' ? true : false"
                      class="w-100"
                      style="float: left; line-height: 2.5em; height: 2.5em"
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
                          :ref="
                            (el) =>
                              assignRef(visiblecalendar.current, el, weekindex, dayindex)
                          "
                          class="font-family text-center d-block letter-spacing"
                          style="font-size: 1rem; line-height: 2.5em; height: 2.5em; outline: 1px solid #fff;"
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
                              : 'color: gray !important'
                          "
                        >
                          {{ day.day }}
                        </span>
                      </template>
                      <template v-else>
                        <span
                          :class="[day.status === 'ENABLE'? 'cursor-pointer' : '']"
                          :ref="
                            (el) =>
                              assignRef(visiblecalendar.current, el, weekindex, dayindex)
                          "
                          class="font-family text-center d-block letter-spacing"
                          style="font-size: 1rem; line-height: 2.5em; height: 2.5em; outline: 1px solid #fff;"
                          :style="
                            day.status === 'DISABLE'
                              ? 'color: gray !important'
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
      <div class="d-block text-center" style="padding-top: 5px;">
        <div
          style="padding: 7px 0 3px 0;"
          class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
        >
          <div class="flex-w-100-over-3 align-self-stretch" style="padding-right:5px;">
            <button
              class="btn shadow-sm w-100 font-family"
              style="padding: 6px; font-size: 1rem;background-color: #f0e68c;"
              @click=""
            >
              Exclude dates
            </button>
          </div>
          <div class="flex-w-100-over-3 align-self-stretch" style="padding: 0 2.5px;">
            <button
              class="btn shadow-sm w-100 font-family"
              style="padding: 6px; font-size: 1rem;background-color: #f0e68c;"
              @click="emits('close:open', false)"
            >
              Done
            </button>
          </div>
          <div class="flex-w-100-over-3 align-self-stretch" style="padding-left: 5px;">
            <button
              class="btn shadow-sm w-100 font-family"
              style="padding: 6px; font-size: 1rem;background-color: #f0e68c;"
              @click="deselectAll()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
}
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
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
label input + span {
  color: #fff;
}
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
