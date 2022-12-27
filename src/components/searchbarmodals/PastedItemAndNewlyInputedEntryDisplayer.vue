<script setup lang="ts">
import type { 
  NumberSearchExcludeEqualToType,
  NumberSearchExcludeFromToType,
  StringSearchType,
} from '../types/SupportedDatatypesTypeDeclaration';
import {
  ref,
  watch,
  type WatchStopHandle,
  onBeforeUnmount,
  onBeforeMount,
} from "vue";
import Pagination from "./Pagination.vue";

const
  _current = ref(0),
  emits = defineEmits<{
    (e: "update:current", action: number): void
  }>(),
  props = defineProps<{
    current: number,
    treetype: 'StringSearchType' | 'NumberSearchExcludeFromToType' | 'NumberSearchExcludeEqualToType';
    displayAreaHeight: string;
    scrollareaid: string;
    tree: StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType;
  }>(),
  holder = ref()
;

let unwatchcurrent: WatchStopHandle;

function localDeleteSaved(dindex: number, action: 'EXCLUDE-FROM-TO' | 'EXCLUDE-EQUAL-TO') {

}

onBeforeMount(() => {
  holder.value = props.tree;
  _current.value = props.current;
  unwatchcurrent = watch(
    () => _current.value,
    (x) => {
      emits("update:current", _current.value);
    }
  );
});

onBeforeUnmount(() => {
  unwatchcurrent();
});

</script>

<template>
  <div class="d-block">
    <Pagination :current="_current" :length="holder.pages.length" @update:current="$val => _current = $val"></Pagination>
    <div
      :id="current === 0 ? scrollareaid : ''"
      class="m-0 p-0 d-block overflow-y-auto overflow-x-hidden"
      style="z-index: 1000; background-color: #eee"
      :style="displayAreaHeight"
    >
      <div class="d-block overflow-x-hidden">
        <template v-if="holder.pages.length > 0">
          <template v-if="props.treetype === 'StringSearchType'">
            <ul
              class="overflow-x-hidden m-0 p-0 flex-box flex-direction-row flex-wrap list-style-none justify-content-start w-100"
            >
              <li
                style="padding: 5px"
                class="flex-grow-0 flex-shrink-0"
                v-for="(holderitem, holderitemindex) in holder.pages[_current]"
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
                    @keypress.enter=""
                    @click=""
                    class="d-inline-block underline-none"
                  >
                    <img
                      class="align-middle"
                      src="/src/assets/icons/close.png"
                      style="width: 19px;height: 19px;"
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
                <li
                  style="padding: 5px"
                  class="flex-grow-0 flex-shrink-0"
                >
                  <div style="padding: 4px 7px;">
                    <img
                      src="/src/assets/icons/loading.gif"
                      style="width: 25px; height: 25px"
                      class="align-middle"
                    />
                  </div>
                </li>
              </template>
              <li :ref="(el) => holder.endoflistitemref = el as HTMLLIElement"></li>
            </ul>
          </template>
          <template v-else-if="props.treetype === 'NumberSearchExcludeFromToType'">
            <ul
              class="d-block list-style-none m-0 overflow-x-hidden"
              style="padding: 5px 0px"
            >
              <li
                class="w-100"
                v-for="(holderitem, holderitemindex) in (holder as NumberSearchExcludeFromToType).pages[_current]"
                :key="
                  '-EXCLUDE-FROM-TO' +
                  holderitemindex
                "
              >
                <Transition>
                  <div
                    :ref="
                      (el) => {
                        (holder as NumberSearchExcludeFromToType).addeditemsref[
                          holderitemindex
                        ] = el as HTMLDivElement;
                      }
                    "
                    v-if="
                      (holder as NumberSearchExcludeFromToType).show[
                        holderitemindex
                      ]
                    "
                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                    style="padding: 1px 5px"
                    :class="{
                      shake: (holder as NumberSearchExcludeFromToType).shake[holderitemindex],
                    }"
                  >
                    <div
                      class="flex-shrink-0 flex-grow-0"
                    >
                      <a
                        @keypress.enter="
                          localDeleteSaved(
                            holderitemindex,
                            'EXCLUDE-FROM-TO'
                          )
                        "
                        @click="
                          localDeleteSaved(
                            holderitemindex,
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
                              (holder as NumberSearchExcludeFromToType).inneraddeditemsref[
                                holderitemindex
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
                              holderitem[0]
                            }}
                            -
                            {{
                              holderitem[1]
                            }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </li>
              <template v-if="holder.addloading">
                <li class="text-center" style="padding: 3px 0;">
                  <a class="underline-none d-inline-block">
                    <img
                      src="/src/assets/icons/loading.gif"
                      style="width: 25px; height: 25px"
                      class="align-middle"
                    />
                  </a>
                </li>
              </template>
              <li :ref="(el) => (holder as NumberSearchExcludeFromToType).endoflistitemref = el as HTMLLIElement"></li>
            </ul>
          </template>
          <template v-else>
            <ul
              class="d-block list-style-none m-0 overflow-x-hidden"
              style="padding: 5px 0px"
            >
              <li
                class="w-100"
                v-for="(holderitem, holderitemindex) in (holder as NumberSearchExcludeEqualToType).pages[_current]"
                :key="
                  '-EXCLUDE-EQUAL-TO' +
                  holderitemindex
                "
              >
                <Transition>
                  <div
                    :ref="
                      (el) => {
                        (holder as NumberSearchExcludeEqualToType).addeditemsref[
                          holderitemindex
                        ] = el as HTMLDivElement;
                      }
                    "
                    v-if="
                      (holder as NumberSearchExcludeEqualToType).show[
                        holderitemindex
                      ]
                    "
                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                    style="padding: 1px 5px"
                    :class="{
                      shake: (holder as NumberSearchExcludeEqualToType).shake[holderitemindex]
                    }"
                  >
                    <div
                      class="flex-shrink-0 flex-grow-0"
                    >
                      <a
                        @keypress.enter="
                          localDeleteSaved(
                            holderitemindex,
                            'EXCLUDE-EQUAL-TO'
                          )
                        "
                        @click="
                          localDeleteSaved(
                            holderitemindex,
                            'EXCLUDE-EQUAL-TO'
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
                              (holder as NumberSearchExcludeEqualToType).inneraddeditemsref[
                                holderitemindex
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
                              holderitem
                            }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </li>
              <template v-if="holder.addloading">
                <li class="text-center" style="padding: 3px 0;">
                  <a class="underline-none d-inline-block">
                    <img
                      src="/src/assets/icons/loading.gif"
                      style="width: 25px; height: 25px"
                      class="align-middle"
                    />
                  </a>
                </li>
              </template>
              <li :ref="(el) => (holder as NumberSearchExcludeEqualToType).endoflistitemref = el as HTMLLIElement"></li>
            </ul>
          </template>
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