<script setup lang="ts">
import { watch, inject, type ShallowRef, computed, triggerRef, } from "vue";
import type { 
  NumberSearcherUIType, 
  NumberType, 
  SingleWordStringType, 
  NumberStringType, 
} from "../types/SupportedDatatypesTypeDeclaration";
import {
  resetOthers,
  deleteSaved,
  increaseIndexAndSavePrevious
} from "../helperfunctions/numbersearcheruitypefns";

const 
  mainnumbersearcherui = inject("mainnumbersearcheruitype") as ShallowRef<NumberSearcherUIType['main']>,
  index = inject("index") as number,
  props = defineProps<{
    from: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL";
  }>(),
  emits = defineEmits<{
    (e: "reset:exclude", action: boolean): void;
  }>(),
  cards = inject("cards") as ShallowRef<NumberType[] | SingleWordStringType[] | NumberStringType[]>
;

function localResetOthers(
  operator: "EQUAL-TO" | "NOT-EQUAL-TO" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO"
) {
  resetOthers(
    operator,
    mainnumbersearcherui
  );

  if(props.from === "NUMBER-SEARCHER-MODAL") {
    emits("reset:exclude", true);
  }
}

function localDeleteSaved(
  index: number, 
  operator: "EQUAL-TO" | "NOT-EQUAL-TO"
) {
  deleteSaved(
    index,
    operator,
    mainnumbersearcherui
  );
}

function localIncreaseIndexAndSavePrevious(
  rangeornonerange: 'NONE-RANGE',
  inputvalue: string,
  operator: 'NOT-EQUAL-TO' | 'EQUAL-TO'
) {
  increaseIndexAndSavePrevious(
    rangeornonerange,
    inputvalue,
    operator,
    mainnumbersearcherui
  );
}

const equaltoAddNew = computed(() => {
  return (
    parseFloat((mainnumbersearcherui.value as NumberSearcherUIType["main"]).equalto.value) <= parseFloat(cards.value[index].result.max) &&
    parseFloat((mainnumbersearcherui.value as NumberSearcherUIType["main"]).equalto.value) >= parseFloat(cards.value[index].result.min)
  );
});

const notequaltoAddNew = computed(() => {
  return (
    parseFloat((mainnumbersearcherui.value as NumberSearcherUIType["main"]).notequalto.value) <= parseFloat(cards.value[index].result.max) &&
    parseFloat((mainnumbersearcherui.value as NumberSearcherUIType["main"]).notequalto.value) >= parseFloat(cards.value[index].result.min)
  );
});

watch(
  () => (mainnumbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.index,
  (x) => {
    (mainnumbersearcherui.value as NumberSearcherUIType["main"]).equalto.value = "";
    triggerRef(mainnumbersearcherui);
  }
);

watch(
  () => (mainnumbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.index,
  (x) => {
    (mainnumbersearcherui.value as NumberSearcherUIType["main"]).notequalto.value = "";
    triggerRef(mainnumbersearcherui);
  }
);

</script>

<template>
  <div class="d-block" style="z-index: 8992;padding: 0 10px">
    <div class="d-block" style="padding: 0 0 15px 0">
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-w-50" style="padding-right: 10px">
          <div class="d-block shadow-sm" style="padding: 5px">
            <div class="d-block" style="padding-bottom: 5px">
              <img
                src="/src/assets/icons/greater-than.png"
                class="align-middle"
                style="width: 24px; height: 24px"
              />
            </div>
            <div class="d-block">
              <input
                @keyup="localResetOthers('GREATER-THAN')"
                @keydown.space.prevent
                v-model.trim="(mainnumbersearcherui as NumberSearcherUIType['main']).greaterthan.value"
                type="text"
                class="w-100 text-center"
                style="height: 30px"
              />
            </div>
          </div>
        </div>
        <div class="flex-w-50" style="padding-left: 10px">
          <div class="d-block shadow-sm" style="padding: 5px">
            <div class="d-block" style="padding-bottom: 5px">
              <img
                src="/src/assets/icons/less-than.png"
                class="align-middle"
                style="width: 24px; height: 24px"
              />
            </div>
            <div class="d-block">
              <input
                @keyup="localResetOthers('LESS-THAN')"
                @keydown.space.prevent
                v-model.trim="(mainnumbersearcherui as NumberSearcherUIType['main']).lessthan.value"
                type="text"
                class="w-100 text-center"
                style="height: 30px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-block" style="padding: 0 0 15px 0">
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-w-50" style="padding-right: 10px">
          <div class="d-block shadow-sm" style="padding: 5px">
            <div class="d-block" style="padding-bottom: 5px">
              <img
                src="/src/assets/icons/equal-to.png"
                class="align-middle"
                style="width: 24px; height: 24px"
              />
            </div>
            <div
              class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right:2px;">
                <input
                  @keyup="localResetOthers('EQUAL-TO')"
                  @keydown.space.prevent
                  v-model.trim="(mainnumbersearcherui as NumberSearcherUIType['main']).equalto.value"
                  type="text"
                  class="w-100 text-center"
                  style="height: 30px; z-index: 1110"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
              >
                <button
                  :disabled="equaltoAddNew ? false : true"
                  @click="
                    localIncreaseIndexAndSavePrevious(
                      'NONE-RANGE',
                      (mainnumbersearcherui as NumberSearcherUIType['main']).equalto.value,
                      'EQUAL-TO'
                    )
                  "
                  class="btn w-100"
                  :style="
                    equaltoAddNew
                    ? 'background-color: #F0E68C;'
                    : 'background-color:#eee;'
                  "
                  style="height:30px; padding:0 2px;"
                >
                  <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                </button>
              </div>
            </div>
            <Paste
              title="numbers"
              :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
              :max="(cards[index].result.max as string)"
              :min="(cards[index].result.min as string)"
              :text-area-height="'height:450px;'"
            >
              <template v-slot:controlbuttons></template>
              <template v-slot:outcomeidentifier>
                <div
                  class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle"
                      style="background-color: #fff; width: 15px; height: 15px"
                    ></div>
                    Pasted Lines
                  </div>
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle"
                      style="background-color: red; width: 15px; height: 15px"
                    ></div>
                    Invalid Numbers
                  </div>
                </div>
              </template>
            </Paste>
            <div
              class="d-block overflow-y-auto overflow-x-hidden"
              style="height: 180px; z-index: 1000"
            >
              <ul
                class="d-block list-style-none m-0"
                style="padding: 5px 0px"
              >
                <li
                  class="w-100"
                  v-for="(data, dindex) in (mainnumbersearcherui as NumberSearcherUIType['main']).treeequalto
                  .value"
                  :key="'exc' + dindex"
                >
                  <Transition>
                    <div
                      :ref="
                        (el) => {
                          (mainnumbersearcherui as NumberSearcherUIType['main']).refequalto[dindex] = el as HTMLDivElement;
                        }
                      "
                      v-if="(mainnumbersearcherui as NumberSearcherUIType['main']).treeequalto.show[dindex]"
                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                      style="padding: 1px 5px"
                      :class="{ shake: (mainnumbersearcherui as NumberSearcherUIType['main']).treeequalto.disabled[dindex] }"
                    >
                      <div class="flex-shrink-0 flex-grow-0">
                        <a
                          @click="localDeleteSaved(dindex, 'EQUAL-TO')"
                          class="remove-selected m-0 d-inline-block underline-none"
                        >
                          <img
                            class="align-middle"
                            src="/src/assets/icons/close.png"
                            style="width: 25px; height: 25px"
                          />
                        </a>
                      </div>
                      <div
                        class="flex-fill"
                        style="padding-left: 5px"
                      >
                        <div class="d-block" style="padding: 5px">
                          <div
                            :ref="
                              (el) => {
                                (mainnumbersearcherui as NumberSearcherUIType['main']).refequaltoinner[dindex] = el as HTMLDivElement;
                              }
                            "
                            class="text-left d-block text-wrap text-break shadow-sm"
                            style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                          >
                            <label
                              class="d-block align-middle letter-spacing"
                              style="font-size: 0.875rem"
                            >{{ data }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </li>
                <li :ref="(el) => (mainnumbersearcherui as NumberSearcherUIType['main']).equaltoref = el as HTMLLIElement"></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex-w-50" style="padding-left: 10px">
          <div class="d-block shadow-sm" style="padding: 5px">
            <div class="d-block" style="padding-bottom: 5px">
              <img
                src="/src/assets/icons/not-equal-to.png"
                class="align-middle"
                style="width:24px;height:24px;"
              />
            </div>
            <div
              class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right:2px;">
                <input
                  @keyup="localResetOthers('NOT-EQUAL-TO')"
                  @keydown.space.prevent
                  v-model.trim="(mainnumbersearcherui as NumberSearcherUIType['main']).notequalto.value"
                  type="text"
                  class="w-100 text-center"
                  style="height: 30px; z-index: 1110"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
              >
                <button
                  :disabled="notequaltoAddNew ? false : true"
                  @click="
                  localIncreaseIndexAndSavePrevious(
                    'NONE-RANGE',
                    (mainnumbersearcherui as NumberSearcherUIType['main']).notequalto.value,
                    'NOT-EQUAL-TO'
                  )
                  "
                  class="btn w-100 cursor-pointer"
                  :style="
                    notequaltoAddNew
                    ? 'background-color: #F0E68C;'
                    : 'background-color:#eee;'
                  "
                  style="height:30px; padding:0 2px;"
                >
                  <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                </button>
              </div>
            </div>
            <Paste
              title="numbers"
              :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
              :max="(cards[index].result.max as string)"
              :min="(cards[index].result.min as string)"
              :text-area-height="'height:450px;'"
            >
              <template v-slot:controlbuttons></template>
              <template v-slot:outcomeidentifier>
                <div
                  class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle"
                      style="background-color: #fff; width: 15px; height: 15px"
                    ></div>
                    Pasted Lines
                  </div>
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle"
                      style="background-color: red; width: 15px; height: 15px"
                    ></div>
                    Invalid Numbers
                  </div>
                </div>
              </template>
            </Paste>
            <div
              class="d-block overflow-y-auto overflow-x-hidden"
              style="height: 180px; z-index: 1000"
            >
              <ul
                class="d-block list-style-none m-0"
                style="padding: 5px 0px"
              >
                <li
                  class="w-100"
                  v-for="(data, dindex) in (mainnumbersearcherui as NumberSearcherUIType['main']).treenotequalto.value"
                  :key="'exc' + dindex"
                >
                  <Transition>
                    <div
                      :ref="
                        (el) => {
                          (mainnumbersearcherui as NumberSearcherUIType['main']).refnotequalto[dindex] = el as HTMLDivElement;
                        }
                      "
                      v-if="(mainnumbersearcherui as NumberSearcherUIType['main']).treenotequalto.show[dindex]"
                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                      style="padding: 1px 5px"
                      :class="{
                        shake: (mainnumbersearcherui as NumberSearcherUIType['main']).treenotequalto.disabled[dindex],
                      }"
                    >
                      <div class="flex-shrink-0 flex-grow-0">
                        <a
                          @click="localDeleteSaved(dindex, 'NOT-EQUAL-TO')"
                          class="remove-selected m-0 d-inline-block underline-none"
                        >
                          <img
                            class="align-middle"
                            src="/src/assets/icons/close.png"
                            style="width: 25px; height: 25px"
                          />
                        </a>
                      </div>
                      <div
                        class="flex-fill"
                        style="padding-left: 5px"
                      >
                        <div class="d-block" style="padding: 5px">
                          <div
                            :ref="
                              (el) => {
                                (mainnumbersearcherui as NumberSearcherUIType['main']).refnotequaltoinner[dindex] = el as HTMLDivElement;
                              }
                            "
                            class="text-left d-block text-wrap text-break shadow-sm"
                            style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                          >
                            <label
                              class="d-block align-middle letter-spacing"
                              style="font-size: 0.875rem"
                            >
                              {{ data }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </li>
                <li :ref="(el) => (mainnumbersearcherui as NumberSearcherUIType['main']).notequaltoref = el as HTMLLIElement"></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      style="padding: 5px 5px 20px 5px"
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
    >
      <div class="flex-grow-1 flex-shrink-1">
        <div class="d-block" style="padding-bottom: 5px">
          <label>From</label>
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            v-model.trim="(mainnumbersearcherui as NumberSearcherUIType['main']).from.value"
            @keyup="localResetOthers('FROM-TO')"
            type="text"
            class="w-100 text-center"
            style="height: 30px"
          />
        </div>
      </div>
      <div class="flex-grow-1 flex-shrink-1">
        <div class="d-block" style="padding-bottom: 5px">
          <label>To</label>
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            v-model.trim="(mainnumbersearcherui as NumberSearcherUIType['main']).to.value"
            @keyup="localResetOthers('FROM-TO')"
            type="text"
            class="w-100 text-center"
            style="height: 30px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>