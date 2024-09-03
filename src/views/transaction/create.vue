<template>
  <formkit-dialog v-model="isOpen" title="Create Transaction">
    <formkit
      type="form"
      @submit="handleSubmit"
      :validation-schema="validationSchema"
      v-slot="{ submit, reset }"
    >
      <formkit-input
        name="description"
        label="Description"
        placeholder="Enter description..."
      />
      <formkit-input
        name="value"
        label="Value"
        type="number"
        placeholder="Enter value..."
      />
      <formkit-input name="dateTransaction" label="Date" type="date" />
      <formkit-select
        name="categoryId"
        label="Category"
        :options="categoryOptions"
      />
      <formkit-file name="photoUpload" label="Upload Photo" />

      <div class="flex justify-end mt-4">
        <button type="button" @click="reset" class="btn-cancel">Cancel</button>
        <button type="submit" @click="submit" class="btn-submit">Submit</button>
      </div>
    </formkit>
  </formkit-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { yup } from 'yup';
import { useTransactionApi } from '@/api/transactionApi';

const isOpen = ref(false);
const { createTransaction } = useTransactionApi();
const categoryOptions = ref([
  { value: '1', label: 'Category 1' } /* your options */,
]);

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
  value: yup.number().required('Value is required'),
  dateTransaction: yup.date().required('Date is required'),
  categoryId: yup.string().required('Category is required'),
  photoUpload: yup.mixed().required('Photo is required'),
});

const handleSubmit = values => {
  createTransaction(values).then(() => {
    // handle success
    isOpen.value = false;
  });
};
</script>

<style scoped>
.btn-cancel {
  /* your styles */
}
.btn-submit {
  /* your styles */
}
</style>
