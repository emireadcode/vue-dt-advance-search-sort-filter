<script setup lang="ts">
import {
  type ShallowRef,
  type Ref,
  onBeforeMount,
  provide,
  ref,
  triggerRef,
  inject,
  nextTick,
} from "vue";
import SearchByDDMMYYYYFormat from "./SearchByDDMMYYYYFormat.vue";
import SearchByDaysMonthsYearsFormat from "./SearchByDaysMonthsYearsFormat.vue";
import { format } from "date-fns";
import type { DateType } from "../types/SupportedDatatypesTypeDeclaration";
import type { VisibleCalendarType } from "../types/dd_mm_yy_types";
import type { 
  DaySelectionFormat, 
  MonthSelectionFormat, 
  YearSelectionFormat 
} from "../types/days_months_years_types";

let 
  previousYearSelection: YearSelectionFormat['years'],

  previousDaySelection: DaySelectionFormat['days'],

  previousMonthSelection: MonthSelectionFormat['months'],

  previousDD_MM_YYY_Selection: VisibleCalendarType['selections'],

  accessibility = inject("accessibility") as {
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  },

  excludedates = ref<boolean>()

;

const
  index = inject("index") as number,

  cards = inject("cards") as ShallowRef<DateType[]>

;

function updateCards() {
  nextTick(() => {
    triggerRef(cards);
  });
}

onBeforeMount(() => {
  excludedates.value = false;
});

</script>

<template>
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800"
    >
      <div class="modal-mask h-100 w-100">
        <div class="modal-wrapper text-center">
          <div class="modal-container d-block">
            <div class="d-block" style="height: 36.855rem;">
              <div
                style="background-color: #fff; padding: 0.315rem 0.315rem 0 0.315rem;white-space: nowrap;"
                class="shadow-sm d-block"
              >
                <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                  <li
                    class="flex-shrink-0 flex-grow-0 align-self-stretch"
                  >
                    <div
                      class="text-lowercase tab m-0" 
                      style="padding: 0.315rem 0.504rem;font-size:1em;background-color:#F0E68C;border-top-right-radius: 0.504rem;border-top-left-radius: 0.504rem;"
                    >
                      {{ cards[index].info.name }}
                    </div>
                  </li>
                </ul>
              </div>
              <div class="d-block m-0 p-0">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center m-0"
                  style="padding: 0.504rem 0"
                >
                  <div class="flex-w-50 p-0 m-0 align-self-stretch">
                    <div
                      class="d-inline-block p-0 m-0 letter-spacing align-middle"
                    >
                      Min:
                      {{
                        format(
                          new Date(cards[index].result.min),
                          (cards[index] as DateType).dateFormat
                            .replace(/mmmm/g, "MMMM")
                            .replace(/mmm/g, "MMM")
                            .replace(/mm/g, "MM")
                            .replace(/dddd/g, "EEEE")
                            .replace(/ddd/g, "EEE")
                        )
                      }}
                    </div>
                  </div>
                  <div class="flex-w-50 p-0 m-0 align-self-stretch">
                    <div
                      class="d-inline-block p-0 m-0 letter-spacing align-middle"
                    >
                      Max:
                      {{
                        format(
                          new Date(cards[index].result.max),
                          (cards[index] as DateType).dateFormat
                            .replace(/mmmm/g, "MMMM")
                            .replace(/mmm/g, "MMM")
                            .replace(/mm/g, "MM")
                            .replace(/dddd/g, "EEEE")
                            .replace(/ddd/g, "EEE")
                        )
                      }}
                    </div>
                  </div>
                </div>
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
                  style="border: 0.063rem solid gray"
                >
                  <div class="flex-w-50 align-self-stretch">
                    <a
                      @keypress.enter="() => { excludedates = false; ((cards[index] as DateType).search.format as 'DD/MM/YYYY' | 'Day(s), Month(s), Year(s)') = 'DD/MM/YYYY'; updateCards(); }"
                      @click="() => { excludedates = false; ((cards[index] as DateType).search.format as 'DD/MM/YYYY' | 'Day(s), Month(s), Year(s)') = 'DD/MM/YYYY'; updateCards(); }"
                      class="font-family date-format align-middle underline-none d-block cursor-pointer m-0"
                      style="outline: 0.063rem solid rgba(0, 0, 0, 0.2);padding: 0.126rem 0;"
                      :style="(cards[index] as DateType).search.format === 'DD/MM/YYYY'
                        ? 'background-color:green;color: #fff;'
                        : 'background-color:gray;color: #fff;'
                      "
                    >
                      DD/MM/YYYY
                    </a>
                  </div>
                  <div class="flex-w-50 align-self-stretch">
                    <a
                      @keypress.enter="() => { excludedates = false; ((cards[index] as DateType).search.format as 'DD/MM/YYYY' | 'Day(s), Month(s), Year(s)') = 'Day(s), Month(s), Year(s)'; updateCards(); }"
                      @click="() => { excludedates = false; ((cards[index] as DateType).search.format as 'DD/MM/YYYY' | 'Day(s), Month(s), Year(s)') = 'Day(s), Month(s), Year(s)'; updateCards(); }"
                      class="font-family date-format align-middle underline-none d-block cursor-pointer m-0"
                      style="outline: 0.063rem solid rgba(0, 0, 0, 0.2);padding: 0.126rem 0;"
                      :style="
                        ((cards[index] as DateType).search.format as 'DD/MM/YYYY' | 'Day(s), Month(s), Year(s)') === 'Day(s), Month(s), Year(s)'
                        ? 'background-color:green;color: #fff;'
                        : 'background-color:gray;color: #fff;'
                      "
                    >
                      Day(s), Month(s), Year(s)
                    </a>
                  </div>
                </div>
                <div
                  class="d-block text-wrap overflow-x-hidden overflow-y-auto"
                >
                  <template v-if="((cards[index] as DateType).search.format as 'DD/MM/YYYY' | 'Day(s), Month(s), Year(s)') ===  'DD/MM/YYYY'">
                    <SearchByDDMMYYYYFormat
                      :excludedates="(excludedates as boolean)"
                      @update:excludedates="$val => excludedates = $val"
                    ></SearchByDDMMYYYYFormat>
                  </template>
                  <template v-else>
                    <SearchByDaysMonthsYearsFormat
                      :excludedates="(excludedates as boolean)"
                    ></SearchByDaysMonthsYearsFormat>
                  </template>
                </div>
              </div>
            </div>
            <div
              style="padding: 0.63rem 0.63rem 0.756rem 0.63rem;"
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
            >
              <div class="flex-w-100-over-3 align-self-stretch" style="padding-right: 0.4725rem;">
                <button
                  @keypress.enter="() => { accessibility.cardsmultiplesearchopenstatus.value[index] = false; }"
                  @click="() => { accessibility.cardsmultiplesearchopenstatus.value[index] = false; }"
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 0.378rem; font-size: 1rem;color: #fff;background-color: gray;"
                >
                  Close
                </button>
              </div>
              <div
                class="flex-w-100-over-3 align-self-stretch"
                style="padding-right: 0.1575rem;"
              >
                <button
                  @click="excludedates = true"
                  @keypress.enter="excludedates = true"
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 0.378rem; font-size: 1rem;color:#fff;background-color: gray;"
                >
                  Exclude dates
                </button>
              </div>
              <div
                class="flex-w-100-over-3 align-self-stretch"
                style="padding-left: 0.315rem;"
              >
                <button
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 0.378rem; font-size: 1rem;color:#fff;background-color: gray;"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.date-format {
  background-color: #dcdcdc;
  color: black;
}
.date-format:hover {
  background-color: #17a2b8;
}
.modal-mask {
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0 auto;
  background-color: #f8f8f8;
  border-radius: 0.126rem;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  width: 34.65rem;
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
</style>