<script setup lang="ts">
import { inject, type ShallowRef, triggerRef } from "vue";
import type { 
  StringSearchType, 
  MultipleWordsStringType, 
  NumberStringType,
  SingleWordStringType, 
  MultipleWordsStringConcatenatedFieldType,
  SingleWordStringConcatenatedFieldType,
} from "../types/SupportedDatatypesTypeDeclaration";

const 
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,

  index = inject("index") as number,

  wordtypeandconcatfieldindex = inject("wordtypeandconcatfieldindex") as { wordtype: 'MULTIPLE' | 'SINGLE'; concatfieldindex: number | string | undefined; }
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
        <template v-if="wordtypeandconcatfieldindex.concatfieldindex === undefined">
          <button
            @keypress.enter="() => { (cards[index].search.multiple?.include as StringSearchType).tabclicked = true; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = false; updateCard(); }"
            @click="() => { (cards[index].search.multiple?.include as StringSearchType).tabclicked = true; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = false; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="((cards[index] as SingleWordStringType).search.multiple?.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            include
          </button>
        </template>
        <template v-else>
          <button
            @keypress.enter="() => { (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = true; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; updateCard(); }"
            @click="() => { (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = true; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="(((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            include
          </button>
        </template>
      </li>
      <li
        class="flex-shrink-0 flex-grow-0 align-self-stretch flex-w-50"
      >
        <template v-if="wordtypeandconcatfieldindex.concatfieldindex === undefined">
          <button
            @keypress.enter="() => { (cards[index].search.multiple?.include as StringSearchType).tabclicked = false; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = true; updateCard(); }"
            @click="() => { (cards[index].search.multiple?.include as StringSearchType).tabclicked = false; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = true; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="(cards[index].search.multiple?.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            exclude
          </button>
        </template>
        <template v-else>
          <button
            @keypress.enter="() => { (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = true; updateCard(); }"
            @click="() => { (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = true; updateCard(); }"
            class="text-lowercase tab w-100" 
            :style="(((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            exclude
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>