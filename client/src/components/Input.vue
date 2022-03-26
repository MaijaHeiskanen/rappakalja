<script setup>

defineProps({
    value: String,
    label: String,
    placeholder: String
})

defineEmits(['update:value'])

</script>

<template>
<div class="input">
    <div class="label">{{ label }}</div>
        <input 
            type="text" 
            :value="value" 
            @input="$emit('update:value', $event.target.value)" 
            v-bind:placeholder="placeholder"
        />
    </div>
</template>

<style scoped lang="scss">

.input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.label {
    padding-left: 0.75em;
    margin: 0.5em 0;
}

input {
    border: 2px solid #000;
    border-radius: 5px;
    height: 3em;
    line-height: normal;
    color: #282828;
    display: block;
    width: 100%;
    box-sizing: border-box;
    user-select: auto;
    font-size: 16px;
    padding: 0 6px;
    padding-left: 0.75em;

    :focus{
        border: 3px solid #5551ff;
    }       
}

</style>