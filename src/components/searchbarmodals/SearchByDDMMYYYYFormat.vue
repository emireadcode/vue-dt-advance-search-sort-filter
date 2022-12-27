<script setup lang="ts">
import {
  nextTick,
  inject,
  triggerRef,
  ref,
  onBeforeMount,
  type ShallowRef,
} from "vue";
import VisibleCalendarDatePicker from "./VisibleCalendarDatePicker.vue";
import Paste from "./Paste.vue";
import type { DateType, YearType } from "../types/SupportedDatatypesTypeDeclaration";

const 

  cards = inject("cards") as ShallowRef<DateType[]>,

  index = inject("index") as number,
  
  props = defineProps<{
    excludedates: boolean;
  }>(),

  emits = defineEmits<{
    (e: "update:excludedates", action: boolean): void;
  }>(),

  selectionformat = ref()

;

function updateCards() {
  nextTick(() => {
    triggerRef(cards);
  });
}

onBeforeMount(() => {
  selectionformat.value = cards.value[index].search.dd_mm_yyyy.format;
});

</script>

<template>
  <div class="d-block" style="padding: 0 10px;">
    <Paste
      :title="cards[index].info.name"
      :datatype="cards[index].info.datatype as 'Date' | 'Year'"
      :max="(cards[index].result.max as string)"
      :min="(cards[index].result.min as string)"
      :text-area-height="'height:422px;'"
    >
      <template v-slot:outcomeidentifier>
        <div
          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
        >
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: #fff; width: 15px; height: 15px"
            ></div>
            Pasted Lines
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: red; width: 15px; height: 15px"
            ></div>
            Invalid Dates
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: yellow;width: 15px;height: 15px;"
            ></div>
            Out of Range
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: pink; width: 15px; height: 15px"
            ></div>
            Indeterminate 
          </div>
        </div>
      </template>
    </Paste>
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
      style="border: 1px solid gray"
    >
      <div class="flex-w-50 align-self-stretch">
        <a
          @keypress.enter="() => { selectionformat = 'RANGE'; emits('update:excludedates', false); }"
          @click="() => { selectionformat = 'RANGE'; emits('update:excludedates', false); }"
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="selectionformat === 'RANGE'
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
          @keypress.enter="() => { selectionformat = 'MULTIPLE-OR-SINGLE'; emits('update:excludedates', true); }"
          @click="() => { selectionformat = 'MULTIPLE-OR-SINGLE'; emits('update:excludedates', true); }"
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="selectionformat === 'MULTIPLE-OR-SINGLE'
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
        :selectionformat="selectionformat"
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
