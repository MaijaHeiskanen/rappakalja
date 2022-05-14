<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';
import Definition from '../components/Definition.vue';
import { isBluff } from '../helpers/isBluff';

const props = defineProps({
  socket: Object,
  updateGame: Function,
  game: Object
})

const playerIsBluff = ref(isBluff(props.socket, props.game));

function endRound() {
  GameService.endRound(props.socket.id)
  .then(game => {
    console.log('Round ended', game);

    props.updateGame(game);
  });
}

</script>

<template>
<div class="round-end">
  <h2 class="title">Oikea määritelmä sanalle <span class="word">{{game.word}}</span>:</h2>
  <Definition :definition="game.correctDefinition" showPlayer selected />
  <h2 class="title">Pelatut oikeat määritelmät:</h2>
  <div class="definitions">
    <div v-if="game.correctDefinitions.length > 0" class="definition" v-for="definition in game.correctDefinitions">
      <Definition :definition="definition" showPlayer selected />
    </div>
    <div v-else class="definition">
      <p>Ei pelattuja oikeita määritelmiä tällä kierroksella</p>
    </div>
  </div>    
  <h2 class="title">Arvaukset:</h2>
  <div class="definitions">
    <div class="definition" v-for="definition in game.definitions">
      <Definition :definition="definition" showPlayer />
    </div>
  </div>    
  <h2 class="title">Pisteet:</h2>
  <div class="points" v-for="points in game.points">
    <div class="player">
      <span class="name">{{ points.playerName }}: </span>
      <span class="point">{{ points.points }}</span>
    </div>
  </div>
  <div class="instruction" v-if="game.votes.length === 0">Hämy keskeytti tämän kierroksen</div>
  <div class="instruction" v-if="!playerIsBluff">Odotetaan, että Hämy {{game.bluff?.name ?? ''}} palaa aulaan...</div>
  <Button v-if="playerIsBluff" text="Takaisin aulaan" :onClick="endRound" />
    
</div>
</template>

<style scoped lang="scss">

.word {
  color: #3369ff;
}

.title {
  font-size: 1.2em;
  margin-bottom: 0.6em;
  margin-top: 1.2em;
}

.instruction {
  margin-top: 2em;
  font-style: italic;
}

.round-end {
    height: 100%;
    display: flex;
    flex-direction: column;

    button {
        margin: 1.4em 0.5em;
        margin-top: 2em;
    }
}

.definitions {
  .definition + .definition {
    margin-top: 0.4em;
  }
}
</style>
