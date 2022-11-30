<script setup lang="ts">
import { ref } from "vue";

const 
  pages = ref([]),
  current = ref(0),
  inputpagenumberref = ref();


function previousOrNextClicked(previousornext: "PREVIOUS" | "NEXT" | "INPUT") {
  if (previousornext === "NEXT") {
    if (current.value >= 1 && current.value < pages.value.length) {
      current.value++;
      if (inputpagenumberref.value) {
        if (pages.value.length > 10 && pages.value.length < 999) {
          if (current.value >= 5 && current.value <= pages.value.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (pages.value.length >= 999) {
            if (current.value >= 5 && current.value <= pages.value.length - 1) {
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
        if (pages.value.length > 10 && pages.value.length < 999) {
          if (current.value >= 5 && current.value <= pages.value.length - 4) {
            inputpagenumberref.value.value = current.value;
          }
        } else {
          if (pages.value.length >= 999) {
            if (current.value >= 5 && current.value <= pages.value.length - 1) {
              inputpagenumberref.value.value = current.value;
            }
          }
        }
      }
    }
  } else {
    current.value = inputpagenumberref.value.value;
  }
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
          :style="current === 0 && pages.length > 1 ? 'background-color: #F0E68C;' : ''"
          @click="current = 0"
        >
          All
        </a>
      </li>
      <li class="flex-fill align-self-stretch" style="width: 90%">
        <template v-if="pages.length > 1">
          <ul
            class="m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
          >
            <li
              style="padding: 5px 3px"
              class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
              :style="
                pages.length < 11
                  ? 'width:' + 100 / (pages.length + 2) + '%'
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
            <template v-if="pages.length <= 10">
              <li
                style="padding: 5px 3px"
                class="flex-grow-0 flex-shrink-0 align-self-stretch text-center"
                v-for="pageindex in pages.length"
                :key="pageindex + '-pagination'"
                :style="
                  pages.length < 11
                    ? 'width:' + 100 / (pages.length + 2) + '%'
                    : 'width:' + 100 / 11 + '%'
                "
              >
                <a
                  class="btn underline-none shadow-sm d-block"
                  style="font-size: 0.8rem; padding: 5.2px 0px"
                  :style="current === pageindex ? 'background-color: #F0E68C;' : ''"
                  @click="current = pageindex"
                >
                  {{ pageindex }}
                </a>
              </li>
            </template>
            <template v-else-if="pages.length > 10 && pages.length < 999">
              <template v-for="pageindex in pages.length">
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
                      @click="current = pageindex"
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
                        current >= 5 && current <= pages.length - 4
                          ? 'background-color: #F0E68C;'
                          : ''
                      "
                      min="5"
                      :max="pages.length - 4"
                      maxlength="3"
                      size="4"
                      value="5"
                      @keypress.enter="previousOrNextClicked('INPUT')"
                    />
                  </li>
                </template>
                <template v-else>
                  <template v-if="pageindex + 4 > pages.length">
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
                        @click="current = pageindex"
                      >
                        {{ pageindex }}
                      </a>
                    </li>
                  </template>
                </template>
              </template>
            </template>
            <template v-else>
              <template v-for="pageindex in pages.length">
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
                      @click="current = pageindex"
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
                        current >= 5 && current <= pages.length - 1
                          ? 'background-color: #F0E68C;'
                          : ''
                      "
                      min="5"
                      :max="pages.length - 1"
                      maxlength="5"
                      size="6"
                      value="5"
                      @keypress.enter="previousOrNextClicked('INPUT')"
                    />
                  </li>
                </template>
                <template v-else>
                  <template v-if="pageindex + 1 > pages.length">
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
                        @click="current = pageindex"
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
                pages.length < 11
                  ? 'width:' + 100 / (pages.length + 2) + '%'
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
        style="padding: 5px 0px 5px 3px; width: 10%"
      >
        <a class="btn underline-none shadow-sm d-block" style="padding: 2.8px 0">
          <img
            src="/src/assets/icons/expand.png"
            class="align-middle"
            style="width: 15px; height: 15px"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
