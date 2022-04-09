<script setup>
const props = defineProps({
  text: String,
})
</script>

<template>
  <div class="instruction">
      {{text}}
  </div>
</template>

<style scoped lang="scss">


.instruction {
  font-style: italic;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
