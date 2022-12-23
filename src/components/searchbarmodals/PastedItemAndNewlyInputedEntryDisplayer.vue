<script setup lang="ts">
import type { 
  NumberSearchExcludeEqualToType,
  NumberSearchExcludeFromToType,
  StringSearchType,
} from '../types/SupportedDatatypesTypeDeclaration';
import {
  type WatchStopHandle,
  ref,
  watch,
  onBeforeUnmount,
  onBeforeMount,
  onMounted,
  nextTick,
} from "vue";
import Pagination from "./Pagination.vue";

const
  current = ref(0),
  props = defineProps<{
    treetype: 'StringSearchType' | 'NumberSearchExcludeFromToType' | 'NumberSearchExcludeEqualToType';
    displayAreaHeight: string;
    scrollareaid: string;
    tree: StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType;
    limit: number;
    receivenewinputentrysignal: [number, string];
    receivenewlypasteditemssignal: [number, string[][]];
  }>(),
  emits = defineEmits<{
    (e: "update:newinputentry"): void;
    (e: "close:pastemodal"): void;
  }>(),
  holder = ref()
;

let
  unwatchcurrent: WatchStopHandle,
  unwatchpagination: WatchStopHandle,
  unwatchsingle: WatchStopHandle,
  unwatchpasted: WatchStopHandle
;

onBeforeMount(() => {
  holder.value = props.tree;
});

</script>

<template>
  <div class="d-block">
    <Pagination :current="current" :length="holder.pages.length" @update:current="$val => current = $val"></Pagination>
    <div
      :id="current === 0 ? scrollareaid : ''"
      class="m-0 p-0 d-block overflow-y-auto"
      style="z-index: 1000; background-color: #eee"
      :style="displayAreaHeight"
    >
      <div class="d-block">
        <template v-if="holder.pages.length > 0">
          <template v-if="props.treetype === 'StringSearchType'">
            <ul
              class="m-0 p-0 flex-box flex-direction-row flex-wrap list-style-none justify-content-start w-100"
            >
              <li
                style="padding: 5px"
                class="flex-grow-0 flex-shrink-0"
                v-for="(holderitem, holderitemindex) in holder.pages[current]"
                :key="holderitemindex + 'include'"
              >
                <div
                  :ref="
                    (el) => {
                      holder.addeditemsref[holderitemindex] = el as HTMLDivElement;
                    }
                  "
                  class="d-inline-block shadow-sm cursor-pointer"
                  style="border-radius: 9px;background-color: #fff;padding: 4px 7px;font-size: 10px;"
                >
                  <a
                    @click=""
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
              <li :ref="(el) => holder.endoflistitemref = el as HTMLLIElement"></li>
            </ul>
          </template>
          <!--<template v-else-if="props.treetype === 'NumberSearchExcludeEqualToType'">
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
                  v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.from"
                  :key="
                    (numbersearcherui as NumberSearcherUIType).main.tab +
                    '-EXCLUDE-FROM-TO' +
                    dindex
                  "
                >
                  <Transition>
                    <div
                      :ref="
                        (el) => {
                          (numbersearcherui as NumberSearcherUIType).exclude.refexcludefromto[
                            dindex
                          ] = el as HTMLDivElement;
                        }
                      "
                      v-if="
                        (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.show[
                          dindex
                        ]
                      "
                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                      style="padding: 1px 5px"
                      :class="{
                        shake:
                          (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto
                            .disabled[dindex],
                      }"
                    >
                      <div
                        class="flex-shrink-0 flex-grow-0"
                      >
                        <a
                          @click="
                            localDeleteSaved(
                              dindex,
                              'EXCLUDE-FROM-TO'
                            )
                          "
                          class="remove-selected m-0 d-inline-block underline-none"
                        >
                          <img
                            class="align-middle"
                            src="/src/assets/icons/close.png"
                            style="width: 25px;height: 25px;"
                          />
                        </a>
                      </div>
                      <div
                        class="flex-fill"
                        style="padding-left: 5px"
                      >
                        <div
                          class="d-block"
                          style="padding: 5px"
                        >
                          <div
                            :ref="
                              (el) => {
                                (numbersearcherui as NumberSearcherUIType).exclude.refexcludefromtoinner[
                                  dindex
                                ] = el as HTMLDivElement;
                              }
                            "
                            class="d-block text-wrap text-break shadow-sm"
                            style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                          >
                            <label
                              class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                            >
                              {{
                                (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.from[
                                  dindex
                                ]
                              }}
                              -
                              {{
                                (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.to[
                                  dindex
                                ]
                              }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </li>
                <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).exclude.excludefromtoref = el as HTMLLIElement"></li>
              </ul>
            </div>
          </template>
          <template v-else>
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
                  v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.from"
                  :key="
                    (numbersearcherui as NumberSearcherUIType).main.tab +
                    '-EXCLUDE-FROM-TO' +
                    dindex
                  "
                >
                  <Transition>
                    <div
                      :ref="
                        (el) => {
                          (numbersearcherui as NumberSearcherUIType).exclude.refexcludefromto[
                            dindex
                          ] = el as HTMLDivElement;
                        }
                      "
                      v-if="
                        (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.show[
                          dindex
                        ]
                      "
                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                      style="padding: 1px 5px"
                      :class="{
                        shake:
                          (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto
                            .disabled[dindex],
                      }"
                    >
                      <div
                        class="flex-shrink-0 flex-grow-0"
                      >
                        <a
                          @click="
                            localDeleteSaved(
                              dindex,
                              'EXCLUDE-FROM-TO'
                            )
                          "
                          class="remove-selected m-0 d-inline-block underline-none"
                        >
                          <img
                            class="align-middle"
                            src="/src/assets/icons/close.png"
                            style="width: 25px;height: 25px;"
                          />
                        </a>
                      </div>
                      <div
                        class="flex-fill"
                        style="padding-left: 5px"
                      >
                        <div
                          class="d-block"
                          style="padding: 5px"
                        >
                          <div
                            :ref="
                              (el) => {
                                (numbersearcherui as NumberSearcherUIType).exclude.refexcludefromtoinner[
                                  dindex
                                ] = el as HTMLDivElement;
                              }
                            "
                            class="d-block text-wrap text-break shadow-sm"
                            style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                          >
                            <label
                              class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                            >
                              {{
                                (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.from[
                                  dindex
                                ]
                              }}
                              -
                              {{
                                (numbersearcherui as NumberSearcherUIType).exclude.treeexcludefromto.to[
                                  dindex
                                ]
                              }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </li>
                <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).exclude.excludefromtoref = el as HTMLLIElement"></li>
              </ul>
            </div>
          </template>-->
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