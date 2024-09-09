<template>
    <input ref="flatpickrInput" :value="flatpickrValue" @input="onInputValue">
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import flatpickr from 'flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';

export default {
    props: {
        modelValue: String,
        format: {
            type: String,
            default: 'Y-m-d',
        },
    },
    setup(props, { emit }) {
        const flatpickrInput = ref(null);
        const flatpickrValue = ref(props.modelValue);

        const onInputValue = () => {
            const value = event.target.value;
            flatpickrValue.value = value;
            emit('update:modelValue', value);
        };

        onMounted(() => {
            flatpickr(flatpickrInput.value, {
                dateFormat: props.format,
                allowInput: true,
                locale: Japanese,
                onChange: (selected, value) => {
                    flatpickrValue.value = value;
                    emit('update:modelValue', value);
                },
            });
        });

        watch(() => props.modelValue, (value) => {
            flatpickrValue.value = value;
        });

        return {
            flatpickrInput,
            flatpickrValue,
            onInputValue,
        };
    },
};
</script>

<style>
.flatpickr-calendar {
  font-family: 'Roboto';
  font-size: 0.75rem !important;
}

.flatpickr-calendar .flatpickr-innerContainer .flatpickr-weekdays .flatpickr-weekday:nth-child(7n + 1),
.flatpickr-calendar .flatpickr-innerContainer .flatpickr-days .flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay):nth-child(7n + 1) {
    color: red;
}

.flatpickr-calendar .flatpickr-innerContainer .flatpickr-weekdays .flatpickr-weekday:nth-child(7),
.flatpickr-calendar .flatpickr-innerContainer .flatpickr-days .flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay):nth-child(7n) {
    color: blue;
}
</style>