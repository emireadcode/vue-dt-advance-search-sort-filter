<script setup lang="ts">
import Switchable from "./Switchable.vue";
import AscDescOrMix from "./AscDescOrMix.vue";
import AddSingleOrMultiplePaste from "./AddSingleOrMultiplePaste.vue";
import { inject, triggerRef, ref } from "vue";
import FilterableResultDisplayer from "./FilterableResultDisplayer.vue";

const props = defineProps<{
  index: any;
}>();

const cards = inject("cards") as any;

const open = ref(false);

function updateSortType(val) {
  cards.value[props.index].sorttype = val.sorttype;
  triggerRef(cards);
}

function updateTrueOrFalse(trueorfalse) {
  cards.value[props.index].search.trueorfalse = trueorfalse;
  triggerRef(cards);
}

function updateFilterableResultDisplayer(card) {
  cards.value[props.index] = card;
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
        >{{ cards[index].info.name }}</span
      >
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
              switchtype="ORDINARY"
              @update:trueorfalse="($trueorfalse) => updateTrueOrFalse($trueorfalse)"
            ></Switchable>
          </div>
          <div class="flex-fill p-0 m-0 align-self-stretch">
            <div
              class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center h-100"
            >
              <div class="flex-fill p-0 m-0 h-100" style="z-index: 700">
                <input
                  type="text"
                  @focus="openStringWindow()"
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
            <transition name="modal">
              <div
                class="position-fixed h-100 w-100 overflow-auto user-select-none"
                style="z-index: 1800"
              >
                <div class="modal-mask h-100 w-100 modal-mask-background-1">
                  <div class="modal-wrapper text-center">
                    <div class="modal-container" style="width: 480px">
                      <div
                        style="background-color: #fff; padding: 3px 10px"
                        class="shadow-sm d-block"
                      >
                        <a
                          class="underline-none cursor-pointer align-middle"
                          @click="open = false"
                        >
                          <img
                            src="/src/assets/icons/close.png"
                            class="align-middle"
                            style="width: 24px; height: 24px"
                          />
                        </a>
                      </div>
                      <div class="d-block m-0" style="padding: 0 10px">
                        <template v-if="!cards[index].concatenated">
                          <div class="d-block" style="padding: 15px 0 10px 0">
                            <div class="d-block" style="padding-bottom: 5px">
                              <label class="text-lowercase">
                                Search By
                                <span class="font-bold">{{
                                  cards[index].info.name
                                }}</span>
                              </label>
                            </div>
                            <AddSingleOrMultiplePaste
                              nospace="true"
                              :index="index"
                              :tree="cards[index].search"
                              areatype="ORDINARY"
                            ></AddSingleOrMultiplePaste>
                          </div>
                        </template>
                        <template v-else>
                          <div class="d-block">
                            <div class="d-block" style="padding: 15px 0 10px 0">
                              <div class="d-block" style="padding-bottom: 5px">
                                <label class="text-lowercase">
                                  Search by
                                  <span class="font-bold">
                                    {{ cards[index].concatenatedname }}
                                  </span>
                                </label>
                              </div>
                              <AddSingleOrMultiplePaste
                                nospace="true"
                                :index="index"
                                :tree="cards[index].search"
                                areatype="ORDINARY"
                              ></AddSingleOrMultiplePaste>
                            </div>
                            <template
                              v-for="(concatenated, cindex) in cards[index].concatenated"
                            >
                              <div class="d-block" style="padding: 10px 0">
                                <div class="d-block" style="padding-bottom: 5px">
                                  <label class="text-lowercase"
                                    >Search By
                                    <span class="font-bold">{{
                                      concatenated.name
                                    }}</span></label
                                  >
                                </div>
                                <AddSingleOrMultiplePaste
                                  nospace="true"
                                  :index="index"
                                  :tree="concatenated.search"
                                  :areatype="'ORDINARY-' + cindex"
                                ></AddSingleOrMultiplePaste>
                              </div>
                            </template>
                          </div>
                        </template>
                        <div class="d-block" style="padding: 15px 0">
                          <button
                            class="btn w-100 shadow-sm"
                            style="padding: 7px; border-radius: 12px"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
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

<style scoped>
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask-background-2 {
  background-color: rgba(255, 255, 255, 0.85);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
