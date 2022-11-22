<script setup lang="ts">
import { getDate, getWeeksInMonth, getDaysInMonth, startOfWeek, differenceInDays } from 'date-fns';
import { ref, nextTick } from 'vue';

const props = defineProps<{
  forMonth?: boolean | undefined,
  years: number[],
  forYear?: boolean | undefined
}>();

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const selectedDay = [0, 1, 2, 3, 6];
const selectedMonth = [0, 1, 2, 3, 4, 10, 11];

type DayBaseCalendarType = {
  [key: number] : {
    [key: number]: {
      status: string,
      day: string,
      date: string
    }
  }[]
};

type YearHolderType = {
  year: number,
  months: {
    month: number,
    monthcalendar: DayBaseCalendarType[],
    weekchecker: string[]
  }[]
};

let yearholder = [] as YearHolderType[];

props.years.sort();

function buildWeekTable() {
  if(props.forMonth !== undefined) {
    if(props.forMonth) {
      props.years.forEach((year, p) => {
        if(p === 0) {
          yearholder = [
            {
              year: year,
              months: []
            }
          ];
        }
        else {
          yearholder = [
            ...yearholder,
            {
              year: year,
              months: []
            }
          ];
        }

        for(let i=0; i<selectedMonth.length; i++) {
          const weeksInMonth = getWeeksInMonth(new Date(year, selectedMonth[i], 1));
          const daysInMonth = getDaysInMonth(new Date(year, selectedMonth[i], 1));
          let dayBaseCalendar = [] as DayBaseCalendarType[], counter = 0, weekchecker = [];

          const diffBtwWkStartAndMnthStart = differenceInDays(
            new Date(year, selectedMonth[i], 1),
            startOfWeek(new Date(year, selectedMonth[i], 1))
          );

          const startDate = getDate(startOfWeek(new Date(year, selectedMonth[i], 1)));

          for(let j=0; j<weeksInMonth; j++) {
            let disableorfalsecount = 0, newWeekDate = 0;
            if(!(j in dayBaseCalendar)) {
              if(j===0) {
                dayBaseCalendar = [
                  {
                    [j]: []
                  }
                ];
              }
              else {
                dayBaseCalendar = [
                  ...dayBaseCalendar,
                  {
                    [j]: []
                  }
                ];
              }
            }
            for(let k=0; k<days.length; k++) {
              if(j===0) {
                if(k < diffBtwWkStartAndMnthStart) {
                  (dayBaseCalendar as DayBaseCalendarType[])[j][j].push({
                    [k]: {
                      status: "DISABLE",
                      day: ((startDate+k)<10)? '0'+(startDate+k) : ''+(startDate+k),
                      date: (((startDate+k)<10)? '0'+(startDate+k) : ''+(startDate+k))+'-'+(((selectedMonth[i]+1)<10)? '0'+(selectedMonth[i]+1): ''+(selectedMonth[i]+1))+'-'+(year-1)
                    }
                  });
                  disableorfalsecount++;
                }
                else {
                  counter++;
                  (dayBaseCalendar as DayBaseCalendarType[])[j][j].push({
                    [k]: {
                      status: "FALSE",
                      day: (counter<10)? '0'+counter : ''+counter,
                      date: ((counter<10)? '0'+counter : ''+counter)+'-'+(((selectedMonth[i]+1)<10)? '0'+(selectedMonth[i]+1): ''+(selectedMonth[i]+1))+'-'+year
                    }
                  });
                  disableorfalsecount++;
                }
              }
              else {
                counter++;
                if(counter <= daysInMonth) {
                  (dayBaseCalendar as DayBaseCalendarType[])[j][j].push({
                    [k]: {
                      status: "FALSE",
                      day: (counter<10)? '0'+counter : ''+counter,
                      date: ((counter<10)? '0'+counter : ''+counter)+'-'+(((selectedMonth[i]+1)<10)? '0'+(selectedMonth[i]+1): ''+(selectedMonth[i]+1))+'-'+year
                    }
                  });
                  disableorfalsecount++;
                }
                else {
                  newWeekDate++;
                  (dayBaseCalendar as DayBaseCalendarType[])[j][j].push({
                    [k]: {
                      status: "DISABLE",
                      day: (newWeekDate<10)? '0'+newWeekDate : ''+newWeekDate,
                      date: ((newWeekDate<10)? '0'+newWeekDate : ''+newWeekDate)+'-'+(((selectedMonth[i]+1)===12)?'01':(((selectedMonth[i]+2)<10)?'0'+(selectedMonth[i]+2):''+(selectedMonth[i]+2)))+'-'+(((selectedMonth[i]+1)===12)?''+(year+1):''+year)
                    }
                  });
                  disableorfalsecount++;
                }
              }
            }

            for(let l=0; l<selectedDay.length; l++) {
              if((dayBaseCalendar as DayBaseCalendarType[])[j][j][selectedDay[l]][selectedDay[l]].status==='FALSE') {
                (dayBaseCalendar as DayBaseCalendarType[])[j][j][selectedDay[l]] = {
                  [selectedDay[l]]: {
                    status: "ON",
                    day: (dayBaseCalendar as DayBaseCalendarType[])[j][j][selectedDay[l]][selectedDay[l]].day,
                    date: (dayBaseCalendar as DayBaseCalendarType[])[j][j][selectedDay[l]][selectedDay[l]].date
                  }
                };
                disableorfalsecount--;
              }
            }
            if(disableorfalsecount===7) {
              weekchecker.push("ON-DISABLE");
            }
            else {
              weekchecker.push("ON")
            }
          }
          (yearholder as YearHolderType[])[p]["months"].push({
            month: selectedMonth[i],
            monthcalendar: dayBaseCalendar,
            weekchecker: weekchecker
          });
        }
      });
    }
  }
}

buildWeekTable();

let yearholders = ref();

yearholders.value = yearholder;

function dayClicked(_dayindex: string, _weekindex: string, _monthindex: string,  _yearindex: string) {
  
  let 
    yearindex = parseInt(_yearindex), monthindex = parseInt(_monthindex), weekindex = parseInt(_weekindex), dayindex = parseInt(_dayindex),
    allmonths = yearholders.value[yearindex].months,
    day = allmonths[monthindex].monthcalendar[weekindex][weekindex][dayindex],
    month = allmonths[monthindex];
  ;

  if(day[dayindex].status === 'OFF') {
    day[dayindex].status = "ON";
    if(weekindex === 0) {
      
      if(allmonths[monthindex].month > 0) {

        //check last week of previous month

        if((monthindex-1) >= 0) {
          if((allmonths[monthindex].month - allmonths[(monthindex-1)].month) === 1) {
            let 
              size = allmonths[(monthindex-1)].monthcalendar.length,
              size1 = allmonths[(monthindex-1)].weekchecker.length,
              week0 = allmonths[(monthindex-1)].monthcalendar[(size-1)][(size-1)],
              completeweek = true
            ;
            for(let i=0; i<week0.length; i++) {
              if(week0[i][i].status === 'DISABLE') {
                completeweek = false;
                break;
              }
            }
            if(!completeweek) {
              if(allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF') {
                allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON';
              }
              else {
                if(
                  allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF-DISABLE'
                ) {
                  allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON-DISABLE';
                }
              }
            }
          }
        }
        if(month.weekchecker[weekindex] === 'OFF') {
          month.weekchecker[weekindex] = 'ON';
        }
      }
      else {
        //check last week of previous year december
        if(yearindex > 0) {
          if((props.years[yearindex] - props.years[(yearindex-1)]) === 1) {
            let prevmonths = yearholders.value[(yearindex-1)].months;
            if(prevmonths[(prevmonths.length-1)].month === 11) {
              let 
                prevyeardec = prevmonths[(prevmonths.length-1)],
                prevyeardecmonthcalendar = prevyeardec.monthcalendar,
                prevyeardeclastweek = prevyeardecmonthcalendar[(prevyeardecmonthcalendar.length - 1)][(prevyeardecmonthcalendar.length - 1)],
                completeweek = true
              ;
              for(let i=0; i<prevyeardeclastweek.length; i++) {
                if(prevyeardeclastweek[i][i].status === 'DISABLE') {
                  completeweek = false;
                  break;
                }
              }
              if(!completeweek) {
                nextTick(() => {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                  if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'OFF') {
                    prevmonths[(prevmonths.length-1)].weekchecker[(prevyeardec.weekchecker.length-1)] = 'ON';
                  }
                  else {
                    if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'OFF-DISABLE') {
                      prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] = 'ON-DISABLE';
                    }
                  }
                });
              }
              else {
                nextTick(() => {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                });
              }
            }
            else {
              nextTick(() => {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              });
            }
          }
          else {
            nextTick(() => {
              if(month.weekchecker[weekindex] === 'OFF') {
                month.weekchecker[weekindex] = 'ON';
              }
            });
          }
        }
        else {
          nextTick(() => {
            if(month.weekchecker[weekindex] === 'OFF') {
              month.weekchecker[weekindex] = 'ON';
            }
          });
        }
      }
    }
    else {
      if(allmonths[monthindex].monthcalendar.length === (weekindex+1)) {
        //last week of the month
        if(allmonths[monthindex].month === 11) {
          //check week 0 of next year January
          if((yearindex + 1) < props.years.length) {
            if((props.years[(yearindex + 1)] - props.years[yearindex]) === 1) {
              let nextyearmonths = yearholders.value[(yearindex+1)].months;
              if(nextyearmonths[0].month === 0) {
                let 
                  nextyearjan = nextyearmonths[0].monthcalendar,
                  nextyearjanfirstweek = nextyearjan[0][0],
                  completeweek = true
                ;
                for(let i=0; i<nextyearjanfirstweek.length; i++) {
                  if(nextyearjanfirstweek[i][i].status === 'DISABLE') {
                    completeweek = false;
                    break;
                  }
                }
                if(!completeweek) {
                  nextTick(() => {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                    if(nextyearmonths[0].weekchecker[0] === 'OFF') {
                      nextyearmonths[0].weekchecker[0] = 'ON';
                    }
                    else {
                      if(nextyearmonths[0].weekchecker[0] === 'OFF-DISABLE') {
                        nextyearmonths[0].weekchecker[0] = 'ON-DISABLE';
                      }
                    }
                  });
                }
                else {
                  nextTick(() => {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                  });
                }
              }
              else {
                nextTick(() => {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                });
              }
            }
            else {
              nextTick(() => {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              });
            }
          }
          else {
            if(yearindex===0) {
              nextTick(() => {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              });
            }
          }
        }
        else {

          //check week 0 of monthindex+1 (next month)

          if((monthindex+1) < allmonths.length) {
            if((allmonths[(monthindex+1)].month - allmonths[monthindex].month) === 1) {
              let week0 = allmonths[(monthindex+1)].monthcalendar[0][0], completeweek = true;
              for(let i=0; i<week0.length; i++) {
                if(week0[i][i].status === 'DISABLE') {
                  completeweek = false;
                  break;
                }
              }
              if(!completeweek) {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
                if(allmonths[(monthindex+1)].weekchecker[0] === 'OFF') {
                  allmonths[(monthindex+1)].weekchecker[0] = 'ON';
                }
                else {
                  if(
                    allmonths[(monthindex+1)].weekchecker[0] === 'OFF-DISABLE'
                  ) {
                    allmonths[(monthindex+1)].weekchecker[0] = 'ON-DISABLE';
                  }
                }
              }
              else {
                month.weekchecker[weekindex] = 'ON';
              }
            }
            else {
              if(month.weekchecker[weekindex] === 'OFF') {
                month.weekchecker[weekindex] = 'ON';
              }
            }
          }
          else {
            if(month.weekchecker[weekindex] === 'OFF') {
              month.weekchecker[weekindex] = 'ON';
            }
          }
        }
      }
      else {
        if(month.weekchecker[weekindex] === 'OFF') {
          month.weekchecker[weekindex] = 'ON';
        }
      }
    }
  }
  else {
    if(day[dayindex].status === 'ON') {
      day[dayindex].status = "OFF";

      if(weekindex === 0) {
        if(allmonths[monthindex].month > 0) {

          //check last week of previous month

          if((monthindex-1) >= 0) {
            if((allmonths[monthindex].month - allmonths[(monthindex-1)].month) === 1) {
              let
                size = allmonths[(monthindex-1)].monthcalendar.length,
                size1 = allmonths[(monthindex-1)].weekchecker.length,
                week0 = allmonths[(monthindex-1)].monthcalendar[(size-1)][(size-1)],
                completeweek = true
              ;
              let onexistinpreviousmonth = false;
              for(let i=0; i<week0.length; i++) {
                if(week0[i][i].status === 'DISABLE') {
                  completeweek = false;
                }
                else {
                  if(week0[i][i].status === 'ON') {
                    onexistinpreviousmonth = true;
                  }
                }
              }
              if(!completeweek) {
                if(onexistinpreviousmonth) {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                  if(allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF') {
                    allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON';
                  }
                  else {
                    if(
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF-DISABLE'
                    ) {
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON-DISABLE';
                    }
                  }
                }
                else {
                  let onexist = false;
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      onexist = true;
                    }
                  });
                  if(!onexist) {
                    month.weekchecker[weekindex] = 'OFF';
                    if(
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'ON-DISABLE'
                    ) {
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'OFF-DISABLE';
                    }
                    else {
                      if(allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'ON') {
                        allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'OFF';
                      }
                    }
                  }
                  else {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                    if(allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF') {
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON';
                    }
                    else {
                      if(
                        allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF-DISABLE'
                      ) {
                        allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON-DISABLE';
                      }
                    }
                  }
                }
              }
              else {
                let onexist = false;
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    onexist = true;
                  }
                });
                if(!onexist) {
                  month.weekchecker[weekindex] = 'OFF';
                }
                else {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                }
              }
            }
            else {
              let onexist = false;
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'ON') {
                  onexist = true;
                }
              });
              if(!onexist) {
                month.weekchecker[weekindex] = 'OFF';
              }
              else {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              }
            }
          }
          else {
            let onexist = false;
            month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
              if(item[index].status === 'ON') {
                onexist = true;
              }
            });
            if(!onexist) {
              month.weekchecker[weekindex] = 'OFF';
            }
            else {
              if(month.weekchecker[weekindex] === 'OFF') {
                month.weekchecker[weekindex] = 'ON';
              }
            }
          }
        }
        else {
          //check last week of previous year december
          if(yearindex > 0) {
            if((props.years[yearindex] - props.years[(yearindex-1)]) === 1) {
              let prevmonths = yearholders.value[(yearindex-1)].months;
              if(prevmonths[(prevmonths.length-1)].month === 11) {
                let 
                  prevyeardec = prevmonths[(prevmonths.length-1)],
                  prevyeardecmonthcalendar = prevyeardec.monthcalendar,
                  prevyeardeclastweek = prevyeardecmonthcalendar[(prevyeardecmonthcalendar.length - 1)][(prevyeardecmonthcalendar.length - 1)],
                  completeweek = true,
                  onexistinpreviousmonth = false
                ;
                for(let i=0; i<prevyeardeclastweek.length; i++) {
                  if(prevyeardeclastweek[i][i].status === 'DISABLE') {
                    completeweek = false;
                  }
                  if(prevyeardeclastweek[i][i].status === 'ON') {
                    onexistinpreviousmonth = true;
                  }
                }
                if(!completeweek) {
                  if(onexistinpreviousmonth) {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                    if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'OFF') {
                      prevmonths[(prevmonths.length-1)].weekchecker[(prevyeardec.weekchecker.length-1)] = 'ON';
                    }
                    else {
                      if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'OFF-DISABLE') {
                        prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] = 'ON-DISABLE';
                      }
                    }
                  }
                  else {
                    nextTick(() => {
                      let onexist = false;
                      month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                        if(item[index].status === 'ON') {
                          onexist = true;
                        }
                      });
                      if(!onexist) {
                        month.weekchecker[weekindex] = 'OFF';
                        if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'ON') {
                          prevmonths[(prevmonths.length-1)].weekchecker[(prevyeardec.weekchecker.length-1)] = 'OFF';
                        }
                        else {
                          if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'ON-DISABLE') {
                            prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] = 'OFF-DISABLE';
                          }
                        }
                      }
                      else {
                        month.weekchecker[weekindex] = 'ON';
                        if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'OFF') {
                          prevmonths[(prevmonths.length-1)].weekchecker[(prevyeardec.weekchecker.length-1)] = 'ON';
                        }
                        else {
                          if(prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] === 'OFF-DISABLE') {
                            prevyeardec.weekchecker[(prevyeardec.weekchecker.length-1)] = 'ON-DISABLE';
                          }
                        }
                      }
                    });
                  }
                }
                else {
                  nextTick(() => {
                    let onexist = false;
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'ON') {
                        onexist = true;
                      }
                    });
                    if(!onexist) {
                      if(month.weekchecker[weekindex] === 'ON') {
                        month.weekchecker[weekindex] = 'OFF';
                      }
                    }
                    else {
                      if(month.weekchecker[weekindex] === 'OFF') {
                        month.weekchecker[weekindex] = 'ON';
                      }
                    }
                  });
                }
              }
            }
          }
          else {
            nextTick(() => {
              let onexist = false;
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'ON') {
                  onexist = true;
                }
              });
              if(!onexist) {
                month.weekchecker[weekindex] = 'OFF';
              }
              else {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              }
            });
          }
        }
      }
      else {
        if(allmonths[monthindex].monthcalendar.length === (weekindex+1)) {
          //last week of the month
          if(allmonths[monthindex].month === 11) {
            //check week 0 of next year january

            if((yearindex + 1) < props.years.length) {
              if((props.years[(yearindex + 1)] - props.years[yearindex]) === 1) {
                let nextyearmonths = yearholders.value[(yearindex+1)].months;
                if(nextyearmonths[0].month === 0) {
                  let 
                    nextyearjan = nextyearmonths[0].monthcalendar,
                    nextyearjanfirstweek = nextyearjan[0][0],
                    completeweek = true,
                    onexistinnextmonth = false
                  ;
                  for(let i=0; i<nextyearjanfirstweek.length; i++) {
                    if(nextyearjanfirstweek[i][i].status === 'DISABLE') {
                      completeweek = false;
                    }
                    if(nextyearjanfirstweek[i][i].status === 'ON') {
                      onexistinnextmonth = true;
                    }
                  }
                  if(!completeweek) {
                    if(!onexistinnextmonth) {
                      nextTick(() => {
                        let onexist = false;
                        month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                          if(item[index].status === 'ON') {
                            onexist = true;
                          }
                        });
                        if(!onexist) {
                          if(month.weekchecker[weekindex] === 'ON') {
                            month.weekchecker[weekindex] = 'OFF';
                          }
                          if(nextyearmonths[0].weekchecker[0] === 'ON') {
                            nextyearmonths[0].weekchecker[0] = 'OFF';
                          }
                          else {
                            if(nextyearmonths[0].weekchecker[0] === 'ON-DISABLE') {
                              nextyearmonths[0].weekchecker[0] = 'OFF-DISABLE';
                            }
                          }
                        }
                        else {
                          if(month.weekchecker[weekindex] === 'OFF') {
                            month.weekchecker[weekindex] = 'ON';
                          }
                          if(nextyearmonths[0].weekchecker[0] === 'OFF') {
                            nextyearmonths[0].weekchecker[0] = 'ON';
                          }
                          else {
                            if(nextyearmonths[0].weekchecker[0] === 'OFF-DISABLE') {
                              nextyearmonths[0].weekchecker[0] = 'ON-DISABLE';
                            }
                          }
                        }
                      });
                    }
                    else {
                      if(month.weekchecker[weekindex] === 'OFF') {
                        month.weekchecker[weekindex] = 'ON';
                      }
                      if(nextyearmonths[0].weekchecker[0] === 'OFF') {
                        nextyearmonths[0].weekchecker[0] = 'ON';
                      }
                      else {
                        if(nextyearmonths[0].weekchecker[0] === 'OFF-DISABLE') {
                          nextyearmonths[0].weekchecker[0] = 'ON-DISABLE';
                        }
                      }
                    }
                  }
                  else {
                    nextTick(() => {
                      let onexist = false;
                      month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                        if(item[index].status === 'ON') {
                          onexist = true;
                        }
                      });
                      if(!onexist) {
                        if(month.weekchecker[weekindex] === 'ON') {
                          month.weekchecker[weekindex] = 'OFF';
                        }
                      }
                      else {
                        if(month.weekchecker[weekindex] === 'OFF') {
                          month.weekchecker[weekindex] = 'ON';
                        }
                      }
                    });
                  }
                }
                else {
                  nextTick(() => {
                    let onexist = false;
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'ON') {
                        onexist = true;
                      }
                    });
                    if(!onexist) {
                      if(month.weekchecker[weekindex] === 'ON') {
                        month.weekchecker[weekindex] = 'OFF';
                      }
                    }
                    else {
                      if(month.weekchecker[weekindex] === 'OFF') {
                        month.weekchecker[weekindex] = 'ON';
                      }
                    }
                  });
                }
              }
              else {
                nextTick(() => {
                  let onexist = false;
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      onexist = true;
                    }
                  });
                  if(!onexist) {
                    if(month.weekchecker[weekindex] === 'ON') {
                      month.weekchecker[weekindex] = 'OFF';
                    }
                  }
                  else {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                  }
                });
              }
            }
            else {
              if(yearindex===0) {
                nextTick(() => {
                  let onexist = false;
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      onexist = true;
                    }
                  });
                  if(!onexist) {
                    if(month.weekchecker[weekindex] === 'ON') {
                      month.weekchecker[weekindex] = 'OFF';
                    }
                  }
                  else {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                  }
                });
              }
            }
          }
          else {

            //check week 0 of next month
            if((monthindex+1) < allmonths.length) {
              if((allmonths[(monthindex+1)].month - allmonths[monthindex].month) === 1) {
                let week0 = allmonths[(monthindex+1)].monthcalendar[0][0], completeweek = true;
                let onexistinnextmonth = false;
                for(let i=0; i<week0.length; i++) {
                  if(week0[i][i].status === 'DISABLE') {
                    completeweek = false;
                  }
                  if(week0[i][i].status === 'ON') {
                    onexistinnextmonth = true;
                  }
                }
                if(!completeweek) {
                  if(onexistinnextmonth) {
                    month.weekchecker[weekindex] = 'ON';

                    if(allmonths[(monthindex+1)].weekchecker[0] === 'OFF') {
                      allmonths[(monthindex+1)].weekchecker[0] = 'ON';
                    }
                    else {
                      if(
                        allmonths[(monthindex+1)].weekchecker[0] === 'OFF-DISABLE'
                      ) {
                        allmonths[(monthindex+1)].weekchecker[0] = 'ON-DISABLE';
                      }
                    }
                  }
                  else {
                    nextTick(() => {
                      let onexist = false;
                      month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                        if(item[index].status === 'ON') {
                          onexist = true;
                        }
                      });
                      if(!onexist) {
                        if(month.weekchecker[weekindex] === 'ON') {
                          month.weekchecker[weekindex] = 'OFF';
                        }
                        if(allmonths[(monthindex+1)].weekchecker[0] === 'ON') {
                          allmonths[(monthindex+1)].weekchecker[0] = 'OFF';
                        }
                        else {
                          if(
                            allmonths[(monthindex+1)].weekchecker[0] === 'ON-DISABLE'
                          ) {
                            allmonths[(monthindex+1)].weekchecker[0] = 'OFF-DISABLE';
                          }
                        }
                      }
                      else {
                        month.weekchecker[weekindex] = 'ON';
                        
                        if(allmonths[(monthindex+1)].weekchecker[0] === 'OFF') {
                          allmonths[(monthindex+1)].weekchecker[0] = 'ON';
                        }
                        else {
                          if(
                            allmonths[(monthindex+1)].weekchecker[0] === 'OFF-DISABLE'
                          ) {
                            allmonths[(monthindex+1)].weekchecker[0] = 'ON-DISABLE';
                          }
                        }
                      }
                    });
                  }
                }
                else {
                  nextTick(() => {
                    let onexist = false;
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'ON') {
                        onexist = true;
                      }
                    });
                    if(!onexist) {
                      if(month.weekchecker[weekindex] === 'ON') {
                        month.weekchecker[weekindex] = 'OFF';
                      }
                    }
                    else {
                      month.weekchecker[weekindex] = 'ON';
                    }
                  });
                }
              }
              else {
                nextTick(() => {
                  let onexist = false;
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      onexist = true;
                    }
                  });
                  if(!onexist) {
                    if(month.weekchecker[weekindex] === 'ON') {
                      month.weekchecker[weekindex] = 'OFF';
                    }
                  }
                  else {
                    month.weekchecker[weekindex] = 'ON';
                  }
                });
              }
            }
            else {
              nextTick(() => {
                let onexist = false;
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    onexist = true;
                  }
                });
                if(!onexist) {
                  if(month.weekchecker[weekindex] === 'ON') {
                    month.weekchecker[weekindex] = 'OFF';
                  }
                }
                else {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                }
              });
            }
          }
        }
        else {
          nextTick(() => {
            let onexist = false;
            month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
              if(item[index].status === 'ON') {
                onexist = true;
              }
            });
            if(!onexist) {
              if(month.weekchecker[weekindex] === 'ON') {
                month.weekchecker[weekindex] = 'OFF';
              }
            }
            else {
              if(month.weekchecker[weekindex] === 'OFF') {
                month.weekchecker[weekindex] = 'ON';
              }
            }
          });
        }
      }
    }
  }
}

function checkWeek(_weekindex: string, _monthindex: string, _yearindex: string) {
  
  let 
    yearindex = parseInt(_yearindex), monthindex = parseInt(_monthindex), weekindex = parseInt(_weekindex),
    allmonths = yearholders.value[yearindex].months,
    month = allmonths[monthindex];
  ;
  
  if(month.weekchecker[weekindex] === 'ON') {
    nextTick(() => {
      if(weekindex === 0) {
        if(allmonths[monthindex].month > 0) {

          //check last week of previous month

          if((monthindex-1) >= 0) {
            if((allmonths[monthindex].month - allmonths[(monthindex-1)].month) === 1) {
              let
                size = allmonths[(monthindex-1)].monthcalendar.length,
                size1 = allmonths[(monthindex-1)].weekchecker.length,
                week0 = allmonths[(monthindex-1)].monthcalendar[(size-1)][(size-1)],
                completeweek = true
              ;
              for(let i=0; i<week0.length; i++) {
                if(week0[i][i].status === 'DISABLE') {
                  completeweek = false;
                  break;
                }
              }
              if(!completeweek) {
                for(let i=0; i<week0.length; i++) {
                  if(week0[i][i].status === 'ON') {
                    week0[i][i].status = 'OFF';
                  }
                }
                if(
                  allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'ON-DISABLE'
                ) {
                  allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'OFF-DISABLE';
                }
                else {
                  if(allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'ON') {
                    allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'OFF';
                  }
                }
                if(month.weekchecker[weekindex] === 'ON') {
                  month.weekchecker[weekindex] = 'OFF';
                }
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    item[index].status = 'OFF';
                  }
                });
              }
              else {
                if(month.weekchecker[weekindex] === 'ON') {
                  month.weekchecker[weekindex] = 'OFF';
                }
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    item[index].status = 'OFF';
                  }
                });
              }
            }
            else {
              if(month.weekchecker[weekindex] === 'ON') {
                month.weekchecker[weekindex] = 'OFF';
              }
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'ON') {
                  item[index].status = 'OFF';
                }
              });
            }
          }
          else {
            if(month.weekchecker[weekindex] === 'ON') {
              month.weekchecker[weekindex] = 'OFF';
            }
            month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
              if(item[index].status === 'ON') {
                item[index].status = 'OFF';
              }
            });
          }
        }
        else {
          //check last week of previous year december
          if(yearindex > 0) {
            if((props.years[yearindex] - props.years[(yearindex-1)]) === 1) {
              let prevmonths = yearholders.value[(yearindex-1)].months;
              if(prevmonths[(prevmonths.length-1)].month === 11) {
                let 
                  prevyeardec = prevmonths[(prevmonths.length-1)].monthcalendar,
                  prevyeardeclastweek = prevyeardec[(prevyeardec.length - 1)][(prevyeardec.length - 1)],
                  completeweek = false
                ;
                for(let i=0; i<prevyeardeclastweek.length; i++) {
                  if(prevyeardeclastweek[i][i].status === 'DISABLE') {
                    completeweek = false;
                    break;
                  }
                }
                if(!completeweek) {
                  for(let i=0; i<prevyeardeclastweek.length; i++) {
                    if(prevyeardeclastweek[i][i].status === 'ON') {
                      prevyeardeclastweek[i][i].status = 'OFF';
                    }
                  }
                  if(prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]==='ON') {
                    prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]='OFF';
                  }
                  else {
                    if(prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]==='ON-DISABLE') {
                      prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]='OFF-DISABLE';
                    }
                  }
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      item[index].status = 'OFF';
                    }
                  });
                  if(month.weekchecker[weekindex] === 'ON') {
                    month.weekchecker[weekindex] = 'OFF';
                  }
                }
                else {
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      item[index].status = 'OFF';
                    }
                  });
                  if(month.weekchecker[weekindex] === 'ON') {
                    month.weekchecker[weekindex] = 'OFF';
                  }
                }
              }
              else {
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    item[index].status = 'OFF';
                  }
                });
                if(month.weekchecker[weekindex] === 'ON') {
                  month.weekchecker[weekindex] = 'OFF';
                }
              }
            }
            else {
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'ON') {
                  item[index].status = 'OFF';
                }
              });
              if(month.weekchecker[weekindex] === 'ON') {
                month.weekchecker[weekindex] = 'OFF';
              }
            }
          }
          else {
            month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
              if(item[index].status === 'ON') {
                item[index].status = 'OFF';
              }
            });
            if(month.weekchecker[weekindex] === 'ON') {
              month.weekchecker[weekindex] = 'OFF';
            }
          }
        }
      }
      else {
        if(allmonths[monthindex].monthcalendar.length === (weekindex+1)) {
          //last week of the month
          if(allmonths[monthindex].month  === 11) {
            //check against next year+1 january

            if((yearindex + 1) < props.years.length) {
              if((props.years[(yearindex + 1)] - props.years[yearindex]) === 1) {
                let nextyearmonths = yearholders.value[(yearindex+1)].months;
                if(nextyearmonths[0].month === 0) {
                  let 
                    nextyearjan = nextyearmonths[0].monthcalendar,
                    nextyearjanfirstweek = nextyearjan[0][0],
                    completeweek = true
                  ;
                  for(let i=0; i<nextyearjanfirstweek.length; i++) {
                    if(nextyearjanfirstweek[i][i].status === 'DISABLE') {
                      completeweek = false;
                      break;
                    }
                  }
                  if(!completeweek) {
                    for(let i=0; i<nextyearjanfirstweek.length; i++) {
                      if(nextyearjanfirstweek[i][i].status === 'ON') {
                        nextyearjanfirstweek[i][i].status = 'OFF';
                      }
                    }
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'ON') {
                        item[index].status = 'OFF';
                      }
                    });
                    if(month.weekchecker[weekindex] === 'ON') {
                      month.weekchecker[weekindex] = 'OFF';
                    }
                    if(nextyearmonths[0].weekchecker[0] === 'ON') {
                      nextyearmonths[0].weekchecker[0] = 'OFF';
                    }
                    else {
                      if(nextyearmonths[0].weekchecker[0] === 'ON-DISABLE') {
                        nextyearmonths[0].weekchecker[0] = 'OFF-DISABLE';
                      }
                    }
                  }
                  else {
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'ON') {
                        item[index].status = 'OFF';
                      }
                    });
                    if(month.weekchecker[weekindex] === 'ON') {
                      month.weekchecker[weekindex] = 'OFF';
                    }
                  }
                }
              }
              else {
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    item[index].status = 'OFF';
                  }
                });
                if(month.weekchecker[weekindex] === 'ON') {
                  month.weekchecker[weekindex] = 'OFF';
                }
              }
            }
            else {
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'ON') {
                  item[index].status = 'OFF';
                }
              });
              if(month.weekchecker[weekindex] === 'ON') {
                month.weekchecker[weekindex] = 'OFF';
              }
            }
          }
          else {

            //check against next monthindex+1 week 0

            if((monthindex+1) < allmonths.length) {
              if((allmonths[(monthindex+1)].month - allmonths[monthindex].month) === 1) {
                let week0 = allmonths[(monthindex+1)].monthcalendar[0][0], completeweek = true;
                for(let i=0; i<week0.length; i++) {
                  if(week0[i][i].status === 'DISABLE') {
                    completeweek = false;
                    break;
                  }
                }
                if(!completeweek) {
                  for(let i=0; i<week0.length; i++) {
                    if(week0[i][i].status === 'ON') {
                      week0[i][i].status = 'OFF';
                    }
                  }
                  if(
                    allmonths[(monthindex+1)].weekchecker[0] === 'ON-DISABLE'
                  ) {
                    allmonths[(monthindex+1)].weekchecker[0] = 'OFF-DISABLE';
                  }
                  else {
                    if(allmonths[(monthindex+1)].weekchecker[0] === 'ON') {
                      allmonths[(monthindex+1)].weekchecker[0] = 'OFF';
                    }
                  }
                  if(month.weekchecker[weekindex] === 'ON') {
                    month.weekchecker[weekindex] = 'OFF';
                  }
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      item[index].status = 'OFF';
                    }
                  });
                }
                else {
                  if(month.weekchecker[weekindex] === 'ON') {
                    month.weekchecker[weekindex] = 'OFF';
                  }
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'ON') {
                      item[index].status = 'OFF';
                    }
                  });
                }
              }
              else {
                if(month.weekchecker[weekindex] === 'ON') {
                  month.weekchecker[weekindex] = 'OFF';
                }
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'ON') {
                    item[index].status = 'OFF';
                  }
                });
              }
            }
            else {
              if(month.weekchecker[weekindex] === 'ON') {
                month.weekchecker[weekindex] = 'OFF';
              }
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'ON') {
                  item[index].status = 'OFF';
                }
              });
            }
          }
        }
        else {
          if(month.weekchecker[weekindex] === 'ON') {
            month.weekchecker[weekindex] = 'OFF';
          }
          month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
            if(item[index].status === 'ON') {
              item[index].status = 'OFF';
            }
          });
        }
      }
    });
  }
  else {
    if(month.weekchecker[weekindex] === 'OFF') {
      nextTick(() => {
        if(weekindex === 0) {
          if(allmonths[monthindex].month  > 0) {

            //check last week of previous month

            if((monthindex-1) >= 0) {
              if((allmonths[monthindex].month - allmonths[(monthindex-1)].month) === 1) {
                let 
                  size = allmonths[(monthindex-1)].monthcalendar.length,
                  size1 = allmonths[(monthindex-1)].weekchecker.length,
                  week0 = allmonths[(monthindex-1)].monthcalendar[(size-1)][(size-1)],
                  completeweek = true
                ;
                for(let i=0; i<week0.length; i++) {
                  if(week0[i][i].status === 'DISABLE') {
                    completeweek = false;
                    break;
                  }
                }
                if(!completeweek) {
                  for(let i=0; i<week0.length; i++) {
                    if(week0[i][i].status === 'OFF') {
                      week0[i][i].status = 'ON';
                    }
                  }
                  if(allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF') {
                    allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON';
                  }
                  else {
                    if(
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] === 'OFF-DISABLE'
                    ) {
                      allmonths[(monthindex-1)].weekchecker[(size1-1)] = 'ON-DISABLE';
                    }
                  }
                  
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }

                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'OFF') {
                      item[index].status = 'ON';
                    }
                  });
                }
                else {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }

                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'OFF') {
                      item[index].status = 'ON';
                    }
                  });
                }
              }
              else {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'OFF') {
                    item[index].status = 'ON';
                  }
                });
              }
            }
            else {
              if(month.weekchecker[weekindex] === 'OFF') {
                month.weekchecker[weekindex] = 'ON';
              }
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'OFF') {
                  item[index].status = 'ON';
                }
              });
            }
          }
          else {
            //check last week of previous year december
            if(yearindex > 0) {
              if((props.years[yearindex] - props.years[(yearindex-1)]) === 1) {
                let prevmonths = yearholders.value[(yearindex-1)].months;
                if(prevmonths[(prevmonths.length-1)].month === 11) {
                  let 
                    prevyeardec = prevmonths[(prevmonths.length-1)].monthcalendar,
                    prevyeardeclastweek = prevyeardec[(prevyeardec.length - 1)][(prevyeardec.length - 1)],
                    completeweek = true
                  ;
                  for(let i=0; i<prevyeardeclastweek.length; i++) {
                    if(prevyeardeclastweek[i][i].status === 'DISABLE') {
                      completeweek = false;
                      break;
                    }
                  }
                  if(!completeweek) {
                    for(let i=0; i<prevyeardeclastweek.length; i++) {
                      if(prevyeardeclastweek[i][i].status === 'OFF') {
                        prevyeardeclastweek[i][i].status = 'ON';
                      }
                    }
                    if(prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]==='OFF') {
                      prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]='ON';
                    }
                    else {
                      if(prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]==='OFF-DISABLE') {
                        prevmonths[(prevmonths.length-1)].weekchecker[(prevmonths[(prevmonths.length-1)].weekchecker.length-1)]='ON-DISABLE';
                      }
                    }
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'OFF') {
                        item[index].status = 'ON';
                      }
                    });
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                  }
                  else {
                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'OFF') {
                        item[index].status = 'ON';
                      }
                    });
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }
                  }
                }
                else {
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'OFF') {
                      item[index].status = 'ON';
                    }
                  });
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                }
              }
              else {
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'OFF') {
                    item[index].status = 'ON';
                  }
                });
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              }
            }
            else {
              month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                if(item[index].status === 'OFF') {
                  item[index].status = 'ON';
                }
              });
              if(month.weekchecker[weekindex] === 'OFF') {
                month.weekchecker[weekindex] = 'ON';
              }
            }
          }
        }
        else {
          if(allmonths[monthindex].monthcalendar.length === (weekindex+1)) {
            //last week of the month
            if(allmonths[monthindex].month === 11) {
              //check against next year+1 january

              if((yearindex + 1) < props.years.length) {
                if((props.years[(yearindex + 1)] - props.years[yearindex]) === 1) {
                  let nextyearmonths = yearholders.value[(yearindex+1)].months;
                  if(nextyearmonths[0].month === 0) {
                    let 
                      nextyearjan = nextyearmonths[0].monthcalendar,
                      nextyearjanfirstweek = nextyearjan[0][0],
                      completeweek = true
                    ;
                    for(let i=0; i<nextyearjanfirstweek.length; i++) {
                      if(nextyearjanfirstweek[i][i].status === 'DISABLE') {
                        completeweek = false;
                        break;
                      }
                    }
                    if(!completeweek) {
                      for(let i=0; i<nextyearjanfirstweek.length; i++) {
                        if(nextyearjanfirstweek[i][i].status === 'OFF') {
                          nextyearjanfirstweek[i][i].status = 'ON';
                        }
                      }
                      month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                        if(item[index].status === 'OFF') {
                          item[index].status = 'ON';
                        }
                      });
                      if(month.weekchecker[weekindex] === 'OFF') {
                        month.weekchecker[weekindex] = 'ON';
                      }
                      if(nextyearmonths[0].weekchecker[0] === 'OFF') {
                        nextyearmonths[0].weekchecker[0] = 'ON';
                      }
                      else {
                        if(nextyearmonths[0].weekchecker[0] === 'OFF-DISABLE') {
                          nextyearmonths[0].weekchecker[0] = 'ON-DISABLE';
                        }
                      }
                    }
                    else {
                      month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                        if(item[index].status === 'OFF') {
                          item[index].status = 'ON';
                        }
                      });
                      if(month.weekchecker[weekindex] === 'OFF') {
                        month.weekchecker[weekindex] = 'ON';
                      }
                    }
                  }
                }
                else {
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'OFF') {
                      item[index].status = 'ON';
                    }
                  });
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                }
              }
              else {
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'OFF') {
                    item[index].status = 'ON';
                  }
                });
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
              }
            }
            else {

              //check against next monthindex+1 week 0

              if((monthindex+1) < allmonths.length) {
                if((allmonths[(monthindex+1)].month - allmonths[monthindex].month) === 1) {
                  let week0 = allmonths[(monthindex+1)].monthcalendar[0][0], completeweek = true;
                  for(let i=0; i<week0.length; i++) {
                    if(week0[i][i].status === 'DISABLE') {
                      completeweek = false;
                      break;
                    }
                  }
                  if(!completeweek) {
                    for(let i=0; i<week0.length; i++) {
                      if(week0[i][i].status === 'OFF') {
                        week0[i][i].status = 'ON';
                      }
                    }
                    if(allmonths[(monthindex+1)].weekchecker[0] === 'OFF') {
                      allmonths[(monthindex+1)].weekchecker[0] = 'ON';
                    }
                    else {
                      if(
                        allmonths[(monthindex+1)].weekchecker[0] === 'OFF-DISABLE'
                      ) {
                        allmonths[(monthindex+1)].weekchecker[0] = 'ON-DISABLE';
                      }
                    }

                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }

                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'OFF') {
                        item[index].status = 'ON';
                      }
                    });
                  }
                  else {
                    if(month.weekchecker[weekindex] === 'OFF') {
                      month.weekchecker[weekindex] = 'ON';
                    }

                    month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                      if(item[index].status === 'OFF') {
                        item[index].status = 'ON';
                      }
                    });
                  }
                }
                else {
                  if(month.weekchecker[weekindex] === 'OFF') {
                    month.weekchecker[weekindex] = 'ON';
                  }
                  month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                    if(item[index].status === 'OFF') {
                      item[index].status = 'ON';
                    }
                  });
                }
              }
              else {
                if(month.weekchecker[weekindex] === 'OFF') {
                  month.weekchecker[weekindex] = 'ON';
                }
                month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
                  if(item[index].status === 'OFF') {
                    item[index].status = 'ON';
                  }
                });
              }
            }
          }
          else {
            if(month.weekchecker[weekindex] === 'OFF') {
              month.weekchecker[weekindex] = 'ON';
            }
            month.monthcalendar[weekindex][weekindex].forEach((item: any, index: number) => {
              if(item[index].status === 'OFF') {
                item[index].status = 'ON';
              }
            });
          }
        }
      });
    }
  }
}

function getWeekNumber(_weekindex: string, _monthindex: string, _yearindex: string) {

  let yearindex = parseInt(_yearindex), monthindex = parseInt(_monthindex), weekindex = parseInt(_weekindex), allmonths = yearholders.value[yearindex].months[monthindex];

  if(monthindex === 0) {
    return (weekindex + 1) * (monthindex + 1);
  }
  else {
    let sum = 0;
    for(let i=0; i<allmonths.length; i++) {
      if(i===monthindex) {
        break;
      }
      sum+=allmonths[i].monthcalendar.length;
    }
    if(monthindex>1) {
      sum-=(monthindex-1);
    }
    return sum + weekindex;
  }
}

</script>

<template>
  <div class="d-block">
    <div class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center" style="padding:5px 0;background-color: lightgray;border: 1px solid gray;">
      <div class="flex-w-10" style="height:25px;float:left;">
        <div class="d-inline-block" style="clear:left;">
          <a style="height:25px;width:25px;border-radius:50%;background-color:green;" class="flex-box align-items-center justify-content-center cursor-pointer text-center">
            <svg class="shadow" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:20px;width:20px;color:#fff;stroke: currentcolor;fill: currentcolor;">
              <path d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="letter-spacing flex-w-80 align-middle text-center">
        Exclude Dates
      </div>
      <div class="flex-w-10 align-middle" style="height:25px;float:right;">
        <div class="d-inline-block" style="clear:right;">
          <a style="height:25px;width:25px;border-radius:50%;background-color:green;" class="flex-box align-items-center justify-content-center cursor-pointer text-center">
            <svg class="shadow" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:20px;width:20px;color:#fff;stroke: currentcolor;fill: currentcolor;">
              <path d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center" style="background-color:#fff;">
      <div v-for="(year, index) in yearholders" :key="'year'+index" :class="[(yearholders.length > 1)?'flex-w-50':'flex-w-100']">
        <div class="d-block text-center">
          <span style="font-size:11.5px;" class="align-middle d-inline-block letter-spacing font-bold">{{ year.year }}</span>
        </div>
        <div class="d-block text-center" v-for="(month, monthindex) in year.months" :key="'month'+monthindex" style="height:240px;background-color:lightgray;">
          <div class="d-block">
            <span style="font-size:11.5px;" class="align-middle d-inline-block letter-spacing">{{ months[month.month] }}</span>
          </div>
          <template v-for="allweeks in month.monthcalendar">
            <div class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center position-relative" style="padding:0 2.5px;">
              <template v-for="(week, weekindex) in allweeks">
                <div class="flex-shrink-0 flex-grow-0 position-absolute" style="padding-top:4.5px;padding-left:2.5px;z-index:900;">
                  <input :name="'Week_'+year.year+'_' + getWeekNumber(''+weekindex, ''+monthindex, ''+index)" :title="'Week ' + getWeekNumber(''+weekindex, ''+monthindex, ''+index)" @click="checkWeek(''+weekindex, ''+monthindex, ''+index)" type="checkbox" style="width:15px;height:15px;" :disabled="(month.weekchecker[weekindex]==='OFF-DISABLE' || month.weekchecker[weekindex]==='ON-DISABLE')? true : false" :checked="(month.weekchecker[weekindex]==='OFF' || month.weekchecker[weekindex]==='OFF-DISABLE')? false : true" class="align-middle" />
                </div>
                <div class="flex-w-100" style="padding-left:20px;z-index:800;">
                  <div class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center">
                    <div class="flex-w-14-dot-285714 overflow-hidden" v-for="(day, dayindex) in week" :key="'day'+dayindex" :style="day[dayindex].status==='OFF'? 'background-color:#104068;' : (day[dayindex].status==='ON'? 'background-color:green;' : (day[dayindex].status==='FALSE'? 'background-color: gray;' : 'background-color: transparent;'))" style="border-radius: 4px;border: 1px solid #fff;float: left;">
                      <label class="w-100" style="float:left;line-height:2.0em;height:2.0em;">
                        <input :disabled="(day[dayindex].status==='FALSE' || day[dayindex].status==='DISABLE')? true: false" @click="dayClicked(''+dayindex, ''+weekindex, ''+monthindex, ''+index)" type="checkbox" class="position-absolute d-none" style="color:#fff !important;">
                        <span class="text-center d-block letter-spacing" style="font-size: 11.5px;">{{ day[dayindex].day }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100" style="padding:5px 0;background-color: lightgray;border: 1px solid gray;">
      <div class="flex-w-10 align-middle" style="height:25px;float:left;">
        <div class="d-inline-block" style="clear:left;">
          <a style="height:25px;width:25px;border-radius:50%;background-color:green;" class="flex-box align-items-center justify-content-center cursor-pointer text-center">
            <svg class="shadow" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:20px;width:20px;color:#fff;stroke: currentcolor;fill: currentcolor;">
              <path d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex-w-80 align-middle text-center">
        Exclude Dates
      </div>
      <div class="flex-w-10 align-middle" style="height:25px;float:right;">
        <div class="d-inline-block" style="clear:right;">
          <a style="height:25px;width:25px;border-radius:50%;background-color:green;" class="flex-box align-items-center justify-content-center cursor-pointer text-center">
            <svg class="shadow" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:20px;width:20px;color:#fff;stroke: currentcolor;fill: currentcolor;">
              <path d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
label input + span{color: #fff;}

/* This will declare how a selected input will look giving generic properties */
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0  6px rgba(0, 0, 0, 0.8);
}
</style>