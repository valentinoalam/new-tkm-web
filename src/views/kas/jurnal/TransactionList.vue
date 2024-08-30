<template>
  <div class="container p-4 mx-auto">
    <!-- Transaction Table -->
    <table class="w-full border-collapse table-auto">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2">Date</th>
          <th class="px-4 py-2">Description</th>
          <th class="px-4 py-2">Amount</th>
          <th class="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td class="px-4 py-2 border">{{ transaction.date }}</td>
          <td class="px-4 py-2 border">{{ transaction.description }}</td>
          <td class="px-4 py-2 border">{{ transaction.amount }}</td>
          <td class="px-4 py-2 border">
            <button
              class="text-blue-600 hover:text-blue-800"
              @click="openModal(transaction)"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add New Transaction Button -->
    <button
      class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
      @click="openModal()"
    >
      Add New Transaction
    </button>

    <!-- Modal Form -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-8 bg-white rounded-lg">
        <h2 class="mb-4 text-2xl">
          {{ selectedTransaction ? 'Edit Transaction' : 'Add New Transaction' }}
        </h2>

        <!-- FormKit Form -->
        <formkit type="form" :actions="false" @submit="submitForm">
          <formkit
            type="text"
            label="Description"
            v-model="form.description"
            :validation="'required'"
          />
          <formkit
            type="number"
            label="Amount"
            v-model="form.amount"
            :validation="'required|number'"
          />
          <formkit
            type="date"
            label="Date"
            v-model="form.date"
            :validation="'required|date'"
          />
          <div class="flex justify-end mt-4">
            <button
              type="button"
              class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-700"
              @click="closeModal"
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
        </formkit>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const transactions = ref([
  { id: 1, date: '2024-08-10', description: 'Groceries', amount: 50 },
  { id: 2, date: '2024-08-11', description: 'Electricity Bill', amount: 100 },
  // Add more transactions as needed
]);

const isModalOpen = ref(false);
const selectedTransaction = ref(null);

const form = ref({
  description: '',
  amount: 0,
  date: '',
});

const openModal = (transaction = null) => {
  selectedTransaction.value = transaction;
  if (transaction) {
    form.value = { ...transaction };
  } else {
    form.value = { description: '', amount: 0, date: '' };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitForm = () => {
  if (selectedTransaction.value) {
    // Update the existing transaction
    const index = transactions.value.findIndex(
      t => t.id === selectedTransaction.value.id
    );
    transactions.value[index] = { ...form.value };
  } else {
    // Add a new transaction
    transactions.value.push({ ...form.value, id: Date.now() });
  }
  closeModal();
};
</script>

<style>
/* Add any additional styling here */
</style>
