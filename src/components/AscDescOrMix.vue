<script setup lang="ts">
import { inject, onMounted, nextTick, triggerRef, type ShallowRef, type Ref } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";

const
  props = defineProps<{
    index: number;
  }>(),
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  index = props.index
;

let
  accessibility = inject("accessibility") as {
    attributes: {
      cardFocusableDescendantsTabIndex: Ref<Boolean[]>;
      cardRefTabIndex: Ref<Boolean[]>;
    };
    methods: {
      enableCardFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableOtherCardsFocusableDescendantsTabIndex: (i: number, f: Ref<Boolean[]>) => void;
      disableOtherCardsRefTabIndex: (i: number, c: Ref<Boolean[]>) => void;
    };
  }
;

onMounted(() => {
  setSortType(cards.value[index].sorttype, false);
});

function setSortType(sorttype: string, clicked: boolean) {
  //set sort type and trigger cards to update itself
  cards.value[index].sorttype = sorttype;
  triggerRef(cards);

  if(clicked) {
    accessibility.methods.enableCardFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
    accessibility.methods.disableOtherCardsFocusableDescendantsTabIndex(index, accessibility.attributes.cardFocusableDescendantsTabIndex);
  }

  nextTick(() => {
    //change background colors of asc, desc, and mix buttons
    if(sorttype === 'ASC') {
      (document.querySelector('#asc-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#F0E68C";
      (document.querySelector('#desc-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#eee";
      (document.querySelector('#mix-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#eee";
    }
    else if(sorttype === 'DESC') {
      (document.querySelector('#desc-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#F0E68C";
      (document.querySelector('#asc-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#eee";
      (document.querySelector('#mix-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#eee";
    }
    else {
      (document.querySelector('#mix-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#F0E68C";
      (document.querySelector('#desc-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#eee";
      (document.querySelector('#asc-btn-'+cards.value[index].info.attribute+'.sort-btn') as HTMLButtonElement).style.backgroundColor = "#eee";
    }
  });
}

</script>

<template>
  <div class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center" style="padding:0.656250749rem 0;">
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 2px 0 0;">
      <button
        :id="'asc-btn-'+cards[index].info.attribute"
        aria-pressed="false"
        aria-label="Ascending"
        :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
        @click.prevent="setSortType('ASC', true)"
        class="sort-btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
      >
        <img :src="'./src/assets/icons/' + cards[index].img.ascclicked" style="height:1.1667rem !important;width:1.1667rem;" />
        <span class="font-bold letter-spacing font-0-dot-80-rem" style="padding-left:0.175rem;">ASC</span>
      </button>
    </div>
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 2px;">
      <button
        :id="'desc-btn-'+cards[index].info.attribute"
        aria-pressed="false"
        aria-label="Descending"
        :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
        @click.prevent="setSortType('DESC', true)"
        class="sort-btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
      >
        <img :src="'./src/assets/icons/' + cards[index].img.descclicked" style="height:1.1667rem !important;width:1.1667rem;" />
        <span class="font-bold letter-spacing font-0-dot-80-rem" style="padding-left:0.175rem;">DESC</span>
      </button>
    </div>
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 0 0 2px;">
      <button
        :id="'mix-btn-'+cards[index].info.attribute"
        aria-pressed="false"
        aria-label="No sorting"
        :tabindex="accessibility.attributes.cardFocusableDescendantsTabIndex.value[index]? 0 : -1"
        @click.prevent="setSortType('MIX', true)"
        class="sort-btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
      >
        <img :src="'./src/assets/icons/' + cards[index].img.mixclicked" style="height:1.1667rem !important;width:1.1667rem;" />
        <span class="font-bold letter-spacing font-0-dot-80-rem" style="padding-left:0.175rem;">MIX</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sort-btn {
  outline: 2px solid gray;
  border: none;
  background-color: #eee;
  border-radius: 10px;
  padding: 0.291667rem;
}

.sort-btn:hover,
.sort-btn:focus,
.sort-btn:active {
  outline: 2px solid blue;
  background-color: gray !important;
}
</style>
