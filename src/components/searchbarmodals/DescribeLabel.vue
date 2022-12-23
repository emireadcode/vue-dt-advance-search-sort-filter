<script setup lang="ts">
import { inject, type ShallowRef, computed } from "vue";
import type { NumberStringType, SingleWordStringType, MultipleWordsStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";

const 

  props = defineProps<{
    context: string;
  }>(),

  cards = inject("cards") as ShallowRef<(NumberStringType | SingleWordStringType | MultipleWordsStringType)[]>,

  index = inject("index") as number,

  wordtypeandconcatfieldindex = inject("wordtypeandconcatfieldindex") as { wordtype: 'MULTIPLE' | 'SINGLE'; concatfieldindex: number | string | undefined; }
;

const info = computed(() => {
  if(wordtypeandconcatfieldindex.concatfieldindex === undefined) {
    return cards.value[index].info.name
  }
  else {
    return ((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number]).name;
  }
});

</script>

<template>
  <div class="d-block" style="padding-bottom: 5px">
    <span class="text-lowercase">
      <template v-if="context === 'DESCRIBE-MODAL'">
        Search By
        <span class="font-bold">
          {{ info }}
        </span>
      </template>
      <template v-else>
        {{ context === 'DESCRIBE-INCLUDE'? 'show' : 'do not show' }}
        <span
          class="font-bold"
          style="padding-right: 4px; padding-left: 2px"
        >
          {{ info }}
        </span>that
      </template>
    </span>
  </div>
</template>
