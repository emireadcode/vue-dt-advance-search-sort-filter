<script setup lang="ts">
import { customRef } from "vue";

const props = defineProps<{
  cards: any
}>();

const emits = defineEmits<{
  (e: "update:sorttype", action: any): void
}>();

function useDebouncedRef(value, delay = 5) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay)
      }
    }
  })
}

let debouncedcard = useDebouncedRef(props.cards);

function changeSortType(sorttype: string) {
  props.cards.sorttype = sorttype;
  debouncedcard.value = props.cards;
  emits("update:sorttype", debouncedcard.value);
}

</script>

<template>
  <div class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center" style="padding:0.656250749rem 0;">
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 2px 0 0;">
      <a
        @click.prevent="changeSortType('ASC')"
        :style="debouncedcard.sorttype==='ASC'?'background-color: #F0E68C;':'background-color: #eee;'"
        class="m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
        style="border-radius: 10px;padding:0.291667rem;"
      >
        <img :src="'./src/assets/icons/' + debouncedcard.img.ascclicked" style="height:1.1667rem !important;width:1.1667rem;" />
        <span class="font-bold letter-spacing font-0-dot-80-rem" style="padding-left:0.175rem;">ASC</span>
      </a>
    </div>
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 2px;">
      <a
        @click.prevent="changeSortType('DESC')"
        :style="debouncedcard.sorttype==='DESC'?'background-color: #F0E68C;':'background-color: #eee;'"
        class="m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
        style="border-radius: 10px;padding:0.291667rem;"
      >
        <img :src="'./src/assets/icons/' + debouncedcard.img.descclicked" style="height:1.1667rem !important;width:1.1667rem;" />
        <span class="font-bold letter-spacing font-0-dot-80-rem" style="padding-left:0.175rem;">DESC</span>
      </a>
    </div>
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 0 0 2px;">
      <a
        @click.prevent="changeSortType('')"
        :style="debouncedcard.sorttype===''?'background-color: #F0E68C;':'background-color: #eee;'"
        class="m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
        style="border-radius: 10px;padding:0.291667rem;"
      >
        <img :src="'./src/assets/icons/' + debouncedcard.img.mixclicked" style="height:1.1667rem !important;width:1.1667rem;" />
        <span class="font-bold letter-spacing font-0-dot-80-rem" style="padding-left:0.175rem;">MIX</span>
      </a>
    </div>
  </div>
</template>