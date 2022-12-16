<script setup lang="ts">
import { inject, type ShallowRef, computed } from "vue";
import type { PrimitiveType, SingleWordStringType, MultipleWordsStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";

const 
  props = defineProps<{
    index: number;
    concatfieldindex?: string | number | undefined;
    context: string;
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

const info = computed(() => {
  if(props.concatfieldindex === undefined) {
    return (cards.value[index] as PrimitiveType).info.name
  }
  else {
    return (((cards.value[index] as MultipleWordsStringType | SingleWordStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[props.concatfieldindex as number]).name;
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
