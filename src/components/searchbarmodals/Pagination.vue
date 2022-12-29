<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  type WatchStopHandle,
  watch,
  onBeforeUnmount,
} from "vue";

const 
  current = ref(0),
  props = defineProps<{
    length: number;
    _current: [number, number];
  }>(),
  emits = defineEmits<{
    (e: "update:current", action: number): void
  }>(),
  limit = 10,
  inputpagenumberref = ref()
;

let unwatchcurrent: WatchStopHandle;

onBeforeMount(() => {
  current.value = props._current[1];
  unwatchcurrent = watch(
    () => props._current[0],
    (x) => {
      current.value = props._current[1] + 1;
    }
  )
});

onBeforeUnmount(() => {
  unwatchcurrent();
});

function previousOrNextClicked(previousornext: "PREVIOUS" | "NEXT" | "INPUT") {
  if (previousornext === "NEXT") {
    if (current.value >= 1 && current.value < props.length) {
      current.value++;
      if (inputpagenumberref.value) {
        if (props.length > 10 && props.length < limit) {
          if (current.value >= 5 && current.value <= props.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (props.length >= limit) {
            if (current.value >= 5 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
      emits("update:current", current.value-1);
    }
  } else if (previousornext === "PREVIOUS") {
    if (current.value > 1) {
      current.value--;
      if (inputpagenumberref.value) {
        if (props.length > 10 && props.length < limit) {
          if (current.value >= 5 && current.value <= props.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (props.length >= limit) {
            if (current.value >= 5 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
      emits("update:current", current.value-1);
    }
  } else {
    current.value = inputpagenumberref.value.value;
    emits("update:current", current.value-1);
  }
}

function setCurrent(pageindex: number) {
  current.value = pageindex; 
  emits('update:current', current.value === 0? 0 : current.value-1);
}

</script>


<template>  
  <div class="d-block">
    <ul
      class="m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
    >
      <li
        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
        style="padding: 5px 3px 5px 0px; width: 10%"
      >
        <button
          class="btn shadow-sm w-100 text-center"
          style="font-size: 0.8rem; padding: 5.2px 0"
        >
          <img
            src="/src/assets/icons/expand.png"
            class="align-middle"
            style="width: 15px; height: 15px;"
          />
        </button>
      </li>
      <li class="flex-fill align-self-stretch" :style="length > 1? 'width: 80%' : 'width: 90%'">
        <template v-if="length > 1">
          <ul
            class="m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
          >
            <li
              style="padding: 5px 3px"
              class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
              :style="
                length < 11
                  ? 'width:' + 100 / (length + 2) + '%'
                  : 'width:' + 100 / 11 + '%'
              "
            >
              <button
                @keypress.enter="previousOrNextClicked('PREVIOUS')"
                @click="previousOrNextClicked('PREVIOUS')"
                class="btn shadow-sm w-100 text-center"
                style="padding: 2.7px 0"
              >
                <img
                  src="/src/assets/icons/previous.png"
                  class="align-middle"
                  style="width: 15px; height: 15px"
                />
              </button>
            </li>
            <template v-if="length <= 10">
              <li
                style="padding: 5px 3px"
                class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                v-for="pageindex in length"
                :key="pageindex + '-pagination'"
                :style="
                  length < 11
                    ? 'width:' + 100 / (length + 2) + '%'
                    : 'width:' + 100 / 11 + '%'
                "
              >
                <button
                  class="btn shadow-sm w-100 text-center"
                  style="font-size: 0.8rem; padding: 5.2px 0px"
                  :style="current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''"
                  @keypress.enter="setCurrent(pageindex)"
                  @click="setCurrent(pageindex)"
                >
                  {{ pageindex }}
                </button>
              </li>
            </template>
            <template v-else-if="length > 10 && length < limit">
              <template v-for="pageindex in length">
                <template v-if="pageindex < 5">
                  <li
                    style="padding: 5px 3px; width: 8.333333333%"
                    class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                    :key="pageindex + '-pagination'"
                  >
                    <button
                      class="btn shadow-sm w-100 text-center"
                      style="font-size: 0.8rem; padding: 5.2px 0px"
                      :style="current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''"
                      @keypress.enter="setCurrent(pageindex)"
                      @click="setCurrent(pageindex)"
                    >
                      {{ pageindex }}
                    </button>
                  </li>
                </template>
                <template v-else-if="pageindex === 5">
                  <li
                    style="padding: 5px 3px; width: 16.666666667%"
                    class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                    :key="pageindex + '-pagination'"
                  >
                    <input
                      :ref="(el) => (inputpagenumberref = el)"
                      type="number"
                      class="shadow-sm w-100 text-center"
                      style="font-size: 0.8rem; padding: 5.2px 0px"
                      :style="
                        current >= 5 && current <= length - 4
                          ? 'background-color: #F0E68C;'
                          : ''
                      "
                      min="5"
                      :max="length - 4"
                      maxlength="3"
                      size="4"
                      value="5"
                      @keypress.enter="previousOrNextClicked('INPUT')"
                    />
                  </li>
                </template>
                <template v-else>
                  <template v-if="pageindex + 4 > length">
                    <li
                      style="padding: 5px 3px; width: 8.333333333%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <button
                        class="btn shadow-sm w-100 text-center"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="
                          current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                        "
                        @keypress.enter="setCurrent(pageindex)"
                        @click="setCurrent(pageindex)"
                      >
                        {{ pageindex }}
                      </button>
                    </li>
                  </template>
                </template>
              </template>
            </template>
            <template v-else>
              <template v-for="pageindex in length">
                <template v-if="pageindex < 5">
                  <li
                    style="padding: 5px 3px; width: 8.333333333%"
                    class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                    :key="pageindex + '-pagination'"
                  >
                    <button
                      class="btn shadow-sm w-100 text-center"
                      style="font-size: 0.8rem; padding: 5.2px 0px"
                      :style="current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''"
                      @keypress.enter="setCurrent(pageindex)"
                      @click="setCurrent(pageindex)"
                    >
                      {{ pageindex }}
                    </button>
                  </li>
                </template>
                <template v-else-if="pageindex === 5">
                  <li
                    style="padding: 5px 3px; width: 24.limitlimit%"
                    class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                    :key="pageindex + '-pagination'"
                  >
                    <input
                      :ref="(el) => (inputpagenumberref = el)"
                      type="number"
                      class="shadow-sm w-100 text-center"
                      style="font-size: 0.8rem; padding: 5.2px 0px"
                      :style="
                        current >= 5 && current <= length - 1
                          ? 'background-color: #F0E68C;'
                          : ''
                      "
                      min="5"
                      :max="length - 1"
                      maxlength="5"
                      size="6"
                      value="5"
                      @keypress.enter="previousOrNextClicked('INPUT')"
                    />
                  </li>
                </template>
                <template v-else>
                  <template v-if="pageindex + 1 > length">
                    <li
                      style="padding: 5px 3px; width: 24.limitlimit%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <button
                        class="btn shadow-sm w-100 text-center"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="
                          current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                        "
                        @keypress.enter="setCurrent(pageindex)"
                        @click="setCurrent(pageindex)"
                      >
                        {{ pageindex }}
                      </button>
                    </li>
                  </template>
                </template>
              </template>
            </template>
            <li
              style="padding: 5px 3px"
              class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
              :style="
                length < 11
                  ? 'width:' + 100 / (length + 2) + '%'
                  : 'width:' + 100 / 11 + '%'
              "
            >
              <button
                @keypress.enter="previousOrNextClicked('NEXT')"
                @click="previousOrNextClicked('NEXT')"
                class="btn shadow-sm w-100 text-center"
                style="padding: 2.7px 0"
              >
                <img
                  src="/src/assets/icons/next.png"
                  class="align-middle"
                  style="width: 15px; height: 15px"
                />
              </button>
            </li>
          </ul>
        </template>
      </li>
      <template v-if="length > 1">
        <li
          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
          style="padding: 5px 0px 5px 3px; width: 10%"
        >
          <button
            class="btn shadow-sm w-100 text-center"
            style="font-size: 0.8rem; padding: 5.2px 0"
            :style="current === 0 && length > 1 ? 'background-color: #F0E68C;' : ''"
            @keypress.enter="setCurrent(0)"
            @click="setCurrent(0)"
          >
            <img
              src="/src/assets/icons/all.png"
              class="align-middle"
              style="width: 15px; height: 15px"
            />
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>
