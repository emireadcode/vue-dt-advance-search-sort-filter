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
  handleTyTm,
  weekHasHighlightedOrSelected,
  mouseMovement,
  clickBackward,
  clickForward,
  assignRef,
  findRangeSelectionMaxAndMinDate,
  getDimensions,
  handleDateSelectHighlightDeselect,
  weekHasEnable,
  selectOrDeselectDaysInWeekForMultipleSelection,
  highlightOrDeselectDaysInWeekForRangeSelection,
  fillVisibleCalendarArray,
  resetSelections,
} from "../utility/dd_mm_yy_utility_fns";

const 
  props = defineProps<{
    resetcalendarsignal?: number | undefined;
    selections: DateType['search']['dd_mm_yyyy']['dates'] | DateType['search']['days_months_years']['dates'];
    excludedates?: boolean | undefined;
    isoweek: boolean;
    selectionformat: 'RANGE' | 'MULTIPLE-OR-SINGLE';
    mindate: string;
    maxdate: string;
    from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY'
  }>(),
  emits = defineEmits<{
    (e: "enable:excludebutton", action: boolean): void;
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
  multipleselectcount = ref(0),
  rangeselectionparams = shallowRef<RangeSelectionParamsType>({
    rangefirstselection: {
      date: '',
      year: 0,
      month: 0,
      day: 0,
      week: 0,
    },
    rangelastselection: {
      date: '',
      year: 0,
      month: 0,
      day: 0,
      week: 0,
    },
    rangeselectcount: 0,
    inselectionmode: true,
    excludedates: props.excludedates as boolean,
  })
;

let
  unwatchselectionformat: WatchStopHandle,
  unwatchrangeselectcount: WatchStopHandle,
  unwatchexcludedates: WatchStopHandle,
  unwatchresetcalendarsignal: WatchStopHandle,
  maxdate = '',
  mindate = ''
;

function handleTyTmClicked(
  tytmtype: 'TM-CURRENT-SELECTIONS' | 'TM-PREVIOUS-SELECTIONS' | 'TY' | 'TM-CURRENT' | 'TM-PREVIOUS',
  tytmindex: number, 
  checkedornot: boolean,
  year: number,
  month?: number | undefined
) {
  handleTyTm(
    visiblecalendar as ShallowRef<VisibleCalendarType>,
    tytmtype,
    tytmindex, 
    checkedornot,
    year,
    month
  );
}

function weekCheckboxClicked(checked: boolean, weekindex: string, vcalendartype: 'PREVIOUS' | 'CURRENT') {
  let 
    year = vcalendartype === 'PREVIOUS'?
      ((visiblecalendar.value as VisibleCalendarType).previous as YearMonthClickable<PositionTrackerType>).year
      :
      ((visiblecalendar.value as VisibleCalendarType).current as YearMonthClickable<PositionTrackerType>).year,
    month = vcalendartype === 'PREVIOUS'?
      ((visiblecalendar.value as VisibleCalendarType).previous as YearMonthClickable<PositionTrackerType>).month
      :
      ((visiblecalendar.value as VisibleCalendarType).current as YearMonthClickable<PositionTrackerType>).month,
    week = parseInt(weekindex)
  ;
  if(
    props.selectionformat === 'RANGE'
    &&
    year in (visiblecalendar.value as VisibleCalendarType).selections
    &&
    month in (visiblecalendar.value as VisibleCalendarType).selections[year].months
  ) {
    nextTick(() => {
      highlightOrDeselectDaysInWeekForRangeSelection(
        checked as boolean,
        year,
        month,
        week,
        rangeselectionparams.value.rangefirstselection as RangeFirstAndLastSelectionType,
        rangeselectionparams.value.rangelastselection as RangeFirstAndLastSelectionType,
        visiblecalendar as ShallowRef<VisibleCalendarType>,
        'WEEK-BOX'
      );
    });
  }
  else {
    selectOrDeselectDaysInWeekForMultipleSelection(
      props.from,
      checked as boolean,
      year,
      month,
      week,
      visiblecalendar as ShallowRef<VisibleCalendarType>,
      'WEEK-BOX',
      props.isoweek,
      mindate,
      maxdate
    );
  }
}

function handleDateClick(day: YearMonthClickable<PositionTrackerType>['calendar']['weeks'][number]['days'][number]) {
  if(day.status === 'ENABLE') {
    if(!(rangeselectionparams.value as RangeSelectionParamsType).inselectionmode) {
      (rangeselectionparams.value as RangeSelectionParamsType).inselectionmode = true;
      triggerRef(rangeselectionparams);
    }
    nextTick(() => {
      if(props.selectionformat === 'RANGE') {
        handleDateSelectHighlightDeselect(
          props.from,
          rangeselectionparams as ShallowRef<RangeSelectionParamsType>,
          props.isoweek,
          props.selectionformat,
          day.date,
          true,
          mindate as string,
          maxdate as string,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        );
      }
      else {
        handleDateSelectHighlightDeselect(
          props.from,
          multipleselectcount,
          props.isoweek,
          props.selectionformat,
          day.date,
          true,
          props.mindate,
          props.maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        );
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
  if(props.excludedates) {
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).selections = resetSelections(
        'SELECTIONS', 
        (visiblecalendar.value as VisibleCalendarType).selections as VisibleCalendarType['selections'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as VisibleCalendarType['selections'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).previous.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).current.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    triggerRef(visiblecalendar);
  }
  if(props.from === 'DAYS-MONTHS-YEARS') {
    if((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).current.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
        }
      }
    }
    if((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).previous.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
        }
      }
    }
  }
}

function clickPrevious() {
  clickBackward(
    props.isoweek, 
    maxdate, 
    mindate, 
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
  if(props.excludedates) {
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).selections = resetSelections(
        'SELECTIONS', 
        (visiblecalendar.value as VisibleCalendarType).selections as VisibleCalendarType['selections'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as VisibleCalendarType['selections'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).previous.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).current.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    triggerRef(visiblecalendar);
  }
  if(props.from === 'DAYS-MONTHS-YEARS') {
    if((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).current.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
        }
      }
    }
    if((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).previous.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
        }
      }
    }
  }
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
    props.from,
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
        (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months
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
        (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months
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
  ((rangeselectionparams.value as RangeSelectionParamsType).excludedates as boolean) = props.excludedates as boolean;
  triggerRef(rangeselectionparams);
  visiblecalendar.value = fillVisibleCalendarArray(
    maxdate,
    mindate,
    props.isoweek
  );
  (visiblecalendar.value as VisibleCalendarType).selections = props.selections as VisibleCalendarType['selections'];
  if(props.from === 'DAYS-MONTHS-YEARS') {
    if((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).current.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
        }
      }
    }
    if((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).previous.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
        }
      }
    }
  }
  triggerRef(visiblecalendar);
});

onMounted(() => {
  unwatchresetcalendarsignal = watch(
    () => (props.resetcalendarsignal as number),
    (x) => {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days) {
          if((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
          }
        }
        (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].checked = false;
      }
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days) {
          if((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
          }
        }
        (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].checked = false;
      }
      for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
        for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
          for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
            ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].checked = false;
            triggerRef(visiblecalendar);
          }
        }
      }
      (visiblecalendar.value as VisibleCalendarType).selections = {};
      triggerRef(visiblecalendar);
    }
  );
  unwatchexcludedates = watch(
    () => (props.excludedates as boolean),
    (x) => {
      (rangeselectionparams.value as RangeSelectionParamsType).excludedates = x;
      triggerRef(rangeselectionparams);
      if(x) {
        if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year) {
          if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month === (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month) {
            for(let year in (visiblecalendar.value as VisibleCalendarType).selections) {
              for(let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                  if(
                    (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year
                    === parseInt(year) 
                    &&
                    (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month
                    === parseInt(month)
                  ) {
                    if(weekHasHighlightedOrSelected(
                      ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)]
                    )) {
                      ((visiblecalendar.value as VisibleCalendarType).selections[parseInt(year)].months[parseInt(month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].checked = true;
                      triggerRef(visiblecalendar);
                    }
                  }
                }
              }
            }
          }
          else {
            if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month > (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month) {
              for(
                let i = (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                i<=(rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                i++
              ){
                for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year].months[i] as YearMonthClickable<{}>['calendar']).weeks
                ) {
                  if(weekHasHighlightedOrSelected(
                    ((visiblecalendar.value as VisibleCalendarType).selections[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                    ].months[i] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)]
                  )) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                    ].months[i] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].checked = true;
                    triggerRef(visiblecalendar);
                  }
                }
              }
            }
            else {
              for(
                let i = (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                i<=(rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                i++
              ){
                for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year].months[i] as YearMonthClickable<{}>['calendar']).weeks
                ) {
                  if(weekHasHighlightedOrSelected(
                      ((visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[i] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)]
                  )) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                    ].months[i] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].checked = true;
                    triggerRef(visiblecalendar);
                  }
                }
              }
            }
          }
        }
        else {
          if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year > (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year) {
            for(
              let year = (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year;
              year <= (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year;
              year++
            ) {
              if(
                (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ||
                (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === year
              ) {
                if(
                  (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ) {
                  for(
                    let month = (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                    month < 12;
                    month++
                  ) {
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                }
                if(
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === year
                ) {
                  for(
                    let month = 0;
                    month <= (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                    month++
                  ) {
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                }
              }
              else {
                for(let month = 0; month < 12; month++) {
                  for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    if(weekHasHighlightedOrSelected(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)]
                    )) {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)].checked = true;
                      triggerRef(visiblecalendar);
                    }
                  }
                }
              }
            }
          }
          else {
            for(
              let year = (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year;
              year <= (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year;
              year++
            ) {
              if(
                (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ||
                (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === year
              ) {
                if(
                  (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ) {
                  for(
                    let month = 0;
                    month <= (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                    month++
                  ) {
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                }
                if(
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === year
                ) {
                  for(
                    let month = (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                    month < 12;
                    month++
                  ) {
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                        triggerRef(visiblecalendar);
                      }
                    }
                  }
                }
              }
              else {
                for(let month = 0; month < 12; month++) {
                  for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    if(weekHasHighlightedOrSelected(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)]
                    )) {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)].checked = true;
                      triggerRef(visiblecalendar);
                    }
                  }
                }
              }
            }
          }
        }
        if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
          let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
          (visiblecalendar.value as VisibleCalendarType).selections = resetSelections(
            'SELECTIONS', 
            (visiblecalendar.value as VisibleCalendarType).selections as VisibleCalendarType['selections'], 
            max as string, 
            min as string, 
            props.isoweek
          ) as VisibleCalendarType['selections'];
        }
        if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
          let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
          (visiblecalendar.value as VisibleCalendarType).previous.calendar = resetSelections(
            'CALENDAR', 
            (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
            max as string, 
            min as string, 
            props.isoweek
          ) as YearMonthClickable<PositionTrackerType>['calendar'];
        }
        if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
          let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
          (visiblecalendar.value as VisibleCalendarType).current.calendar = resetSelections(
            'CALENDAR', 
            (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
            max as string, 
            min as string, 
            props.isoweek
          ) as YearMonthClickable<PositionTrackerType>['calendar'];
        }
        triggerRef(visiblecalendar);
      }
    }
  );
  unwatchselectionformat = watch(
    () => props.selectionformat,
    (x) => {
      multipleselectcount.value = 0;
      rangeselectionparams.value.rangeselectcount = 0;
      rangeselectionparams.value.rangefirstselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      rangeselectionparams.value.rangelastselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      (visiblecalendar.value as VisibleCalendarType).selections = {};
      triggerRef(visiblecalendar);
      unTrackVisibleCalendarMouseMovement();
    }
  );
  unwatchrangeselectcount = watch(
    () => (rangeselectionparams.value as RangeSelectionParamsType).rangeselectcount,
    (x) => {
      if (props.selectionformat === "RANGE") {
        if (x === 1) {
          emits('enable:excludebutton', true);
          trackVisibleCalendarMouseMovement();
          for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
            for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days) {
              if((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
              }
            }
          }
          for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
            for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days) {
              if((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
              }
            }
          }
          for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
            for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
              for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                for (let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                  if(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].readonlystatus === "ENABLE") {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status = "ENABLE";
                  }
                }
              }
            }
          }
          triggerRef(visiblecalendar);
        } else {
          unTrackVisibleCalendarMouseMovement();
          if(x === 2) {
            emits('enable:excludebutton', false);
          }
          else {
            if(x === 0) {
              emits('enable:excludebutton', true);
              for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
                for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days) {
                  if((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
                  }
                }
              }
              for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
                for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days) {
                  if((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                    (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
                  }
                }
              }
              for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
                for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    for (let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                      if(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].readonlystatus === "ENABLE") {
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status = "ENABLE";
                      }
                    }
                  }
                }
              }
              triggerRef(visiblecalendar);
            }
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
  unwatchselectionformat();
  unTrackVisibleCalendarMouseMovement();
  unwatchresetcalendarsignal();
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
});

</script>

<template>
  <div 
    :style="from==='DD-MM-YYYY'? 'height: 381.2px;' : 'height: 426.5px;'"
    class="d-block shadow-sm"
  >
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
      </div>
      <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
      </div>
    </div>
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
        <div
          style="padding: 10px 0"
          class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
        >
          <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
            <a
              @keypress.enter="clickPrevious()"
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
        <template v-if="from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE'">
          <div
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
              <div
                class="flex-w-12-dot-5 align-self-stretch"
              ></div>
            </template>
            <div class="flex-fill align-self-stretch">
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
              >
                <div
                  class="flex-w-14-dot-285714"
                  v-for="(ty, tyindex) in (visiblecalendar as VisibleCalendarType).previous.ty"
                  :key="'ty-'+(visiblecalendar as VisibleCalendarType).previous.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tyindex"
                >
                  <div class="d-block m-0" style="padding: 3px 0;">
                    <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                      TY
                    </div>
                    <div class="d-block p-0 m-0">
                      <input
                        v-model="(visiblecalendar as VisibleCalendarType).previous.ty[tyindex]"
                        class="m-0 p-0 border w-100"
                        type="checkbox"
                        style="float: left; line-height: 1.2rem; height: 1.2rem;"
                        @change="handleTyTmClicked(
                          'TY', 
                          tyindex, 
                          (visiblecalendar as VisibleCalendarType).previous.ty[tyindex],
                          (visiblecalendar as VisibleCalendarType).previous.year
                        )"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
              >
                <div
                  class="flex-w-14-dot-285714"
                  v-for="(tm, tmindex) in ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm"
                  :key="'tm-'+(visiblecalendar as VisibleCalendarType).previous.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tmindex"
                >
                  <div class="d-block" style="padding: 5px 0 8px 0;">
                    <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                      TM
                    </div>
                    <div class="d-block p-0 m-0">
                      <template v-if="previousyearandmonthinselections">
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).selections[
                            (visiblecalendar as VisibleCalendarType).previous.year
                          ].months[
                            (visiblecalendar as VisibleCalendarType).previous.month
                          ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked
                          "
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-PREVIOUS-SELECTIONS', 
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).previous.year,
                            (visiblecalendar as VisibleCalendarType).previous.month
                          )"
                        />
                      </template>
                      <template v-else>
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked"
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-PREVIOUS',
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).previous.year,
                            (visiblecalendar as VisibleCalendarType).previous.month
                          )"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="from === 'DAYS-MONTHS-YEARS'">
          <div
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
              <div
                class="flex-w-12-dot-5 align-self-stretch"
              ></div>
            </template>
            <div class="flex-fill align-self-stretch">
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
              >
                <div
                  class="flex-w-14-dot-285714"
                  v-for="(tm, tmindex) in ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm"
                  :key="'tm-'+(visiblecalendar as VisibleCalendarType).previous.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tmindex"
                >
                  <div class="d-block" style="padding: 5px 0 8px 0;">
                    <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                      TM
                    </div>
                    <div class="d-block p-0 m-0">
                      <template v-if="previousyearandmonthinselections">
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).selections[
                            (visiblecalendar as VisibleCalendarType).previous.year
                          ].months[
                            (visiblecalendar as VisibleCalendarType).previous.month
                          ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked
                          "
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-PREVIOUS-SELECTIONS', 
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).previous.year,
                            (visiblecalendar as VisibleCalendarType).previous.month
                          )"
                        />
                      </template>
                      <template v-else>
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked"
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-PREVIOUS',
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).previous.year,
                            (visiblecalendar as VisibleCalendarType).previous.month
                          )"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div
          style="padding: 5px 0 0 0;"
          class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
        >
          <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
            <div
              class="flex-w-12-dot-5 overflow-hidden"
            ></div>
          </template>
          <div
            :class="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
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
          <template v-for="(week, weekindex) in (visiblecalendar as VisibleCalendarType).previous.calendar.weeks">
            <div class="flex-w-100">
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
              >
                <template v-if="((props.excludedates !== undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
                  <div
                    class="flex-w-12-dot-5 overflow-hidden m-0 align-self-stretch" style="padding:0 2px 0 0;"
                  >
                    <div
                      style="float: left;"
                      class="p-0 m-0 w-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                    >
                      <template v-if="previousyearandmonthinselections">
                        <input v-model="(
                            (visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[weekindex].checked"
                          class="m-0 p-0 border flex-w-100"
                          :key="(visiblecalendar as VisibleCalendarType).previous.year+'_'+(visiblecalendar as VisibleCalendarType).previous.month+'_'+weekindex"
                          @change="weekCheckboxClicked((
                            (visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[weekindex].checked, ''+weekindex, 'PREVIOUS')"
                          :disabled="weekHasEnable((
                            (visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[weekindex])"
                          type="checkbox"
                          style="float: left;"
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 2.285em; height: 2.285em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              'line-height: 3.15em; height: 3.15em;'
                              :
                              'line-height: 3.18rem; height: 3.18rem;'
                            )
                          "
                        />
                      </template>
                      <template v-else>
                        <input v-model="(
                            (visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                          ).weeks[weekindex].checked"
                          class="m-0 p-0 border flex-w-100"
                          :key="(visiblecalendar as VisibleCalendarType).previous.year+'_'+(visiblecalendar as VisibleCalendarType).previous.month+'_'+weekindex"
                          @change="weekCheckboxClicked((
                            (visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                          ).weeks[weekindex].checked, ''+weekindex,'PREVIOUS')"
                          :disabled="weekHasEnable(week)"
                          type="checkbox"
                          style="float: left;"
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 2.285em; height: 2.285em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              'line-height: 3.15em; height: 3.15em;'
                              :
                              'line-height: 3.18rem; height: 3.18rem;'
                            )
                          "
                        />
                      </template>
                    </div>
                  </div>
                </template>
                <div
                  :class="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
                  class="align-self-stretch"
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
                  style="float: left;"
                  :style="
                    (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                    'line-height: 2.285em; height: 2.285em;'
                    : (
                      (from === 'DD-MM-YYYY')?
                      'line-height: 3.15em; height: 3.15em;'
                      :
                      'line-height: 3.18rem; height: 3.18rem;'
                    )
                  "
                >
                  <label
                    :ref="
                      (el) => assignRef((visiblecalendar as VisibleCalendarType).previous, el as HTMLLabelElement, weekindex as number, dayindex as number)
                    "
                    @keypress.enter="handleDateClick(day)"
                    @click="handleDateClick(day)"
                    :disabled="day.status === 'DISABLE' ? true : false"
                    :class="[day.status === 'DISABLE'?'':'cursor-pointer']"
                    class="w-100"
                    style="float: left;border: 1px solid #fff;"
                    :style="
                      (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                      'line-height: 2.285em; height: 2.285em;'
                      : (
                        (from === 'DD-MM-YYYY')?
                        'line-height: 3.15em; height: 3.15em;'
                        :
                        'line-height: 3.18rem; height: 3.18rem;'
                      )
                    "
                  >
                    <input
                      @keypress.enter.stop=""
                      @click.stop=""
                      :disabled="day.status === 'DISABLE' ? true : false"
                      type="checkbox"
                      class="position-absolute d-none"
                      style="pointer-events: auto;"
                    />
                    <template v-if="previousyearandmonthinselections">
                      <div
                        :style="
                          (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                          'line-height: 2.285em; height: 2.285em;'
                          : (
                            (from === 'DD-MM-YYYY')?
                            'line-height: 3.15em; height: 3.15em;'
                            :
                            'line-height: 3.18rem; height: 3.18rem;'
                          )
                        "
                      >
                        <span
                          class="h-100 font-family text-center d-block letter-spacing"
                          style="font-size: 1rem;"
                          :style="
                            day.day ===
                              ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'SELECTED' &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
                              ? 'background-color:green;color: #fff !important'
                              : day.day ===
                                  ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                    (visiblecalendar as VisibleCalendarType).previous.month
                                  ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                  (visiblecalendar as VisibleCalendarType).previous.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'DESELECTED' &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                  (visiblecalendar as VisibleCalendarType).previous.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
                              ? 'color: black !important;text-shadow:none'
                              : day.day ===
                                  ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                    (visiblecalendar as VisibleCalendarType).previous.month
                                  ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                  (visiblecalendar as VisibleCalendarType).previous.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'HIGHLIGHTED' &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].months[
                                  (visiblecalendar as VisibleCalendarType).previous.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
                              ? 'background-color:grey;color: #fff !important'
                              : 'color: gray !important;text-shadow:none'
                          "
                        >
                          {{ day.day }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        :style="
                          (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                          'line-height: 2.285em; height: 2.285em;'
                          : (
                            (from === 'DD-MM-YYYY')?
                            'line-height: 3.15em; height: 3.15em;'
                            :
                            'line-height: 3.18rem; height: 3.18rem;'
                          )
                        "
                      >
                        <span
                          class="h-100 font-family text-center d-block letter-spacing"
                          style="font-size: 1rem;"
                          :style="
                            day.status === 'DISABLE'
                              ? 'color: gray !important;text-shadow:none'
                              : 'color: black !important;text-shadow:none'
                          "
                        >
                          {{ day.day }}
                        </span>
                      </div>
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
              @keypress.enter="clickNext()"
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
        <template v-if="from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE'">
          <div
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
              <div
                class="flex-w-12-dot-5 align-self-stretch"
              ></div>
            </template>
            <div class="flex-fill align-self-stretch">
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
              >
                <div
                  class="flex-w-14-dot-285714"
                  v-for="(ty, tyindex) in (visiblecalendar as VisibleCalendarType).current.ty"
                  :key="'ty-'+(visiblecalendar as VisibleCalendarType).current.month +'-'+(visiblecalendar as VisibleCalendarType).current.year+'-'+tyindex"
                >
                  <div class="d-block m-0" style="padding: 3px 0;">
                    <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                      TY
                    </div>
                    <div class="d-block p-0 m-0">
                      <input
                        v-model="(visiblecalendar as VisibleCalendarType).current.ty[tyindex]"
                        class="m-0 p-0 border w-100"
                        type="checkbox"
                        style="float: left; line-height: 1.2rem; height: 1.2rem;"
                        @change="handleTyTmClicked(
                          'TY', 
                          tyindex, 
                          (visiblecalendar as VisibleCalendarType).current.ty[tyindex],
                          (visiblecalendar as VisibleCalendarType).current.year
                        )"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
              >
                <div
                  class="flex-w-14-dot-285714"
                  v-for="(tm, tmindex) in ((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm"
                  :key="'tm-'+(visiblecalendar as VisibleCalendarType).current.month +'-'+(visiblecalendar as VisibleCalendarType).current.year+'-'+tmindex"
                >
                  <div class="d-block" style="padding: 5px 0 8px 0;">
                    <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                      TM
                    </div>
                    <div class="d-block p-0 m-0">
                      <template v-if="currentyearandmonthinselections">
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).selections[
                            (visiblecalendar as VisibleCalendarType).current.year
                          ].months[
                            (visiblecalendar as VisibleCalendarType).current.month
                          ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked
                          "
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-CURRENT-SELECTIONS', 
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).current.year,
                            (visiblecalendar as VisibleCalendarType).current.month
                          )"
                        />
                      </template>
                      <template v-else>
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked"
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-CURRENT',
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).current.year,
                            (visiblecalendar as VisibleCalendarType).current.month
                          )"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="from === 'DAYS-MONTHS-YEARS'">
          <div
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
              <div
                class="flex-w-12-dot-5 align-self-stretch"
              ></div>
            </template>
            <div class="flex-fill align-self-stretch">
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
              >
                <div
                  class="flex-w-14-dot-285714"
                  v-for="(tm, tmindex) in ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm"
                  :key="'tm-'+(visiblecalendar as VisibleCalendarType).current.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tmindex"
                >
                  <div class="d-block" style="padding: 5px 0 8px 0;">
                    <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                      TM
                    </div>
                    <div class="d-block p-0 m-0">
                      <template v-if="currentyearandmonthinselections">
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).selections[
                            (visiblecalendar as VisibleCalendarType).current.year
                          ].months[
                            (visiblecalendar as VisibleCalendarType).current.month
                          ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked
                          "
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-CURRENT-SELECTIONS',
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).current.year,
                            (visiblecalendar as VisibleCalendarType).current.month
                          )"
                        />
                      </template>
                      <template v-else>
                        <input
                          v-model="((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked"
                          class="m-0 p-0 border w-100"
                          type="checkbox"
                          style="float: left; line-height: 1.2rem; height: 1.2rem;"
                          @change="handleTyTmClicked(
                            'TM-CURRENT',
                            tmindex, 
                            ((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked,
                            (visiblecalendar as VisibleCalendarType).current.year,
                            (visiblecalendar as VisibleCalendarType).current.month
                          )"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div
          style="padding: 5px 0 0 0;"
          class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
        >
          <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
            <div
              class="flex-w-12-dot-5 overflow-hidden"
            ></div>
          </template>
          <div
            :class="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
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
          <template v-for="(week, weekindex) in (visiblecalendar as VisibleCalendarType).current.calendar.weeks">
            <div class="flex-w-100">
              <div
                class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
              >
                <template v-if="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
                  <div
                    class="flex-w-12-dot-5 overflow-hidden m-0 align-self-stretch" style="padding:0 2px 0 0;"
                  >
                    <div
                      class="p-0 m-0 w-100 h-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                    >
                      <template v-if="currentyearandmonthinselections">
                        <input v-model="(
                            (visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar']
                          ).weeks[weekindex].checked"
                          class="m-0 p-0 border flex-w-100"
                          :key="(visiblecalendar as VisibleCalendarType).current.year+'_'+(visiblecalendar as VisibleCalendarType).current.month+'_'+weekindex"
                          @change="weekCheckboxClicked((
                            (visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[weekindex].checked, ''+weekindex, 'CURRENT')"
                          :disabled="weekHasEnable((
                            (visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<PositionTrackerType>['calendar']
                          ).weeks[weekindex])"
                          type="checkbox"
                          style="float: left;"
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 2.285em; height: 2.285em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              'line-height: 3.15em; height: 3.15em;'
                              :
                              'line-height: 3.18rem; height: 3.18rem;'
                            )
                          "
                        />
                      </template>
                      <template v-else>
                        <input v-model="(
                              (visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex].checked
                          "
                          class="m-0 p-0 border flex-w-100" 
                          :key="(visiblecalendar as VisibleCalendarType).current.year+'_'+(visiblecalendar as VisibleCalendarType).current.month+'_'+weekindex"
                          @change="weekCheckboxClicked((
                              (visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex].checked, ''+weekindex, 'CURRENT')
                          "
                          :disabled="weekHasEnable(week)"
                          type="checkbox"
                          style="float: left;"
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 2.285em; height: 2.285em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              'line-height: 3.15em; height: 3.15em;'
                              :
                              'line-height: 3.18rem; height: 3.18rem;'
                            )
                          "
                        />
                      </template>
                    </div>
                  </div>
                </template>
                <div
                  :class="(props.excludedates || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
                  class="align-self-stretch"
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
                  style="float: left;"
                  :style="
                    (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                    'line-height: 2.285em; height: 2.285em;'
                    : (
                      (from === 'DD-MM-YYYY')?
                      'line-height: 3.15em; height: 3.15em;'
                      :
                      'line-height: 3.18rem; height: 3.18rem;'
                    )
                  "
                >
                  <label
                    :ref="
                      (el) => assignRef((visiblecalendar as VisibleCalendarType).current, el as HTMLLabelElement, weekindex as number, dayindex as number)
                    "
                    @keypress.enter="handleDateClick(day)"
                    @click="handleDateClick(day)"
                    :disabled="day.status === 'DISABLE' ? true : false"
                    class="w-100"
                    :class="[day.status === 'DISABLE'?'':'cursor-pointer']"
                    style="float: left;border: 1px solid #fff;"
                    :style="
                      (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                      'line-height: 2.285em; height: 2.285em;'
                      : (
                        (from === 'DD-MM-YYYY')?
                        'line-height: 3.15em; height: 3.15em;'
                        :
                        'line-height: 3.18rem; height: 3.18rem;'
                      )
                    "
                  >
                    <input
                      @keypress.enter.stop=""
                      @click.stop=""
                      :disabled="day.status === 'DISABLE' ? true : false"
                      type="checkbox"
                      class="position-absolute d-none"
                      style="pointer-events: auto;"
                    />
                    <template v-if="currentyearandmonthinselections">
                      <div
                        :style="
                          (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                          'line-height: 2.285em; height: 2.285em;'
                          : (
                            (from === 'DD-MM-YYYY')?
                            'line-height: 3.15em; height: 3.15em;'
                            :
                            'line-height: 3.18rem; height: 3.18rem;'
                          )
                        "
                      >
                        <span
                          class="h-100 font-family text-center d-block letter-spacing"
                          style="font-size: 1rem;"
                          :style="
                            day.day ===
                              ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'SELECTED' &&
                            ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
                              ? 'background-color:green;color: #fff !important'
                              : day.day ===
                                  ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                    (visiblecalendar as VisibleCalendarType).current.month
                                  ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                  (visiblecalendar as VisibleCalendarType).current.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'DESELECTED' &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                  (visiblecalendar as VisibleCalendarType).current.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
                              ? 'color: black !important;text-shadow:none'
                              : day.day ===
                                  ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                    (visiblecalendar as VisibleCalendarType).current.month
                                  ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                  (visiblecalendar as VisibleCalendarType).current.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'HIGHLIGHTED' &&
                                ((visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].months[
                                  (visiblecalendar as VisibleCalendarType).current.month
                                ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
                              ? 'background-color:grey;color: #fff !important'
                              : 'color: gray !important;text-shadow:none'
                          "
                        >
                          {{ day.day }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        :style="
                          (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                          'line-height: 2.285em; height: 2.285em;'
                          : (
                            (from === 'DD-MM-YYYY')?
                            'line-height: 3.15em; height: 3.15em;'
                            :
                            'line-height: 3.18rem; height: 3.18rem;'
                          )
                        "
                      >
                        <span
                          class="h-100 font-family text-center d-block letter-spacing"
                          style="font-size: 1rem;"
                          :style="
                            day.status === 'DISABLE'
                              ? 'color: gray !important;text-shadow:none'
                              : 'color: black !important;text-shadow:none'
                          "
                        >
                          {{ day.day }}
                        </span>
                      </div>
                    </template>
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>
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
