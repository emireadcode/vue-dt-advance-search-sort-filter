<script setup lang="ts">
import {
  onBeforeMount,
  inject,
  type ShallowRef,
  computed
} from "vue";
import type { YearSelectionFormat, MonthSelectionFormat, DaySelectionFormat } from "../types/days_months_years_types";
import type { DateType } from "../types/SupportedDatatypesTypeDeclaration";
import DayPicker from "./DayPicker.vue";
import MonthPicker from "./MonthPicker.vue";
import YearPicker from "./YearPicker.vue";

const 

  cards = inject("cards") as ShallowRef<DateType[]>,

  index = inject("index") as number,
  
  props = defineProps<{
    excludedates: boolean;
  }>(),

  cmaxyear = computed(() => {
    return ((cards.value[index] as DateType).result.max as string).split('-')[0];
  }),

  cminyear = computed(() => {
    return ((cards.value[index] as DateType).result.min as string).split('-')[0];
  })

;

onBeforeMount(() => {

});

</script>

<template>
  <div class="d-block position-relative" style="padding: 0 10px;">
    <div class="d-block" style="padding: 12px 0px 5px 0px;">
      <DayPicker
        :dayselectionandformat="((cards[index] as DateType).search.days_months_years?.days as DaySelectionFormat)"
        :isoweek="(cards[index] as DateType).isoweek"
      ></DayPicker>
    </div>
    <div class="d-block" style="padding: 7px 0px 5px 0px;">
      <MonthPicker
        :monthselectionandformat="((cards[index] as DateType).search.days_months_years?.months as MonthSelectionFormat)"
      ></MonthPicker>
    </div>
    <div class="d-block" style="padding: 7px 0px 2px 0px;">
      <YearPicker
        :maxyear="(parseInt(cmaxyear) as number)"
        :minyear="(parseInt(cminyear) as number)"
        :yearselectionandformat="((cards[index] as DateType).search.days_months_years?.years as YearSelectionFormat)"
      ></YearPicker>
    </div>
  </div>
</template>
