<script setup lang="ts">
import type { 
  CurrentAndSignalType,
  CurrentAndSignalInnerType,
  NumberSearchExcludeEqualToType,
  NumberSearchExcludeFromToType,
  StringSearchType,
} from '../types/SupportedDatatypesTypeDeclaration';
import {
  repaginatePage
} from "../helperfunctions/addnewlypastedandnewinputentry";
import {
  watch,
  triggerRef,
  type WatchStopHandle,
  onBeforeUnmount,
  onBeforeMount,
  shallowRef,
  type ShallowRef,
} from "vue";
import Pagination from "./Pagination.vue";

const
  props = defineProps<{
    current: [number, number],
    treetype: 'StringSearchType' | 'NumberSearchExcludeFromToType' | 'NumberSearchExcludeEqualToType';
    displayAreaHeight: string;
    scrollareaid: string;
    tree: StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType;
  }>(),
  emits = defineEmits<{
    (e: "update:current", action: number): void
  }>(),
  currentandsignal = shallowRef<CurrentAndSignalType>({
    displayer: {
      signal: 0,
      current: 0,
      closepaste: 0,
    },
  }),
  holder = shallowRef<StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType>()
;

let 
  somethingdeletedbutnotrepaginatedyet = false,
  unwatchcurrent: WatchStopHandle
;

async function updateCurrentAndEmitCurrent(val: number) { 
  (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = val; 
  triggerRef(currentandsignal);
  emits('update:current', val);
  if(somethingdeletedbutnotrepaginatedyet) {
    let done = await repaginatePage(
      currentandsignal,
      holder as ShallowRef<NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType>,
      (
        props.treetype === 'NumberSearchExcludeFromToType'?
          'DISPLAYER-EXCLUDE-FROM-TO'
          :
          'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
      )
    );
    if(done) {
      somethingdeletedbutnotrepaginatedyet = false;
      let time: NodeJS.Timeout;
      time = setTimeout(() => {
        if(((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages.length - 1) >= 0 && ((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages.length - 1) <= (currentandsignal.value.displayer as CurrentAndSignalInnerType).current) {
          (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = (holder.value as NumberSearchExcludeEqualToType).pages.length - 1;
          (currentandsignal.value.displayer as CurrentAndSignalInnerType).signal++;
          triggerRef(currentandsignal);
          emits('update:current', (currentandsignal.value.displayer as CurrentAndSignalInnerType).current);
        }
        clearTimeout(time);
      }, 120);
    }
  }
}

async function localDeleteSaved(dindex: number, inputtype: 'DISPLAYER-EXCLUDE-FROM-TO' | 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' | 'WORD') {
  somethingdeletedbutnotrepaginatedyet = true;
  if(((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages.length - 1) >= 0 && ((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages.length - 1) === (currentandsignal.value.displayer as CurrentAndSignalInnerType).current) {
    somethingdeletedbutnotrepaginatedyet = false;
  }
  if(inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' || inputtype === 'DISPLAYER-EXCLUDE-FROM-TO') {
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current][dindex];
    if(inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO') {
      (holder.value as NumberSearchExcludeEqualToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current] = [
        ...(holder.value as NumberSearchExcludeEqualToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].filter((item: string | undefined | null) => (item !== undefined && item !== null))
      ];
    }
    else {
      (holder.value as NumberSearchExcludeFromToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current] = [
        ...(holder.value as NumberSearchExcludeFromToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].filter((item: [string, string] | undefined | null) => (item !== undefined && item !== null))
      ];
    }
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).addeditemsref[dindex];
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).addeditemsref = [
      ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).addeditemsref.filter((item: HTMLDivElement | undefined | null) => (item !== undefined && item !== null))
    ];
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).inneraddeditemsref[dindex];
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).inneraddeditemsref = [
      ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).inneraddeditemsref.filter((item: HTMLDivElement | undefined | null) => (item !== undefined && item !== null))
    ];
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake[dindex];
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake = [
      ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake.filter((item: boolean | undefined | null) => (item !== undefined && item !== null))
    ];
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show[dindex];
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show = [
      ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show.filter((item: boolean | undefined | null) => (item !== undefined && item !== null))
    ];

    triggerRef(holder);
    
    if((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].length === 0) {
      let done = await repaginatePage(
        currentandsignal,
        holder as ShallowRef<NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType>,
        inputtype
      );
      if(done) {
        somethingdeletedbutnotrepaginatedyet = false;
        let time: NodeJS.Timeout;
        time = setTimeout(() => {
          if(((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages.length - 1) >= 0 && ((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).pages.length - 1) <= (currentandsignal.value.displayer as CurrentAndSignalInnerType).current) {
            (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = (holder.value as NumberSearchExcludeEqualToType).pages.length - 1;
            (currentandsignal.value.displayer as CurrentAndSignalInnerType).signal++;
            triggerRef(currentandsignal);
          }
          clearTimeout(time);
        }, 120);
      }
    }
  }
  else {

  }
}

onBeforeMount(() => {
  somethingdeletedbutnotrepaginatedyet = false;
  holder.value = props.tree;
  triggerRef(holder);
  (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = props.current[1];
  unwatchcurrent = watch(
    () => props.current[0],
    (x) => {
      (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = props.current[1];
      (currentandsignal.value.displayer as CurrentAndSignalInnerType).signal = x;
    }
  );
});

onBeforeUnmount(() => {
  unwatchcurrent();
});

</script>

<template>
  <div class="d-block">
    <Pagination :_current="[(currentandsignal.displayer as CurrentAndSignalInnerType).signal,(currentandsignal.displayer as CurrentAndSignalInnerType).current]" :length="(holder as StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).pages.length" @update:current="$val => updateCurrentAndEmitCurrent($val)"></Pagination>
    <div
      :id="(currentandsignal.displayer as CurrentAndSignalInnerType).current === 0 ? scrollareaid : ''"
      class="m-0 p-0 d-block overflow-y-auto overflow-x-hidden"
      style="z-index: 1000; background-color: #eee"
      :style="displayAreaHeight"
    >
      <div class="d-block overflow-x-hidden">
        <template v-if="(holder as StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).pages.length > 0">
          <template v-if="props.treetype === 'StringSearchType'">
            <ul
              class="overflow-x-hidden m-0 p-0 flex-box flex-direction-row flex-wrap list-style-none justify-content-start w-100"
            >
              <li
                style="padding: 5px"
                class="flex-grow-0 flex-shrink-0"
                v-for="(holderitem, holderitemindex) in (holder as StringSearchType).pages[(currentandsignal.displayer as CurrentAndSignalInnerType).current]"
                :key="holderitemindex + 'include'"
              >
                <div
                  :ref="
                    (el) => {
                      (holder as StringSearchType).addeditemsref[holderitemindex] = el as HTMLDivElement;
                    }
                  "
                  class="d-inline-block shadow-sm"
                  style="border-radius: 9px;background-color: #fff;padding: 4px 7px;font-size: 10px;"
                >
                  <a
                    @keypress.enter="localDeleteSaved(holderitemindex, 'WORD')"
                    @click="localDeleteSaved(holderitemindex, 'WORD')"
                    class="d-inline-block underline-none cursor-pointer"
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
              <template v-if="(holder as StringSearchType).addloading">
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
              <li :ref="(el) => (holder as StringSearchType).endoflistitemref = el as HTMLLIElement"></li>
            </ul>
          </template>
          <template v-else>
            <ul
              class="d-block list-style-none m-0 overflow-x-hidden"
              style="padding: 5px 0px"
            >
              <li
                class="w-100"
                v-for="(holderitem, holderitemindex) in (holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).pages[(currentandsignal.displayer as CurrentAndSignalInnerType).current]"
                :key="
                  (
                    props.treetype === 'NumberSearchExcludeFromToType'?
                    '-EXCLUDE-FROM-TO'
                    :
                    '-EXCLUDE-EQUAL-TO'
                  ) +
                  holderitemindex
                "
              >
                <Transition>
                  <div
                    :ref="
                      (el) => {
                        (holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).addeditemsref[
                          holderitemindex
                        ] = el as HTMLDivElement;
                      }
                    "
                    v-if="
                      (holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).show[
                        holderitemindex
                      ]
                    "
                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                    style="padding: 1px 5px"
                    :class="{
                      shake: (holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).shake[holderitemindex],
                    }"
                  >
                    <div
                      class="flex-shrink-0 flex-grow-0"
                    >
                      <a
                        @keypress.enter="
                          localDeleteSaved(
                            holderitemindex,
                            (
                              props.treetype === 'NumberSearchExcludeFromToType'?
                              'DISPLAYER-EXCLUDE-FROM-TO'
                              :
                              'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
                            )
                          )
                        "
                        @click="
                          localDeleteSaved(
                            holderitemindex,
                            (
                              props.treetype === 'NumberSearchExcludeFromToType'?
                              'DISPLAYER-EXCLUDE-FROM-TO'
                              :
                              'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
                            )
                          )
                        "
                        class="m-0 d-inline-block underline-none cursor-pointer"
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
                              (holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).inneraddeditemsref[
                                holderitemindex
                              ] = el as HTMLDivElement;
                            }
                          "
                          class="d-block text-wrap text-break shadow-sm"
                          style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                        >
                          <template v-if="props.treetype === 'NumberSearchExcludeFromToType'">
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
                          </template>
                          <template v-else>
                            <label
                              class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                            >
                              {{
                                holderitem
                              }}
                            </label>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </li>
              <template v-if="(holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).addloading">
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
              <li :ref="(el) => (holder as NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).endoflistitemref = el as HTMLLIElement"></li>
            </ul>
          </template>
        </template>
      </div>
      <div class="d-block">
        <template v-if="(holder as StringSearchType | NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType).loading">
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