<script setup lang="ts">
import { inject, type ShallowRef, computed } from "vue";
import type { PrimitiveType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";

const 
  props = defineProps<{
    index: number;
    concatfieldindex?: number | undefined;
    context: string;
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

const info = computed(() => {
  if(props.context === 'DESCRIBE-MODAL') {
    if(!(cards.value[index] as MultipleWordsStringType).concatenated) {
      return (cards.value[index] as MultipleWordsStringType).info.name
    }
    else {
      if((cards.value[index] as MultipleWordsStringType).concatenatedname !== undefined) {
        return (cards.value[index] as MultipleWordsStringType).concatenatedname;
      }
      else {
        return (((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[props.concatfieldindex as number]).name;
      }
    }
  }
  else {
    if(!(cards.value[index] as MultipleWordsStringType).concatenated) {
      return (cards.value[index] as MultipleWordsStringType).info.name
    }
    else {
      if((cards.value[index] as MultipleWordsStringType).concatenatedname !== undefined) {
        return (cards.value[index] as MultipleWordsStringType).concatenatedname;
      }
      else {
        return (((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[props.concatfieldindex as number]).name;
      }
    }
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
          style="padding-right: 4px; padding-left: 4px"
        >
          {{ info }}
        </span>that
      </template>
    </span>
  </div>
</template>
