<script setup>
const props = defineProps({
  definition: Object,
  selected: Boolean,
  showPlayer: Boolean,
  canSelect: Boolean,
  select: Function
})

const checkIconSrc = './check.svg';

</script>

<template>
  <div :class="[definition, {selected}]" v-on:click="() => {if (canSelect) select(definition)}">
      <div class="content">
        <div v-if="showPlayer" class="player-name">{{definition.playerName}}:</div>
        <div class="text">{{definition.definition}}</div>
      </div>
      <div class="icon">
          <svg v-if="selected" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>4.Check mark</title><g id="_4.Check_mark" data-name="4.Check mark"><path d="M12,24A12,12,0,1,1,24,12,12.013,12.013,0,0,1,12,24ZM12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Z"/><polygon points="10 17.414 6.293 13.707 7.707 12.293 10 14.586 17.293 7.293 18.707 8.707 10 17.414"/></g></svg>
      </div>
  </div>
</template>

<style scoped lang="scss">
.definition {
    display: flex;
    flex-direction: row;
    padding: 0.4em;
    border-radius: 0.4em;
    background-color: #fff;
    border: 2px solid;
    min-height: 2.5em;
    align-items: center;

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
}

svg {
  fill: #5aba4c;
  flex-grow: 1;
}

</style>
