<script setup lang="ts">
import AddSingleOrMultiplePaste from "./AddSingleOrMultiplePaste.vue";
import { inject, type ShallowRef, type Ref, onMounted, triggerRef } from "vue";
import type { MultipleWordsStringConcatenatedFieldType, PrimitiveType, MultipleWordsStringType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";

const 
  props = defineProps<{
    index: any;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index
;

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardSearchBarOpen: Ref<Boolean[]>;
    };
  }
;

function updateCard() {
  triggerRef(cards);
}

function updateAttributeButtonTabClicked(clickedtype: string, bindex: number | undefined) {
  if(clickedtype === 'CONCATENATED-NAME-FIELD') {
    (cards.value[index] as MultipleWordsStringType).search.tabclicked = true;
    Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
      (concatenated.search as StringSearchType).tabclicked = false;
    });
  }
  else {
    if((cards.value[index] as MultipleWordsStringType).concatenatedname !== undefined) {
      (cards.value[index] as MultipleWordsStringType).search.tabclicked = false;
      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        if(""+(bindex as number) === ""+i) {
          (concatenated.search as StringSearchType).tabclicked = true;
        }
        else {
          (concatenated.search as StringSearchType).tabclicked = false;
        }
      });
    }
    else {
      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        if(""+(bindex as number) === ""+i) {
          (concatenated.search as StringSearchType).tabclicked = true;
        }
        else {
          (concatenated.search as StringSearchType).tabclicked = false;
        }
      });
    }
  }
  triggerRef(cards);
}

function setTabDefaultSelection() {
  if(!(cards.value[index] as MultipleWordsStringType).concatenated) {
    (cards.value[index] as MultipleWordsStringType).search.tabclicked = true;
    ((cards.value[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = true;
    ((cards.value[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = false;
  }
  else {
    if((cards.value[index] as MultipleWordsStringType).concatenatedname !== undefined) {
      (cards.value[index] as MultipleWordsStringType).search.tabclicked = true;
      ((cards.value[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = true;
      ((cards.value[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = false;

      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        (concatenated.search as StringSearchType).tabclicked = false;
        if(!concatenated.aword) {
          (concatenated.search?.include as StringSearchType).tabclicked = true;
          (concatenated.search?.exclude as StringSearchType).tabclicked = false;
        }
      });
    }
    else {
      Object.values((cards.value[index] as MultipleWordsStringType).concatenated as MultipleWordsStringConcatenatedFieldType).forEach((concatenated, i) => {
        if(i === 0) {
          (concatenated.search as StringSearchType).tabclicked = true;
        }
        else {
          (concatenated.search as StringSearchType).tabclicked = false;
        }
        if(!concatenated.aword) {
          (concatenated.search?.include as StringSearchType).tabclicked = true;
          (concatenated.search?.exclude as StringSearchType).tabclicked = false;
        }
      });
    }
  }
  triggerRef(cards);
}

onMounted(() => {
  setTabDefaultSelection();
});

</script>

<template>
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800;"
    >
      <div class="modal-mask h-100 w-100 modal-mask-background-1">
        <div class="modal-wrapper text-center">
          <div class="modal-container" style="width: 480px">
            <div
              style="background-color: #fff; padding: 10px 5px 0 5px;white-space: nowrap;"
              class="shadow-sm d-block overflow-x-auto"
            >
              <template v-if="!(cards[index] as MultipleWordsStringType).concatenated">
                <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                  <li
                    class="flex-shrink-0 flex-grow-0 align-self-stretch"
                  >
                    <button 
                      aria-disabled="true" 
                      class="text-lowercase tab" 
                      style="padding:5px 8px;font-size:1em;background-color:#F0E68C;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                    >
                      {{ (cards[index] as MultipleWordsStringType).info.name }}
                    </button>
                  </li>
                </ul>
              </template>
              <template v-else>
                <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                  <template v-if="(cards[index] as MultipleWordsStringType).concatenatedname !== undefined">
                    <li
                      class="flex-shrink-0 flex-grow-0 align-self-stretch"
                    >
                      <button
                        @click="() => {(cards[index] as MultipleWordsStringType).search.tabclicked=true; updateAttributeButtonTabClicked('CONCATENATED-NAME-FIELD', undefined); }"
                        class="text-lowercase tab" 
                        :style="(cards[index] as MultipleWordsStringType).search.tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
                        style="padding:5px 8px;font-size:1em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                      >
                        {{ (cards[index] as MultipleWordsStringType).concatenatedname }}
                      </button>
                    </li>
                  </template>
                  <li
                    v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType).concatenated"
                    class="flex-shrink-0 flex-grow-0 align-self-stretch"
                  >
                    <button 
                      :style="(concatenated.search as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
                      @click="() => { (concatenated.search as StringSearchType).tabclicked=true; updateAttributeButtonTabClicked('ONE-OF-CONCATENATED-FIELD', cindex as number); }"
                      class="text-lowercase tab" 
                      style="padding:5px 8px;font-size:1em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                    >
                      {{ concatenated.name }}
                    </button>
                  </li>
                </ul>
              </template>
            </div>
            <div class="d-block m-0" style="padding: 0 10px">
              <template v-if="!(cards[index] as MultipleWordsStringType).concatenated">
                <template v-if="(cards[index] as MultipleWordsStringType).search.tabclicked">
                  <div class="d-block">
                    <div class="d-block" style="padding: 15px 0 10px 0">
                      <div class="d-block" style="padding-bottom: 5px">
                        <label class="text-lowercase">
                          Search By
                          <span class="font-bold">{{ (cards[index] as MultipleWordsStringType).info.name }}</span>
                        </label>
                      </div>
                      <div class="d-block">
                        <input
                          type="text"
                          v-model="(cards[index] as MultipleWordsStringType).search.single"
                          class="w-100 shadow-sm"
                          style="height: 30px"
                        />
                      </div>
                    </div>
                    <div class="d-block" style="padding: 10px 3px 0px 3px;">
                      <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                        <li
                          class="flex-shrink-0 flex-grow-0 align-self-stretch"
                        >
                          <button
                            @click="() => { ((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = true; ((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = false; updateCard(); }"
                            class="text-lowercase tab" 
                            :style="((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
                            style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                          >
                            include
                          </button>
                        </li>
                        <li
                          class="flex-shrink-0 flex-grow-0 align-self-stretch"
                        >
                          <button
                            @click="() => { ((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked = false; ((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked = true; updateCard(); }"
                            class="text-lowercase tab" 
                            :style="((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
                            style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                          >
                            exclude
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div class="d-block shadow-sm" style="padding: 0 5px;">
                      <template v-if="((cards[index] as MultipleWordsStringType).search.include as StringSearchType).tabclicked">
                        <div class="d-block" style="padding: 10px 0">
                          <div class="d-block" style="padding-bottom: 5px">
                            <label class="text-lowercase align-middle">
                              include<span
                                class="font-bold"
                                style="padding-right: 4px; padding-left: 4px"
                                >{{ (cards[index] as MultipleWordsStringType).info.name }}</span
                              >that
                            </label>
                          </div>
                          <div class="d-block" style="padding-bottom: 5px"></div>
                          <AddSingleOrMultiplePaste
                            nospace="false"
                            :index="index"
                            :tree="((cards[index] as MultipleWordsStringType).search.include as StringSearchType)"
                            areatype="INCLUDE"
                          ></AddSingleOrMultiplePaste>
                        </div>
                      </template>
                      <template v-else>
                        <div class="d-block" style="padding: 10px 0">
                          <div class="d-block" style="padding-bottom: 5px">
                            <label class="text-lowercase">
                              exclude<span
                                class="font-bold"
                                style="padding-left: 4px; padding-right: 4px"
                                >{{ (cards[index] as MultipleWordsStringType).info.name }}</span
                              >that
                            </label>
                          </div>
                          <div class="d-block" style="padding-bottom: 5px"></div>
                          <AddSingleOrMultiplePaste
                            nospace="false"
                            :index="index"
                            :tree="((cards[index] as MultipleWordsStringType).search.exclude as StringSearchType)"
                            areatype="EXCLUDE"
                          ></AddSingleOrMultiplePaste>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="d-block">
                  <template v-if="(cards[index] as MultipleWordsStringType).concatenatedname !== undefined">
                    <template v-if="(cards[index] as MultipleWordsStringType).search.tabclicked">
                      <div class="d-block" style="padding: 15px 0 10px 0">
                        <div class="d-block" style="padding-bottom: 5px">
                          <label class="text-lowercase">
                            Search by
                            <span class="font-bold">
                              {{ (cards[index] as MultipleWordsStringType).concatenatedname }}
                            </span>
                          </label>
                        </div>
                        <AddSingleOrMultiplePaste
                          nospace="false"
                          :index="index"
                          :tree="(cards[index] as MultipleWordsStringType).search"
                          areatype="ORDINARY"
                        ></AddSingleOrMultiplePaste>
                      </div>
                    </template>
                  </template>
                  <template v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType).concatenated">
                    <template v-if="!concatenated.aword">
                      <template v-if="(concatenated.search as StringSearchType).tabclicked">
                        <div class="d-block">
                          <div class="d-block" style="padding: 15px 0 10px 0">
                            <div class="d-block" style="padding-bottom: 5px">
                              <label class="text-lowercase">
                                Search By
                                <span class="font-bold">{{ concatenated.name }}</span>
                              </label>
                            </div>
                            <div class="d-block">
                              <input
                                type="text"
                                v-model="(concatenated.search as StringSearchType).single"
                                class="w-100 shadow-sm"
                                style="height: 30px"
                              />
                            </div>
                          </div>
                          <div class="d-block" style="padding: 10px 3px 0px 3px;">
                            <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
                              <li
                                class="flex-shrink-0 flex-grow-0 align-self-stretch"
                              >
                                <button
                                  @click="() => { (concatenated.search?.include as StringSearchType).tabclicked = true; (concatenated.search?.exclude as StringSearchType).tabclicked = false; updateCard(); }"
                                  class="text-lowercase tab" 
                                  :style="(concatenated.search?.include as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
                                  style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                                >
                                  include
                                </button>
                              </li>
                              <li
                                class="flex-shrink-0 flex-grow-0 align-self-stretch"
                              >
                                <button
                                  @click="() => { (concatenated.search?.exclude as StringSearchType).tabclicked = true; (concatenated.search?.include as StringSearchType).tabclicked = false; updateCard(); }"
                                  class="text-lowercase tab" 
                                  :style="(concatenated.search?.exclude as StringSearchType).tabclicked? 'background-color:#F0E68C;' : 'background-color:lightgray;'"
                                  style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
                                >
                                  exclude
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div class="d-block shadow-sm" style="padding: 0 5px;">
                            <template v-if="(concatenated.search?.include as StringSearchType).tabclicked">
                              <div class="d-block" style="padding: 10px 0">
                                <div class="d-block" style="padding-bottom: 5px">
                                  <label class="text-lowercase align-middle">
                                    include<span
                                      class="font-bold"
                                      style="padding-right: 4px; padding-left: 4px"
                                      >{{ concatenated.name }}</span
                                    >that
                                  </label>
                                </div>
                                <div class="d-block" style="padding-bottom: 5px"></div>
                                <AddSingleOrMultiplePaste
                                  nospace="false"
                                  :index="index"
                                  :tree="(concatenated.search?.include as StringSearchType)"
                                  :areatype="'CONCATENATED-INCLUDE-' + cindex"
                                ></AddSingleOrMultiplePaste>
                              </div>
                            </template>
                            <template v-else>
                              <div class="d-block" style="padding: 10px 0">
                                <div class="d-block" style="padding-bottom: 5px">
                                  <label class="text-lowercase">
                                    exclude<span
                                      class="font-bold"
                                      style="padding-right: 4px; padding-left: 4px"
                                      >{{ concatenated.name }}</span
                                    >that
                                  </label>
                                </div>
                                <div class="d-block" style="padding-bottom: 5px"></div>
                                <AddSingleOrMultiplePaste
                                  nospace="false"
                                  :index="index"
                                  :tree="(concatenated.search?.exclude as StringSearchType)"
                                  :areatype="'CONCATENATED-EXCLUDE-' + cindex"
                                ></AddSingleOrMultiplePaste>
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="(concatenated.search as StringSearchType).tabclicked">
                        <div class="d-block" style="padding: 15px 0 10px 0">
                          <div class="d-block" style="padding-bottom: 5px">
                            <label class="text-lowercase"
                              >Search By
                              <span class="font-bold">{{ concatenated.name }}</span></label
                            >
                          </div>
                          <AddSingleOrMultiplePaste
                            nospace="false"
                            :index="index"
                            :tree="(concatenated.search as StringSearchType)"
                            :areatype="'ORDINARY-' + cindex"
                          ></AddSingleOrMultiplePaste>
                        </div>
                      </template>
                    </template>
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
</template>

<style scoped>
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
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
  height: 550px;
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

.tab {
  border: none;
  outline: 1px solid gray;
}
</style>
