<script setup>
const props = defineProps({
  definition: Object,
  selected: Boolean,
  showPlayer: Boolean,
  canSelect: Boolean,
  select: Function
})

</script>

<template>
  <div :class="[definition, {selected}]" v-on:click="() => {if (canSelect) select(definition)}">
      <div class="content">
        <div v-if="showPlayer" class="player-name">{{definition.playerName}}:</div>
        <div class="text">{{definition.definition}}</div>
      </div>
      <div class="action-button">
          
      </div>
  </div>
</template>

<style scoped lang="scss">
.definition {
    display: flex;
    flex-direction: row;
    padding: 0.4em;
    border-radius: 0.2em;
    background-color: #fafafa;
    border: 1px solid #e0e0e0;

    &.selected {
        background-color: green;
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

    .action-button {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 0;
        border-radius: 100%;
        background-color: gray;
        width: 30px;
        height: 30px;
    }
}
</style>
