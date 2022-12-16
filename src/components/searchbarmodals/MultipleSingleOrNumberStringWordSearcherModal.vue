<script setup lang="ts">
import { inject, type ShallowRef, type Ref } from "vue";
import type { PrimitiveType, SingleWordStringType, MultipleWordsStringType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import TabPanelWithIncludeAndExclude from "./TabPanelWithIncludeAndExclude.vue";
import TabPanelWithoutIncludeAndExclude from "./TabPanelWithoutIncludeAndExclude.vue";
import SingleOrMultipleWordsStringAttributeInfoNameTabs from "./SingleOrMultipleWordsStringAttributeInfoNameTabs.vue";

const
  props = defineProps<{
    index: number;
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
          <div class="modal-container" style="width:550px;">
            <div class="d-block" style="height:585px !important;">
              <template v-if="cards[index].info.datatype === 'MultipleWordsString'">
                <SingleOrMultipleWordsStringAttributeInfoNameTabs wordtype="MULTIPLE" :index="index"></SingleOrMultipleWordsStringAttributeInfoNameTabs>
                <div class="d-block m-0 overflow-hidden" style="padding: 0 10px;">
                  <template v-if="!(cards[index] as MultipleWordsStringType).concatenated">
                    <template v-if="(cards[index] as MultipleWordsStringType).search.tabclicked">
                      <template v-if="(cards[index] as MultipleWordsStringType).disableincludeandexclude!==undefined && (cards[index] as MultipleWordsStringType).disableincludeandexclude===false">
                        <TabPanelWithIncludeAndExclude wordtype="MULTIPLE" :index="index"></TabPanelWithIncludeAndExclude>
                      </template>
                      <template v-else>
                        <TabPanelWithoutIncludeAndExclude wordtype="MULTIPLE" :index="index"></TabPanelWithoutIncludeAndExclude>
                      </template>
                    </template>
                  </template>
                  <template v-else>
                    <div class="d-block">
                      <template v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType).concatenated">
                        <template v-if="concatenated.disableincludeandexclude!==undefined && !concatenated.disableincludeandexclude">
                          <template v-if="(concatenated.search as StringSearchType).tabclicked">
                            <TabPanelWithIncludeAndExclude wordtype="MULTIPLE" :index="index" :concatfieldindex="(cindex as number)"></TabPanelWithIncludeAndExclude>
                          </template>
                        </template>
                        <template v-else>
                          <template v-if="(concatenated.search as StringSearchType).tabclicked">
                            <TabPanelWithoutIncludeAndExclude wordtype="MULTIPLE" :index="index" :concatfieldindex="(cindex as number)"></TabPanelWithoutIncludeAndExclude>
                          </template>
                        </template>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <SingleOrMultipleWordsStringAttributeInfoNameTabs wordtype="SINGLE" :index="index"></SingleOrMultipleWordsStringAttributeInfoNameTabs>
                <div class="d-block m-0 overflow-hidden" style="padding: 0 10px;">
                  <template v-if="!(cards[index] as SingleWordStringType).concatenated">
                    <template v-if="(cards[index] as SingleWordStringType).search.tabclicked">
                      <template v-if="(cards[index] as SingleWordStringType).disableincludeandexclude!==undefined && (cards[index] as SingleWordStringType).disableincludeandexclude===false">
                        <TabPanelWithIncludeAndExclude wordtype="SINGLE" :index="index"></TabPanelWithIncludeAndExclude>
                      </template>
                      <template v-else>
                        <TabPanelWithoutIncludeAndExclude wordtype="SINGLE" :index="index"></TabPanelWithoutIncludeAndExclude>
                      </template>
                    </template>
                  </template>
                  <template v-else>
                    <div class="d-block">
                      <template v-for="(concatenated, cindex) in (cards[index] as SingleWordStringType).concatenated">
                        <template v-if="concatenated.disableincludeandexclude!==undefined && !concatenated.disableincludeandexclude">
                          <template v-if="(concatenated.search as StringSearchType).tabclicked">
                            <TabPanelWithIncludeAndExclude wordtype="SINGLE" :index="index" :concatfieldindex="(cindex as number)"></TabPanelWithIncludeAndExclude>
                          </template>
                        </template>
                        <template v-else>
                          <template v-if="(concatenated.search as StringSearchType).tabclicked">
                            <TabPanelWithoutIncludeAndExclude wordtype="SINGLE" :index="index" :concatfieldindex="(cindex as number)"></TabPanelWithoutIncludeAndExclude>
                          </template>
                        </template>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div
              style="padding: 10px 10px 12px 10px;"
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
            >
              <div class="flex-w-100-over-3 align-self-stretch" style="padding-right:7.5px;">
                <button
                  @keyup.enter="accessibility.cardsmultiplesearchopenstatus.value[index] = false"
                  @click="() => { accessibility.cardsmultiplesearchopenstatus.value[index] = false; }"
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 6px; font-size: 1rem;color: #fff;background-color: gray;"
                >
                  Close
                </button>
              </div>
              <div
                class="flex-w-100-over-3 align-self-stretch"
                style="padding-right: 2.5px;"
              >
                <button
                  @keyup.enter="accessibility.cardsmultiplesearchopenstatus.value[index] = false"
                  @click="accessibility.cardsmultiplesearchopenstatus.value[index] = false"
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 6px; font-size: 1rem;color:#fff;background-color: gray;"
                >
                  Close
                </button>
              </div>
              <div
                class="flex-w-100-over-3 align-self-stretch"
                style="padding-left: 5px;"
              >
                <button
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 6px; font-size: 1rem;color:#fff;background-color: gray;"
                >
                  Cancel
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
</style>
