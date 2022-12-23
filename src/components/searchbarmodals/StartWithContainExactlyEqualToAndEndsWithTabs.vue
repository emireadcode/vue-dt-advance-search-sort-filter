<script setup lang="ts">
import { inject, type ShallowRef } from "vue";
import type { MultipleWordsStringType, SingleWordStringType, NumberStringType, SingleWordStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";

const 
  buttonnames = ['starts with', 'contains', 'equal to', 'ends with'],

  emits = defineEmits<{
    (e: "update:format", action: 'STARTS-WITH' | 'ENDS-WITH' | 'CONTAINS' | 'EQUAL-TO' | '@NUMBER'): void;
  }>(),

  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,

  index = inject("index") as number,

  wordtypeandconcatfieldindex = inject("wordtypeandconcatfieldindex") as { wordtype: 'MULTIPLE' | 'SINGLE'; concatfieldindex: number | string | undefined; }
;
</script>


<template>
  <div class="d-block" style="padding: 7px 0px 15px 0px;">
    <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
      <li
        class="flex-shrink-0 flex-grow-0 align-self-stretch"
        v-for="(name, bindex) in buttonnames"
        :key="bindex + 'bn'"
        :class="[
          (
            (
              wordtypeandconcatfieldindex.wordtype === 'SINGLE' 
              && wordtypeandconcatfieldindex.concatfieldindex !== undefined
              && (cards[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].fixedlengthofstring !== undefined
            )
            ||
            (
              wordtypeandconcatfieldindex.wordtype === 'SINGLE' 
              && wordtypeandconcatfieldindex.concatfieldindex === undefined
              && (cards[index] as SingleWordStringType).fixedlengthofstring !== undefined
            )
          )? 'flex-w-20' : 'flex-w-25'
        ]"
      >
        <button
          @click="
            emits(
              'update:format', 
              name==='starts with'? 'STARTS-WITH'
              : (
                name==='ends with'? 'ENDS-WITH'
                : (
                  name==='contains'? 'CONTAINS' : 'EQUAL-TO'
                )
              )
            )
          "
          class="text-lowercase tab w-100" 
          style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
        >
          {{ name }}
        </button>
      </li>
      <template v-if="wordtypeandconcatfieldindex.wordtype === 'SINGLE'">
        <template v-if="wordtypeandconcatfieldindex.concatfieldindex !== undefined">
          <template v-if="(cards[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].fixedlengthofstring !== undefined">
            <li
              class="flex-shrink-0 flex-grow-0 align-self-stretch flex-w-20"
            >
              <button
                @click="emits('update:format', '@NUMBER')"
                class="text-lowercase tab w-100" 
                style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
              >
                @number
              </button>
            </li>
          </template>
        </template>
        <template v-else>
          <template v-if="(cards[index] as SingleWordStringType).fixedlengthofstring !== undefined">
            <li
              class="flex-shrink-0 flex-grow-0 align-self-stretch flex-w-20"
            >
              <button
                @click="emits('update:format', '@NUMBER')"
                class="text-lowercase tab w-100" 
                style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
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