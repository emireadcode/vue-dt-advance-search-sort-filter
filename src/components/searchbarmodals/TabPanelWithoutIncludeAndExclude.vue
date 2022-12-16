<script setup lang="ts">
import { inject, type ShallowRef } from "vue";
import type { PrimitiveType, SingleWordStringType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import Paste from "./Paste.vue";
const 
  props = defineProps<{
    index: number;
    concatfieldindex?: string | number | undefined;
    wordtype: 'MULTIPLE' | 'SINGLE';
  }>(),
  index = props.index,
  concatfieldindex = props.concatfieldindex,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;
</script>

<template>
  <div class="d-block" style="padding: 15px 0 10px 0">
    <template v-if="wordtype === 'MULTIPLE'">
      <template v-if="concatfieldindex === undefined">
        <DescribeLabel 
          :wordtype="wordtype"
          :index="index" 
          :concatfieldindex="(concatfieldindex as undefined)" 
          context="DESCRIBE-MODAL"
        ></DescribeLabel>
        <PasteSingleOrMultipleWords
          nospace="false"
          :index="index"
          :tree="(cards[index] as MultipleWordsStringType).search"
          :areatype="'search'"
          :text-area-height="'height: 407px;'"
          :display-area-height="'height: 367.9px;'"
        ></PasteSingleOrMultipleWords>
      </template>
      <template v-else>
        <DescribeLabel 
          :wordtype="wordtype"
          :index="index" 
          :concatfieldindex="(concatfieldindex as number)" 
          context="DESCRIBE-MODAL"
        ></DescribeLabel>
        <PasteSingleOrMultipleWords
          nospace="false"
          :index="index"
          :tree="(((cards[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search as StringSearchType"
          :areatype="
            'concatenated-search-' + concatfieldindex
          "
          :text-area-height="'height:407px;'"
          :display-area-height="'height: 367.9px;'"
        ></PasteSingleOrMultipleWords>
      </template>
    </template>
    <template v-else>
      <template v-if="concatfieldindex === undefined">
        <DescribeLabel 
          :wordtype="wordtype"
          :index="index" 
          :concatfieldindex="(concatfieldindex as undefined)" 
          context="DESCRIBE-MODAL"
        ></DescribeLabel>
        <!--<PasteSingleOrMultipleWords
          nospace="false"
          :index="index"
          :tree="(cards[index] as SingleWordStringType).search"
          :areatype="'search'"
          :text-area-height="'height: 407px;'"
          :display-area-height="'height: 367.9px;'"
        ></PasteSingleOrMultipleWords>-->

        <Paste
          :title="cards[index].info.name"
          :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
          :max="(cards[index].result.max as string)"
          :min="(cards[index].result.min as string)"
          :text-area-height="'height:450px;'"
        >
          <template v-slot:controlbuttons></template>
          <template v-slot:outcomeidentifier>
            <div
              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: #fff; width: 15px; height: 15px"
                ></div>
                Pasted Lines
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: red; width: 15px; height: 15px"
                ></div>
                Invalid Dates
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="
                    background-color: yellow;
                    width: 15px;
                    height: 15px;
                  "
                ></div>
                Out of Range
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: pink; width: 15px; height: 15px"
                ></div>
                Indeterminate 
              </div>
            </div>
          </template>
        </Paste>
      </template>
      <template v-else>
        <DescribeLabel 
          :wordtype="wordtype"
          :index="index" 
          :concatfieldindex="(concatfieldindex as number)" 
          context="DESCRIBE-MODAL"
        ></DescribeLabel>
        <!--<Paste
          nospace="false"
          :index="index"
          :tree="(((cards[index] as SingleWordStringType).concatenated as MultipleWordsStringConcatenatedFieldType)[concatfieldindex as number]).search as StringSearchType"
          :areatype="
            'concatenated-search-' + concatfieldindex
          "
          :text-area-height="'height:407px;'"
          :display-area-height="'height: 367.9px;'"
        ></Paste>-->


        <Paste
          :title="cards[index].info.name"
          :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
          :max="(cards[index].result.max as string)"
          :min="(cards[index].result.min as string)"
          :text-area-height="'height:450px;'"
        >
          <template v-slot:controlbuttons></template>
          <template v-slot:outcomeidentifier>
            <div
              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: #fff; width: 15px; height: 15px"
                ></div>
                Pasted Lines
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: red; width: 15px; height: 15px"
                ></div>
                Invalid Dates
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="
                    background-color: yellow;
                    width: 15px;
                    height: 15px;
                  "
                ></div>
                Out of Range
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: pink; width: 15px; height: 15px"
                ></div>
                Indeterminate 
              </div>
            </div>
          </template>
        </Paste>
      </template>
    </template>
  </div>
</template>