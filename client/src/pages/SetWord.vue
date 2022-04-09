<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
})


function setWord(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }

  GameService.setWord(props.socket.id, inputValue.value.toString())
  .then(game => {
    console.log('Set word', game);

    props.updateGame(game);
  });
}

const inputValue = ref('');

</script>

<template>
<div class="select-name">
  <form>
    <Input v-model:value="inputValue" label="Kirjoita sana" placeholder="Sana"/>
    <Button text="Lähetä" :onClick="setWord" submit />
  </form>
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
