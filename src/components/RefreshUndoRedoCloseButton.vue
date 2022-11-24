<script setup lang="ts">
import { inject, type Ref } from "vue";

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardFocusableDescendantsTabIndex: Ref<Boolean[]>;
      cardRefTabIndex: Ref<Boolean[]>;
      cardListBoxFocusableDescendantsTabIndex: Ref<Boolean[]>;
    };
    methods: {
      enableAllCardsRefTabIndex: (c: Ref<Boolean[]>) => void;
      disableOtherCardsFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableAllCardsListBoxFocusableDescendantsTabIndex: (l: Ref<Boolean[]>) => void;
    };
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
      tabindex="0"
      aria-pressed="false"
      :aria-label="btnTitle"
      type="button"
      @keyup.enter="() => { 
        accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
        accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex);
        accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
      }"
      @keyup.enter.native="() => { 
        accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
        accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex);
        accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
      }"
      @click="() => { 
        accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
        accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex);
        accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
      }"
      @focus="() => { 
        accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
        accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex);
        accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
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