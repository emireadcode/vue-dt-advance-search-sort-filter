<script setup lang="ts">
import {
  nextTick,
  inject,
  triggerRef,
  type ShallowRef,
} from "vue";
import VisibleCalendarDatePicker from "./VisibleCalendarDatePicker.vue";
//import PasteDD_MM_YY from "./PasteDD_MM_YY.vue";
import type { DateType } from "../types/SupportedDatatypesTypeDeclaration";

const 

  cards = inject("cards") as ShallowRef<DateType[]>,

  index = inject("index") as number,
  
  props = defineProps<{
    excludedates: boolean;
  }>()

;

function updateCards() {
  nextTick(() => {
    triggerRef(cards);
  });
}

</script>

<template>
  <div class="d-block" style="padding: 0 10px;">
    <!--<PasteDD_MM_YY></PasteDD_MM_YY>-->
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
      style="border: 1px solid gray"
    >
      <div class="flex-w-50 align-self-stretch">
        <a
          @click="() => { cards[index].search.dd_mm_yyyy.format = 'RANGE'; updateCards(); }"
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="cards[index].search.dd_mm_yyyy.format === 'RANGE'
            ? 'background-color:green;'
            : 'background-color:gray;'
          "
          style="color: #fff; padding: 2px 0"
        >
          Range
        </a>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <a
          @click="() => { cards[index].search.dd_mm_yyyy.format = 'MULTIPLE-OR-SINGLE'; updateCards(); }"
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="cards[index].search.dd_mm_yyyy.format === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          style="color: #fff; padding: 2px 0"
        >
          Multiple or Single
        </a>
      </div>
    </div>
    <div class="d-block" style="padding-bottom:2px;">
      <VisibleCalendarDatePicker
        :selectionformat="cards[index].search.dd_mm_yyyy.format"
        :excludedates="props.excludedates"
        :isoweek="cards[index].isoweek"
        :selections="cards[index].search.dd_mm_yyyy.dates"
        :maxdate="(cards[index].result.max as string)"
        :mindate="(cards[index].result.min as string)"
        @update:selections="($val: DateType['search']['dd_mm_yyyy']['dates']) => { cards[index].search.dd_mm_yyyy.dates = $val; updateCards(); }"
      ></VisibleCalendarDatePicker>
    </div>
  </div>
</template>
