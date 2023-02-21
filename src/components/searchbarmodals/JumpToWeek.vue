<script lang="ts" setup>
import { triggerRef, shallowRef, ref, inject, nextTick } from "vue";
import { buildCalendar, calculateWeeksInAYear, determineMonthAndWeek, weekHasEnable } from "../utility/dd_mm_yy_utility_fns";
import JustAYearPicker from "./JustAYearPicker.vue";
import type { RangeSelectionParamsType, VisibleCalendarType, YearMonthClickable } from "../types/dd_mm_yy_types";

type JustAWeekPickerType = {
  [row: number]: {
    [col: number]: {
      week: number;
      ref: HTMLLabelElement | null;
      status: 'ENABLE' | 'DISABLE';
      selected: 'SELECTED' | 'DESELECTED';
    }
  }
};

const
  props = inject('jumptoweek') as {
    selections: VisibleCalendarType['selections'];
    isoweek: boolean;
    from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY';
    selectionformat: 'RANGE' | 'MULTIPLE-OR-SINGLE';
    rangeselectionparams: RangeSelectionParamsType;
    mindate: string;
    maxdate: string;
  },
  emits = defineEmits<{
    (e: "receive:yearandweek", action: {week: number; year: number;}): void;
  }>(),
  numberofweeksinayear = shallowRef<JustAWeekPickerType>(),
  cmaxyear = parseInt((props.maxdate).split('-')[0]),
  cminyear = parseInt((props.mindate).split('-')[0]),
  year = ref(0)
;

function formWeeksRowColArrayInAYear(weeks: number, collimit: number) {
  let 
    row = 0, 
    col = 0, 
    weeksinayear = shallowRef<JustAWeekPickerType>(),
    vc: VisibleCalendarType['selections'] = {}
  ;
  if(props.from === 'DD-MM-YYYY') {
    for(let i=0; i<weeks; i++) {
      const {month} = determineMonthAndWeek(
        props.isoweek,
        {year: year.value, week: i+1}
      );
      if(year.value in (vc as VisibleCalendarType['selections'])) {
        if(!(month in (vc as VisibleCalendarType['selections'])[year.value].months)) {
          (vc as VisibleCalendarType['selections'])[year.value].months = {
            ...(vc as VisibleCalendarType['selections'])[year.value].months,
            [month]: buildCalendar(
              year.value,
              month,
              'SELECTIONS',
              props.isoweek,
              props.mindate,
              props.maxdate
            )
          };
        }
      }
      else {
        (vc as VisibleCalendarType['selections']) = {
          ...(vc as VisibleCalendarType['selections']),
          [year.value]: {
            months: {
              [month]: buildCalendar(
                year.value,
                month,
                'SELECTIONS',
                props.isoweek,
                props.mindate,
                props.maxdate
              )
            }
          }
        } as VisibleCalendarType['selections'];
      }
    }
    if(
      props.selectionformat === 'RANGE' 
      && 
      props.rangeselectionparams.rangefirstselection.date
      &&
      props.rangeselectionparams.rangelastselection.date
    ) {
      if(
        new Date(props.rangeselectionparams.rangefirstselection.date)
        <
        new Date(props.rangeselectionparams.rangelastselection.date)
      ) {
        for(let m in (vc as VisibleCalendarType['selections'])[year.value].months) {
          for(let w in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks) {
            for(let d in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days) {
              if(
                (
                  new Date((vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].date)
                  <
                  new Date(props.rangeselectionparams.rangefirstselection.date)
                )
                ||
                (
                  new Date((vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].date)
                  >
                  new Date(props.rangeselectionparams.rangelastselection.date)
                )
              ) {
                (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].status = 'DISABLE';
                (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].readonlystatus = 'DISABLE';
              }
            }
          }
        }
      }
      else {
        for(let m in (vc as VisibleCalendarType['selections'])[year.value].months) {
          for(let w in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks) {
            for(let d in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days) {
              if(
                (
                  new Date((vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].date)
                  >
                  new Date(props.rangeselectionparams.rangefirstselection.date)
                )
                ||
                (
                  new Date((vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].date)
                  <
                  new Date(props.rangeselectionparams.rangelastselection.date)
                )
              ) {
                (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].status = 'DISABLE';
                (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[d].readonlystatus = 'DISABLE';
              }
            }
          }
        }
      }
    }
  }
  
  for(let i=0; i<weeks; i++) {
    const {week, month} = determineMonthAndWeek(
      props.isoweek,
      {year: year.value, week: i+1}
    );
    if(weeksinayear.value) {
      if(row in weeksinayear.value) {
        weeksinayear.value[row] = {
          ...weeksinayear.value[row],
          [col]: {
            week: i+1,
            ref: null,
            status: (props.from === 'DAYS-MONTHS-YEARS')?
            (
              (
                year.value in (props.selections as VisibleCalendarType['selections'])
                &&
                month in (props.selections as VisibleCalendarType['selections'])[year.value].months
                &&
                month >= 0
                &&
                week >= 0
                &&
                !weekHasEnable(
                  (props.selections as VisibleCalendarType['selections'])[year.value].months[
                    month
                  ].weeks[
                    week
                  ]
                )
              )?
              'ENABLE' : 'DISABLE'
            )
            : 
            (
              (
                year.value in (vc as VisibleCalendarType['selections'])
                &&
                month in (vc as VisibleCalendarType['selections'])[year.value].months
                &&
                month >= 0
                &&
                week >= 0
                &&
                !weekHasEnable(
                  (vc as VisibleCalendarType['selections'])[year.value].months[
                    month
                  ].weeks[
                    week
                  ]
                )
              )?
              'ENABLE' : 'DISABLE'
            )
            ,
            selected: 'DESELECTED'
          }
        } as JustAWeekPickerType[number];
      }
      else {
        weeksinayear.value = {
          ...weeksinayear.value,
          [row]: {
            [col]: {
              week: i+1,
              ref: null,
              status: (props.from === 'DAYS-MONTHS-YEARS')?
              (
                (
                  year.value in (props.selections as VisibleCalendarType['selections'])
                  &&
                  month in (props.selections as VisibleCalendarType['selections'])[year.value].months
                  &&
                  month >= 0
                  &&
                  week >= 0
                  &&
                  !weekHasEnable(
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[
                      week
                    ]
                  )
                )?
                'ENABLE' : 'DISABLE'
              )
              :
              (
                (
                  year.value in (vc as VisibleCalendarType['selections'])
                  &&
                  month in (vc as VisibleCalendarType['selections'])[year.value].months
                  &&
                  month >= 0
                  &&
                  week >= 0
                  &&
                  !weekHasEnable(
                    (vc as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[
                      week
                    ]
                  )
                )?
                'ENABLE' : 'DISABLE'
              )
              ,
              selected: 'DESELECTED'
            }
          }
        } as JustAWeekPickerType;
      }
      col++;
    }
    else {
      weeksinayear.value = {
        [row]: {
          [col]: {
            week: i+1,
            ref: null,
            status: (props.from === 'DAYS-MONTHS-YEARS')?
            (
              (
                year.value in (props.selections as VisibleCalendarType['selections'])
                &&
                month in (props.selections as VisibleCalendarType['selections'])[year.value].months
                &&
                month >= 0
                &&
                week >= 0
                &&
                !weekHasEnable(
                  (props.selections as VisibleCalendarType['selections'])[year.value].months[
                    month
                  ].weeks[
                    week
                  ]
                )
              )?
              'ENABLE' : 'DISABLE'
            )
            :
            (
              (
                year.value in (vc as VisibleCalendarType['selections'])
                &&
                month in (vc as VisibleCalendarType['selections'])[year.value].months
                &&
                month >= 0
                &&
                week >= 0
                &&
                !weekHasEnable(
                  (vc as VisibleCalendarType['selections'])[year.value].months[
                    month
                  ].weeks[
                    week
                  ]
                )
              )?
              'ENABLE' : 'DISABLE'
            )
            ,
            selected: 'DESELECTED'
          }
        }
      } as JustAWeekPickerType;
      col++;
    }
    if(col === collimit) {
      row++;
      col = 0;
    }
  }

  return weeksinayear.value;
}

function selectJustAWeek(rindex: number, cindex: number) {
  if((numberofweeksinayear.value as JustAWeekPickerType)[rindex][cindex].status === 'ENABLE') {
    (numberofweeksinayear.value as JustAWeekPickerType)[rindex][cindex].selected = 'SELECTED';
    triggerRef(numberofweeksinayear);
    let time: NodeJS.Timeout;
    time = setTimeout(() => {
      emits('receive:yearandweek', {year: year.value as number, week: (numberofweeksinayear.value as JustAWeekPickerType)[rindex][cindex].week});
    }, 200);
  }
}

</script>

<template>
  <div
    style="background-color: #E8E8E8;"
    class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100 h-100"
  >
    <div class="flex-w-50 align-self-stretch shadow-sm" style="padding:0.126rem;">
      <JustAYearPicker 
        :maxyear="cmaxyear" 
        :minyear="cminyear" 
        :rowlimit="9" 
        :collimit="3" 
        @receive:year="($val: number) => { 
          year = $val;
          numberofweeksinayear = formWeeksRowColArrayInAYear(calculateWeeksInAYear($val, props.isoweek), 6); 
        }"
      ></JustAYearPicker>
    </div>
    <div class="flex-w-50 align-self-stretch shadow-sm" style="padding:0.126rem;">
      <div class="d-block text-center shadow-sm" style="background-color: lightgray;padding:10px;">
        Then choose a week
      </div>
      <div
        style="padding: 2px 0;"
        class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
      >
        <template v-for="(row, rindex) in numberofweeksinayear">
          <template v-for="(col, cindex) in row">
            <div
              class="flex-w-100-over-6 overflow-hidden"
              style="float: left; outline: 1px solid #fff"
            >
              <label
                :ref="(el) => col.ref = el as HTMLLabelElement"
                @keypress.enter="selectJustAWeek(rindex, cindex)"
                @click="selectJustAWeek(rindex, cindex)"
                class="w-100"
                style="float: left; line-height: 2em; height: 2em"
              >
                <input
                  @keypress.enter.stop=""
                  @click.stop=""
                  type="checkbox"
                  :value="col.week"
                  class="position-absolute d-none"
                  style="pointer-events: auto"
                />
                <span
                  :class="[col.status === 'ENABLE'? 'cursor-pointer' : '']"
                  class="font-family text-center d-block letter-spacing"
                  style="font-size: 1rem; line-height: 2em; height: 2em"
                  :style="
                    col.status === 'ENABLE' ? (
                      col.selected === 'SELECTED'?
                      'background-color: green; color: #fff;'
                      :
                      'background-color: #E8E8E8; color: black; text-shadow:none;'
                    ) : 'background-color: yellow; color: #fff; text-shadow:none;'
                  "
                >
                  {{ col.week }}
                </span>
              </label>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
