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

const skipVote = ref(props.game.correctDefinitions.some(d => d.playerSocketId === props.socket.id));
const playerIsBluff = ref(isBluff(props.socket, props.game));
const selectedDefinitionId = ref(null);
const voted = ref(false);
const errorMessage = ref('');

function voteDefinition() {
  GameService.vote(props.socket.id, selectedDefinitionId.value)
  .then(game => {
    console.log('Definition voted', game);

    voted.value = true;
    props.updateGame(game);
  }).catch(err => {
    errorMessage.value = err.message;
    voted.value = false;
  });
}

function selectDefinition(definition) {
  errorMessage.value = '';

  if (selectedDefinitionId.value === definition.id) {
    selectedDefinitionId.value = null;

    return;
  }

  selectedDefinitionId.value = definition.id;
}

</script>

<template>
<div class="choose-definition">
  <h2 v-if="skipVote" class="title">Määritelmäsi oli oikein! Muut koittavat arvata näistä oikean määritelmän sanalle <span class="word">{{game.word}}</span>:</h2>
  <h2 v-else-if="playerIsBluff" class="title">Muut pelaajat koittavat arvata, mikä näistä on oikea määritelmä sanalle <span class="word">{{game.word}}</span>:</h2>
  <h2 v-else-if="!skipVote" class="title">Valitse oikea määritelmä sanalle <span class="word">{{game.word}}</span>:</h2>
  <div class="definitions">
    <div class="definition" v-for="definition in game.allDefinitions">
      <Definition :definition="definition" :showPlayer="false" :canSelect="!skipVote && !voted && !playerIsBluff" :select="selectDefinition" :selected="selectedDefinitionId === definition.id" />
    </div>
  </div>
  <div class="instruction" v-if="skipVote || playerIsBluff">Odotetaan muita pelaajia...</div>
  <Button v-if="!skipVote && !playerIsBluff" text="Vahvista valinta" :onClick="voteDefinition" :disabled="!selectedDefinitionId || voted" />
  <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
  <div v-if="voted">Valintasi on tallennettu!</div>
    
</div>
</template>

<style scoped lang="scss">

.word {
  color: #3369ff;
}

.title {
  font-size: 1.2em;
  margin-bottom: 0.5em;
}

.instruction {
  font-style: italic;
}

.choose-definition {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        margin: 1.4em 0.5em;
    }
}

.error {
  color: darkred;
}

.definitions {
  margin-bottom: 1.4em;

  .definition + .definition {
    margin-top: 0.4em;
  }

  margin-bottom: 3em;
}

</style>
