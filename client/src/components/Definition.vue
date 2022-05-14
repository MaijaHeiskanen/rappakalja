<script setup>
const props = defineProps({
  definition: Object,
  selected: Boolean,
  showPlayer: Boolean,
  showVotes: Boolean,
  canSelect: Boolean,
  select: Function
})

</script>

<template>
  <div :class="[{selected, definition: true}]" v-on:click="() => {if (canSelect) select(definition)}">
      <div class="content">
        <div v-if="showPlayer" class="player-name">{{definition.playerName}}:</div>
        <div class="text">{{definition.definition}}</div>
      </div>
      <div class="votes" v-if="showVotes">
        <span class="vote" v-for="vote in definition.votes">{{vote.playerName}}</span>
      </div>
      <div class="icon" v-if="!showVotes">
          <svg v-if="selected" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>4.Check mark</title><g id="_4.Check_mark" data-name="4.Check mark"><path d="M12,24A12,12,0,1,1,24,12,12.013,12.013,0,0,1,12,24ZM12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Z"/><polygon points="10 17.414 6.293 13.707 7.707 12.293 10 14.586 17.293 7.293 18.707 8.707 10 17.414"/></g></svg>
      </div>
  </div>
</template>

<style scoped lang="scss">
.definition {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0.4em;
  border-radius: 0.4em;
  background-color: #fff;
  border: 2px solid;
  min-height: 2.5em;
  align-items: center;
  gap: 1em;

  &.selected {
      background-color: lighten(#5aba4c, 30%);
      border-color: #5aba4c;
  }

  .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      flex-grow: 1;
  }

  .player-name {
      font-size: 0.9rem;
      margin-bottom: 0.4em;
  }

  .icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 0;
      border-radius: 100%;
      width: 30px;
  }

  .votes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex-grow: 0;
    gap: 0.2em;

    .vote {
      padding: 0.2em 0.4em;
      border-radius: 1em;
      background-color: rgba($color: darken(#3369ff, 10%), $alpha: 0.5);
      color: lighten(#ffffff, 37%);

    }
  }
}

svg {
  fill: #5aba4c;
  flex-grow: 1;
}

</style>
