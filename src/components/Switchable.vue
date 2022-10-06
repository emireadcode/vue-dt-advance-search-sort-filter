<script setup lang="ts">
import { customRef, inject } from "vue";

const props = defineProps<{
  index: number;
  concatindex?: number;
  truelabel: string;
  falselabel: string;
}>();

const emits = defineEmits<{
  (e: "update:trueorfalse", trueorfalse: boolean): void;
}>();

const cards = inject("cards") as any;

function useDebouncedRef(value, delay = 5) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}

let debouncedsearch = useDebouncedRef(cards.value[props.index].search.trueorfalse);
</script>

<template>
  <label
    :for="cards[index].scroll.areaid + '-switch'"
    @click.stop="emits('update:trueorfalse', !debouncedsearch)"
    class="d-inline-block w-100 h-100 position-relative"
    style="background-color: #eee"
  >
    <input
      :id="cards[index].scroll.areaid + '-switch'"
      class="d-none"
      @click.stop=""
      type="checkbox"
      v-model="debouncedsearch"
    />
    <span
      class="d-block align-middle position-absolute t-0 h-100 slider"
      style="outline: 1px solid rgba(0, 0, 0, 0.2)"
    >
      <a class="d-block underline-none text-center cursor-pointer">{{
        debouncedsearch ? truelabel : falselabel
      }}</a>
    </span>
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
      style="outline: 1px solid rgba(0, 0, 0, 0.2)"
    >
      <div class="flex-w-50 bold align-self-stretch">
        <a
          class="d-block underline-none text-center cursor-pointer"
          style="padding: 2.5px 0 1px 0"
        >
          {{ truelabel }}
        </a>
      </div>
      <div class="flex-w-50 bold align-self-stretch">
        <a
          class="d-block underline-none text-center cursor-pointer"
          style="padding: 2.5px 0 1px 0"
        >
          {{ falselabel }}
        </a>
      </div>
    </div>
  </label>
</template>

<style scoped>
.slider {
  width: 1.75rem;
  padding: 2.5px 0 1px 0;
  background-color: #f0e68c;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  -webkit-transform: translateX(1.75rem);
  -ms-transform: translateX(1.75rem);
  transform: translateX(1.75rem);
}
input:focus + .slider {
  box-shadow: 0 0 1px white;
}
input:checked + .slider {
  box-shadow: 0 0 1px white;
  -webkit-transform: translateX(0rem);
  -ms-transform: translateX(0rem);
  transform: translateX(0rem);
}
</style>
