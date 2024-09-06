<template>
  <div class="mt-4">
    <div
      class="w-full max-w-sm overflow-hidden bg-white border rounded-md shadow-md"
    >
      <div class="p-4">
        <!-- Color Picker -->
        <div class="flex gap-5 mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Pick a color
          </label>
          <ColorPicker
            v-model:pureColor="selectedColor"
            format="hex"
            shape="circle"
          />
        </div>

        <!-- Text Input -->
        <div class="flex mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Ganti Nama
          </label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            :placeholder="categoryName"
            v-model="textInput"
          />
        </div>

        <!-- Display the selected color and input text -->
        <div class="mt-4">
          <span
            class="inline-flex items-center justify-center px-1 py-1 leading-none text-white min-h-6 min-w-28 rounded-3xl font-extralight dark:border-neutral-200 dark:text-white"
            :style="{ backgroundColor: selectedColor }"
          >
            {{ textInput || categoryName }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between px-5 py-3">
        <button
          onclick="handleClose"
          class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Cancel
        </button>
        <button
          class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { ColorInputWithoutInstance } from 'tinycolor2';
import { ref, watch } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
});
const selectedColor = ref(props.color);
const textInput = ref('');
console.log(props.id);
watch(
  () => selectedColor,
  newColor => console.log(newColor)
);
const emit = defineEmits(['updateCategory']);
// function onSubmit() {
//   emit('updateCategory', props.id, selectedColor);
// }
</script>

<style></style>
