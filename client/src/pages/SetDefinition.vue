<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';
import TextArea from '../components/TextArea.vue';
import { isBluff } from '../helpers/isBluff';

const props = defineProps({
  socket: Object,
  updateGame: Function,
  game: Object
})

const definitionSaved = ref(false);


function setDefinition(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }

  GameService.setDefinition(props.socket.id, inputValue.value.toString())
  .then(game => {
    console.log('Set definition', game);

    definitionSaved.value = true;
    inputValue.value = '********';
    props.updateGame(game);
  });
}

const inputValue = ref('');
const label = (isBluff(props.socket, props.game) ? 'Kirjoita oikea määritelmä sanalle ' : 'Kirjoita oikea tai keksitty määritelmä sanalle ') + `<span class="word">${props.game.word}</span>`;

</script>

<template>
<div class="select-name">
  <form>
    <TextArea v-model:value.trim="inputValue" :label="label" placeholder="Sana" :disabled="definitionSaved" />
    <Button text="Lähetä" :onClick="setDefinition" :disabled="definitionSaved" submit />
  </form>
  <div v-if="definitionSaved">Määritelmäsi on tallennettu!</div>
</div>
</template>

<style lang="scss">

.word {
  color: #3369ff;
  font-weight: bold;
}

.select-name {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        margin-top: 1em;
    }
}

</style>
