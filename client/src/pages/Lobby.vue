<script setup>
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';

const MIN_AMOUNT_OF_PLAYERS = 4;

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
      <h4>Pelaajia: {{game.players.length}}</h4>
      <div class="players" v-for="(player, index) in game.players">
        <span :class="['player', {'choosing-name': !player.name}]">{{player.name ? player.name : 'Valitsee nimimerkkiä'}}{{index < game.players.length - 1 ? ', ' : ''}}</span>
      </div>
    </div>
    <div>
    <Button text="Olen Hämy, aloita peli" :onClick="startRound" :disabled="bluff || game.players.length < MIN_AMOUNT_OF_PLAYERS" />
    <div v-if="bluff">{{bluff.name}} kirjoittaa sanaa...</div>
    <div v-else-if="game.players.length < MIN_AMOUNT_OF_PLAYERS">Peliin tarvitaan vähintään {{MIN_AMOUNT_OF_PLAYERS}} pelaajaa</div>
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

.players {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
    
  .player {
    margin-top: 0.5em;
  }

}

.choosing-name {
    font-style: italic;
}

</style>
