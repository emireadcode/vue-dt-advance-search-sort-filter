<script setup lang="ts">
import { provide, type ShallowRef, ref, onBeforeMount, onMounted } from "vue";
import {
  enableAllCardsTabIndex,
  disableAllCardsChildrenTabIndex,
  disableAllCardsFilterItemTabIndex,
  disableOtherCardsChildrenTabIndex
} from "./helperfunctions/accessibility";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import RefreshUndoRedoCloseButton from "./RefreshUndoRedoCloseButton.vue";
import Card from "./Card.vue";

const
  emits = defineEmits<{
    (e: "modal:close", action: boolean): void;
  }>(),
  props = defineProps<{
    cards: ShallowRef<PrimitiveType[]>;
  }>(),
  cards = props.cards
;

let
  cardscontainerref = ref<HTMLDivElement>(),
  refreshundoredoclosecontainerref = ref<HTMLDivElement>(),
  refreshundoredoclosetabindex = ref<Boolean>(),
  cardsref = ref<HTMLDivElement[]>([]),
  cardstabindex = ref<Boolean[]>([]),
  cardschildrentabindex = ref<Boolean[]>([]),
  cardsmultiplesearchopenstatus = ref<Boolean[]>([]),
  cardsfilteritemtabindex = ref<Boolean[]>([])
;

provide("cards", cards);

provide("accessibility", {
  cardscontainerref,
  refreshundoredoclosetabindex,
  cardsref,
  cardstabindex,
  cardschildrentabindex,
  cardsmultiplesearchopenstatus,
  cardsfilteritemtabindex,
});

function enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex() {
  enableAllCardsTabIndex(cardstabindex);
  disableAllCardsChildrenTabIndex(cardschildrentabindex);
  disableAllCardsFilterItemTabIndex(cardsfilteritemtabindex);
}

function enableACardChildrenTabIndexAndDisableOtherCardsChildrenTabIndex(index: number) {
  cardschildrentabindex.value[index] = true;
  disableOtherCardsChildrenTabIndex(index, cardschildrentabindex);
}

onMounted(() => {
  (refreshundoredoclosecontainerref.value as HTMLDivElement).focus();
});

onBeforeMount(() => {
  refreshundoredoclosetabindex.value = true;
  cards.value?.forEach((_item, index) => {
    cardstabindex.value[index] = false;
    cardschildrentabindex.value[index] = false;
    cardsmultiplesearchopenstatus.value[index] = false;
    cardsfilteritemtabindex.value[index] = false;
  });
});

</script>

<template>
  <div class="position-relative m-0 p-0 d-block h-100" aria-modal="true" role="dialog">
    <div class="position-fixed w-100 h-100 l-0 t-0 m-0 p-0 user-select-none">
      <div class="d-block position-relative m-0 p-0">
        <div
          class="position-fixed w-100 l-0 t-0 m-0 p-0 shadow"
          style="z-index: 1000; height: 4.08333rem; pointer-events: auto"
        >
          <div
            tabindex="-1"
            :ref="(el) => refreshundoredoclosecontainerref = el as HTMLDivElement"
            class="flex-box flex-direction-row w-100 h-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
            @click.self="() => { refreshundoredoclosecontainerref?.focus(); refreshundoredoclosetabindex = true; }"
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
        class="d-block vh-100 m-0"
        style="z-index: 980; padding: 4.08333rem 0 0 0 !important"
      >
        <div
          tabindex="-1"
          :ref="(el) => cardscontainerref = el as HTMLDivElement"
          @click.self="() => { 
            (cardscontainerref as HTMLDivElement).focus();
            enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
          }"
          class="d-block m-0 overflow-y-auto overflow-x-hidden h-100"
          style="padding: 0.875rem 1.75rem important;z-index: 990;background-color: snow;"
        >
          <div
            tabindex="-1"
            @click.self="() => {
              (cardscontainerref as HTMLDivElement).focus();
              enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
            }"
            class="d-block"
            style="height: auto !important; padding: 0.875rem 0 !important"
          >
            <ul
              tabindex="-1"
              @click.self="() => {
                (cardscontainerref as HTMLDivElement).focus();
                enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
              }"
              id="card-container"
              class="flex-box flex-direction-row w-100 flex-wrap align-items-center justify-content-center list-style-none m-0 p-0"
            >
              <li
                tabindex="-1"
                @click.self="() => {
                  (cardscontainerref as HTMLDivElement).focus();
                  enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex(); 
                }"
                v-for="(card, index) in cards"
                :key="index"
                class="flex-w-25 m-0"
                style="padding: 0.875rem !important; min-width: 26.25rem !important"
              >
                <div
                  :tabindex="cardstabindex[index]? 0 : -1"
                  :aria-describedby="'info-'+card.info.attribute"
                  @focus.self="() => { 
                    cardsref[index].focus();
                    enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex(); 
                  }"
                  @click="() => {
                    enableACardChildrenTabIndexAndDisableOtherCardsChildrenTabIndex(index);
                  }"
                  @keyup.enter="() => {
                    enableACardChildrenTabIndexAndDisableOtherCardsChildrenTabIndex(index);
                  }"
                  :ref="(el) => cardsref[index] = el as HTMLDivElement"
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
.card:focus {
  border: 2px solid black;
  outline: none;
}
</style>