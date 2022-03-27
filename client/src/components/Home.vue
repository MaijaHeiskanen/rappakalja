<script setup>
import { ref } from 'vue';
import Button from './Button.vue';
import Input from './Input.vue';
import Divider from './Divider.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
})


function joinLobby() {
  GameService.joinRoom(props.socket.id, inputValue.value.toString())
  .then(game => {
    console.log('Joined room', game);

    props.updateGame(game);
  });
}

function createLobby() {
  GameService.createRoom(props.socket.id).then(game => {
    console.log('Created room', game);

    props.updateGame(game);
  });
}

const inputValue = ref('');

</script>

<template>
<div class="home">
  <Button text="Luo aula" :onClick="createLobby" />
  <Divider class="spacing" text="Tai" />
  <div class="section">
    <Input v-model:value="inputValue" label="Aulakoodi" placeholder="1234"/>
    <Button text="Liity" :onClick="joinLobby" />
  </div>
</div>
</template>

<style scoped lang="scss">

.home {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .section {
        button {
            margin-top: 1em;
        }
    }

    .spacing {
        margin: 3em 0;
    }
}

</style>
