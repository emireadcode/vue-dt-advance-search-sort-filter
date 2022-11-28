<script setup lang="ts">
import type { StringSearchType, MultipleWordsStringType, PrimitiveType, MultipleWordsStringConcatenatedFieldType } from "../types/SupportedDatatypesTypeDeclaration";
import { inject, triggerRef, type ShallowRef, onMounted } from "vue";

const 
  props = defineProps<{
    index: number;
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

function updateAttributeButtonTabClicked(clickedtype: string, bindex: number | undefined) {
  if(clickedtype === 'CONCATENATED-NAME-FIELD') {
    (cards.value[index] as MultipleWordsStringType).search.tabclicked = true;
    Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
      (concatenated.search as StringSearchType).tabclicked = false;
    });
  }
  else {
    if((cards.value[index] as MultipleWordsStringType).concatenatedname !== undefined) {
      (cards.value[index] as MultipleWordsStringType).search.tabclicked = false;
      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        if(""+(bindex as number) === ""+i) {
          (concatenated.search as StringSearchType).tabclicked = true;
        }
        else {
          (concatenated.search as StringSearchType).tabclicked = false;
        }
      });
    }
    else {
      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        if(""+(bindex as number) === ""+i) {
          (concatenated.search as StringSearchType).tabclicked = true;
        }
        else {
          (concatenated.search as StringSearchType).tabclicked = false;
        }
      });
    }
  }
  triggerRef(cards);
}

function setTabDefaultSelection() {
  if(!(cards.value[index] as MultipleWordsStringType).concatenated) {
    (cards.value[index] as MultipleWordsStringType).search.tabclicked = true;
    ((cards.value[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = true;
    ((cards.value[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = false;
  }
  else {
    if((cards.value[index] as MultipleWordsStringType).concatenatedname !== undefined) {
      (cards.value[index] as MultipleWordsStringType).search.tabclicked = true;
      ((cards.value[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = true;
      ((cards.value[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = false;

      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        (concatenated.search as StringSearchType).tabclicked = false;
        if(!concatenated.aword) {
          (concatenated.search?.include as StringSearchType).tabclicked = true;
          (concatenated.search?.exclude as StringSearchType).tabclicked = false;
        }
      });
    }
    else {
      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        if(i === 0) {
          (concatenated.search as StringSearchType).tabclicked = true;
        }
        else {
          (concatenated.search as StringSearchType).tabclicked = false;
        }
        if(!concatenated.aword) {
          (concatenated.search?.include as StringSearchType).tabclicked = true;
          (concatenated.search?.exclude as StringSearchType).tabclicked = false;
        }
      });
    }
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
    class="shadow-sm d-block overflow-x-auto"
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
        <template v-if="(cards[index] as MultipleWordsStringType).concatenatedname !== undefined">
          <li
            class="flex-shrink-0 flex-grow-0 align-self-stretch"
          >
            <button
              @click="() => {(cards[index] as MultipleWordsStringType).search.tabclicked=true; updateAttributeButtonTabClicked('CONCATENATED-NAME-FIELD', undefined); }"
              class="text-lowercase tab" 
              :style="(cards[index] as MultipleWordsStringType).search.tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
              style="padding:5px 8px;font-size:1em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
            >
              {{ (cards[index] as MultipleWordsStringType).concatenatedname }}
            </button>
          </li>
        </template>
        <li
          v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType).concatenated"
          class="flex-shrink-0 flex-grow-0 align-self-stretch"
        >
          <button 
            :style="(concatenated.search as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
            @click="() => { (concatenated.search as StringSearchType).tabclicked=true; updateAttributeButtonTabClicked('ONE-OF-CONCATENATED-FIELD', cindex as number); }"
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
