<template>
  <!-- FormKit Form -->
  <FormKit type="form" :actions="false" @submit.prevent="submitForm">
    <div class="flex gap-5">
      <!-- Toggle for Transaction Type (Penerimaan / Pengeluaran) -->
      <toggle :modelValue="isIncome" @update:modelValue="toggleHandle" />
      <!-- Conditional text based on the toggle state -->
      <h1 class="text-xl font-bold toggle-text">
        {{ form.transactionType }}
      </h1>
    </div>

    <!-- Select for Category Fetched from API -->
    <FormKit
      type="select"
      label="Category"
      :v-model="selectedCategoryId"
      :options="categoriesSelectItems"
      :validation="'required'"
    />
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
import { onMounted, ref, watch } from 'vue';
import toggle from '@/components/atoms/toggle.vue';
import { getAllCategories } from '@/service/appsheetService';

const props = defineProps({
  selectedTransaction: {
    type: Object,
    default: null,
  },
});

const form = ref({
  description: '',
  amountString: '',
  date: new Date().toISOString().split('T')[0],
  transactionType: 'Pengeluaran',
  categoryId: '',
  image: '',
});

const selectedCategoryId = ref('');
const categories = ref([]);
const categoriesSelectItems = ref([]);
const isIncome = ref(false);
// Emit setup
const emit = defineEmits([
  'closeModal',
  'updateTransaction',
  'createTransaction',
]);

const toggleHandle = (selected: boolean) => {
  isIncome.value = selected;
  form.value.transactionType = isIncome.value ? 'Penerimaan' : 'Pengeluaran';
  categoriesSelectItems.value = categories.value
    .filter(item => item.type === form.value.transactionType)
    .map(category => ({
      label: category.category, // Category name
      value: category.id, // Category ID
    }));
};

async function getCategories() {
  try {
    const response = await getAllCategories(); // get categories by type

    categories.value = response.data;
    console.log(categories.value);
    categoriesSelectItems.value = categories.value
      .filter(
        (item: { type: string }) => item.type === form.value.transactionType
      )
      .map((category: { category: string; id: string }) => ({
        label: category.category, // Nama kategori
        value: category.id, // ID kategori
      }));
  } catch (error) {
    console.error('Error fetching categories', error);
  }
}
console.log(form.value.transactionType);
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
    if (newTransaction) {
      form.value = {
        description: newTransaction.activity || '',
        transactionType: newTransaction.type || '',
        amountString: newTransaction.value || '',
        date: newTransaction.dtTransaction || '',
        image: newTransaction.photo || '',
        categoryId: newTransaction.categoryId || '',
      };
    }
  },
  { immediate: true }
);

onMounted(async () => {
  getCategories();
  console.log(form.value.date);
});
// Method to submit the form
const submitForm = () => {
  const transactionData = {
    activity: form.value.description,
    value: parseFloat(form.value.amountString), // Convert string back to number
    dtTransaction: form.value.date,
    file: form.value.image,
    categoryId: form.value.categoryId,
    id: props.selectedTransaction?.id || Date.now(), // If editing, keep the existing ID; otherwise, generate a new one
  };
  if (props.selectedTransaction) emit('updateTransaction', transactionData);
  else emit('createTransaction', transactionData);
  emitCloseModal();
};

// Emit closeModal event
const emitCloseModal = () => {
  emit('closeModal');
};
</script>
