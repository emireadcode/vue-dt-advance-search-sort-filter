<script setup lang="ts">
import { provide, ref, triggerRef, inject } from "vue";
import Switchable from "./Switchable.vue";
import AscDescOrMix from "./AscDescOrMix.vue";
import FilterableResultDisplayer from "./FilterableResultDisplayer.vue";

const props = defineProps<{
  index: number;
  enableFocusableDescendants: boolean;
}>();

type TimeType = {
  hours: any;
  minutes: any;
};

type TimeRangeType = [
  {
    hours: any;
    minutes: any;
  },
  {
    hours: any;
    minutes: any;
  }
];

const time = ref<TimeType>();

const timerange = ref<TimeRangeType>();

const cards = inject("cards") as any;

const open = ref(false);

function updateTrueOrFalse(trueorfalse) {
  cards.value[props.index].search.trueorfalse = trueorfalse;
  triggerRef(cards);
}

function openTimeWindow() {
  open.value = true;
}

function updateSortType(val) {
  cards.value[props.index].sorttype = val.sorttype;
  triggerRef(cards);
}

function updateFilterableResultDisplayer(card) {
  cards.value[props.index] = card;
  triggerRef(cards);
}
</script>
<template>
    <transition name="modal">
              <div
                class="position-fixed h-100 w-100 overflow-auto user-select-none"
                style="z-index: 1800"
              >
                <div class="modal-mask h-100 w-100">
                  <div class="modal-wrapper text-center">
                    <div class="modal-container d-block">
                      <div class="d-block">
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
                        <div
                          class="d-block text-center"
                          style="padding: 7px; font-size: 0.6rem"
                        >
                          {{ cards[index].info.name }}
                        </div>
                      </div>
                      <div class="d-block m-0 p-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
</template>

<style scoped>
.modal-mask {
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding: 20px 0;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  width: 550px;
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
