
<script setup lang="ts">
import { ref, inject, type ShallowRef, type Ref } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import Switchable from "./Switchable.vue";
/*
import DateSearcherModal from "./searchbarmodals/DateSearcherModal.vue"
import DateTimeSearcherModal from "./searchbarmodals/DateTimeSearcherModal.vue";
import NumberSearcherModal from "./searchbarmodals/NumberSearcherModal.vue";
import TimeSearcherModal from "./searchbarmodals/TimeSearcherModal.vue";
import YearSearcherModal from "./searchbarmodals/YearSearcherModal.vue";
import SingleWordStringSearcherModal from "./searchbarmodals/SingleWordStringSearcherModal.vue";
import KeyToNameMappingSearcherModal from "./searchbarmodals/KeyToNameMappingSearcherModal.vue";
*/

import MultipleWordsStringSearcherModal from "./searchbarmodals/MultipleWordsStringSearcherModal.vue";

const
  props = defineProps<{
    index: number;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index
;

let
  accessibility = inject("accessibility") as {
    cardschildrentabindex: Ref<Boolean[]>;
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  }
;
</script>

<template>
  <div class="d-block" style="padding: 0.410156718rem 0">
    <div
      class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
      style="height: 1.75rem"
    >
      <div class="flex-w-3-dot-5-rem p-0 m-0 align-self-stretch">
        <Switchable
          truelabel="R"
          falselabel="U"
          :index="index"
        ></Switchable>
      </div>
      <div class="flex-fill m-0 align-self-stretch" style="padding:0 0 0 1px;">
        <div
          class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center h-100"
        >
          <div class="flex-fill p-0 m-0 h-100">
            <div
              class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center h-100"
            >
              <div class="flex-fill p-0 m-0 h-100">
                <input
                  :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
                  type="text"
                  class="w-100 align-middle h-100"
                />
              </div>
              <div class="flex-shrink-0 flex-grow-0 p-0 m-0 h-100">
                <button
                  :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
                  class="open-search-btn h-100 m-0 cursor-pointer shadow-sm font-bold letter-spacing"
                  style="font-size: 0.9rem;"
                >
                  <img src="/src/assets/icons/search.png" class="align-middle" style="width:20px;height:20px;" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex-w-24-rem p-0 m-0 h-100">
            <button
              @click="accessibility.cardsmultiplesearchopenstatus.value[index]=true"
              @keyup.enter="accessibility.cardsmultiplesearchopenstatus.value[index]=true"
              :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
              class="open-search-btn w-100 h-100 m-0 cursor-pointer shadow-sm font-bold letter-spacing"
              style="font-size: 0.9rem;"
            >
              Multiple
            </button>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="accessibility.cardsmultiplesearchopenstatus.value[index]" class="d-block position-relative">
        <template v-if="cards[index].info.datatype === 'MultipleWordsString'">
          <MultipleWordsStringSearcherModal :index="index"></MultipleWordsStringSearcherModal>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.open-search-btn {
  outline: 1px solid grey;
  border:none;
}
.open-search-btn:hover,
.open-search-btn:focus,
.open-search-btn:active {
  outline: 1px solid blue;
  background-color: grey;
}
</style>