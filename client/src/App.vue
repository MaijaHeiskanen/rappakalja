<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import io from 'socket.io-client';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Home from './pages/Home.vue';
import SelectName from './pages/SelectName.vue';
import Lobby from './pages/Lobby.vue';
import { isSelectingName } from './helpers/playerStatuses';
import { getPlayer } from './helpers/getPlayer';
import { isLobby, isBluffWritingWord, isWritingDefinition, isValidatingDefinitions, isVoting, isRoundEnd } from './helpers/gameStatuses';
import { isBluff } from './helpers/isBluff';
import SetWord from './pages/SetWord.vue';
import SetDefinition from './pages/SetDefinition.vue';
import ValidateDefnitions from './pages/ValidateDefnitions.vue';
import WaitForBluff from './pages/WaitForBluff.vue';
import Vote from './pages/Vote.vue';
import RoundEnd from './pages/RoundEnd.vue';

const socket = ref({});
const game = ref({});

const updateGame = (data) => {
  game.value = data;
}

onMounted(() => {
  socket.value = io();

  socket.value.on('update', updateGame);
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('update', updateGame);
    socket.value.close()
  } 
})

watch(game, (newVal, oldVal) => {
  console.log('game changed', {new: newVal, old: oldVal})
})

</script>

<template>
  <Home v-if="game.gameState === undefined" :updateGame="updateGame" :socket="socket" />
  <SelectName v-else-if="game && isSelectingName(getPlayer(socket.id, game.players))" :updateGame="updateGame" :socket="socket" />
  <SetWord v-else-if="game && isBluff(socket, game) && isBluffWritingWord(game)" :updateGame="updateGame" :socket="socket" :game="game" />
  <Lobby v-else-if="game && (isLobby(game) || isBluffWritingWord(game))" :bluff="isBluffWritingWord(game) ? game.bluff : undefined" :updateGame="updateGame" :socket="socket" :game="game" />
  <SetDefinition v-else-if="game && isWritingDefinition(game)" :updateGame="updateGame" :socket="socket" :game="game" />
  <ValidateDefnitions v-else-if="game && isBluff(socket, game) && isValidatingDefinitions(game)" :updateGame="updateGame" :socket="socket" :game="game" />
  <WaitForBluff v-else-if="game && isValidatingDefinitions(game)" text="Hämy käy vastauksia läpi..." />
  <Vote v-else-if="game && isVoting(game)" :updateGame="updateGame" :socket="socket" :game="game" />
  <RoundEnd v-else-if="game && isRoundEnd(game)" :updateGame="updateGame" :socket="socket" :game="game" />
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
