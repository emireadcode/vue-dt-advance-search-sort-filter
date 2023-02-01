<script setup lang="ts">
import {
  onBeforeMount,
  inject,
  type ShallowRef,
  computed,
  ref,
  watch,
  type WatchStopHandle,
  onBeforeUnmount,
  triggerRef,
} from "vue";
import type { YearSelectionFormat, MonthSelectionFormat, DaySelectionFormat } from "../types/days_months_years_types";
import type { DateType } from "../types/SupportedDatatypesTypeDeclaration";
import DayPicker from "./DayPicker.vue";
import MonthPicker from "./MonthPicker.vue";
import YearPicker from "./YearPicker.vue";
import VisibleCalendarDatePicker from "./VisibleCalendarDatePicker.vue";

const 

  openexcludewindow = ref(false),

  cards = inject("cards") as ShallowRef<DateType[]>,

  index = inject("index") as number,

  emits = defineEmits<{
    (e: "enable:excludebutton", action: boolean): void;
  }>(),
  
  props = defineProps<{
    excludedatesignal: number;
  }>(),

  cmaxyear = computed(() => {
    return ((cards.value[index] as DateType).result.max as string).split('-')[0];
  }),

  cminyear = computed(() => {
    return ((cards.value[index] as DateType).result.min as string).split('-')[0];
  }),

  isdayready = ref(false),

  ismonthready = ref(false),

  isyearready = ref(false)

;

let 
  unwatchexclude: WatchStopHandle,
  unwatchexcludedatesignal: WatchStopHandle
;

function triggerCard() {
  triggerRef(cards);
}

onBeforeMount(() => {
  unwatchexcludedatesignal = watch(
    () => props.excludedatesignal,
    (x) => {
      openexcludewindow.value = true;
    }
  );
  unwatchexclude = watch(
    [
      () => isdayready.value,
      () => ismonthready.value,
      () => isyearready.value
    ],
    ([x, y, z]) => {
      if(x && y && z) {
        emits('enable:excludebutton', false);
      }
      else {
        emits('enable:excludebutton', true);
      }
    }
  )
});

onBeforeUnmount(() => {
  unwatchexclude();
  unwatchexcludedatesignal();
});

</script>

<template>
  <div class="d-block position-relative" style="padding: 0 10px;z-index: 1000;">
    <div class="d-block" style="padding: 7px 0px 3.5px 0;">
      <DayPicker
        @update:dayselectionandformat="($val: DaySelectionFormat) => { cards[index].search.days_months_years.days = $val; triggerCard(); }"
        :dayselectionandformat="((cards[index] as DateType).search.days_months_years.days as DaySelectionFormat)"
        :isoweek="(cards[index] as DateType).isoweek"
        @signal:readyforexclude="($val: boolean) => isdayready = $val"
      ></DayPicker>
    </div>
    <div class="d-block" style="padding: 3.5px 0px;">
      <MonthPicker
        @update:monthselectionandformat="($val: MonthSelectionFormat) => { cards[index].search.days_months_years.months = $val; triggerCard(); }"
        @signal:readyforexclude="($val: boolean) => ismonthready = $val"
        :monthselectionandformat="((cards[index] as DateType).search.days_months_years?.months as MonthSelectionFormat)"
      ></MonthPicker>
    </div>
    <div class="d-block" style="padding: 3.5px 0px 7px 0;">
      <YearPicker
        :title="'year'"
        @update:yearselectionandformat="($val: YearSelectionFormat) => { cards[index].search.days_months_years.years = $val; triggerCard(); }"
        @signal:readyforexclude="($val: boolean) => isyearready = $val"
        :maxyear="(parseInt(cmaxyear) as number)"
        :minyear="(parseInt(cminyear) as number)"
        :yearselectionandformat="((cards[index] as DateType).search.days_months_years?.years as YearSelectionFormat)"
      ></YearPicker>
    </div>
    <template v-if="openexcludewindow">
      <div class="w-100 h-100 position-absolute t-0 l-0" style="z-index: 1400;padding: 5px 9px;">
        <div class="d-block h-100" style="background-color: #fff;">
          <div class="d-block" style="padding: 0 0 3px 0;">
            <div
              class="d-block shadow-sm"
              style="background-color: blue;border-radius: 0.25rem;"
            >
              <a
                class="underline-none cursor-pointer align-middle"
                @click="openexcludewindow = false"
                @keypress.enter="openexcludewindow = false"
              >
                <img
                  src="/src/assets/icons/close.png"
                  class="align-middle"
                  style="width: 2.205rem; height: 2.205rem"
                />
              </a>
            </div>
          </div>
          <div class="d-block" style="background-color: #E8E8E8;">
            <VisibleCalendarDatePicker
              :from="'DAYS-MONTHS-YEARS'"
              :selectionformat="'MULTIPLE-OR-SINGLE'"
              :isoweek="cards[index].isoweek"
              :selections="cards[index].search.days_months_years.dates"
              :maxdate="(cards[index].result.max as string)"
              :mindate="(cards[index].result.min as string)"
              @update:selections="($val: DateType['search']['days_months_years']['dates']) => { cards[index].search.days_months_years.dates = $val; triggerCard(); }"
            ></VisibleCalendarDatePicker>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
