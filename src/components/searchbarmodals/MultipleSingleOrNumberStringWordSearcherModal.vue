<script setup lang="ts">
import { inject, type ShallowRef, type Ref } from "vue";
import type { NumberStringType, SingleWordStringType, MultipleWordsStringType, StringSearchType } from "../types/SupportedDatatypesTypeDeclaration";
import TabPanelWithIncludeAndExclude from "./TabPanelWithIncludeAndExclude.vue";
import TabPanelWithoutIncludeAndExclude from "./TabPanelWithoutIncludeAndExclude.vue";
import SingleOrMultipleWordsStringAttributeInfoNameTabs from "./SingleOrMultipleWordsStringAttributeInfoNameTabs.vue";
import type { AccessibilityType } from "../types/accessibility";

const
  cards = inject("cards") as ShallowRef<(NumberStringType | SingleWordStringType | MultipleWordsStringType)[]>,
  index = inject("index") as number,
  accessibility = inject("accessibility") as ShallowRef<AccessibilityType>
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
              <SingleOrMultipleWordsStringAttributeInfoNameTabs
                :wordtype="cards[index].info.datatype === 'MultipleWordsString'? 'MULTIPLE' : 'SINGLE'" 
              ></SingleOrMultipleWordsStringAttributeInfoNameTabs>
              <div class="d-block m-0 overflow-hidden" style="padding: 0 10px;">
                <template v-if="!cards[index].concatenated">
                  <template v-if="cards[index].search.multiple?.tabclicked">
                    <template v-if="cards[index].disableincludeandexclude!==undefined && cards[index].disableincludeandexclude===false">
                      <TabPanelWithIncludeAndExclude 
                        :wordtype="cards[index].info.datatype === 'MultipleWordsString'? 'MULTIPLE' : 'SINGLE'" 
                      ></TabPanelWithIncludeAndExclude>
                    </template>
                    <template v-else>
                      <TabPanelWithoutIncludeAndExclude 
                        :wordtype="cards[index].info.datatype === 'MultipleWordsString'? 'MULTIPLE' : 'SINGLE'" 
                      ></TabPanelWithoutIncludeAndExclude>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <div class="d-block">
                    <template v-for="(concatenated, cindex) in cards[index].concatenated">
                      <template v-if="concatenated.disableincludeandexclude!==undefined && !concatenated.disableincludeandexclude">
                        <template v-if="(concatenated.search as StringSearchType).tabclicked">
                          <TabPanelWithIncludeAndExclude 
                            :wordtype="cards[index].info.datatype === 'MultipleWordsString'? 'MULTIPLE' : 'SINGLE'" 
                            :concatfieldindex="(cindex as number)"
                          ></TabPanelWithIncludeAndExclude>
                        </template>
                      </template>
                      <template v-else>
                        <template v-if="(concatenated.search as StringSearchType).tabclicked">
                          <TabPanelWithoutIncludeAndExclude
                            :wordtype="cards[index].info.datatype === 'MultipleWordsString'? 'MULTIPLE' : 'SINGLE'"
                            :concatfieldindex="(cindex as number)"
                          ></TabPanelWithoutIncludeAndExclude>
                        </template>
                      </template>
                    </template>
                  </div>
                </template>
              </div>
            </div>
            <div
              style="padding: 10px 10px 12px 10px;"
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
            >
              <div class="flex-w-100-over-3 align-self-stretch" style="padding-right:7.5px;">
                <button
                  @keypress.enter="() => { (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = false; accessibility.updateAccessibility(); }"
                  @click="() => { (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = false; accessibility.updateAccessibility(); }"
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
                  @keypress.enter="() => { (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = false; accessibility.updateAccessibility(); }"
                  @click="() => { (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = false; accessibility.updateAccessibility(); }"
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
