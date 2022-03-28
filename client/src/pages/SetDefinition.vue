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


function setDefinition() {
  GameService.setDefinition(props.socket.id, inputValue.value.toString())
  .then(game => {
    console.log('Set definition', game);

    definitionSaved.value = true;
    props.updateGame(game);
  });
}

const inputValue = ref('');
const label = isBluff(props.socket, props.game) ? 'Kirjoita oikea määritelmä sanalle ' + props.game.word : 'Kirjoita oikea tai keksitty määritelmä sanalle ' + props.game.word

</script>

<template>
<div class="select-name">
    <TextArea v-model:value="inputValue" :label="label" placeholder="Sana" :disabled="definitionSaved" />
    <Button text="Lähetä" :onClick="setDefinition" :disabled="definitionSaved" />
    <div v-if="definitionSaved">Määritelmäsi on tallennettu!</div>
</div>
</template>

<style scoped lang="scss">

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
