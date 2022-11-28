<script setup lang="ts">
import { inject, type ShallowRef } from "vue";
import type { PrimitiveType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import StartWithContainExactlyEqualToAndEndsWithTabs from "./StartWithContainExactlyEqualToAndEndsWithTabs.vue";
import AddSingleOrMultiplePaste from "./AddSingleOrMultiplePaste.vue";

const 
  props = defineProps<{
    index: number;
    concatfieldindex?: number | undefined;
    context: string;
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

</script>

<template>
  <div class="d-block" style="padding: 7px 0;">
    <template v-if="concatfieldindex === undefined">
      <DescribeLabel 
        :index="index" 
        :concatfieldindex="concatfieldindex" 
        :context="context"
      ></DescribeLabel>
      <StartWithContainExactlyEqualToAndEndsWithTabs></StartWithContainExactlyEqualToAndEndsWithTabs>
      <AddSingleOrMultiplePaste
        nospace="false"
        :index="index"
        :tree="
          context==='DESCRIBE-EXCLUDE'?
          ((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType)
          :
          ((cards[index] as MultipleWordsStringType).search.include as StringSearchType)
        "
        :areatype="
          context==='DESCRIBE-EXCLUDE'?
          'search-exclude'
          :
          'search-include'
        "
        :text-area-height="'height: 120px;'"
      ></AddSingleOrMultiplePaste>
    </template>
    <template v-else>
      <DescribeLabel 
        :index="index" 
        :concatfieldindex="concatfieldindex" 
        :context="context"
      ></DescribeLabel>
      <StartWithContainExactlyEqualToAndEndsWithTabs></StartWithContainExactlyEqualToAndEndsWithTabs>
      <AddSingleOrMultiplePaste
        nospace="false"
        :index="index"
        :tree="
          context==='DESCRIBE-EXCLUDE'?
          ((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.exclude as StringSearchType)
          :
          ((((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search?.include as StringSearchType)
        "
        :areatype="
          context==='DESCRIBE-EXCLUDE'?
          'concatenated-search-exclude-' + concatfieldindex
          :
          'concatenated-search-include-' + concatfieldindex
        "
        :text-area-height="'height: 120px;'"
      ></AddSingleOrMultiplePaste>
    </template>
  </div>
</template>