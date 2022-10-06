<script setup lang="ts">
import { customRef } from "vue";

const props = defineProps<{
  cards: any;
}>();

const emits = defineEmits<{
  (e: "update:filterableresultdisplayer", action: any): void;
}>();

function useDebouncedRef(value, delay = 1) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
          clearTimeout(timeout);
        }, delay);
      },
    };
  });
}

let debouncedcard = useDebouncedRef(props.cards);

function selectAllOrNot(recordtype: string) {
  props.cards.result.all = !props.cards.result.all;
  props.cards.result.data.forEach((item) => {
    if (props.cards.result.all) {
      if (!item.checked) {
        item.checked = props.cards.result.all;
        props.cards.result.totalselection++;
      }
    } else {
      if (item.checked) {
        item.checked = props.cards.result.all;
        props.cards.result.totalselection--;
      }
    }
  });
  debouncedcard.value = props.cards;
  emits("update:filterableresultdisplayer", debouncedcard.value);
}

function handleSelection(index: number) {
  props.cards.result.data[index].checked = !props.cards.result.data[index].checked;
  if (props.cards.result.data[index].checked) {
    props.cards.result.totalselection++;
    if (props.cards.result.totalselection === props.cards.result.data.length) {
      props.cards.result.all = true;
    } else {
      props.cards.result.all = false;
    }
  } else {
    props.cards.result.totalselection--;
    props.cards.result.all = false;
  }
  debouncedcard.value = props.cards;
  emits("update:filterableresultdisplayer", debouncedcard.value);
}
</script>

<template>
  <div class="d-block" style="padding: 0.325777rem 0">
    <input
      @change="selectAllOrNot()"
      class="align-middle shadow-sm"
      :id="'deselect-' + debouncedcard.scroll.areaid"
      type="checkbox"
      style="width: 15px; height: 15px"
      :checked="debouncedcard.result.all ? true : false"
    />
    <label
      style="margin-left: 0.35rem"
      class="align-middle letter-spacing font-bold font-0-dot-80-rem"
      :for="'deselect-' + debouncedcard.scroll.areaid"
    >
      All
    </label>
  </div>
  <div class="d-block position-relative" style="padding: 0.291667rem 0">
    <div
      :id="debouncedcard.scroll.areaid"
      class="d-block overflow-y-auto overflow-x-hidden shadow-sm"
      style="height: 16.625rem"
    >
      <ul class="d-block list-style-none m-0" style="padding: 5px 0px">
        <li
          class="w-100"
          v-for="(data, dindex) in debouncedcard.result.data"
          :key="'jii' + dindex"
        >
          <template
            v-if="
              debouncedcard.info.datatype === 'Date' ||
              debouncedcard.info.datatype === 'DateTime' ||
              debouncedcard.info.datatype === 'Number' ||
              debouncedcard.info.datatype === 'Time' ||
              debouncedcard.info.datatype === 'Year'
            "
          >
            <div
              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
              style="padding: 1px 5px"
            >
              <div class="flex-shrink-0 flex-grow-0">
                <input
                  @change="handleSelection(dindex)"
                  :checked="data.checked"
                  :id="debouncedcard.scroll.areaid + 'jjj' + dindex"
                  class="align-middle shadow-sm"
                  type="checkbox"
                  :name="debouncedcard.scroll.areaid"
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
                        style="padding: 8px"
                        :for="debouncedcard.scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                      >
                        <template v-if="debouncedcard.info.datatype === 'DateTime'">
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
                        style="padding: 8px"
                        :for="debouncedcard.scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                      >
                        NO {{ debouncedcard.info.name }}
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
                  @change="handleSelection(dindex)"
                  :checked="data.checked"
                  :id="debouncedcard.scroll.areaid + 'jjj' + dindex"
                  class="align-middle shadow-sm"
                  type="checkbox"
                  :name="debouncedcard.scroll.areaid"
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
                        style="padding: 8px"
                        :for="debouncedcard.scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                        >{{
                          debouncedcard.info.datatype === "KeyToName"
                            ? debouncedcard.keytonamemapping[data.row]
                            : data.row
                        }}</label
                      >
                    </template>
                    <template v-else>
                      <label
                        style="padding: 8px"
                        :for="debouncedcard.scroll.areaid + 'jjj' + dindex"
                        class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                      >
                        NO {{ debouncedcard.info.name }}
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
          :class="[debouncedcard.result.totalselection === 0 ? '' : 'cursor-pointer']"
          :disabled="debouncedcard.result.totalselection === 0 ? true : false"
          class="btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center shadow-sm"
          style="border-radius: 10px; padding: 0.08rem 0"
        >
          <img
            src="/src/assets/icons/filter.png"
            style="height: 1.1667rem !important; width: 1.1667rem"
            class="align-middle"
          />
          <span
            class="font-bold letter-spacing font-0-dot-90-rem"
            style="padding-left: 0.2rem"
            >Filter by selected</span
          >
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
input[type="checkbox"]:focus {
  outline: 1px solid rgba(0, 0, 0, 0.2);
  border: none;
}
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
</style>
