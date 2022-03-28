<script setup>
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
  game: Object
})

function startRound() {
  GameService.startRound(props.socket.id)
  .then(newGame => {
    console.log('Start round', newGame);

    props.updateGame(newGame);
  });
}

</script>

<template>
<div v-if="game" class="lobby">
    <div>Aulan koodi: {{game.room}}</div>
    <div>Pelaajia: {{game.players.length}}</div>
    <Button text="Olen Hämy, aloita peli" :onClick="startRound" />
</div>
</template>

<style scoped lang="scss">

.lobby {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        margin-top: 1em;
    }
}

</style>
