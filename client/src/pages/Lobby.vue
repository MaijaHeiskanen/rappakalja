<script setup>
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
  game: Object,
  bluff: Object | undefined,
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
    <div>
      <div>Pelaajia: {{game.players.length}}</div>
      <div v-for="(player, index) in game.players">
        <span>{{player.name ? player.name : 'Valitsee nimimerkkiä'}}{{index < game.players.length - 1 ? ', ' : ''}}</span>
      </div>
    </div>
    <div>
    <Button text="Olen Hämy, aloita peli" :onClick="startRound" :disabled="bluff" />
    <div v-if="bluff">{{bluff.name}} kirjoittaa sanaa...</div>
    </div>
</div>
</template>

<style scoped lang="scss">

.lobby {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    button {
        margin-top: 1em;
    }
}

</style>
