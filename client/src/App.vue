<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import Home from './components/Home.vue';

</script>

<template>
  <Home />
</template>

<style>

html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  min-height: 100%;
  height: 100%;
  width: 100%;

}
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: calc(100% - 4em);
  padding: 2em 1em;
  max-width: 400px;
  max-height: 800px;
  margin: 0 auto;
}
</style>
