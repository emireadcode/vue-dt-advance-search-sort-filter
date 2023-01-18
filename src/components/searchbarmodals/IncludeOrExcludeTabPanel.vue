<script setup lang="ts">
import {
  triggerRef, 
  shallowRef,
  inject,
  type ShallowRef,
  ref,
  onBeforeMount,
} from "vue";
import type { 
  MultipleWordsStringType,
  MultipleWordsStringConcatenatedFieldType,
  SingleWordStringConcatenatedFieldType,
  StringSearchType,
  SingleWordStringType,
  NumberStringType,
} from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import StartWithContainExactlyEqualToAndEndsWithTabs from "./StartWithContainExactlyEqualToAndEndsWithTabs.vue";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";

const
  props = defineProps<{
    context: string;
  }>(),
  emits = defineEmits<{
    (e: "disable:searchphraseinputbox", action: boolean): void;
  }>(),
  holder = shallowRef<StringSearchType>(),
  concatfieldindex = inject("concatfieldindex") as number | undefined,
  index = inject("index") as number,
  cards = inject("cards") as ShallowRef<(SingleWordStringType | MultipleWordsStringType | NumberStringType)[]>
;

function triggerHolder() {
  triggerRef(holder);
}

async function addLocalNewInputEntry(newinputentry: string, inputtype: 'WORD') {
  await addNewInputEntry(
    newinputentry,
    inputtype,
    holder as ShallowRef<StringSearchType>,
    'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL'
  );
}

async function addPastedItems(pasteditems: string[][], inputtype: 'WORD') {
  let 
    time: NodeJS.Timeout[] = [],
    timeIndex = 0
  ;
  for(let i=0; i < pasteditems.length; i++) {
    let item = pasteditems[i];
    if (item[1] !== "ERROR") {
      if (item[0].trim().length > 0) {
        time[timeIndex] = setTimeout(async () => {
          await addNewInputEntry(
            item[0],
            inputtype,
            holder as ShallowRef<StringSearchType>,
            'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL'
          );
          clearTimeout(time[timeIndex]);
        }, 10);
        timeIndex++;
      }
    }
  }
  (holder.value as StringSearchType).closepaste++;
  triggerRef(holder);
}

onBeforeMount(() => {
  if(concatfieldindex === undefined) {
    holder.value = JSON.parse(JSON.stringify(cards.value[index].search.multiple as StringSearchType)) as StringSearchType;
  }
  else {
    if(props.context === 'DESCRIBE-INCLUDE') {
      holder.value = JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search?.include as StringSearchType)) as StringSearchType;
    }
    else {
      holder.value = JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search?.exclude as StringSearchType)) as StringSearchType;
    }
  }
});

</script>

<template>
  <div class="d-block" style="padding: 7px 0;">
    <DescribeLabel 
      :context="context"
    ></DescribeLabel>
    <StartWithContainExactlyEqualToAndEndsWithTabs @disable:searchphraseinputbox="($val: boolean) => emits('disable:searchphraseinputbox', $val)"></StartWithContainExactlyEqualToAndEndsWithTabs>
    <div class="d-block">
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
        :pastebuttonfontsize="'font-size:0.85rem;'"
        :receiveclosepastemodalsignal="(holder as StringSearchType).closepaste"
        :title="(concatfieldindex === undefined? cards[index].search.multiple :  (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='STARTS-WITH'?
          'starts with'
          : (
            (concatfieldindex === undefined? cards[index].search.multiple :  (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='ENDS-WITH'?
              'ends with'
              : (
                (concatfieldindex === undefined? cards[index].search.multiple :  (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='EQUAL-TO'?
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
        paginationarea="WORD"
        :current="[(holder as StringSearchType).signal, (holder as StringSearchType).current]"
        :tree="(holder as StringSearchType)"
        treetype="StringSearchType"
        :display-area-height="'height: 185.9px;'"
        :scrollareaid="cards[index].scroll.areaid+'-search'"
        @update:current="($val) => {(holder as StringSearchType).current = $val; triggerHolder();}"
      ></PastedItemAndNewlyInputedEntryDisplayer>
    </div>
  </div>
</template>