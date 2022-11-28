<script setup lang="ts">
import { inject, type Ref } from "vue";
import {
  enableAllCardsTabIndex,
  disableAllCardsChildrenTabIndex,
  disableAllCardsFilterItemTabIndex,
} from "./helperfunctions/accessibility";

let
  accessibility = inject("accessibility") as {
    refreshundoredoclosetabindex: Ref<Boolean>;
    cardstabindex: Ref<Boolean[]>;
    cardschildrentabindex: Ref<Boolean[]>;
    cardsfilteritemtabindex: Ref<Boolean[]>;
  }
;

const
  props = defineProps<{
    btnImgName: string;
    btnTitle: string;
  }>()
;

</script>

<template>  
  <div class="d-inline-block align-middle">
    <button
      :tabindex="accessibility.refreshundoredoclosetabindex.value? 0 : -1"
      aria-pressed="false"
      :aria-label="btnTitle"
      type="button"
      @keyup.enter="() => { 
        disableAllCardsChildrenTabIndex(accessibility.cardschildrentabindex); 
        disableAllCardsFilterItemTabIndex(accessibility.cardsfilteritemtabindex);
        enableAllCardsTabIndex(accessibility.cardstabindex); 
      }"
      @click="() => { 
        disableAllCardsChildrenTabIndex(accessibility.cardschildrentabindex); 
        disableAllCardsFilterItemTabIndex(accessibility.cardsfilteritemtabindex);
        enableAllCardsTabIndex(accessibility.cardstabindex); 
      }"
      @focus="() => { 
        disableAllCardsChildrenTabIndex(accessibility.cardschildrentabindex); 
        disableAllCardsFilterItemTabIndex(accessibility.cardsfilteritemtabindex);
        enableAllCardsTabIndex(accessibility.cardstabindex); 
      }"
      style="background-color:#fff;"
      class="control-img-btn m-0 p-0 cursor-pointer"
      :title="btnTitle"
    >
      <img :src="'./src/assets/icons/' + btnImgName" class="wh-1-dot-75-rem" />
    </button>
  </div>
</template>

<style scoped>
.control-img-btn {
  border:none;
  outline:none;
}
.control-img-btn:focus,
.control-img-btn:hover,
.control-img-btn:active {
  outline: 2px dashed blue;
}
</style>