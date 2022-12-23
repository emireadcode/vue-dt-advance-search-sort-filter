<script setup lang="ts">
import DescribeLabel from './DescribeLabel.vue';
import IncludeOrExcludeTabs from './IncludeOrExcludeTabs.vue';
import IncludeOrExcludeTabPanel from './IncludeOrExcludeTabPanel.vue';
import { provide, type ShallowRef, inject, ref } from 'vue';
import type { NumberStringType, SingleWordStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringType, StringSearchType, MultipleWordsStringConcatenatedFieldType } from '../types/SupportedDatatypesTypeDeclaration';

const
  props = defineProps<{
    concatfieldindex?: string | number | undefined;
    wordtype: "MULTIPLE" | "SINGLE";
  }>(),
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,
  concatfieldindex = props.concatfieldindex,
  single = ref(""),
  index = inject("index") as number
;

provide("wordtypeandconcatfieldindex", {wordtype: props.wordtype, concatfieldindex: props.concatfieldindex});

</script>

<template>
  <div class="d-block">
    <div class="d-block" style="padding: 15px 0 10px 0">
      <DescribeLabel context="DESCRIBE-MODAL"></DescribeLabel>
      <div class="d-block">
        <template v-if="concatfieldindex === undefined">
          <input
            type="text"
            v-model="single"
            class="w-100 shadow-sm"
            style="height: 30px"
          />
        </template>
        <template v-else>
          <input
            type="text"
            v-model="single"
            class="w-100 shadow-sm"
            style="height: 30px"
          />
        </template>
      </div>
    </div>
    <IncludeOrExcludeTabs></IncludeOrExcludeTabs>
    <div class="d-block">
      <template v-if="concatfieldindex === undefined">
        <template v-if="(cards[index].search.include as StringSearchType).tabclicked">
          <IncludeOrExcludeTabPanel context="DESCRIBE-INCLUDE"></IncludeOrExcludeTabPanel>
        </template>
        <template v-else>
          <IncludeOrExcludeTabPanel context="DESCRIBE-EXCLUDE"></IncludeOrExcludeTabPanel>
        </template>
      </template>
      <template v-else>
        <template v-if="((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search?.include as StringSearchType).tabclicked">
          <IncludeOrExcludeTabPanel context="DESCRIBE-INCLUDE"></IncludeOrExcludeTabPanel>
        </template>
        <template v-else>
          <IncludeOrExcludeTabPanel context="DESCRIBE-EXCLUDE"></IncludeOrExcludeTabPanel>
        </template>
      </template>
    </div>
  </div>
</template>
