<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import io from 'socket.io-client';
import { onMounted, onUnmounted, ref } from 'vue';
import Home from './components/Home.vue';

const x = ref(0)
const y = ref(0)

const socket = ref();
const game = ref();

function update(data) {
  game.value = data.game;
}

onMounted(() => {
  socket.value = io();

  fetch('/api')
    .then(res => res.json())
    .then(data => console.log(data));

  console.log('socket', socket.value);
  socket.value.on('update', update);
})

onUnmounted(() => {
  if (socket.value) socket.value.close()
})

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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: calc(100% - 4em);
  padding: 2em 1em;
  max-width: 400px;
  max-height: 800px;
  margin: 0 auto;
}
</style>
