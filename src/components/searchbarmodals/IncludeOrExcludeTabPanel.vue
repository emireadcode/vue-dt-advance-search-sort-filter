<script setup lang="ts">
import { provide, inject, type ShallowRef, ref, onBeforeMount, type Ref, } from "vue";
import type { MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, SingleWordStringConcatenatedFieldType, StringSearchType, SingleWordStringType, NumberStringType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import StartWithContainExactlyEqualToAndEndsWithTabs from "./StartWithContainExactlyEqualToAndEndsWithTabs.vue";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";
import ReusableNumberSearch from "./ReusableNumberSearch.vue";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";

const
  props = defineProps<{
    context: string;
  }>(),
  holder = ref<StringSearchType>(),
  format = ref<'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO' | '@NUMBER'>(),
  newlypasteditems = ref(),
  closepastemodalsignal = ref(0),
  wordtypeandconcatfieldindex = inject("wordtypeandconcatfieldindex") as { wordtype: 'MULTIPLE' | 'SINGLE'; concatfieldindex: number | string | undefined; },
  index = inject("index") as number,
  cards = inject("cards") as ShallowRef<(SingleWordStringType | MultipleWordsStringType | NumberStringType)[]>
;

if(wordtypeandconcatfieldindex.concatfieldindex === undefined) {
  if(cards.value[index].info.datatype === 'SingleWordString' || cards.value[index].info.datatype === 'NumberString') {
    if(cards.value[index].disableincludeandexclude !== undefined && cards.value[index].disableincludeandexclude === false) {
      if((cards.value[index] as SingleWordStringType | NumberStringType).fixedlengthofstring !== undefined) {
        provide(
          "mainnumbersearcherui", 
          (cards.value[index] as SingleWordStringType | NumberStringType).search.atnumbersearch?.search
        )
      }
    }
  }
}
else {
  if(cards.value[index].info.datatype === 'SingleWordString' || cards.value[index].info.datatype === 'NumberString') {
    if((cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].disableincludeandexclude !== undefined && (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].disableincludeandexclude === false) {
      if((cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].fixedlengthofstring !== undefined) {
        provide(
          "mainnumbersearcherui", 
          (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].search?.atnumbersearch?.search
        )
      }
    }
  }
}

function addLocalNewInputEntry(nonerangeorrange: 'NONE-RANGE', newinputentry: string, inputtype: 'WORD') {
  addNewInputEntry(
    nonerangeorrange,
    newinputentry,
    inputtype,
    holder as Ref<StringSearchType>
  );
}

onBeforeMount(() => {
  if(wordtypeandconcatfieldindex.concatfieldindex === undefined) {
    holder.value = JSON.parse(JSON.stringify(cards.value[index].search as StringSearchType)) as StringSearchType;
    format.value = cards.value[index].search.includeorexcludeformat;
  }
  else {
    if(props.context === 'DESCRIBE-INCLUDE') {
      holder.value = JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].search?.include as StringSearchType)) as StringSearchType;
    }
    else {
      holder.value = JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].search?.exclude as StringSearchType)) as StringSearchType;
    }
    format.value = (cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex].search?.includeorexcludeformat;
  }
});
</script>

<template>
  <div class="d-block" style="padding: 7px 0;">
    <DescribeLabel 
      :context="context"
    ></DescribeLabel>
    <StartWithContainExactlyEqualToAndEndsWithTabs @update:format="$val => format = $val"></StartWithContainExactlyEqualToAndEndsWithTabs>
    <div class="d-block">
      <template v-if="format === '@NUMBER'">
        <div class="d-block overflow-y-auto" style="height:305px;padding: 10px 0;">
          <ReusableNumberSearch from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ReusableNumberSearch>
        </div>
      </template>
      <template v-else>
        <div
          class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
        >
          <div class="flex-fill p-0 m-0 align-self-stretch">
            <input
              @keypress.enter=""
              v-model="(holder as StringSearchType).single"
              maxlength="40"
              type="text"
              class="w-100"
              style="height:30px;padding-right:1.75rem"
            />
          </div>
          <div
            class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
            style="background-color:#eee;outline:1px solid rgba(0, 0, 0, 0.2)"
          >
            <a
              class="cursor-pointer d-block text-center"
              style="padding:3px 0"
              @click="
                addLocalNewInputEntry(
                  'NONE-RANGE',
                  (holder as StringSearchType).single,
                  'WORD'
                )
              "
            >
              <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
            </a>
          </div>
        </div>
        <Paste
          :receiveclosepastemodalsignal="closepastemodalsignal"
          :title="
            format==='STARTS-WITH'?
              'start with'
              : (
                format==='ENDS-WITH'?
                  'ends with'
                  : (
                    format==='EQUAL-TO'?
                      'equal to'
                      : 
                      'contains'
                  )
              )
          "
          :datatype="cards[index].info.datatype as 'NumberString' | 'SingleWordString' | 'MultipleWordsString'"
          :text-area-height="'height:450px;'"
          @return:newlypasteditems="$val => { newlypasteditems = $val; }"
        >
          <template v-slot:outcomeidentifier>
            <div
              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: #fff; width: 15px; height: 15px"
                ></div>
                Accepted lines
              </div>
              <div class="flex-fill text-center">
                <div
                  class="d-inline-block align-middle"
                  style="background-color: red; width: 15px; height: 15px"
                ></div>
                Invalid lines
              </div>
            </div>
          </template>
        </Paste>
        <PastedItemAndNewlyInputedEntryDisplayer
          :tree="(holder as StringSearchType)"
          treetype="StringSearchType"
          :display-area-height="'height: 167.9px;'"
          :scrollareaid="cards[index].scroll.areaid+'-search'"
        ></PastedItemAndNewlyInputedEntryDisplayer>
      </template>
    </div>
  </div>
</template>