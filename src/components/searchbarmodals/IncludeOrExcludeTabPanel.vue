<script setup lang="ts">
import {
  triggerRef, 
  shallowRef,
  provide,
  inject,
  type ShallowRef,
  ref,
  onBeforeMount,
} from "vue";
import type { 
  CurrentAndSignalInnerType,
  CurrentAndSignalType,
  MultipleWordsStringType,
  MultipleWordsStringConcatenatedFieldType,
  SingleWordStringConcatenatedFieldType,
  StringSearchType,
  SingleWordStringType,
  NumberStringType,
  EnteredWhenInAndWhenNotInPageType,
} from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import StartWithContainExactlyEqualToAndEndsWithTabs from "./StartWithContainExactlyEqualToAndEndsWithTabs.vue";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";
import ReusableNumberSearch from "./ReusableNumberSearch.vue";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";

const
  currentandsignal = shallowRef<CurrentAndSignalType>({
    word: {
      signal: 0,
      current: 0,
      closepaste: 0,
    }
  }),
  props = defineProps<{
    context: string;
  }>(),
  holder = shallowRef<StringSearchType>(),
  format = ref<'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO' | '@NUMBER'>(),
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
          shallowRef(JSON.parse(JSON.stringify((cards.value[index] as SingleWordStringType | NumberStringType).search.multiple?.atnumbersearch)))
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
          shallowRef(JSON.parse(JSON.stringify((cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[wordtypeandconcatfieldindex.concatfieldindex as number].search?.atnumbersearch)))
        )
      }
    }
  }
}

function triggerHolder() {
  triggerRef(holder);
}

function triggerCurrentAndSignal() {
  triggerRef(currentandsignal);
}

async function addLocalNewInputEntry(newinputentry: string, inputtype: 'WORD') {
  let 
    enteredwheninandwhennot = shallowRef<EnteredWhenInAndWhenNotInPageType>({
      enteredwheninpage: false,
      enteredwhennotinpage: false
    })
  ;
  await addNewInputEntry(
    newinputentry,
    inputtype,
    currentandsignal as ShallowRef<CurrentAndSignalType>,
    holder as ShallowRef<StringSearchType>,
    enteredwheninandwhennot
  );
}

async function addPastedItems(pasteditems: string[][], inputtype: 'WORD') {
  let 
    time: NodeJS.Timeout[] = [],
    timeIndex = 0,
    enteredwheninandwhennot = shallowRef<EnteredWhenInAndWhenNotInPageType>({
      enteredwheninpage: false,
      enteredwhennotinpage: false
    })
  ;
  for(let i=0; i<pasteditems.length; i++) {
    let item = pasteditems[i];
    if (item[1] !== "ERROR") {
      if (item[0].trim().length > 0) {
        time[timeIndex] = setTimeout(async () => {
          await addNewInputEntry(
            item[0],
            inputtype,
            currentandsignal as ShallowRef<CurrentAndSignalType>,
            holder as ShallowRef<StringSearchType>,
            enteredwheninandwhennot
          );
          clearTimeout(time[timeIndex]);
        }, 10);
        timeIndex++;
      }
    }
  }
  ((currentandsignal.value as CurrentAndSignalType).word as CurrentAndSignalInnerType).closepaste++;
  triggerRef(currentandsignal);
}

onBeforeMount(() => {
  if(wordtypeandconcatfieldindex.concatfieldindex === undefined) {
    holder.value = JSON.parse(JSON.stringify(cards.value[index].search.multiple as StringSearchType)) as StringSearchType;
    format.value = cards.value[index].search.multiple?.includeorexcludeformat;
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
    <StartWithContainExactlyEqualToAndEndsWithTabs :format="format as 'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO' | '@NUMBER'" @update:format="$val => format = $val"></StartWithContainExactlyEqualToAndEndsWithTabs>
    <div class="d-block">
      <template v-if="format === '@NUMBER'">
        <div class="d-block overflow-y-auto" style="height:305px;padding: 10px 0;">
          <ReusableNumberSearch from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ReusableNumberSearch>
        </div>
      </template>
      <template v-else>
        <div
          class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
        >
          <div class="flex-fill p-0 m-0 align-self-stretch">
            <input
              @keypress.enter="
                addLocalNewInputEntry(
                  (holder as StringSearchType).single,
                  'WORD'
                )
              "
              @input="triggerHolder()"
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
            <button
              class="cursor-pointer text-center btn w-100"
              style="padding:3px 0;height:30px;"
              @click="
                addLocalNewInputEntry(
                  (holder as StringSearchType).single,
                  'WORD'
                )
              "
              @keypress.enter="
                addLocalNewInputEntry(
                  (holder as StringSearchType).single,
                  'WORD'
                )
              "
            >
              <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
            </button>
          </div>
        </div>
        <Paste
          :receiveclosepastemodalsignal="((currentandsignal as CurrentAndSignalType).word as CurrentAndSignalInnerType).closepaste"
          :title="
            format==='STARTS-WITH'?
              'starts with'
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
          :text-area-height="'height:197px;'"
          @return:newlypasteditems="$val => { addPastedItems($val, 'WORD'); }"
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
          paginationtype="WORD"
          :current="[((currentandsignal as CurrentAndSignalType).word as CurrentAndSignalInnerType).signal, ((currentandsignal as CurrentAndSignalType).word as CurrentAndSignalInnerType).current]"
          :tree="(holder as StringSearchType)"
          treetype="StringSearchType"
          :display-area-height="'height: 185.9px;'"
          :scrollareaid="cards[index].scroll.areaid+'-search'"
          @update:current="($val) => {((currentandsignal as CurrentAndSignalType).word as CurrentAndSignalInnerType).current = $val; triggerCurrentAndSignal();}"
        ></PastedItemAndNewlyInputedEntryDisplayer>
      </template>
    </div>
  </div>
</template>