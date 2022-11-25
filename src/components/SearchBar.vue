<script setup lang="ts">
import { ref, inject, type ShallowRef, type Ref } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import Switchable from "./Switchable.vue";

const
  props = defineProps<{
    index: number;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index,
  open = ref(false)
;

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardFocusableDescendantsTabIndex: Ref<Boolean[]>;
    };
  }
;
</script>

<template>
  <div class="d-block" style="padding: 0.410156718rem 0">
    <div
      class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
      style="height: 1.75rem"
    >
      <div class="flex-w-3-dot-5-rem p-0 m-0 align-self-stretch">
        <Switchable
          truelabel="R"
          falselabel="U"
          :index="index"
        ></Switchable>
      </div>
      <div class="flex-fill m-0 align-self-stretch" style="padding:0 0 0 1px;">
        <div
          class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center h-100"
        >
          <div class="flex-fill p-0 m-0 h-100" style="z-index: 700">
            <input
              :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
              @click="() => { open = true; }"
              @keyup.enter="() => { }"
              type="text"
              class="w-100 align-middle h-100"
            />
          </div>
          <div
            class="flex-w-1-dot-75-rem h-100 position-absolute t-0 p-0"
            style="z-index: 720"
          >
            <a class="cursor-pointer d-block text-center">
              <img src="/src/assets/icons/close.png" class="wh-1-dot-25-rem" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="open" class="d-block position-relative">
        <!--
        <MultipleWordsStringSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></MultipleWordsStringSearcherModal>
        <SingleWordStringSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></SingleWordStringSearcherModal>
        <YearSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></YearSearcherModal>
        <NumberSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></NumberSearcherModal>
        <DateSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></DateSearcherModal>
        <DateTimeSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></DateTimeSearcherModal>
        <TimeSearcherModal
              :open="open"
              :index="index"
              @close:open="($status) => (open = $status)"
            ></TimeSearcherModal>
        -->
      </div>
    </Teleport>
  </div>
</template>
