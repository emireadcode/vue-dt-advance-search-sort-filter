<script setup lang="ts">
import { inject, type ShallowRef, triggerRef, nextTick, ref, type Ref } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import { useBooleanDebouncedRef } from "./composable/useBooleanDebouncedRef";

const
  props = defineProps<{
    index: number;
    truelabel: string;
    falselabel: string;
  }>(),
  index = props.index,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>
;

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardFocusableDescendantsTabIndex: Ref<Boolean[]>;
      cardRefTabIndex: Ref<Boolean[]>;
      sliderRef: Ref<HTMLDivElement[]>;
      trueLabelRef: Ref<HTMLAnchorElement[]>;
      falseLabelRef: Ref<HTMLAnchorElement[]>;
      sliderOnFocused: Ref<Boolean[]>;
      shiftTabbed: Ref<Boolean[]>;
    };
    methods: {
      enableCardFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableOtherCardsFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableOtherCardsRefTabIndex: (i: number, c: Ref<Boolean[]>) => void;
    };
  }
;

let trueorfalse = useBooleanDebouncedRef(cards.value[index].search.trueorfalse);

function updateTrueOrFalse(val: Boolean) {
  accessibility.attributes.cardFocusableDescendantsTabIndex.value[index] = true;
  accessibility.methods.enableCardFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
  accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
  accessibility.methods.disableOtherCardsRefTabIndex(index, accessibility.attributes.cardRefTabIndex);
  
  nextTick(() => {
    cards.value[index].search.trueorfalse = !val;
    triggerRef(cards);
  });
}

function handleShiftTab(e: KeyboardEvent) {
  accessibility.attributes.shiftTabbed.value[index] = true;
  nextTick(() => {
    if (e.shiftKey) {
      accessibility.attributes.sliderRef.value[index]?.blur();
      accessibility.attributes.trueLabelRef.value[index]?.focus();
      if(accessibility.attributes.sliderOnFocused.value[index]) {
        accessibility.attributes.sliderRef.value[index].blur();
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
    @click.stop="updateTrueOrFalse(trueorfalse)"
    @keyup.enter.native="updateTrueOrFalse(trueorfalse)"
    @keyup.enter="updateTrueOrFalse(trueorfalse)"
    class="d-inline-block w-100 h-100 position-relative"
    style="background-color: #eee;"
  >
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
      style="outline: 1.4px solid rgba(0, 0, 0, 0.2);"
    >
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          :ref="(el) => accessibility.attributes.trueLabelRef.value[index] = el as HTMLAnchorElement"
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
          aria-pressed="true"
          aria-label="relatively"
          @focus="() => { (trueorfalse? accessibility.attributes.sliderOnFocused.value[index]=true : accessibility.attributes.sliderOnFocused.value[index]=false); accessibility.attributes.sliderOnFocused.value[index]? (accessibility.attributes.sliderRef.value[index] as HTMLDivElement).focus() : (accessibility.attributes.sliderRef.value[index] as HTMLDivElement).blur(); accessibility.attributes.shiftTabbed.value[index] = false; }"
        >
          {{ truelabel }}
        </a>
      </div>
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          :ref="(el) => accessibility.attributes.falseLabelRef.value[index] = el as HTMLAnchorElement"
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
          aria-pressed="true"
          aria-label="unrelatively"
          @focus="() => { (trueorfalse? accessibility.attributes.sliderOnFocused.value[index]=false : accessibility.attributes.sliderOnFocused.value[index]=true); accessibility.attributes.sliderOnFocused.value[index]? (accessibility.attributes.sliderRef.value[index] as HTMLDivElement).focus() : (accessibility.attributes.sliderRef.value[index] as HTMLDivElement).blur(); accessibility.attributes.shiftTabbed.value[index] = false; }"
        >
          {{ falselabel }}
        </a>
      </div>
    </div>
    <input
      :id="cards[index].scroll.areaid + '-switch'"
      class="d-none"
      @click.stop=""
      type="checkbox"
      v-model="(trueorfalse as boolean)"
    />
    <div
      @keydown.tab="handleShiftTab($event)"
      :ref="el => accessibility.attributes.sliderRef.value[index] = el as HTMLDivElement"
      :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index] && accessibility.attributes.sliderOnFocused.value[index]? 0 : -1"
      class="d-block align-middle position-absolute m-0 t-0 h-100 slider"
      @blur="trueorfalse && accessibility.attributes.shiftTabbed.value[index]? accessibility.attributes.falseLabelRef.value[index].focus() : accessibility.attributes.falseLabelRef.value[index].blur()"
    >
      <a 
        class="d-block underline-none text-center cursor-pointer h-100 switch-btn"
        tabindex="-1"
        :aria-label="trueorfalse ? 'Selected relatively ' : 'Selected unrelative '"
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