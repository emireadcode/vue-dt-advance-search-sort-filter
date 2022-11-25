<script setup lang="ts">
import { inject, type Ref, type ShallowRef } from "vue";
import RefreshUndoRedoCloseButton from "./RefreshUndoRedoCloseButton.vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import Card from "./Card.vue";

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardFocusableDescendantsTabIndex: Ref<Boolean[]>;
      cardRefTabIndex: Ref<Boolean[]>;
      cardListBoxFocusableDescendantsTabIndex: Ref<Boolean[]>;
      cardContainerRef: Ref<HTMLDivElement>;
      cardRef: Ref<HTMLDivElement[]>;
    };
    methods: {
      enableCardFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableOtherCardsFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableOtherCardsRefTabIndex: (i: number, c: Ref<Boolean[]>) => void;
      disableAllCardsListBoxFocusableDescendantsTabIndex: (l: Ref<Boolean[]>) => void;
      enableAllCardsRefTabIndex: (c: Ref<Boolean[]>) => void;
      assignElToCardRef: (el: HTMLDivElement, i: number, c: Ref<HTMLDivElement[]>) => void;
    };
  }
;

const
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

</script>

<template>
  <div class="position-fixed w-100 h-100 l-0 t-0 m-0 p-0 user-select-none">
    <div class="d-block position-relative m-0 p-0">
      <div
        tabindex="-1"
        class="position-fixed w-100 l-0 t-0 m-0 p-0 shadow"
        style="z-index: 1000; height: 4.08333rem; pointer-events: auto"
        @click="() =>{ 
          accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
          accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex); 
          accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex);
        }"
      >
        <div
          class="flex-box flex-direction-row w-100 h-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
        >
          <div class="flex-w-25 align-self-stretch border text-center p-1">
            <RefreshUndoRedoCloseButton btn-img-name="refresh.png" btn-title="Refresh"></RefreshUndoRedoCloseButton> 
          </div>
          <div class="flex-w-25 align-self-stretch border text-center p-1">
            <RefreshUndoRedoCloseButton btn-img-name="undo.png" btn-title="Undo"></RefreshUndoRedoCloseButton> 
          </div>
          <div class="flex-w-25 align-self-stretch border text-center p-1">
            <RefreshUndoRedoCloseButton btn-img-name="redo.png" btn-title="Redo"></RefreshUndoRedoCloseButton> 
          </div>
          <div class="flex-w-25 align-self-stretch border text-center p-1">
            <RefreshUndoRedoCloseButton btn-img-name="close.png" btn-title="Close"></RefreshUndoRedoCloseButton> 
          </div>
        </div>
      </div>
    </div>
    <div
      tabindex="-1"
      :ref="(el) => accessibility.attributes.cardContainerRef.value = el as HTMLDivElement"
      class="d-block vh-100 m-0"
      style="z-index: 980; padding: 4.08333rem 0 0 0 !important"
    >
      <div
        tabindex="-1"
        @click.self="() => { 
          accessibility.attributes.cardContainerRef.value.focus();
          accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
          accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex); 
          accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
        }"
        class="d-block m-0 overflow-y-auto overflow-x-hidden h-100"
        style="padding: 0.875rem 1.75rem important;z-index: 990;background-color: snow;"
      >
        <div
          tabindex="-1"
          @click.self="() => { 
            accessibility.attributes.cardContainerRef.value.focus();
            accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
            accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex); 
            accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
          }"
          class="d-block"
          style="height: auto !important; padding: 0.875rem 0 !important"
        >
          <ul
            tabindex="-1"
            @click.self="() => { 
              accessibility.attributes.cardContainerRef.value.focus();
              accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
              accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex); 
              accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
            }"
            id="card-container"
            class="flex-box flex-direction-row w-100 flex-wrap align-items-center justify-content-center list-style-none m-0 p-0"
          >
            <li
              tabindex="-1"
              @click.self="() => { 
                accessibility.attributes.cardContainerRef.value.focus();
                accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
                accessibility.methods.disableAllCardsListBoxFocusableDescendantsTabIndex(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex); 
                accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
              }"
              v-for="(card, index) in cards"
              :key="index"
              class="flex-w-25 m-0"
              style="padding: 0.875rem !important; min-width: 26.25rem !important"
            >
              <div
                :tabindex="accessibility.attributes.cardRefTabIndex.value[index]? 0 : -1"
                :aria-labelledby="'info-'+card.info.attribute"
                @focus.self="() => { 
                  accessibility.attributes.cardRef.value[index].focus();
                  accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(-1, accessibility.attributes.cardFocusableDescendantsTabIndex); 
                  accessibility.methods.enableAllCardsRefTabIndex(accessibility.attributes.cardRefTabIndex); 
                }"
                @click="() => {
                  accessibility.methods.enableCardFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
                  accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
                }"
                @keyup.enter="() => {
                  accessibility.methods.enableCardFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
                  accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
                }"
                :ref="
                  (el) => {
                    accessibility.methods.assignElToCardRef(el as HTMLDivElement, index, accessibility.attributes.cardRef)
                  }
                "
                class="d-block shadow card"
                style="background-color: white;"
              >
                <Card :index="index"></Card>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-1 {
  padding-top: 1.108333rem !important;
  padding-bottom: 1.108333rem !important;
}
.card {
  border: 2px solid transparent;
  outline: none;
}

.card:hover,
.card:active,
.card:focus {
  border: 2px solid black;
  outline: none;
}

</style>