<script setup lang="ts">
import DescribeLabel from './DescribeLabel.vue';
import IncludeOrExcludeTabs from './IncludeOrExcludeTabs.vue';
import IncludeOrExcludeTabPanel from './IncludeOrExcludeTabPanel.vue';
import { triggerRef, provide, type ShallowRef, inject, ref, shallowRef, } from 'vue';
import type { NumberStringType, SingleWordStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringType, StringSearchType, MultipleWordsStringConcatenatedFieldType } from '../types/SupportedDatatypesTypeDeclaration';
import ReusableNumberSearch from "./ReusableNumberSearch.vue";
import ExcludeNumberSearch from "./ExcludeNumberSearch.vue";
import AtNumberSearchSetter from "./AtNumberSearchSetter.vue";

const
  openatnumbersearch = ref(false),
  format = ref<'INCLUDE' | 'EXCLUDE' | '@NUMBER'>(),
  props = defineProps<{
    concatfieldindex?: string | number | undefined;
    wordtype: "MULTIPLE" | "SINGLE";
    numberexclude?: boolean | undefined;
  }>(),
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,
  concatfieldindex = props.concatfieldindex,
  single = ref(""),
  emits = defineEmits<{
    (e: "enable:exclude", action: boolean): void;
    (e: "close:exclude", action: boolean): void;
  }>(),
  index = inject("index") as number
;

provide("wordtypeandconcatfieldindex", {wordtype: props.wordtype, concatfieldindex: props.concatfieldindex});

if(concatfieldindex === undefined) {
  if(cards.value[index].info.datatype === 'SingleWordString' || cards.value[index].info.datatype === 'NumberString') {
    if(cards.value[index].disableincludeandexclude !== undefined && cards.value[index].disableincludeandexclude === false) {
      if((cards.value[index] as SingleWordStringType | NumberStringType).fixedlengthofstring !== undefined) {
        provide(
          "numbersearchcard", 
          shallowRef(JSON.parse(JSON.stringify((cards.value[index] as SingleWordStringType | NumberStringType).search.multiple.atnumbersearch)))
        )
      }
    }
  }
}
else {
  if(cards.value[index].info.datatype === 'SingleWordString' || cards.value[index].info.datatype === 'NumberString') {
    if((cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[concatfieldindex as number].disableincludeandexclude !== undefined && (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[concatfieldindex as number].disableincludeandexclude === false) {
      if((cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[concatfieldindex as number].fixedlengthofstring !== undefined) {
        provide(
          "numbersearchcard", 
          shallowRef(JSON.parse(JSON.stringify((cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search.atnumbersearch)))
        )
      }
    }
  }
}

function setDefaultFormat() {
  if(format.value !== '@NUMBER') {
    if(concatfieldindex === undefined) {
      cards.value[index].search.multiple.includeorexcludeformat = "STARTS-WITH";
    }
    else {
      (cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search.includeorexcludeformat = "STARTS-WITH";
    }
    triggerRef(cards);
  }
}

</script>

<template>
  <div class="d-block position-relative">
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
    <IncludeOrExcludeTabs @update:format="($val: 'INCLUDE' | 'EXCLUDE' | '@NUMBER') => { format = $val; setDefaultFormat(); }"></IncludeOrExcludeTabs>
    <template v-if="format === '@NUMBER'">
      <div class="d-block" style="padding:2px 0">
        <div class="d-block overflow-hidden shadow-sm" style="height:390px;padding: 10px 0px;">
          <AtNumberSearchSetter @enable:exclude="($val: boolean) => emits('enable:exclude', $val)" @open:atnumbersearch="($val: boolean) => openatnumbersearch=$val"></AtNumberSearchSetter>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="concatfieldindex === undefined">
        <template v-if="(cards[index].search.multiple?.include as StringSearchType).tabclicked">
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
    </template>
    <template v-if="openatnumbersearch">
      <template v-if="format === '@NUMBER'">
        <div class="w-100 position-absolute t-0 l-0 h-100">
          <div class="overflow-y-auto h-100 d-block" style="background-color: #fff;outline: 1px solid blue;border-bottom:3px solid blue;">
            <template v-if="typeof props.numberexclude === undefined || props.numberexclude === false">
              <div
                class="shadow-sm d-block text-center"
                style="background-color: blue;padding: 0 0.63rem;"
              >
                <a
                  class="underline-none cursor-pointer align-middle"
                  @click="() => { openatnumbersearch=false; emits('enable:exclude', true); }"
                  @keypress.enter="() => { openatnumbersearch=false; emits('enable:exclude', true); }"
                >
                  <img
                    src="/src/assets/icons/close.png"
                    class="align-middle"
                    style="width: 2.205rem; height: 2.205rem"
                  />
                </a>
              </div>
              <ReusableNumberSearch @enable:exclude="($val: boolean) => emits('enable:exclude', $val)" from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ReusableNumberSearch>
            </template>
            <template v-else>
              <ExcludeNumberSearch @close:exclude="($val: boolean) => emits('close:exclude', $val)" from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ExcludeNumberSearch>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
