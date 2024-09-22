<script setup>
import { defineProps, ref, watch } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const props = defineProps({
  context: Object,
});

// Extract options and initial value from context
const options = ref(props.context.options);
const selectedValue = ref(props.context._value);

// Watch for changes in the context value to update the selected value
watch(
  () => props.context._value,
  newValue => {
    selectedValue.value = newValue;
  }
);

// Watch for changes in the options to update the options reference
watch(
  () => props.context.options,
  newOptions => {
    options.value = newOptions;
  }
);
// Function to handle value change
function handleChange(value) {
  console.log(value);
  selectedValue.value = value; // Update local state
  props.context.node.input(value); // Emit input to FormKit
}
</script>

<template>
  <v-select
    :options="options"
    v-model="selectedValue"
    @option:selecting="handleChange"
    class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  />
</template>

<style scoped>
/* Add any additional styling here if needed */
</style>
