<script setup lang="ts">
import type { 
  StringSearchType,
  NumberSearchType,
  NumberType,
  SingleWordStringType,
  MultipleWordsStringType,
  NumberStringType,
} from '../types/SupportedDatatypesTypeDeclaration';
import { 
  type ShallowRef, 
  type WatchStopHandle,
  ref,
  inject,
  onBeforeMount,
} from "vue";

const 
  pages = ref<string[][]>([]),
  current = ref(0),
  inputpagenumberref = ref(),
  lastpasteditemsref = ref(),
  holder = ref(),
  pasteditemsref = ref<HTMLDivElement[]>([]),
  props = defineProps<{
    displayAreaHeight: string;
    scrollareaid: string;
    tree: StringSearchType | NumberSearchType;
  }>(),
  index = inject("index") as number,
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType | NumberType)[]>,
  temporary = ref()
;

let
  unwatchcurrent: WatchStopHandle,
  unwatchpagination: WatchStopHandle
;

function previousOrNextClicked(direction: string) {

}

function deleteholderitem(holderitemindex: number) {

}

onBeforeMount(() => {
  holder.value = props.tree;
  temporary.value = props.tree;
});

</script>

<template>
  <div class="d-block">
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
          style="padding: 5px 3px 5px 0px; width: 10%"
        >
          <a
            class="btn underline-none shadow-sm d-block"
            style="font-size: 0.8rem; padding: 5.2px 0"
            :style="current === 0 && pages.length > 1 ? 'background-color: #F0E68C;' : ''"
            @click="current = 0"
          >
            <img
              src="/src/assets/icons/next.png"
              class="align-middle"
              style="width: 15px; height: 15px"
            />
            <img
              src="/src/assets/icons/next.png"
              class="align-middle"
              style="width: 15px; height: 15px"
            />
          </a>
        </li>
      </ul>
    </div>
    <div class="d-block">
      <div
        :id="current === 0 ? scrollareaid : ''"
        class="m-0 p-0 d-block overflow-y-auto"
        style="z-index: 1000; background-color: #eee"
        :style="displayAreaHeight"
      >
        <div class="d-block">
          <template v-if="holder.value">
            <ul
              class="m-0 p-0 flex-box flex-direction-row flex-wrap list-style-none justify-content-start w-100"
            >
              <li
                style="padding: 5px"
                class="flex-grow-0 flex-shrink-0"
                v-for="(holderitem, holderitemindex) in holder.value"
                :key="holderitemindex + 'include'"
              >
                <div
                  :ref="
                    (el) => {
                      pasteditemsref[holderitemindex] = el as HTMLDivElement;
                    }
                  "
                  class="d-inline-block shadow-sm cursor-pointer"
                  style="border-radius: 9px;background-color: #fff;padding: 4px 7px;font-size: 10px;"
                >
                  <a
                    @click="deleteholderitem(holderitemindex)"
                    class="d-inline-block underline-none"
                  >
                    <img
                      src="/src/assets/icons/close.png"
                      style="width: 18px; height: 18px"
                      class="align-middle"
                    />
                  </a>
                  <span
                    class="font-0-dot-90-rem d-inline-block align-middle"
                    style="padding-left: 5px"
                  >
                    {{ holderitem }}
                  </span>
                </div>
              </li>
              <template v-if="holder.addloading">
                <li style="padding: 5px" class="flex-grow-0 flex-shrink-0">
                  <img
                    src="/src/assets/icons/loading.gif"
                    style="width: 32px; height: 32px"
                    class="align-middle"
                  />
                </li>
              </template>
              <li ref="lastpasteditemsref"></li>
            </ul>
          </template>
        </div>
        <div class="d-block">
          <template v-if="holder.loading">
            <div class="d-block text-center" style="padding: 20px 0">
              <img
                src="/src/assets/icons/loading.gif"
                style="width: 40px; height: 40px"
                class="align-middle"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
