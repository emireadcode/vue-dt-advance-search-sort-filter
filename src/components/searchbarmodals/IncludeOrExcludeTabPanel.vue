<script setup lang="ts">
import { inject, type ShallowRef } from "vue";
import type { PrimitiveType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import StartWithContainExactlyEqualToAndEndsWithTabs from "./StartWithContainExactlyEqualToAndEndsWithTabs.vue";
import Paste from "./Paste.vue";
const 
  props = defineProps<{
    index: number;
    concatfieldindex?: string | number | undefined;
    context: string;
    wordtype: "MULTIPLE" | "SINGLE";
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;
</script>

<template>
  <div class="d-block" style="padding: 7px 0;">
    <template v-if="concatfieldindex === undefined">
      <DescribeLabel 
        :wordtype="wordtype"
        :index="index" 
        :concatfieldindex="(concatfieldindex as undefined)" 
        :context="context"
      ></DescribeLabel>
      <StartWithContainExactlyEqualToAndEndsWithTabs></StartWithContainExactlyEqualToAndEndsWithTabs>
      <Paste
        :areatype="
          context==='DESCRIBE-EXCLUDE'?
          'search-exclude'
          :
          'search-include'
        "
        :text-area-height="'height:240px;'"
      ></Paste>
    </template>
    <template v-else>
      <DescribeLabel 
        :wordtype="wordtype"
        :index="index" 
        :concatfieldindex="(concatfieldindex as number)" 
        :context="context"
      ></DescribeLabel>
      <StartWithContainExactlyEqualToAndEndsWithTabs></StartWithContainExactlyEqualToAndEndsWithTabs>
      <Paste
        :areatype="
          context==='DESCRIBE-EXCLUDE'?
          'concatenated-search-exclude-' + concatfieldindex
          :
          'concatenated-search-include-' + concatfieldindex
        "
        :text-area-height="'height:240px;'"
      ></Paste>
    </template>
  </div>
</template>