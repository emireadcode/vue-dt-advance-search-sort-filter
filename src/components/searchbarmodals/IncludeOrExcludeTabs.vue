<script setup lang="ts">
import { inject, type ShallowRef, triggerRef, ref } from "vue";
import type { 
  StringSearchType, 
  MultipleWordsStringType, 
  NumberStringType,
  SingleWordStringType, 
  MultipleWordsStringConcatenatedFieldType,
  SingleWordStringConcatenatedFieldType,
} from "../types/SupportedDatatypesTypeDeclaration";

const 
  emits = defineEmits<{
    (e: "update:format", action: 'INCLUDE' | 'EXCLUDE' | '@NUMBER'): void;
  }>(),

  format = ref<'@NUMBER' | 'INCLUDE' | 'EXCLUDE'>(),

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
        class="align-self-stretch"
        :class="[
          (
            wordtypeandconcatfieldindex.wordtype === 'SINGLE'
            &&
            wordtypeandconcatfieldindex.concatfieldindex !== undefined
            &&
            (cards[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].fixedlengthofstring !== undefined
          )?
          'flex-w-100-over-3'
          : (
            ((cards[index] as SingleWordStringType).fixedlengthofstring !== undefined)?
            'flex-w-100-over-3'
            :
            'flex-w-50'
          )
        ]"
      >
        <template v-if="wordtypeandconcatfieldindex.concatfieldindex === undefined">
          <button
            @keypress.enter="() => { format = 'INCLUDE'; (cards[index].search.multiple?.include as StringSearchType).tabclicked = true; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = false; updateCard(); emits('update:format', format); }"
            @click="() => { format = 'INCLUDE'; (cards[index].search.multiple?.include as StringSearchType).tabclicked = true; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = false; updateCard(); emits('update:format', format); }"
            class="text-lowercase tab w-100" 
            :style="((cards[index] as SingleWordStringType).search.multiple?.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            include
          </button>
        </template>
        <template v-else>
          <button
            @keypress.enter="() => { format = 'INCLUDE'; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = true; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; updateCard(); emits('update:format', format); }"
            @click="() => { format = 'INCLUDE'; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = true; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; updateCard(); emits('update:format', format); }"
            class="text-lowercase tab w-100" 
            :style="(((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            include
          </button>
        </template>
      </li>
      <li
        class="align-self-stretch"
        :class="[
          (
            wordtypeandconcatfieldindex.wordtype === 'SINGLE'
            &&
            wordtypeandconcatfieldindex.concatfieldindex !== undefined
            &&
            (cards[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].fixedlengthofstring !== undefined
          )?
          'flex-w-100-over-3'
          : (
            ((cards[index] as SingleWordStringType).fixedlengthofstring !== undefined)?
            'flex-w-100-over-3'
            :
            'flex-w-50'
          )
        ]"
      >
        <template v-if="wordtypeandconcatfieldindex.concatfieldindex === undefined">
          <button
            @keypress.enter="() => { format = 'EXCLUDE'; (cards[index].search.multiple?.include as StringSearchType).tabclicked = false; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = true; updateCard(); emits('update:format', format); }"
            @click="() => { format = 'EXCLUDE'; (cards[index].search.multiple?.include as StringSearchType).tabclicked = false; (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = true; updateCard(); emits('update:format', format); }"
            class="text-lowercase tab w-100" 
            :style="(cards[index].search.multiple?.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            exclude
          </button>
        </template>
        <template v-else>
          <button
            @keypress.enter="() => { format = 'EXCLUDE'; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = true; updateCard(); emits('update:format', format); }"
            @click="() => { format = 'EXCLUDE'; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = true; updateCard(); emits('update:format', format); }"
            class="text-lowercase tab w-100" 
            :style="(((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            style="padding:5px 0;font-size:0.9em;"
          >
            exclude
          </button>
        </template>
      </li>
      <template v-if="wordtypeandconcatfieldindex.wordtype === 'SINGLE'">
        <template v-if="wordtypeandconcatfieldindex.concatfieldindex !== undefined">
          <template v-if="(cards[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].fixedlengthofstring !== undefined">
            <li
              class="align-self-stretch flex-w-100-over-3"
            >
              <button
                :style="format==='@NUMBER'?'background-color:#F0E68C;' : 'background-color:lightgray;'"
                @click="() => {
                  format = '@NUMBER';
                  (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].search.includeorexcludeformat = format;
                  (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; 
                  (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; 
                  updateCard();
                  emits('update:format', format);
                }"
                @keypress.enter="() => {
                  format = '@NUMBER';
                  (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].search.includeorexcludeformat = format;
                  (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.include as StringSearchType).tabclicked = false; 
                  (((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).search?.exclude as StringSearchType).tabclicked = false; 
                  updateCard();
                  emits('update:format', format);
                }"
                class="text-lowercase tab w-100" 
                style="padding:5px 0;font-size:0.9em;"
              >
                @number
              </button>
            </li>
          </template>
        </template>
        <template v-else>
          <template v-if="(cards[index] as SingleWordStringType).fixedlengthofstring !== undefined">
            <li
              class="align-self-stretch flex-w-100-over-3"
            >
              <button
                :style="format==='@NUMBER'?'background-color:#F0E68C;' : 'background-color:lightgray;'"
                @click="() => {
                  format = '@NUMBER';
                  cards[index].search.multiple.includeorexcludeformat = format;
                  (cards[index].search.multiple?.include as StringSearchType).tabclicked = false; 
                  (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = false; 
                  updateCard();
                  emits('update:format', format);
                }"
                @keypress.enter="() => {
                  format = '@NUMBER';
                  (cards[index].search.multiple).includeorexcludeformat = format;
                  (cards[index].search.multiple?.include as StringSearchType).tabclicked = false; 
                  (cards[index].search.multiple?.exclude as StringSearchType).tabclicked = false; 
                  updateCard();
                  emits('update:format', format);
                }"
                class="text-lowercase tab w-100" 
                style="padding:5px 0;font-size:0.9em;"
              >
                @number
              </button>
            </li>
          </template>
        </template>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>