<script setup>

defineProps({
    value: String,
    label: String,
    placeholder: String,
    disabled: Boolean
})

defineEmits(['update:value'])

</script>

<template>
<div class="textarea">
    <div class="label">{{ label }}</div>
        <textarea 
            type="text" 
            :value="value" 
            @input="$emit('update:value', $event.target.value)" 
            v-bind:placeholder="placeholder"
            :disabled="disabled"
        />
    </div>
</template>

<style scoped lang="scss">

.textarea {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.label {
    padding-left: 0.75em;
    margin: 0.5em 0;
}

textarea {
    border: 2px solid #000;
    border-radius: 5px;
    min-height: 3em;
    line-height: normal;
    color: #282828;
    display: block;
    width: 100%;
    box-sizing: border-box;
    user-select: auto;
    font-size: 16px;
    padding: 0.75em;
    resize: vertical;

    :focus{
        border: 3px solid #5551ff;
    }       
}

</style>