
<script setup lang="ts">
import { inject, type ShallowRef, type Ref } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import Switchable from "./Switchable.vue";

/*
import DateTimeSearcherModal from "./searchbarmodals/DateTimeSearcherModal.vue";
import TimeSearcherModal from "./searchbarmodals/TimeSearcherModal.vue";
import YearSearcherModal from "./searchbarmodals/YearSearcherModal.vue";
import KeyToNameMappingSearcherModal from "./searchbarmodals/KeyToNameMappingSearcherModal.vue";
*/

import DateSearcherModal from "./searchbarmodals/DateSearcherModal.vue";
import MultipleSingleOrNumberStringWordSearcherModal from "./searchbarmodals/MultipleSingleOrNumberStringWordSearcherModal.vue";
import NumberSearcherModal from "./searchbarmodals/NumberSearcherModal.vue";

const
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

let
  accessibility = inject("accessibility") as {
    cardschildrentabindex: Ref<Boolean[]>;
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  },
  index = inject("index") as number
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
        ></Switchable>
      </div>
      <div class="flex-fill m-0 align-self-stretch p-0">
        <div
          class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
        >
          <div class="flex-fill p-0 m-0 h-100" style="padding: 0 1px;">
            <input
              :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
              type="text"
              class="w-100 align-middle h-100"
            />
          </div>
          <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 1px solid gray;">
            <button
              @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
              @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
              :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
              class="s-search-btn h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            >
              <img src="/src/assets/icons/search.png" style="width:20px;height:20px;" />
            </button>
          </div>
          <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 1px solid gray;">
            <button
              title="Multiple"
              class="h-100 m-0 w-100 m-search-modal-opener-btn cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100" 
              @click="() => { accessibility.cardschildrentabindex.value[index] = true; accessibility.cardsmultiplesearchopenstatus.value[index]=true; }"
              @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; accessibility.cardsmultiplesearchopenstatus.value[index]=true; }"
              :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            >
              <img src="/src/assets/icons/m.png" style="width:20px;height:20px;" />
            </button>
          </div>
          <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 1px solid gray;">
            <button
              @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
              @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
              :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
              class="s-search-btn h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
              style="font-size: 0.9rem;"
            >
              <img src="/src/assets/icons/place.png" style="width:20px;height:20px;" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="accessibility.cardsmultiplesearchopenstatus.value[index]" class="d-block position-relative">
        <template v-if="cards[index].info.datatype === 'Date'">
          <DateSearcherModal></DateSearcherModal>
        </template>
        <template v-if="cards[index].info.datatype === 'MultipleWordsString' || cards[index].info.datatype === 'SingleWordString' || cards[index].info.datatype === 'NumberString'">
          <MultipleSingleOrNumberStringWordSearcherModal></MultipleSingleOrNumberStringWordSearcherModal>
        </template>
        <template v-if="cards[index].info.datatype === 'Number'">
          <NumberSearcherModal></NumberSearcherModal>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.m-search-modal-opener-btn,
.s-search-btn {
  border:none;
  outline: 1px solid gray;
}
.s-search-btn:hover,
.s-search-btn:focus,
.s-search-btn:active,
.m-search-modal-opener-btn:hover,
.m-search-modal-opener-btn:focus,
.m-search-modal-opener-btn:active {
  outline: 1px solid grey;
  background-color: grey;
}
</style>