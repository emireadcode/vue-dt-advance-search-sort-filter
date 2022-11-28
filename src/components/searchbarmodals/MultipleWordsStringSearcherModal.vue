<script setup lang="ts">
import { inject, type ShallowRef, type Ref } from "vue";
import type { PrimitiveType, MultipleWordsStringType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import TabPanelWithIncludeAndExclude from "./TabPanelWithIncludeAndExclude.vue";
import TabPanelWithoutIncludeAndExclude from "./TabPanelWithoutIncludeAndExclude.vue";
import MultipleWordsStringAttributeInfoNameTabs from "./MultipleWordsStringAttributeInfoNameTabs.vue";

const 
  props = defineProps<{
    index: any;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index
;

let
  accessibility = inject("accessibility") as {
    cardsmultiplesearchopenstatus: Ref<Boolean[]>;
  }
;

</script>

<template>
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800;"
    >
      <div class="modal-mask h-100 w-100 modal-mask-background">
        <div class="modal-wrapper text-center">
          <div class="modal-container" style="width: 480px">
            <MultipleWordsStringAttributeInfoNameTabs :index="index"></MultipleWordsStringAttributeInfoNameTabs>
            <div class="d-block m-0" style="padding: 0 10px">
              <template v-if="!(cards[index] as MultipleWordsStringType).concatenated">
                <template v-if="(cards[index] as MultipleWordsStringType).search.tabclicked">
                  <TabPanelWithIncludeAndExclude :index="index"></TabPanelWithIncludeAndExclude>
                </template>
              </template>
              <template v-else>
                <div class="d-block">
                  <template v-if="(cards[index] as MultipleWordsStringType).concatenatedname !== undefined">
                    <template v-if="(cards[index] as MultipleWordsStringType).search.tabclicked">
                      <TabPanelWithoutIncludeAndExclude :index="index"></TabPanelWithoutIncludeAndExclude>
                    </template>
                  </template>
                  <template v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType).concatenated">
                    <template v-if="!concatenated.aword">
                      <template v-if="(concatenated.search as StringSearchType).tabclicked">
                        <TabPanelWithIncludeAndExclude :index="index" :concatfieldindex="(cindex as number)"></TabPanelWithIncludeAndExclude>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="(concatenated.search as StringSearchType).tabclicked">
                        <TabPanelWithoutIncludeAndExclude :index="index" :concatfieldindex="(cindex as number)"></TabPanelWithoutIncludeAndExclude>
                      </template>
                    </template>
                  </template>
                </div>
              </template>
              <div class="d-block">
                <button
                  class="btn w-50 shadow-sm"
                  style="padding: 7px; border-radius: 12px"
                >
                  Done
                </button>
                <button
                  class="btn w-50 shadow-sm"
                  style="padding: 7px; border-radius: 12px"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-mask-background {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  height: 550px;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.tab {
  border: none;
  outline: 1px solid gray;
}
</style>
