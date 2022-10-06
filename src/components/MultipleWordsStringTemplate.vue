<script setup lang="ts">
import Switchable from "./Switchable.vue";
import AscDescOrMix from "./AscDescOrMix.vue";
import { inject, triggerRef, ref } from "vue";
import FilterableResultDisplayer from "./FilterableResultDisplayer.vue";
import MultipleWordsStringModal from "./MultipleWordsStringModal.vue";

const props = defineProps<{
  index: any;
}>();

const cards = inject("cards") as any;

const open = ref(false);

function updateFilterableResultDisplayer(card) {
  cards.value[props.index] = card;
  triggerRef(cards);
}

function updateTrueOrFalse(trueorfalse) {
  cards.value[props.index].search.trueorfalse = trueorfalse;
  triggerRef(cards);
}

function updateSortType(val) {
  cards.value[props.index].sorttype = val.sorttype;
  triggerRef(cards);
}

function openStringWindow() {
  open.value = true;
}
</script>

<template>
  <div class="d-block">
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center shadow-sm m-0"
      style="padding: 0.182291875rem 0"
    >
      <span
        class="m-0 p-0 text-capitalize text-center letter-spacing font-bold font-0-dot-80-rem"
      >
        {{ cards[index].info.name }}
      </span>
    </div>
    <div class="d-block" style="padding: 0 0.583333333rem !important">
      <AscDescOrMix
        :cards="cards[index]"
        @update:sorttype="
          ($val) => {
            updateSortType($val);
          }
        "
      ></AscDescOrMix>
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
              :switchtype="'ORDINARY'"
              @update:trueorfalse="($trueorfalse) => updateTrueOrFalse($trueorfalse)"
            ></Switchable>
          </div>
          <div class="flex-fill p-0 m-0 align-self-stretch">
            <div
              class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center h-100"
            >
              <div class="flex-fill p-0 m-0 h-100" style="z-index: 700">
                <input
                  @focus="openStringWindow()"
                  type="text"
                  class="w-100 align-middle h-100"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem h-100 position-absolute t-0 p-0"
                style="z-index: 720"
              >
                <a class="cursor-pointer d-block text-center">
                  <img src="/src/assets/icons/close.png" class="wh-1-dot-25-rem" />
                </a>
              </div>
            </div>
          </div>
          <div
            class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
            style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
          >
            <a class="cursor-pointer d-block text-center">
              <img
                src="/src/assets/icons/search.png"
                class="wh-1-dot-25-rem align-middle"
              />
            </a>
          </div>
        </div>
        <Teleport to="body">
          <div v-if="open" class="d-block position-relative">
            <MultipleWordsStringModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></MultipleWordsStringModal>
          </div>
        </Teleport>
      </div>
      <FilterableResultDisplayer
        :cards="cards[index]"
        @update:filterableresultdisplayer="
          ($val) => {
            updateFilterableResultDisplayer($val);
          }
        "
      ></FilterableResultDisplayer>
    </div>
  </div>
</template>
