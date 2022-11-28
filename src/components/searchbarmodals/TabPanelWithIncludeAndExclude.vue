<script setup lang="ts">
import DescribeLabel from './DescribeLabel.vue';
import IncludeOrExcludeTabs from './IncludeOrExcludeTabs.vue';
import IncludeOrExcludeTabPanel from './IncludeOrExcludeTabPanel.vue';
import { type ShallowRef, inject } from 'vue';
import type { PrimitiveType, MultipleWordsStringType, StringSearchType, MultipleWordsStringConcatenatedFieldType } from '../types/SupportedDatatypesTypeDeclaration';

const
  props = defineProps<{
    index: number;
    concatfieldindex?: number | undefined;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index,
  concatfieldindex = props.concatfieldindex
;

</script>

<template>
  <div class="d-block">
    <div class="d-block" style="padding: 15px 0 10px 0">
      <DescribeLabel :index="index" :concatfieldindex="concatfieldindex" context="DESCRIBE-MODAL"></DescribeLabel>
      <div class="d-block">
        <template v-if="concatfieldindex === undefined">
          <input
            type="text"
            v-model="(cards[index] as MultipleWordsStringType).search.single"
            class="w-100 shadow-sm"
            style="height: 30px"
          />
        </template>
        <template v-else>
          <input
            type="text"
            v-model="(((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number].search as StringSearchType).single"
            class="w-100 shadow-sm"
            style="height: 30px"
          />
        </template>
      </div>
    </div>
    <IncludeOrExcludeTabs :index="index" :concatfieldindex="concatfieldindex"></IncludeOrExcludeTabs>
    <div class="d-block">
      <template v-if="concatfieldindex === undefined">
        <template v-if="((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked">
          <IncludeOrExcludeTabPanel :index="index" :concatfieldindex="concatfieldindex" context="DESCRIBE-INCLUDE"></IncludeOrExcludeTabPanel>
        </template>
        <template v-else>
          <IncludeOrExcludeTabPanel :index="index" :concatfieldindex="concatfieldindex" context="DESCRIBE-EXCLUDE"></IncludeOrExcludeTabPanel>
        </template>
      </template>
      <template v-else>
        <template v-if="(((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number].search?.include as StringSearchType).tabclicked">
          <IncludeOrExcludeTabPanel :index="index" :concatfieldindex="concatfieldindex" context="DESCRIBE-INCLUDE"></IncludeOrExcludeTabPanel>
        </template>
        <template v-else>
          <IncludeOrExcludeTabPanel :index="index" :concatfieldindex="concatfieldindex" context="DESCRIBE-EXCLUDE"></IncludeOrExcludeTabPanel>
        </template>
      </template>
    </div>
  </div>
</template>
