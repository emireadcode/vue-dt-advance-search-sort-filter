import type { Ref } from "vue";

export function assignElToCardRef(el: HTMLDivElement, index: number, cardRef: Ref<HTMLDivElement[]>) {
  cardRef.value[index] = el;
}

export function enableCardFocusableDescendantsTabIndex(index: number, cardFocusableDescendantsTabIndex: Ref<Boolean[]>) {
  cardFocusableDescendantsTabIndex.value[index] = true;
}

export function enableAllCardsRefTabIndex(cardRefTabIndex: Ref<Boolean[]>) {
  cardRefTabIndex.value.forEach((item, i) => {
    cardRefTabIndex.value[i] = true;
  });
}

export function disableOtherCardsFocusableDescendantsTabIndex(index: number, cardFocusableDescendantsTabIndex: Ref<Boolean[]>) {
  cardFocusableDescendantsTabIndex.value.forEach((item, i) => {
    if(i !== index) {
      cardFocusableDescendantsTabIndex.value[i] = false;
    }
  });
}

export function disableAllCardsListBoxFocusableDescendantsTabIndex(cardListBoxFocusableDescendantsTabIndex: Ref<Boolean[]>) {
  cardListBoxFocusableDescendantsTabIndex.value.forEach((item, i) => {
    cardListBoxFocusableDescendantsTabIndex.value[i] = false;
  });
}

export function disableOtherCardsRefTabIndex(index: number, cardRefTabIndex: Ref<Boolean[]>) {
  cardRefTabIndex.value.forEach((item, i) => {
    if(i !== index) {
      cardRefTabIndex.value[i] = false;
    }
  });
}
