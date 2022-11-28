<script setup lang="ts">
const buttonnames = ['starts with', 'contains', 'exactly equal to', 'ends with'];

</script>


<template>
  <div class="d-block" style="padding: 7px 0px 15px 0px;">
    <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
      <li
        class="flex-shrink-0 flex-grow-0 align-self-stretch flex-w-25"
        v-for="(name, index) in buttonnames"
        :key="index + 'bn'"
      >
        <button
          class="text-lowercase tab w-100" 
          style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
        >
          {{ name }}
        </button>
      </li>
    </ul>
  </div>
</template>