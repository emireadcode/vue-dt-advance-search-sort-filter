<script setup lang="ts">
import { inject, triggerRef, nextTick, type ShallowRef, type Ref } from "vue";
import type { KeyToNameType, PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";

const
  props = defineProps<{
    index: number;
  }>()
;

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardFocusableDescendantsTabIndex: Ref<Boolean[]>;
      cardListBoxFocusableDescendantsTabIndex: Ref<Boolean[]>;
    };
  },
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index
;


function handleTabPress(e: KeyboardEvent) {
  nextTick(() => {
    if (e.shiftKey) {
      document.getElementById(cards.value[index].scroll.areaid)?.focus();
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

function selectAllOrNot() {
  cards.value[index].result.all = !cards.value[index].result.all;
  triggerRef(cards);

  nextTick(() => {
    cards.value[index].result.data.forEach((item) => {
      if (cards.value[index].result.all) {
        if (!item.checked) {
          item.checked = cards.value[index].result.all;
          cards.value[index].result.totalselection++;
        }
      } else {
        if (item.checked) {
          item.checked = cards.value[index].result.all;
          cards.value[index].result.totalselection--;
        }
      }
    });
    triggerRef(cards);

    if(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] === false) {
      accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] = true;
    }
  });
}

function handleSelection(i: number) {
  cards.value[index].result.data[i].checked = !cards.value[index].result.data[i].checked;
  triggerRef(cards);

  nextTick(() => {
    if (cards.value[index].result.data[i].checked) {
      cards.value[index].result.totalselection++;
      if (cards.value[index].result.totalselection === cards.value[index].result.data.length) {
        cards.value[index].result.all = true;
      } else {
        cards.value[index].result.all = false;
      }
    } else {
      cards.value[index].result.totalselection--;
      cards.value[index].result.all = false;
    }
    triggerRef(cards);

    if(accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] === false) {
      accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] = true;
    }
  });
}
</script>

<template>
  <div class="d-block" style="padding: 0.325777rem 0">
    <input
      :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
      @change="selectAllOrNot()"
      class="align-middle shadow-sm"
      :id="'deselect-' + cards[index].scroll.areaid"
      type="checkbox"
      style="width: 15px; height: 15px"
      :checked="cards[index].result.all ? true : false"
    />
    <label
      style="margin-left: 0.35rem"
      class="align-middle letter-spacing font-bold font-0-dot-80-rem"
      :for="'deselect-' + cards[index].scroll.areaid"
    >
      All
    </label>
  </div>
  <div class="d-block position-relative" style="padding: 0.291667rem 0">
    <div
      :id="cards[index].scroll.areaid"
      class="d-block overflow-y-auto overflow-x-hidden shadow-sm listbox"
      style="height: 16.625rem"
      @focus="accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] = false"
      :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
      @keyup.enter="accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] = true"
      @click="accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] = true"
    >
      <ul class="d-block list-style-none m-0" style="padding: 5px 0px">
        <li
          class="w-100"
          v-for="(data, dindex) in cards[index].result.data"
          :key="cards[index].scroll.areaid + '-jjj-' + dindex"
        >
          <template
            v-if="
              cards[index].info.datatype === 'Date' ||
              cards[index].info.datatype === 'DateTime' ||
              cards[index].info.datatype === 'Number' ||
              cards[index].info.datatype === 'Time' ||
              cards[index].info.datatype === 'Year'
            "
          >
            <div
              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
              style="padding: 1px 5px"
            >
              <div class="flex-shrink-0 flex-grow-0">
                <input
                  :tabindex="accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index]? 0 : -1"
                  @change="handleSelection(dindex)"
                  :checked="data.checked"
                  :id="cards[index].scroll.areaid + 'jjj' + dindex"
                  class="align-middle shadow-sm"
                  type="checkbox"
                  :name="cards[index].scroll.areaid"
                  style="width: 15px; height: 15px"
                />
              </div>
              <div class="flex-fill" style="padding-left: 5px">
                <div class="d-block" style="padding: 5px">
                  <div
                    class="d-block text-wrap text-break shadow-sm"
                    style="border-radius: 20px"
                  >
                    <template v-if="data.row !== null">
                      <label
                        tabindex="-1"
                        style="padding: 8px"
                        :for="cards[index].scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                      >
                        <template v-if="cards[index].info.datatype === 'DateTime'">
                          <div
                            class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                          >
                            <div class="flex-fill align-self-stretch">
                              {{ data.row.split("__O__")[0] }}
                            </div>
                            <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
                              {{ data.row.split("__O__")[1] }}
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          {{ data.row }}
                        </template>
                      </label>
                    </template>
                    <template v-else>
                      <label
                        tabindex="-1"
                        style="padding: 8px"
                        :for="cards[index].scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                      >
                        NO {{ cards[index].info.name }}
                      </label>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
              style="padding: 1px 5px"
            >
              <div class="flex-shrink-0 flex-grow-0">
                <input
                  :tabindex="accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index]? 0 : -1"
                  @change="handleSelection(dindex)"
                  :checked="data.checked"
                  :id="cards[index].scroll.areaid + 'jjj' + dindex"
                  class="align-middle shadow-sm"
                  type="checkbox"
                  :name="cards[index].scroll.areaid"
                  style="width: 15px; height: 15px"
                />
              </div>
              <div class="flex-fill" style="padding-left: 5px">
                <div class="d-block" style="padding: 5px">
                  <div
                    class="d-block text-wrap text-break shadow-sm"
                    style="border-radius: 20px"
                  >
                    <template v-if="data.row !== null && data.row.trim() !== ''">
                      <label
                        tabindex="-1"
                        style="padding: 8px"
                        :for="cards[index].scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                        >{{
                          cards[index].info.datatype === "KeyToName"
                            ? (cards[index] as KeyToNameType).keytonamemapping[data.row]
                            : data.row
                        }}</label
                      >
                    </template>
                    <template v-else>
                      <label
                        tabindex="-1"
                        style="padding: 8px"
                        :for="cards[index].scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                      >
                        NO {{ cards[index].info.name }}
                      </label>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
  <div class="d-block" style="padding: 0.542416rem 0 0.834083rem 0">
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
    >
      <div class="flex-w-50 m-0 align-self-stretch" style="padding: 0 3px 0 0">
        <button
          :class="[cards[index].result.totalselection === 0 ? 'cursor-disabled' : 'cursor-pointer']"
          :style="cards[index].result.totalselection === 0 ? 'color:grey;opacity:0.6;' : 'color:black;opacity:1;'"
          :aria-disabled="cards[index].result.totalselection === 0 ? true : false"
          class="btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center shadow-sm"
          style="border-radius: 10px; padding: 0.08rem 0"
          :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
          @keydown.tab="handleTabPress($event)"
          @blur="accessibility.attributes.cardListBoxFocusableDescendantsTabIndex.value[index] = false"
        >
          <img
            src="/src/assets/icons/filter.png"
            style="height: 1.1667rem !important; width: 1.1667rem"
            class="align-middle"
          />
          <span
            class="font-bold letter-spacing font-0-dot-90-rem"
            style="padding-left: 0.2rem"
          >
            Filter by selected
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  background-color: #fff;
  border: 1px solid black;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
input[type="checkbox"]:focus,
input[type="checkbox"]:hover {
  background-color: #ccc;
  border: none;
}
input[type="checkbox"]:checked {
  border: none;
  background-color: #2196f3;
  background: #2196f3
    url("data:image/gif;base64,R0lGODlhCwAKAIABAP////3cnSH5BAEKAAEALAAAAAALAAoAAAIUjH+AC73WHIsw0UCjglraO20PNhYAOw==")
    2px 2px no-repeat;
}
.listbox {
  outline: 1px solid transparent;
  border: none;
}
.listbox:focus {
  outline: 1px solid black;
}
</style>
