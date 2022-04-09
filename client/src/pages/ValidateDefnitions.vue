<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';
import Definition from '../components/Definition.vue';

const props = defineProps({
  socket: Object,
  updateGame: Function,
  game: Object
})

const canContinue = ref(true);
const correctDefinitions = ref([]);

function continueToVote() {
  GameService.continueToVote(props.socket.id, correctDefinitions.value)
  .then(game => {
    console.log('Continue to vote', game);

    props.updateGame(game);
  });
}

function abortRound() {
  GameService.abortRound(props.socket.id, correctDefinitions.value)
  .then(game => {
    console.log('Abort round', game);

    props.updateGame(game);
  });
}

function selectDefinition(definition) {
  console.log('Select definition', definition);

  const idx = correctDefinitions.value.findIndex(d => d === definition.playerSocketId);

  console.log('selectDefinition', definition, idx);
  if (idx !== -1) {
    correctDefinitions.value.splice(idx, 1);

    return;
  }

  correctDefinitions.value.push(definition.playerSocketId);
}

</script>

<template>
<div class="validate-definitions">
  <h2 class="title">Sanan oikea määritelmä:</h2>
    <Definition :definition="game.correctDefinition" />
  <h2 class="title">Valitse oikeat määritelmät:</h2>
    <div class="definitions">
      <div class="definition" v-for="definition in game.definitions">
        <Definition :definition="definition" :showPlayer="true" canSelect :select="selectDefinition" :selected="correctDefinitions.some(correctDefinition => correctDefinition === definition.playerSocketId)" />
      </div>
    </div>
    <div class="instruction">Keskeytä kierros, jos vähintään kaksi (oikeaa tai keksittyä) määritelmää ovat keskenään samoja</div>
    <div class="buttons">
        <Button text="Keskeytä kierros" :onClick="abortRound" />
        <Button text="Jatka äänestykseen" :onClick="continueToVote" :disabled="!canContinue" />
    </div>
</div>
</template>

<style scoped lang="scss">

.title {
  font-size: 1.2em;
  margin-bottom: 0.5em;
}

.instruction {
  font-style: italic;
}

.validate-definitions {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        margin: 1.4em 0.5em;
    }
}

.definitions {
  .definition + .definition {
    margin-top: 0.4em;
  }

  margin-bottom: 3em;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

</style>
