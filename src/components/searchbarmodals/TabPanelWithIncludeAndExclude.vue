<script setup lang="ts">
import DescribeLabel from './DescribeLabel.vue';
import IncludeOrExcludeTabs from './IncludeOrExcludeTabs.vue';
import IncludeOrExcludeTabPanel from './IncludeOrExcludeTabPanel.vue';
import { onBeforeUnmount, onBeforeMount, type WatchStopHandle, watch, triggerRef, provide, type ShallowRef, inject, ref, shallowRef, } from 'vue';
import type { NumberStringType, SingleWordStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringType, StringSearchType, MultipleWordsStringConcatenatedFieldType } from '../types/SupportedDatatypesTypeDeclaration';
import ReusableNumberSearch from "./ReusableNumberSearch.vue";
import ExcludeNumberSearch from "./ExcludeNumberSearch.vue";
import AtNumberSearchSetter from "./AtNumberSearchSetter.vue";

const
  props = defineProps<{
    openatnumbersearchexcludenumberwindow: boolean;
    concatfieldindex?: number | undefined;
  }>(),
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,
  emits = defineEmits<{
    (e: "enable:atnumbersearchwindowopenerbutton", action: boolean): void;
    (e: "close:atnumbersearchexcludenumberwindow", action: boolean): void;
    (e: "disable:searchphraseinputbox", action: boolean): void;
    (e: "show:atnumbersearchexcludenumberwindowopenerbutton", action: boolean): void;
  }>(),
  index = inject("index") as number,
  searchphraseinputboxenabler = ref(true)
;

let unwatchopenatnumbersearchexcludenumberwindow: WatchStopHandle;

provide("concatfieldindex", props.concatfieldindex as number | undefined);

if(props.concatfieldindex === undefined) {
  if(
    (cards.value[index] as MultipleWordsStringType | SingleWordStringType | NumberStringType).enableatnumbersearch !== undefined
    &&
    (cards.value[index] as MultipleWordsStringType | SingleWordStringType | NumberStringType).enableatnumbersearch === true
  ) {
    provide(
      "numbersearchcard", 
      shallowRef(JSON.parse(JSON.stringify((cards.value[index] as MultipleWordsStringType | SingleWordStringType | NumberStringType).search.multiple.atnumbersearch)))
    )
  }
}
else {
  if(
    (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].enableatnumbersearch !== undefined
    &&
    (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].enableatnumbersearch === true
  ) {
    provide(
      "numbersearchcard", 
      shallowRef(JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search?.atnumbersearch)))
    )
  }
}

function openOrCloseAtNumberSearchWindow(action: boolean) {
  ((
    (props.concatfieldindex === undefined)? 
    cards.value[index].search.multiple 
    : 
    (
      cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType
    )[props.concatfieldindex as number].search
  ) as {openatnumbersearchwindow: boolean}).openatnumbersearchwindow = action; 
  triggerRef(cards);
  if(action === false) {
    emits('enable:atnumbersearchwindowopenerbutton', true);
  }
}

function openOrCloseAtNumberSearchExcludeNumberWindow(action: boolean) {
  ((
    (props.concatfieldindex === undefined)? 
    cards.value[index].search.multiple 
    : 
    (
      cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType
    )[props.concatfieldindex as number].search
  ) as {openatnumbersearchexcludenumberwindow: boolean}).openatnumbersearchexcludenumberwindow = action; 
  triggerRef(cards);
}

function triggerCard() {
  triggerRef(cards);
}

onBeforeMount(() => {
  unwatchopenatnumbersearchexcludenumberwindow = watch(
    () => props.openatnumbersearchexcludenumberwindow,
    (action) => {
      openOrCloseAtNumberSearchExcludeNumberWindow(action);
    }
  )
});

onBeforeUnmount(() => {
  unwatchopenatnumbersearchexcludenumberwindow();
  openOrCloseAtNumberSearchWindow(false);
  openOrCloseAtNumberSearchExcludeNumberWindow(false);
});

</script>

<template>
  <div class="d-block position-relative">
    <div class="d-block" style="padding: 15px 0 10px 0">
      <DescribeLabel context="DESCRIBE-MODAL"></DescribeLabel>
      <div class="d-block">
        <input
          type="text"
          @input="triggerCard()"
          v-model="((props.concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search as StringSearchType).single"
          class="w-100"
          style="height: 30px"
          :disabled="searchphraseinputboxenabler"
          :class="[searchphraseinputboxenabler? '':'shadow-sm']"
        />
      </div>
    </div>
    <IncludeOrExcludeTabs 
      @disable:searchphraseinputbox="($val: boolean) => { searchphraseinputboxenabler = $val; ((props.concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search as StringSearchType).single = ''; triggerCard(); }"
      @show:atnumbersearchexcludenumberwindowopenerbutton="($val: boolean) => emits('show:atnumbersearchexcludenumberwindowopenerbutton', $val)"
    ></IncludeOrExcludeTabs>
    <template v-if="((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.includeorexcludeformat === '@NUMBER'">
      <div class="d-block" style="padding:2px 0">
        <div class="d-block overflow-hidden shadow-sm" style="height:390px;padding: 10px 0px;">
          <AtNumberSearchSetter @enable:atnumbersearchwindowopenerbutton="($val: boolean) => emits('enable:atnumbersearchwindowopenerbutton', $val)" @open:atnumbersearchwindow="($val: boolean) => openOrCloseAtNumberSearchWindow($val)"></AtNumberSearchSetter>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="concatfieldindex === undefined">
        <template v-if="cards[index].search.multiple?.includeorexcludeformat==='INCLUDE'">
          <IncludeOrExcludeTabPanel @disable:searchphraseinputbox="($val: boolean) => { searchphraseinputboxenabler = $val; ((props.concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search as StringSearchType).single = ''; triggerCard(); }" context="DESCRIBE-INCLUDE"></IncludeOrExcludeTabPanel>
        </template>
        <template v-else>
          <IncludeOrExcludeTabPanel @disable:searchphraseinputbox="($val: boolean) => { searchphraseinputboxenabler = $val; ((props.concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search as StringSearchType).single = ''; triggerCard(); }" context="DESCRIBE-EXCLUDE"></IncludeOrExcludeTabPanel>
        </template>
      </template>
      <template v-else>
        <template v-if="(cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search?.includeorexcludeformat==='INCLUDE'">
          <IncludeOrExcludeTabPanel @disable:searchphraseinputbox="($val: boolean) => { searchphraseinputboxenabler = $val; ((props.concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search as StringSearchType).single = ''; triggerCard(); }" context="DESCRIBE-INCLUDE"></IncludeOrExcludeTabPanel>
        </template>
        <template v-else>
          <IncludeOrExcludeTabPanel @disable:searchphraseinputbox="($val: boolean) => { searchphraseinputboxenabler = $val; ((props.concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search as StringSearchType).single = ''; triggerCard(); }" context="DESCRIBE-EXCLUDE"></IncludeOrExcludeTabPanel>
        </template>
      </template>
    </template>
    <template v-if="((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.includeorexcludeformat === '@NUMBER'">
      <template v-if="((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.openatnumbersearchwindow">
        <div class="w-100 position-absolute t-0 l-0 h-100">
          <div class="overflow-y-auto h-100 d-block" style="background-color: #fff;outline: 1px solid blue;border-bottom:3px solid blue;">
            <template v-if="((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.openatnumbersearchexcludenumberwindow === false">
              <div
                class="shadow-sm d-block text-center"
                style="background-color: blue;"
              >
                <a
                  class="underline-none cursor-pointer align-middle"
                  @click="openOrCloseAtNumberSearchWindow(false)"
                  @keypress.enter="openOrCloseAtNumberSearchWindow(false)"
                >
                  <img
                    src="/src/assets/icons/close.png"
                    class="align-middle"
                    style="width: 2.205rem; height: 2.205rem"
                  />
                </a>
              </div>
              <ReusableNumberSearch @enable:atnumbersearchwindowopenerbutton="($val: boolean) => emits('enable:atnumbersearchwindowopenerbutton', $val)" from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ReusableNumberSearch>
            </template>
            <template v-else>
              <ExcludeNumberSearch @close:atnumbersearchexcludenumberwindow="($val: boolean) => emits('close:atnumbersearchexcludenumberwindow', $val)" from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ExcludeNumberSearch>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
