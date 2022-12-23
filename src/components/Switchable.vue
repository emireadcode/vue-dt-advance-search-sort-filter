<script setup lang="ts">
import { inject, type ShallowRef, triggerRef, nextTick, ref, type Ref } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import { useBooleanDebouncedRef } from "./composable/useBooleanDebouncedRef";
import {
  disableOtherCardsChildrenTabIndex
} from "./helperfunctions/accessibility";

const
  props = defineProps<{
    truelabel: string;
    falselabel: string;
  }>(),
  index = inject("index") as number,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

let
  done = ref(false),
  accessibility = inject("accessibility") as {
    cardstabindex: Ref<Boolean[]>;
    cardschildrentabindex: Ref<Boolean[]>;
  },
  sliderRef = ref<HTMLDivElement>(),
  trueLabelRef = ref<HTMLAnchorElement>(),
  falseLabelRef = ref<HTMLAnchorElement>(),
  focusStatus = ref<Boolean>(),
  shiftTabStatus = ref<Boolean>(),
  trueorfalse = useBooleanDebouncedRef(cards.value[index].search.trueorfalse)
;

function updateTrueOrFalse(e: KeyboardEvent | MouseEvent) {
  if(done.value === false) {
    done.value = true;
    let time: NodeJS.Timeout;
    time = setTimeout(() => {
      if(trueorfalse.value) {
        cards.value[index].search.trueorfalse = false;
      }
      else {
        cards.value[index].search.trueorfalse = true;
      }

      triggerRef(cards);
        
      accessibility.cardschildrentabindex.value[index] = true;
      disableOtherCardsChildrenTabIndex(index, accessibility.cardschildrentabindex);
        
      (sliderRef.value as HTMLDivElement).focus();

      if(e instanceof KeyboardEvent) {
        document.getElementById(cards.value[index].scroll.areaid + '-switch')?.click();
        e.preventDefault();
      }
      
      done.value = false;

      clearTimeout(time);
      
    }, 50);
  }
}

function handleShiftTab(e: KeyboardEvent) {
  shiftTabStatus.value = true;
  nextTick(() => {
    if (e.shiftKey) {
      sliderRef.value?.blur();
      trueLabelRef.value?.focus();
      if(focusStatus.value) {
        (sliderRef.value as HTMLDivElement).blur();
        nextTick(() => {
          document.getElementById('mix-btn-'+cards.value[index].info.attribute)?.focus();
        });
      }
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

</script>

<template>
  <label
    role="switch"
    :aria-checked="(trueorfalse as boolean)"
    :for="cards[index].scroll.areaid + '-switch'"
    @click.stop="updateTrueOrFalse($event)"
    @keypress.enter.stop="updateTrueOrFalse($event)"
    class="d-inline-block w-100 h-100 position-relative"
    style="background-color: #eee;"
  >
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
      style="outline: 1.4px solid rgba(0, 0, 0, 0.2);"
    >
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          :ref="(el) => trueLabelRef = el as HTMLAnchorElement"
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
          aria-pressed="true"
          aria-label="relatively"
          @focus="() => { (trueorfalse? focusStatus=true : focusStatus=false); focusStatus? (sliderRef as HTMLDivElement).focus() : (sliderRef as HTMLDivElement).blur(); shiftTabStatus = false; }"
        >
          {{ truelabel }}
        </a>
      </div>
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          :ref="(el) => falseLabelRef = el as HTMLAnchorElement"
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="accessibility.cardschildrentabindex.value[index]? 0 : -1"
          aria-pressed="true"
          aria-label="unrelatively"
          @focus="() => { (trueorfalse? focusStatus=false : focusStatus=true); focusStatus? (sliderRef as HTMLDivElement).focus() : (sliderRef as HTMLDivElement).blur(); shiftTabStatus = false; }"
        >
          {{ falselabel }}
        </a>
      </div>
    </div>
    <input
      :id="cards[index].scroll.areaid + '-switch'"
      class="d-none"
      @click.stop=""
      @keypress.enter.stop=""
      type="checkbox"
      v-model="(trueorfalse as boolean)"
    />
    <div
      @keydown.tab="handleShiftTab($event)"
      :ref="el => sliderRef = el as HTMLDivElement"
      :tabindex="accessibility.cardschildrentabindex.value[index] && focusStatus? 0 : -1"
      class="d-block align-middle position-absolute m-0 t-0 h-100 slider"
      @blur="trueorfalse && shiftTabStatus? (falseLabelRef as HTMLAnchorElement).focus() : (falseLabelRef as HTMLAnchorElement).blur()"
    >
      <a 
        class="d-block underline-none text-center cursor-pointer h-100 switch-btn"
        tabindex="-1"
        :aria-label="trueorfalse ? 'Selected relatively ' : 'Selected unrelatively '"
      >{{
        trueorfalse ? truelabel : falselabel
      }}</a>
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