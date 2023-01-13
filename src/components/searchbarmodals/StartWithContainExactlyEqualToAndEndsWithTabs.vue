<script setup lang="ts">
import { ref, } from "vue";

const 

  props = defineProps<{
    format: 'STARTS-WITH' | 'ENDS-WITH' | 'CONTAINS' | 'EQUAL-TO';
  }>(),

  buttonnames = ['starts with', 'contains', 'equal to', 'ends with'],

  emits = defineEmits<{
    (e: "update:format", action: 'STARTS-WITH' | 'ENDS-WITH' | 'CONTAINS' | 'EQUAL-TO'): void;
  }>(),

  format = ref<'STARTS-WITH' | 'ENDS-WITH' | 'CONTAINS' | 'EQUAL-TO'>()
;

format.value = props.format;

</script>

<template>
  <div class="d-block" style="padding: 7px 0px 15px 0px;">
    <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
      <li
        class="flex-w-25 align-self-stretch"
        v-for="(name, bindex) in buttonnames"
        :key="bindex + 'bn'"
      >
        <button
          :style="
            (
              (format==='STARTS-WITH' && name==='starts with')
              ||
              (format==='ENDS-WITH' && name==='ends with')
              ||
              (format==='CONTAINS' && name==='contains')
              ||
              (format==='EQUAL-TO' && name==='equal to')
            )?
              'background-color:#F0E68C;' 
              : 
              'background-color:lightgray;'
          "
          @keypress.enter="() => {
            name==='starts with'? format = 'STARTS-WITH'
            : (
              name==='ends with'? format = 'ENDS-WITH'
              : (
                name==='contains'? format = 'CONTAINS' : format = 'EQUAL-TO'
              )
            );
            emits('update:format', format);
          }"
          @click="() => {
            name==='starts with'? format = 'STARTS-WITH'
            : (
              name==='ends with'? format = 'ENDS-WITH'
              : (
                name==='contains'? format = 'CONTAINS' : format = 'EQUAL-TO'
              )
            );
            emits('update:format', format);
          }"
          class="text-lowercase tab w-100" 
          style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
        >
          {{ name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>