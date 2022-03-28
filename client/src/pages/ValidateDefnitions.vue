<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
  game: Object
})

const canContinue = ref(true);


function setDefinition() {
  GameService.setDefinition(props.socket.id, inputValue.value.toString())
  .then(game => {
    console.log('Set definition', game);

    definitionSaved.value = true;
    props.updateGame(game);
  });
}

</script>

<template>
<div class="validate-definitions">
    <div>Keskeytä kierros, jos vähintään kaksi (oikeaa tai keksittyä) määritelmää ovat keskenään samoja</div>
    <div class="buttons">
        <Button text="Keskeytä kierros" :onClick="setDefinition" />
        <Button text="Jatka äänestykseen" :onClick="setDefinition" :disabled="!canContinue" />
    </div>
</div>
</template>

<style scoped lang="scss">

.validate-definitions {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        margin: 1em 0.5em;
    }
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

</style>
