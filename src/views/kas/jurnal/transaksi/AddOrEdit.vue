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
      v-model="form.amount"
      :validation="'required|number'"
    />
    <FormKit
      type="date"
      label="Date"
      v-model="form.date"
      :validation="'required|date'"
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

<script name="AddOrEditTransaction" setup>
import { FormKit } from '@formkit/vue';
import { ref, watch } from 'vue';

// Props for the form data and selected transaction
const props = defineProps({
  selectedTransaction: {
    type: Object,
    default: null,
  },
  transactions: {
    type: Array,
    required: true,
  },
});

// Emit function for closing the modal
const emit = defineEmits(['closeModal']);

// Reactive form data
const form = ref({ description: '', amount: 0, date: '' });

// Watcher to populate the form if editing an existing transaction
watch(
  () => props.selectedTransaction,
  newTransaction => {
    if (newTransaction) {
      form.value = { ...newTransaction };
    }
  },
  { immediate: true }
);

// Method to submit the form
const submitForm = () => {
  if (props.selectedTransaction) {
    // Update the existing transaction
    emit('updateTransaction', {
      ...form.value,
      id: props.selectedTransaction.id,
    });
  } else {
    // Add a new transaction
    emit('updateTransaction', { ...form.value, id: Date.now() });
  }
  emitCloseModal();
};

// Emit closeModal event
const emitCloseModal = () => {
  emit('closeModal');
};
</script>
