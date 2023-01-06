<script setup lang="ts">
import { shallowRef, inject, triggerRef, nextTick, type ShallowRef, type Ref } from "vue";
import type { KeyToNameType, PrimitiveType, CurrentAndSignalType, CurrentAndSignalInnerType } from "./types/SupportedDatatypesTypeDeclaration";
import Pagination from "./searchbarmodals/Pagination.vue";

let
  accessibility = inject("accessibility") as {
    cardschildrentabindex: Ref<Boolean[]>;
    cardsfilteritemtabindex: Ref<Boolean[]>;
  },
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = inject("index") as number
;

const currentandsignal = shallowRef<CurrentAndSignalType>({
  displayer: {
    signal: 0,
    current: 0,
    closepaste: 0,
  },
});

function handleTabPress(e: KeyboardEvent) {
  nextTick(() => {
    if (e.shiftKey) {
      document.getElementById(cards.value[index].scroll.areaid)?.focus();
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

function updateCurrent(val: number) { 
  (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = val; 
  triggerRef(currentandsignal);
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

    if(accessibility.cardsfilteritemtabindex.value[index] === false) {
      accessibility.cardsfilteritemtabindex.value[index] = true;
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

    if(accessibility.cardsfilteritemtabindex.value[index] === false) {
      accessibility.cardsfilteritemtabindex.value[index] = true;
    }
  });
}
</script>

<template>
  <div class="d-block">
    <div class="d-block shadow-sm" style="z-index:8000;">
      <div class="m-0 p-0 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100" style="height:30px;background-color: #E8E8E8;outline: 0.063rem solid gray;">
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="border: 0.063rem solid gray;">
          <button
            @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding:2.5px 0;border:none;"
          >
            <img src="/src/assets/icons/horizontal.png" style="width:25px;height:25px;" class="align-middle" />
          </button>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="border: 0.063rem solid gray;">
          <button
            @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding:2.5px 0;border:none;"
          >
            <img src="/src/assets/icons/vertical.png" style="width:25px;height:25px;" class="align-middle" />
          </button>
        </div>
        <div class="flex-fill align-self-stretch m-0 p-0">
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="border: 0.063rem solid gray;">
          <button
            @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding:2.5px 0;border:none;"
          >
            <img src="/src/assets/icons/down-arrow.png" style="width:25px;height:25px;" class="align-middle" />
          </button>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="border: 0.063rem solid gray;">
          <button
            @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding:2.5px 0;border:none;"
          >
            <img src="/src/assets/icons/up-arrow.png" style="width:25px;height:25px;" class="align-middle" />
          </button>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="border: 0.063rem solid gray;">
          <button
            @click="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            @keyup.enter="() => { accessibility.cardschildrentabindex.value[index] = true; }"
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            class="s-search-btn h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="font-size: 0.9rem;border:none;"
          >
            <img src="/src/assets/icons/close.png" style="width:20px;height:20px;" />
          </button>
        </div>
      </div>
      <div style="padding: 0 5px; height:45px;border: 1px solid #E8E8E8;" class="m-0 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100">
        <div class="flex-shrink-0 flex-grow-0">
          <input
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            @change="selectAllOrNot()"
            class="align-middle shadow-sm"
            type="checkbox"
            style="width: 15px; height:15px"
            :checked="cards[index].result.all ? true : false"
          />
        </div>
        <div class="flex-fill" style="padding-left: 10px;">
          <template v-if="parseInt(''+((cards[index].result.data.length) / 100)) > 1">
            <Pagination
              paginationtype="RESULT-DISPLAYER-VERTICAL"
              :_current="[
                (currentandsignal.displayer as CurrentAndSignalInnerType).signal,
                (currentandsignal.displayer as CurrentAndSignalInnerType).current
              ]"
              :length="parseInt(''+((cards[index].result.data.length) / 100))"
              @update:current="($val: number) => updateCurrent($val)"
            ></Pagination>
          </template>
        </div>
      </div>
    </div>
    <div class="d-block position-relative" style="padding-top:1px;">
      <div
        :id="cards[index].scroll.areaid"
        class="d-block overflow-y-auto overflow-x-hidden shadow-sm listbox"
        style="height: 16.625rem"
        @focus="accessibility.cardsfilteritemtabindex.value[index] = false"
        :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
        @keyup.enter="accessibility.cardsfilteritemtabindex.value[index] = true"
        @click="accessibility.cardsfilteritemtabindex.value[index] = true"
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
                    :tabindex="accessibility.cardsfilteritemtabindex.value[index]? 0 : -1"
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
                    :tabindex="accessibility.cardsfilteritemtabindex.value[index]? 0 : -1"
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
    <div class="d-block" style="padding: 0.63rem 0">
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
            :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
            @keydown.tab="handleTabPress($event)"
            @blur="accessibility.cardsfilteritemtabindex.value[index] = false"
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
