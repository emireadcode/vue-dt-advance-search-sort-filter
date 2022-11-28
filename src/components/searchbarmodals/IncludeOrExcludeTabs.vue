<script setup lang="ts">
import { inject, type ShallowRef, triggerRef } from "vue";
import type { StringSearchType, PrimitiveType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";

const 
  props = defineProps<{
    index: number;
    concatfieldindex?: number | undefined;
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

function updateCard() {
  triggerRef(cards);
}

</script>


<template>
  <div class="d-block" style="padding-top: 10px;">
    <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
      <li
        class="flex-shrink-0 flex-grow-0 align-self-stretch flex-w-50"
      >
        <template v-if="concatfieldindex === undefined">
          <button
            @click="() => { ((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = true; ((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = false; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            include
          </button>
        </template>
        <template v-else>
          <button
            @click="() => { ((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.include as StringSearchType).tabclicked = true; ((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            include
          </button>
        </template>
      </li>
      <li
        class="flex-shrink-0 flex-grow-0 align-self-stretch flex-w-50"
      >
        <template v-if="concatfieldindex === undefined">
          <button
            @click="() => { ((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = false; ((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = true; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            exclude
          </button>
        </template>
        <template v-else>
          <button
            @click="() => { ((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; ((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = true; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            exclude
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>
