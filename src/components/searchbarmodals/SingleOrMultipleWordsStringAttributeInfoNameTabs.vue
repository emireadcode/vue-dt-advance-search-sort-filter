<script setup lang="ts">
import type { SingleWordStringConcatenatedFieldType, SingleWordStringType, StringSearchType, MultipleWordsStringType, MultipleWordsStringConcatenatedFieldType, NumberStringType } from "../types/SupportedDatatypesTypeDeclaration";
import { inject, triggerRef, type ShallowRef, onMounted } from "vue";

const 
  props = defineProps<{
    wordtype: 'MULTIPLE' | 'SINGLE';
  }>(),
  index = inject("index") as number,
  cards = inject("cards") as ShallowRef<( MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>
;

function updateAttributeButtonTabClicked(bindex?: number | undefined) {
  if(cards.value[index].concatenated !== undefined) {
    Object.values(cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType).forEach((concatenated, i) => {
      if(""+(bindex as number) === ""+i) {
        (concatenated.search as StringSearchType).tabclicked = true;
      }
      else {
        (concatenated.search as StringSearchType).tabclicked = false;
      }
    });
  }
  triggerRef(cards);
}

function setTabDefaultSelection() {
  if(!cards.value[index].concatenated) {
    (cards.value[index].search.multiple as StringSearchType).tabclicked = true;
    if(cards.value[index].disableincludeandexclude !== undefined 
      && 
      !cards.value[index].disableincludeandexclude
    ) {
      (cards.value[index].search.multiple?.include as StringSearchType).tabclicked = true;
      (cards.value[index].search.multiple?.exclude as StringSearchType).tabclicked = false;
    }
  }
  else {
    Object.values(cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType).forEach((concatenated, i) => {
      if(i === 0) {
        (concatenated.search as StringSearchType).tabclicked = true;
      }
      else {
        (concatenated.search as StringSearchType).tabclicked = false;
      }
      if(concatenated.disableincludeandexclude !== undefined && !concatenated.disableincludeandexclude) {
        (concatenated.search?.include as StringSearchType).tabclicked = true;
        (concatenated.search?.exclude as StringSearchType).tabclicked = false;
      }
    });
  }
  triggerRef(cards);
}

onMounted(() => {
  setTabDefaultSelection();
});

</script>


<template>
  <div
    style="background-color: #fff; padding: 10px 5px 0 5px;white-space: nowrap;"
    class="shadow-sm d-block overflow-x-scroll"
  >
    <template v-if="!(cards[index] as MultipleWordsStringType).concatenated">
      <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
        <li
          class="flex-shrink-0 flex-grow-0 align-self-stretch"
        >
          <button 
            aria-disabled="true" 
            class="text-lowercase tab" 
            style="padding:5px 8px;font-size:1em;background-color:#F0E68C;border-top-right-radius: 8px;border-top-left-radius: 8px;"
          >
            {{ (cards[index] as MultipleWordsStringType).info.name }}
          </button>
        </li>
      </ul>
    </template>
    <template v-else>
      <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
        <li
          v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType).concatenated"
          class="flex-shrink-0 flex-grow-0 align-self-stretch"
        >
          <button 
            :style="(concatenated.search as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            @keypress.enter="() => { (concatenated.search as StringSearchType).tabclicked=true; updateAttributeButtonTabClicked(cindex as number); }"
            @click="() => { (concatenated.search as StringSearchType).tabclicked=true; updateAttributeButtonTabClicked(cindex as number); }"
            class="text-lowercase tab" 
            style="padding:5px 8px;font-size:1em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
          >
            {{ concatenated.name }}
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>