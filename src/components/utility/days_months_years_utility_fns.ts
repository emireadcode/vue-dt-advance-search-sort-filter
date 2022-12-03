import { nextTick, triggerRef, } from "vue";
import type { YearRangeFirstSelectionType, YearSelectionType, MonthSelectionType, DaySelectionType, } from '../types/days_months_years_types';
import type { ShallowRef, Ref } from "vue";

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

export function getMonthDimensions(months: ShallowRef<MonthSelectionType>) {
  nextTick(() => {
    for(let row in months.value) {
      for(let col in months.value[row]) {
        if((months.value[row][col] as MonthSelectionType[number][number][number][number]).ref) {
          let offset = getOffset((months.value[row][col] as MonthSelectionType[number][number][number][number]).ref);
          if (offset) {
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).x1 = offset.x1;
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).y1 = offset.y1;
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).x2 = offset.x2;
            (months.value[row][col] as MonthSelectionType[number][number][number][number]).y2 = offset.y2;
          }
        }
      }
    }
    triggerRef(months);
  });
}

export function getDayDimensions(days: ShallowRef<DaySelectionType>) {
  nextTick(() => {
    for(let day in days.value) {
      if((days.value[day] as unknown as DaySelectionType[number][number]).ref) {
        let offset = getOffset((days.value[day] as unknown as DaySelectionType[number][number]).ref);
        if (offset) {
          (days.value[day] as unknown as DaySelectionType[number][number]).x1 = offset.x1;
          (days.value[day] as unknown as DaySelectionType[number][number]).y1 = offset.y1;
          (days.value[day] as unknown as DaySelectionType[number][number]).x2 = offset.x2;
          (days.value[day] as unknown as DaySelectionType[number][number]).y2 = offset.y2;
        }
      }
    }
    triggerRef(days);
  });
}

export function getYearDimensions(years: ShallowRef<YearSelectionType>, page: Ref<number>) {
  nextTick(() => {
    for(let row in years.value[page.value]) {
      for(let col in years.value[page.value][row]) {
        if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number]).ref) {
          let offset = getOffset((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).ref);
          if (offset) {
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1 = offset.x1;
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y1 = offset.y1;
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2 = offset.x2;
            (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y2 = offset.y2;
          }
        }
      }
    }
    triggerRef(years);
  });
}

export function calculateRemainder(max: number, min: number) {
  let diff = max - min, quotient = parseInt(""+(diff/15));
  return (((quotient + 1)*15) - diff) - 1;
}

export function whereisMouse(pointx: number, pointy: number, page: Ref<number>, years: ShallowRef<YearSelectionType>) {
  let result = {page: -1, year: -1, status: "DISABLE"}, found = false;
  for(let row in years.value[page.value]) {
    for(let col in years.value[page.value][row]) {
      if(
        (
          parseInt(row) === 0
          && (
            pointy <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y1
            &&
            pointx >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1
            &&
            pointx <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2
          )
        )
        ||
        (
          parseInt(row) === Object.keys(years.value[page.value]).length - 1
          &&
          pointx >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1
          &&
          pointx <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2
        )
        ||
        (
          parseInt(row) !== Object.keys(years.value[page.value]).length - 1
          && (
            pointx >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x1
            &&
            pointx <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).x2
            &&
            pointy >= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y1
            &&
            pointy <= (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).y2
          )
        )
      ) {
        result = {
          page: page.value,
          year: (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year,
          status: (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status,
        };
        found = true;
        break;
      }
    }
    if(found) break;
  }
  return result;
}

export function mouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, event: { pageX: any; pageY: any; }, loadingMovement: Ref<boolean>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (format.value === "RANGE") {
        if (rangefirstselection.value.year > -1) {
          let mousePointed = whereisMouse(event.pageX, event.pageY, page, years);
          if(mousePointed.status === "ENABLE" && mousePointed.year > -1 && mousePointed.page > -1) {
            for(let p in years.value) {
              for(let row in years.value[p]) {
                for(let col in years.value[p][row]) {
                  if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year > rangefirstselection.value.year) {
                    if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year <= mousePointed.year) {
                      (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'HIGHLIGHTED';
                    }
                    else {
                      if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'HIGHLIGHTED') {
                        (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                      }
                    }
                  }
                  else {
                    if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year < rangefirstselection.value.year) {
                      if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year >= mousePointed.year) {
                        (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'HIGHLIGHTED';
                      }
                      else {
                        if((years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'HIGHLIGHTED') {
                          (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
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
    triggerRef(years);
  });
}

export function unTrackYearBoxMouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, loadingMovement: Ref<boolean>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  if (document.getElementById("yearbox")) {
    (document
      .getElementById("yearbox") as HTMLDivElement)
      .removeEventListener("mousemove", (event) => { mouseMovement(page, years, rangefirstselection, event, loadingMovement, format); }, true);
  }
}

export function trackYearBoxMouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, loadingMovement: Ref<boolean>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  if (document.getElementById("yearbox")) {
    (document.getElementById("yearbox") as HTMLDivElement).addEventListener("mousemove", (event) => { mouseMovement(page, years, rangefirstselection, event, loadingMovement, format); }, true);
  }
}

export function deselectAll(years: ShallowRef<YearSelectionType>) {
  for(let p in years.value) {
    for(let row in years.value[p]) {
      for(let col in years.value[p][row]) {
        (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
      }
    }
  }
  triggerRef(years);
}

export function addYear(page: Ref<number>, rangefirstselection: Ref<YearRangeFirstSelectionType> | undefined, loadingMovement: Ref<boolean> | undefined, rangecount: Ref<number> | undefined, multipleselectcount: Ref<number> | undefined, year: number, clickedorpasted: boolean, years: ShallowRef<YearSelectionType>, format: Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">) {
  let found = false;
  for(let p in years.value) {
    for(let row in years.value[p]) {
      for(let col in years.value[p][row]) {
        if(year === (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year) {
          if(format.value === 'RANGE') {
            if(rangecount && rangefirstselection && loadingMovement) {
              if(rangecount.value < 2) {
                if((years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'DESELECTED' || (years.value[page.value][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'HIGHLIGHTED') {
                  (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                  rangecount.value++;
                  if(rangecount.value === 1) {
                    rangefirstselection.value = { page: parseInt(p), year };
                    trackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                  }
                  else {
                    unTrackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                    rangefirstselection.value = { page: -1, year: -1 };
                  }
                }
                else {
                  (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                  rangefirstselection.value = { page: -1, year: -1 };
                  rangecount.value = 0;
                  unTrackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                }
              }
              else {
                deselectAll(years);
                rangecount.value = 1;
                (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                rangefirstselection.value = { page: parseInt(p), year };
                trackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
              }
            }
          }
          else {
            if(clickedorpasted) {
              if((years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'DESELECTED') {
                (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                if(multipleselectcount) {
                  multipleselectcount.value++;
                }
              }
              else {
                (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'DESELECTED';
                if(multipleselectcount) {
                  multipleselectcount.value--;
                }
              }
            }
            else {
              (years.value[p][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
              page.value = parseInt(p);
            }
          }
          found = true;
          break;
        }
      }
      if(found) break;
    }
    if(found) break;
  }
  
  triggerRef(years);
}
