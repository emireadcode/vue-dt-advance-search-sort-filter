<script setup lang="ts">
import { provide } from "vue";
import MultipleWordsStringTemplate from "./MultipleWordsStringTemplate.vue";
import SingleWordStringTemplate from "./SingleWordStringTemplate.vue";
import NumberTemplate from "./NumberTemplate.vue";
import KeyToNameTemplate from "./KeyToNameTemplate.vue";
import DateTemplate from "./DateTemplate.vue";
import DateTimeTemplate from "./DateTimeTemplate.vue";
import TimeTemplate from "./TimeTemplate.vue";
import YearTemplate from "./YearTemplate.vue";

const emits = defineEmits<{
  (e: "modal:close", action: boolean): void;
}>();

const props = defineProps<{
  cards: any;
}>();

const cards = props.cards;

provide("cards", cards);
</script>

<template>
  <div class="position-relative m-0 p-0 d-block">
    <div class="position-fixed w-100 h-100 l-0 t-0 m-0 p-0 user-select-none">
      <div class="d-block position-relative m-0 p-0">
        <div
          class="position-fixed w-100 l-0 t-0 m-0 p-0 shadow"
          style="z-index: 1000; height: 4.08333rem; pointer-events: auto"
        >
          <div
            class="flex-box flex-direction-row w-100 h-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
          >
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <a class="cursor-pointer d-block" title="Refresh">
                  <img src="/src/assets/icons/refresh.png" class="wh-1-dot-75-rem" />
                </a>
              </div>
            </div>
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <a class="cursor-pointer d-block" title="Undo">
                  <img src="/src/assets/icons/undo.png" class="wh-1-dot-75-rem" />
                </a>
              </div>
            </div>
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <a class="cursor-pointer d-block" title="Redo">
                  <img src="/src/assets/icons/redo.png" class="wh-1-dot-75-rem" />
                </a>
              </div>
            </div>
            <div class="flex-w-25 align-self-stretch border text-center p-1">
              <div class="d-inline-block align-middle">
                <a
                  class="cursor-pointer d-block"
                  title="Close"
                  @click="emits('modal:close', false)"
                >
                  <img src="/src/assets/icons/close.png" class="wh-1-dot-75-rem" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="d-block vh-100 m-0"
        style="z-index: 980; padding: 4.08333rem 0 0 0 !important"
      >
        <div
          class="d-block m-0 overflow-y-auto overflow-x-hidden h-100"
          style="
            padding: 0.875rem 1.75rem important;
            z-index: 990;
            background-color: snow;
          "
        >
          <div
            class="d-block"
            style="height: auto !important; padding: 0.875rem 0 !important"
          >
            <ul
              class="flex-box flex-direction-row w-100 flex-wrap align-items-center justify-content-center list-style-none m-0 p-0"
            >
              <li
                v-for="(card, index) in cards"
                :key="index"
                class="flex-w-25 m-0"
                style="padding: 0.875rem !important; min-width: 26.25rem !important"
              >
                <div class="d-block shadow" style="background-color: white">
                  <template v-if="card.info.datatype === 'MultipleWordsString'">
                    <MultipleWordsStringTemplate
                      :index="index"
                    ></MultipleWordsStringTemplate>
                  </template>
                  <template v-else-if="card.info.datatype === 'Number'">
                    <NumberTemplate :index="index"></NumberTemplate>
                  </template>
                  <template v-else-if="card.info.datatype === 'KeyToName'">
                    <KeyToNameTemplate :index="index"></KeyToNameTemplate>
                  </template>
                  <template v-else-if="card.info.datatype === 'Date'">
                    <DateTemplate :index="index"></DateTemplate>
                  </template>
                  <template v-else-if="card.info.datatype === 'DateTime'">
                    <DateTimeTemplate :index="index"></DateTimeTemplate>
                  </template>
                  <template v-else-if="card.info.datatype === 'Time'">
                    <TimeTemplate :index="index"></TimeTemplate>
                  </template>
                  <template v-else-if="card.info.datatype === 'Year'">
                    <YearTemplate :index="index"></YearTemplate>
                  </template>
                  <template
                    v-else-if="
                      card.info.datatype === 'SingleWordString' ||
                      card.info.datatype === 'NumberString'
                    "
                  >
                    <SingleWordStringTemplate :index="index"></SingleWordStringTemplate>
                  </template>
                  <template v-else></template>
                  <!--  -->
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-1 {
  padding-top: 1.108333rem !important;
  padding-bottom: 1.108333rem !important;
}
</style>
