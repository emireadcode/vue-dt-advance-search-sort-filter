<template>
  <div id="app">
    <MapContainer></MapContainer>
  </div>
</template>

<script setup lang="ts">
import MapContainer from "./components/searchbarmodals/MapContainer.vue";
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    height: 100%;
    width: 100%;
    grid-gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
  }
</style>
