<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
})


function setName() {
  GameService.setName(props.socket.id, inputValue.value.toString())
  .then(game => {
    console.log('Set name', game);

    props.updateGame(game);
  });
}

const inputValue = ref('');

</script>

<template>
<div class="select-name">
    <Input v-model:value="inputValue" label="Nimi" placeholder="Nimi"/>
    <Button text="Lähetä" :onClick="setName" />
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
