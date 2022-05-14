<script setup>

defineProps({
  game: Object
})

</script>

<template>
    <div class="room-code">
        <span class="grow">Aulan koodi: </span><span class="code">{{game.room}}</span><span class="grow">&nbsp;</span></div>
</template>

<style scoped lang="scss">

.room-code {
    color: lighten(#3369ff, 10%);
    background-color: lighten(#3369ff, 35%);
    padding: 0.4em 1em;
    border-radius: 1rem;
    align-items: center;

    display: flex;
    justify-content: center;

    span {
        flex-grow: 0;
    }
    .grow {
        width: 100%;
        flex-grow: 1;
    }

    .code {
    color: lighten(#3369ff, 100%);
    background-color: lighten(#3369ff, 10%);
    padding: 0.1em 1em;
    border-radius: 1rem;
    }
}

</style>
