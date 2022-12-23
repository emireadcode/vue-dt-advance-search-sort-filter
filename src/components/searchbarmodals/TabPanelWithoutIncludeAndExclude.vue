<script setup lang="ts">
import { provide, inject, type ShallowRef, ref, onBeforeMount } from "vue";
import type { NumberStringType, SingleWordStringType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, StringSearchType, SingleWordStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";

const 
  newinputentrysignal = ref(0),
  newlypasteditemssignal = ref(0),
  closepastemodalsignal = ref(0),
  newlypasteditems = ref<string[][]>([]),
  holder = ref(),
  props = defineProps<{
    concatfieldindex?: string | number | undefined;
    wordtype: "MULTIPLE" | "SINGLE";
  }>(),
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,
  concatfieldindex = props.concatfieldindex,
  newinputentry = ref(""),
  index = inject("index") as number
;

provide("wordtypeandconcatfieldindex", {wordtype: props.wordtype, concatfieldindex: props.concatfieldindex});

onBeforeMount(() => {
  (concatfieldindex === undefined)?
    holder.value = JSON.parse(JSON.stringify(cards.value[index].search as StringSearchType))
    :
    holder.value = JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex].search as StringSearchType))
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
            @keypress.enter="()=>{newinputentry.trim().length>0? newinputentrysignal++ : newinputentrysignal;}"
            v-model="newinputentry"
            maxlength="40"
            type="text"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
        <template v-else>
          <input
            @keydown.space.prevent
            @keypress.enter="()=>{newinputentry.trim().length>0? newinputentrysignal++ : newinputentrysignal;}"
            v-model="newinputentry"
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
          @click="()=>{newinputentry.trim().length>0? newinputentrysignal++ : newinputentrysignal;}"
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
      @return:newlypasteditems="$val => { newlypasteditems = $val; newlypasteditemssignal++; }"
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
      :tree="holder"
      treetype="StringSearchType"
      :display-area-height="'height: 367.9px;'"
      :limit="900"
      :scrollareaid="cards[index].scroll.areaid+'-pasted-and-newinputentry'"
      :receivenewinputentrysignal="[newinputentrysignal, newinputentry]"
      :receivenewlypasteditemssignal="[newlypasteditemssignal, newlypasteditems]"
      @update:newinputentry="newinputentry=''"
      @close:pastemodal="() => {closepastemodalsignal++; newlypasteditems=[];}"
    ></PastedItemAndNewlyInputedEntryDisplayer>
  </div>
</template>
