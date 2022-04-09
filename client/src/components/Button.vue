<script setup>

defineProps({
  text: String,
  onClick: Function,
  submit: Boolean
})

</script>

<template>
  <button :type="submit ? 'submit' : ''" :onclick="onClick">{{ text }}</button>
</template>

<style scoped lang="scss">
button {
    all: unset;

	cursor: pointer;
	display: inline-block;
	padding: 0.7em 1.4em;
	margin: 0 0.3em 0.3em 0;
	border-radius: 0.15em;
	box-sizing: border-box;
	text-decoration: none;
	text-transform: uppercase;
	font-weight: 400;
	color: #ffffff;
	background-color: #3369ff;
	box-shadow: inset 0 -0.6em 0 -0.35em rgba(0, 0, 0, 0.17);
	text-align: center;
	position: relative;
    width: 100%;

	&:active, &:disabled {
		top: 0.1em;
		box-shadow: none;
	}

	&:disabled {
		background-color: lighten(#3369ff, 20%);
		cursor: initial;
	}
}
</style>
