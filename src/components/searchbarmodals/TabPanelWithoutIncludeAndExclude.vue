<script setup lang="ts">
import { type Ref, provide, inject, type ShallowRef, ref, onBeforeMount } from "vue";
import type { NumberStringType, SingleWordStringType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, StringSearchType, SingleWordStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import Paste from "./Paste.vue";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";

const
  closepastemodalsignal = ref(0),
  newlypasteditems = ref<string[][]>([]),
  holder = ref<StringSearchType>(),
  props = defineProps<{
    concatfieldindex?: string | number | undefined;
    wordtype: "MULTIPLE" | "SINGLE";
  }>(),
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,
  concatfieldindex = props.concatfieldindex,
  index = inject("index") as number
;

provide("wordtypeandconcatfieldindex", {wordtype: props.wordtype, concatfieldindex: props.concatfieldindex});

function addLocalNewInputEntry(nonerangeorrange: 'NONE-RANGE', newinputentry: string, inputtype: 'WORD') {
  addNewInputEntry(
    nonerangeorrange,
    newinputentry,
    inputtype,
    holder as Ref<StringSearchType>
  );
}

onBeforeMount(() => {
  (concatfieldindex === undefined)?
    holder.value = JSON.parse(JSON.stringify(cards.value[index].search as StringSearchType)) as StringSearchType
    :
    holder.value = JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search as StringSearchType)) as StringSearchType
  ;
});

</script>

<template>
  <div class="d-block" style="padding: 15px 0 10px 0">
    <DescribeLabel
      context="DESCRIBE-MODAL"
    ></DescribeLabel>
    <div
      class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
    >
      <div class="flex-fill p-0 m-0 align-self-stretch">
        <template v-if="wordtype === 'MULTIPLE'">
          <input
            @keypress.enter=""
            v-model="(holder as StringSearchType).single"
            maxlength="40"
            type="text"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
        <template v-else>
          <input
            @keydown.space.prevent
            @keypress.enter=""
            v-model="(holder as StringSearchType).single"
            maxlength="40"
            type="text"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
      </div>
      <div
        class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
        style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
      >
        <a
          class="cursor-pointer d-block text-center"
          style="padding: 3px 0"
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
      :title="cards[index].info.name"
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
            Accepted Lines
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: red; width: 15px; height: 15px"
            ></div>
            Invalid Lines
          </div>
        </div>
      </template>
    </Paste>
    <PastedItemAndNewlyInputedEntryDisplayer
      :tree="(holder as StringSearchType)"
      treetype="StringSearchType"
      :display-area-height="'height: 367.9px;'"
      :scrollareaid="cards[index].scroll.areaid+'-pasted-and-newinputentry'"
    ></PastedItemAndNewlyInputedEntryDisplayer>
  </div>
</template>
