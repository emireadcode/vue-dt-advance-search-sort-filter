<script setup lang="ts">
import {
  ref,
} from "vue";

const 
  current = ref(0),
  props = defineProps<{
    length: number;
    current: number;
  }>(),
  emits = defineEmits<{
    (e: "update:current", action: number): void
  }>(),
  inputpagenumberref = ref()
;

current.value = props.current;

function previousOrNextClicked(previousornext: "PREVIOUS" | "NEXT" | "INPUT") {
  if (previousornext === "NEXT") {
    if (current.value >= 1 && current.value < props.length) {
      current.value++;
      if (inputpagenumberref.value) {
        if (props.length > 10 && props.length < 999) {
          if (current.value >= 5 && current.value <= props.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (props.length >= 999) {
            if (current.value >= 5 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
    }
  } else if (previousornext === "PREVIOUS") {
    if (current.value > 1) {
      current.value--;
      if (inputpagenumberref.value) {
        if (props.length > 10 && props.length < 999) {
          if (current.value >= 5 && current.value <= props.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (props.length >= 999) {
            if (current.value >= 5 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
    }
  } else {
    current.value = inputpagenumberref.value.value;
  }
  emits("update:current", current.value);
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
        <a
          class="btn underline-none shadow-sm d-block"
          style="font-size: 0.8rem; padding: 5.2px 0"
        >
          <img
            src="/src/assets/icons/expand.png"
            class="align-middle"
            style="width: 15px; height: 15px;"
          />
        </a>
      </li>
      <li class="flex-fill align-self-stretch" style="width: 80%">
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
              <a
                @click="previousOrNextClicked('PREVIOUS')"
                class="btn underline-none shadow-sm d-block"
                style="padding: 2.7px 0"
              >
                <img
                  src="/src/assets/icons/previous.png"
                  class="align-middle"
                  style="width: 15px; height: 15px"
                />
              </a>
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
                <a
                  class="btn underline-none shadow-sm d-block"
                  style="font-size: 0.8rem; padding: 5.2px 0px"
                  :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                  @click="() => { current = pageindex; emits('update:current', current); }"
                >
                  {{ pageindex }}
                </a>
              </li>
            </template>
            <template v-else-if="length > 10 && length < 999">
              <template v-for="pageindex in length">
                <template v-if="pageindex < 5">
                  <li
                    style="padding: 5px 3px; width: 8.333333333%"
                    class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                    :key="pageindex + '-pagination'"
                  >
                    <a
                      class="btn underline-none shadow-sm d-block"
                      style="font-size: 0.8rem; padding: 5.2px 0px"
                      :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                      @click="() => { current = pageindex; emits('update:current', current); }"
                    >
                      {{ pageindex }}
                    </a>
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
                      <a
                        class="btn underline-none shadow-sm d-block"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="
                          current === pageindex ? 'background-color: #F0E68C;' : ''
                        "
                        @click="() => { current = pageindex; emits('update:current', current); }"
                      >
                        {{ pageindex }}
                      </a>
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
                    <a
                      class="btn underline-none shadow-sm d-block"
                      style="font-size: 0.8rem; padding: 5.2px 0px"
                      :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                      @click="() => { current = pageindex; emits('update:current', current); }"
                    >
                      {{ pageindex }}
                    </a>
                  </li>
                </template>
                <template v-else-if="pageindex === 5">
                  <li
                    style="padding: 5px 3px; width: 24.999999%"
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
                      style="padding: 5px 3px; width: 24.999999%"
                      class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                      :key="pageindex + '-pagination'"
                    >
                      <a
                        class="btn underline-none shadow-sm d-block"
                        style="font-size: 0.8rem; padding: 5.2px 0px"
                        :style="
                          current === pageindex ? 'background-color: #F0E68C;' : ''
                        "
                        @click="() => { current = pageindex; emits('update:current', current); }"
                      >
                        {{ pageindex }}
                      </a>
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
              <a
                @click="previousOrNextClicked('NEXT')"
                class="btn underline-none shadow-sm d-block"
                style="padding: 2.7px 0"
              >
                <img
                  src="/src/assets/icons/next.png"
                  class="align-middle"
                  style="width: 15px; height: 15px"
                />
              </a>
            </li>
          </ul>
        </template>
      </li>
      <li
        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
        style="padding: 5px 3px 5px 0px; width: 10%"
      >
        <a
          class="btn underline-none shadow-sm d-block"
          style="font-size: 0.8rem; padding: 5.2px 0"
          :style="current === 0 && length > 1 ? 'background-color: #F0E68C;' : ''"
          @click="() => { current = 0; emits('update:current', current); }"
        >
          <img
            src="/src/assets/icons/all.png"
            class="align-middle"
            style="width: 15px; height: 15px"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
