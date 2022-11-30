<script setup lang="ts">
import { inject, type ShallowRef } from "vue";
import type { PrimitiveType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import AddSingleOrMultiplePaste from "./AddSingleOrMultiplePaste.vue";
const 
  props = defineProps<{
    index: number;
    concatfieldindex?: number | undefined;
  }>(),
  index = props.index,
  concatfieldindex = props.concatfieldindex,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;
</script>

<template>
  <div class="d-block" style="padding: 15px 0 10px 0">
    <template v-if="concatfieldindex === undefined">
      <DescribeLabel 
        :index="index" 
        :concatfieldindex="(concatfieldindex as undefined)" 
        context="DESCRIBE-MODAL"
      ></DescribeLabel>
      <AddSingleOrMultiplePaste
        nospace="false"
        :index="index"
        :tree="(cards[index] as MultipleWordsStringType).search"
        :areatype="'search'"
        :text-area-height="'height: 297.9px;'"
      ></AddSingleOrMultiplePaste>
    </template>
    <template v-else>
      <DescribeLabel 
        :index="index" 
        :concatfieldindex="(concatfieldindex as number)" 
        context="DESCRIBE-MODAL"
      ></DescribeLabel>
      <AddSingleOrMultiplePaste
        nospace="false"
        :index="index"
        :tree="(((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search as StringSearchType"
        :areatype="
          'concatenated-search-' + concatfieldindex
        "
        :text-area-height="'height: 297.9px;'"
      ></AddSingleOrMultiplePaste>
    </template>
  </div>
</template>