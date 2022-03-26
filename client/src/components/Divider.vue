<script setup>
defineProps({
  text: String
})
</script>

<template>
  <div class="divider">
    <hr >
    <span>{{ text }}</span>
    <hr >
  </div>
</template>

<style scoped lang="scss">
.divider {
    display: flex;
}

span {
    padding: 0 0.6em;
	text-transform: uppercase;
}

hr {
    width: 100%;
    border: 0;
    height: 3px;
    background-color: black;
    // background-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
    
}
</style>
