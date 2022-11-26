<script setup lang="ts">
import { provide, type ShallowRef, type Ref, ref, onBeforeMount } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import {
  assignElToCardRef, 
  enableCardFocusableDescendantsTabIndex, 
  enableAllCardsRefTabIndex,
  disableOtherCardsFocusableDescendantsTabIndex,
  disableAllCardsListBoxFocusableDescendantsTabIndex,
  disableOtherCardsRefTabIndex,
} from "./helperfunctions/accessibility";
import Framework from "./Framework.vue";

let
  cardContainerRef = ref<HTMLDivElement>(),
  cardRef = ref<HTMLDivElement[]>([]),
  cardFocusableDescendantsTabIndex = ref<Boolean[]>([]),
  cardRefTabIndex = ref<Boolean[]>([]),
  sliderRef = ref<HTMLDivElement[]>([]),
  trueLabelRef = ref<HTMLAnchorElement[]>([]),
  falseLabelRef = ref<HTMLAnchorElement[]>([]),
  sliderOnFocused = ref<Boolean[]>([]),
  shiftTabbed = ref<Boolean[]>([]),
  cardSearchBarOpen = ref<Boolean[]>([]),
  cardListBoxFocusableDescendantsTabIndex = ref<Boolean[]>([])
;

const
  emits = defineEmits<{
    (e: "modal:close", action: boolean): void;
  }>(),
  props = defineProps<{
    cards: ShallowRef<PrimitiveType[]>;
  }>()
;

provide("cards", props.cards);

provide("accessibility", {
  attributes: {
    cardRef,
    cardFocusableDescendantsTabIndex,
    cardRefTabIndex,
    cardListBoxFocusableDescendantsTabIndex,
    cardContainerRef,
    sliderRef,
    trueLabelRef,
    falseLabelRef,
    sliderOnFocused,
    shiftTabbed,
    cardSearchBarOpen,
  },
  methods: {
    enableCardFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => {
      enableCardFocusableDescendantsTabIndex(i, f);
    },
    disableOtherCardsFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => {
      disableOtherCardsFocusableDescendantsTabIndex(i, f);
    },
    disableOtherCardsRefTabIndex: (i: number, c: Ref<Boolean[]>) => {
      disableOtherCardsRefTabIndex(i, c);
    },
    disableAllCardsListBoxFocusableDescendantsTabIndex: (l: Ref<Boolean[]>) => {
      disableAllCardsListBoxFocusableDescendantsTabIndex(l);
    },
    enableAllCardsRefTabIndex: (c: Ref<Boolean[]>) => {
      enableAllCardsRefTabIndex(c);
    },
    assignElToCardRef: (el: HTMLDivElement, i: number, c: Ref<HTMLDivElement[]>) => {
      assignElToCardRef(el, i, c);
    }
  }
});

onBeforeMount(() => {
  props.cards.value?.forEach((item, index) => {
    cardFocusableDescendantsTabIndex.value[index] = false;
    cardRefTabIndex.value[index] = true;
    cardListBoxFocusableDescendantsTabIndex.value[index] = false;
    sliderOnFocused.value[index] = false;
    shiftTabbed.value[index] = false;
    cardSearchBarOpen.value[index] = false;
  });
});

</script>

<template>
  <div class="position-relative m-0 p-0 d-block" aria-modal="true" role="dialog">
    <Framework></Framework>
  </div>
</template>

