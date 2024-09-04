<template>
  <!-- FormKit Form -->
  <FormKit type="form" :actions="false" @submit.prevent="submitForm">
    <FormKit
      type="text"
      label="Description"
      v-model="form.description"
      :validation="'required'"
    />
    <FormKit
      type="number"
      label="Amount"
      v-model="form.amountString"
      :validation="'required|number'"
    />
    <FormKit
      type="date"
      label="Date"
      v-model="form.date"
      :validation="'required|date'"
    />
    <FormKit
      type="file"
      name="image"
      label="Image"
      multiple
      :upload="uploadHandler"
    />
    <div class="flex justify-end mt-4">
      <button
        type="button"
        class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-700"
        @click="emitCloseModal"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  </FormKit>
</template>

<script lang="ts" setup>
import { FormKit } from '@formkit/vue';
import { ref, watch } from 'vue';

const props = defineProps({
  selectedTransaction: {
    type: Object,
    default: null,
  },
});

const form = ref({
  description: '',
  amountString: '',
  date: '',
  image: '',
});

// Emit setup
const emit = defineEmits(['closeModal', 'updateTransaction']);

// File upload handler
const uploadHandler = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    return data.url; // Assuming the API returns the URL of the uploaded image
  }

  throw new Error('File upload failed');
};

// Watcher to populate the form if editing an existing transaction
watch(
  () => props.selectedTransaction,
  newTransaction => {
    console.log(newTransaction);
    if (newTransaction) {
      form.value = {
        description: newTransaction.activity || '',
        amountString: newTransaction.value || '',
        date: newTransaction.dtTransaction || '',
        image: newTransaction.photo || '',
      };
    }
    console.log(form.value);
  },
  { immediate: true }
);

// Method to submit the form
const submitForm = () => {
  const transactionData = {
    description: form.value.description,
    amount: parseFloat(form.value.amountString), // Convert string back to number
    date: form.value.date,
    image: form.value.image,
    id: props.selectedTransaction?.id || Date.now(), // If editing, keep the existing ID; otherwise, generate a new one
  };

  emit('updateTransaction', transactionData);
  emitCloseModal();
};

// Emit closeModal event
const emitCloseModal = () => {
  emit('closeModal');
};
</script>
