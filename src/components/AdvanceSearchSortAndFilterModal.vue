<script setup lang="ts">
import { provide, type ShallowRef, ref, onBeforeMount, nextTick } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import Card from "./Card.vue";

const 
  cardContainerRef = ref(),
  cardRef = ref<HTMLDivElement[]>([]),
  focusableDescendants = ref<Boolean[]>([]),
  cardRefTabIndex = ref<Boolean[]>([]),
  listfocuser = ref<Boolean[]>([]),
  emits = defineEmits<{
    (e: "modal:close", action: boolean): void;
  }>(),
  props = defineProps<{
    cards: ShallowRef<PrimitiveType[]>;
  }>(),
  cards = props.cards
;

provide("cards", cards);

function assignElToCardRef(el: HTMLDivElement, index: number) {
  cardRef.value[index] = el;
}

function enableCardFocusableDescendantsTabIndex(index: number) {
  focusableDescendants.value[index] = true;
}

function enableAllCardRefTabIndex() {
  cardRefTabIndex.value.forEach((item, i) => {
    cardRefTabIndex.value[i] = true;
  });
}

function disableOtherCardFocusableDescendants(index: number) {
  focusableDescendants.value.forEach((item, i) => {
    if(i !== index) {
      focusableDescendants.value[i] = false;
    }
  });
}

function disableAllListFocuser() {
  listfocuser.value.forEach((item, i) => {
    listfocuser.value[i] = false;
  });
}

function disableOtherCardRefTabIndex(index: number) {
  cardRefTabIndex.value.forEach((item, i) => {
    if(i !== index) {
      cardRefTabIndex.value[i] = false;
    }
  });
}

onBeforeMount(() => {
  cards.value?.forEach((item, index) => {
    focusableDescendants.value[index] = false;
    cardRefTabIndex.value[index] = true;
    listfocuser.value[index] = false;
  });
});

</script>

<template>
  <div class="position-relative m-0 p-0 d-block" aria-modal="true" role="dialog">
    <div class="position-fixed w-100 h-100 l-0 t-0 m-0 p-0 user-select-none">
      <div class="d-block position-relative m-0 p-0">
        <div
          tabindex="-1"
          class="position-fixed w-100 l-0 t-0 m-0 p-0 shadow"
          style="z-index: 1000; height: 4.08333rem; pointer-events: auto"
          @click="() =>{ disableOtherCardFocusableDescendants(-1); disableAllListFocuser(); enableAllCardRefTabIndex(); }"
        >
          <div
            class="flex-box flex-direction-row w-100 h-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
          >
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <button
                  tabindex="0"
                  aria-pressed="false"
                  aria-label="Refresh"
                  type="button"
                  @keyup.enter="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @keyup.enter.native="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @click="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @focus="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex();
                    disableAllListFocuser();
                  }"
                  style="background-color:#fff;"
                  class="control-img-btn m-0 p-0 cursor-pointer"
                  title="Refresh"
                >
                  <img src="/src/assets/icons/refresh.png" class="wh-1-dot-75-rem" />
                </button>
              </div>
            </div>
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <button
                  tabindex="0"
                  aria-pressed="false"
                  aria-label="Undo"
                  type="button"
                  @keyup.enter="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @keyup.enter.native="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @click="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @focus="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  style="background-color:#fff;"
                  class="control-img-btn m-0 p-0 cursor-pointer"
                  title="Undo"
                >
                  <img src="/src/assets/icons/undo.png" class="wh-1-dot-75-rem" />
                </button>
              </div>
            </div>
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <button
                  tabindex="0"
                  aria-pressed="false"
                  aria-label="Redo"
                  type="button"
                  @keyup.enter="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex();
                    disableAllListFocuser(); 
                  }"
                  @keyup.enter.native="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @click="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @focus="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  style="background-color:#fff;"
                  class="control-img-btn m-0 p-0 cursor-pointer"
                  title="Redo"
                >
                  <img src="/src/assets/icons/redo.png" class="wh-1-dot-75-rem" />
                </button>
              </div>
            </div>
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <button
                  tabindex="0"
                  aria-pressed="false"
                  aria-label="Close"
                  type="button"
                  @keyup.enter="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  @keyup.enter.native="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex();
                    disableAllListFocuser(); 
                  }"
                  @click="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                    emits('modal:close', false); 
                  }"
                  @focus="() => { 
                    disableOtherCardFocusableDescendants(-1); 
                    enableAllCardRefTabIndex(); 
                    disableAllListFocuser();
                  }"
                  style="background-color:#fff;"
                  class="control-img-btn m-0 p-0 cursor-pointer"
                  title="Close"
                >
                  <img src="/src/assets/icons/close.png" class="wh-1-dot-75-rem" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        tabindex="-1"
        :ref="(el) => cardContainerRef = el"
        class="d-block vh-100 m-0"
        style="z-index: 980; padding: 4.08333rem 0 0 0 !important"
      >
        <div
          tabindex="-1"
          @click.self="() => { 
            enableAllCardRefTabIndex(); 
            cardContainerRef.focus(); 
            disableOtherCardFocusableDescendants(-1);
            disableAllListFocuser(); 
          }"
          class="d-block m-0 overflow-y-auto overflow-x-hidden h-100"
          style="padding: 0.875rem 1.75rem important;z-index: 990;background-color: snow;"
        >
          <div
            tabindex="-1"
            @click.self="() => { 
              enableAllCardRefTabIndex();
              cardContainerRef.focus(); 
              disableOtherCardFocusableDescendants(-1); 
              disableAllListFocuser(); 
            }"
            class="d-block"
            style="height: auto !important; padding: 0.875rem 0 !important"
          >
            <ul
              tabindex="-1"
              @click.self="() => { 
                enableAllCardRefTabIndex();
                cardContainerRef.focus(); 
                disableOtherCardFocusableDescendants(-1); 
                disableAllListFocuser(); 
              }"
              id="card-container"
              class="flex-box flex-direction-row w-100 flex-wrap align-items-center justify-content-center list-style-none m-0 p-0"
            >
              <li
                tabindex="-1"
                @click.self="() => { 
                  enableAllCardRefTabIndex();
                  cardContainerRef.focus(); 
                  disableOtherCardFocusableDescendants(-1); 
                  disableAllListFocuser(); 
                }"
                v-for="(card, index) in cards"
                :key="index"
                class="flex-w-25 m-0"
                style="padding: 0.875rem !important; min-width: 26.25rem !important"
              >
                <div
                  :tabindex="cardRefTabIndex[index]? 0 : -1"
                  :aria-labelledby="'info-'+card.info.attribute"
                  @focus.self="() => { 
                    enableAllCardRefTabIndex();
                    cardRef[index].focus();
                    disableOtherCardFocusableDescendants(-1);
                  }"
                  @click="() => {
                    enableCardFocusableDescendantsTabIndex(index);
                    disableOtherCardFocusableDescendants(index);
                  }"
                  @keyup.enter.native="() => {
                    enableCardFocusableDescendantsTabIndex(index);
                    disableOtherCardFocusableDescendants(index);
                  }"
                  @keyup.enter="() => {
                    enableCardFocusableDescendantsTabIndex(index);
                    disableOtherCardFocusableDescendants(index);
                  }"
                  :ref="
                    (el) => {
                      assignElToCardRef(el as HTMLDivElement, index)
                    }
                  "
                  class="d-block shadow card"
                  style="background-color: white;"
                >
                  <Card
                    @enable:focusableDescendants="() => {
                      enableCardFocusableDescendantsTabIndex(index);
                      disableOtherCardFocusableDescendants(index);
                      disableOtherCardRefTabIndex(index);
                    }"
                    :index="index"
                    @enable:cardRefFocus="() => {
                      disableAllListFocuser();
                    }"
                    :focusableDescendants="focusableDescendants[index]"
                    @enableOrDisable:listDescendantsFocus="$val => { listfocuser[index] = $val; }"
                    :listfocuser="listfocuser[index]"
                  ></Card>
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

.card:hover,
.card:active,
.card:focus {
  border: 2px solid black;
  outline: none;
}

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
