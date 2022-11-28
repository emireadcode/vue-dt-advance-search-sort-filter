import type { Ref } from "vue";

export function enableAllCardsTabIndex(cardtabindex: Ref<Boolean[]>) {
  cardtabindex.value.forEach((_item, index) => {
    cardtabindex.value[index] = true;
  });
}

export function disableAllCardsChildrenTabIndex(cardchildrentabindex: Ref<Boolean[]>) {
  cardchildrentabindex.value.forEach((_item, index) => {
    cardchildrentabindex.value[index] = false;
  });
}

export function disableAllCardsFilterItemTabIndex(filteritemtabindex: Ref<Boolean[]>) {
  filteritemtabindex.value.forEach((_item, index) => {
    filteritemtabindex.value[index] = false;
  });
}

export function disableOtherCardsChildrenTabIndex(curindex: number, cardchildrentabindex: Ref<Boolean[]>) {
  cardchildrentabindex.value.forEach((_item, index) => {
    if(curindex !== index) {
      cardchildrentabindex.value[index] = false;
    }
  });
}
