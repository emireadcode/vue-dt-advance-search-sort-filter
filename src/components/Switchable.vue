<script setup lang="ts">
import { inject, type ShallowRef, triggerRef, nextTick } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import { useBooleanDebouncedRef } from "./composable/useBooleanDebouncedRef";

const
  props = defineProps<{
    index: number;
    focusableDescendants: Boolean;
    truelabel: string;
    falselabel: string;
  }>(),
  emits = defineEmits<{
    (e: "enable:focusableDescendants"): void;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

let trueorfalse = useBooleanDebouncedRef(cards.value[props.index].search.trueorfalse);

function updateTrueOrFalse(val: Boolean) {
  emits("enable:focusableDescendants");
  
  nextTick(() => {
    cards.value[props.index].search.trueorfalse = !val;
    triggerRef(cards);
  });
}

</script>

<template>
  <label
    role="switch"
    :aria-checked="(trueorfalse as boolean)"
    :for="cards[index].scroll.areaid + '-switch'"
    @click.stop="updateTrueOrFalse(trueorfalse)"
    @keyup.enter.native="updateTrueOrFalse(trueorfalse)"
    @keyup.enter="updateTrueOrFalse(trueorfalse)"
    class="d-inline-block w-100 h-100 position-relative"
    style="background-color: #eee;"
  >
    <input
      :id="cards[index].scroll.areaid + '-switch'"
      class="d-none"
      @click.stop=""
      type="checkbox"
      v-model="(trueorfalse as boolean)"
    />
    <div
      class="d-block align-middle position-absolute m-0 t-0 h-100 slider"
      tabindex="-1"
    >
      <a 
        class="d-block underline-none text-center cursor-pointer h-100 switch-btn"
        tabindex="-1"
        :aria-label="trueorfalse ? 'Selected relatively between ' : 'Selected unrelative between '"
      >{{
        trueorfalse ? truelabel : falselabel
      }}</a>
    </div>
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
      style="outline: 1.4px solid rgba(0, 0, 0, 0.2);"
    >
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="props.focusableDescendants? 0 : -1"
          aria-pressed="true"
          aria-label="relatively"
        >
          {{ truelabel }}
        </a>
      </div>
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="props.focusableDescendants? 0 : -1"
          aria-pressed="true"
          aria-label="unrelatively"
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
  background-color: #f0e68c;
  -webkit-transition: 0.6s;
  transition: 0.6s;
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

.switch-btn {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 2px 0;
}

.slider:focus,
.switch-btn:hover,
.switch-btn:focus,
.switch-btn:active {
  background-color: grey;
}
</style>