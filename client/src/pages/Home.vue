<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import Divider from '../components/Divider.vue';
import { GameService } from '../services/GameService';

const props = defineProps({
  socket: Object,
  updateGame: Function,
})


function joinLobby(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }

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
    <form>
      <Input v-model:value="inputValue" label="Aulakoodi" placeholder="1234"/>
      <Button text="Liity" :onClick="joinLobby" submit />
    </form>
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
