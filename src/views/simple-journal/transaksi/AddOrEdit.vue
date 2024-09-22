<template>
  <!-- Toggle for Transaction Type (Penerimaan / Pengeluaran) -->
  <!-- <div class="flex flex-wrap items-center gap-3">
    <toggle :modelValue="isIncome" @update:modelValue="toggleHandle" />
    <h1 class="text-lg font-semibold">
      {{ transactionType }}
    </h1>
  </div> -->
  <!-- FormKit Form -->
  <FormKit
    type="form"
    v-model="form"
    :actions="false"
    @submit="submitForm"
    :validation-schema="validationSchema"
    class="p-4 space-y-4 bg-white rounded-lg shadow-md"
  >
    <Tabs class="w-full" v-model="transactionType">
      <TabsList class="w-full">
        <TabsTrigger class="w-full" value="Penerimaan">
          Penerimaan
        </TabsTrigger>
        <TabsTrigger class="w-full" value="Pengeluaran">
          Pengeluaran
        </TabsTrigger>
      </TabsList>
      <TabsContent :value="transactionType">
        <!-- Category Select -->
        <FormKit
          :type="vueSelect"
          label="Category"
          name="category"
          :value="selectedCategory"
          :options="categoryOptions"
          :validation="'required'"
        />
      </TabsContent>
    </Tabs>

    <!-- Description -->
    <FormKit
      type="text"
      label="Description"
      name="description"
      :validation="'required'"
      input-class="w-full"
      label-class="text-sm font-semibold text-gray-600"
      validation-label-class="text-xs text-red-500"
    />

    <!-- Amount -->
    <FormKit
      type="number"
      label="Amount"
      name="amount"
      :validation="'required|number'"
      input-class="w-full"
      label-class="text-sm font-semibold text-gray-600"
      validation-label-class="text-xs text-red-500"
    />

    <!-- Date -->
    <FormKit
      type="date"
      label="Date"
      name="date"
      :validation="'required|date'"
      input-class="w-full"
      label-class="text-sm font-semibold text-gray-600"
      validation-label-class="text-xs text-red-500"
    />

    <!-- File Upload -->
    <FormKit
      type="file"
      name="image"
      label="Image"
      input-class="w-full"
      label-class="text-sm font-semibold text-gray-600"
    />

    <!-- Buttons -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-700"
        @click="emitCloseModal"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  </FormKit>
</template>

<script lang="ts" setup>
import { FormKit, createInput } from '@formkit/vue';
import { onMounted, ref, watch } from 'vue';
import * as yup from 'yup';
// import toggle from '@/components/atoms/toggle.vue';
import { getAllCategories } from '@/service/appsheetService';
import 'vue-select/dist/vue-select.css'; // Import gaya vue-select
import vSelect from '@/components/forms/vue-select.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TransactionFormData {
  description: string;
  category: { label: string; value: string };
  date: string; // Use Date type if needed
  amount: number;
  image: File | null;
}

interface Options {
  label: string;
  value: string;
}

type Category = { type: string; category: string; id: string };

const props = defineProps({
  selectedTransaction: {
    type: Object,
    default: null,
  },
});

const transactionType = ref(
  props.selectedTransaction ? props.selectedTransaction.type : 'Pengeluaran'
);

const categories = ref([]);
const categoryOptions = ref();
const selectedCategory = ref<{ label: string; value: string }>({
  label: '',
  value: '',
});

const vueSelect = createInput(vSelect, {
  props: ['options', 'value'],
});

const form = ref({
  description: '',
  category: { label: '', value: '' },
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  image: null,
});

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
  value: yup.number().required('Value is required'),
  dateTransaction: yup.date().required('Date is required'),
  categoryId: yup.string().required('Category is required'),
  photoUpload: yup.mixed().required('Photo is required'),
});

// Emit setup
const emit = defineEmits([
  'closeModal',
  'updateTransaction',
  'createTransaction',
]);

const filterCatOptions = (type: string) =>
  categories.value
    .filter((item: Category) => item.type === type)
    .map((category: Category) => ({
      label: category.category,
      value: category.id,
    }));

let expendCategories: { label: string; value: string }[],
  incomeCategories: { label: string; value: string }[];

async function getCategories() {
  try {
    const response = await getAllCategories(); // get categories by type
    categories.value = response.data;

    expendCategories = filterCatOptions('Pengeluaran');
    incomeCategories = filterCatOptions('Penerimaan');
    console.log(expendCategories);
    console.log(incomeCategories);
  } catch (error) {
    console.error('Error fetching categories', error);
  }
}

watch(transactionType, (newValue: string) => {
  categoryOptions.value =
    newValue === 'Penerimaan' ? incomeCategories : expendCategories;
});

onMounted(async () => {
  await getCategories();
  if (props.selectedTransaction) {
    const existTransaction = props.selectedTransaction;
    transactionType.value = existTransaction.type;
    const existOptions =
      transactionType.value === 'Penerimaan'
        ? incomeCategories
        : expendCategories;
    const category: Options = existOptions.find(
      ({ value }: Options) => value === existTransaction.categoryId
    ) || { value: '', label: '' };
    form.value = {
      description: existTransaction.activity || '',
      amount: existTransaction.amount || 0, // Convert to string if needed
      date: existTransaction.dtTransaction
        ? new Date(existTransaction.dtTransaction).toISOString().split('T')[0]
        : '', // Format date as string
      category,
      image: null,
    };
  }
});
// Method to submit the form
const submitForm = () => {
  const transactionData: TransactionFormData = form.value;
  const dataOut = {
    activity: transactionData.description,
    categoryId: transactionData.category.value,
    dtTransaction: transactionData.date,
    value: transactionData.amount,
    file: Array.isArray(transactionData.image)
      ? transactionData.image[0].file
      : null,
  };
  console.log(transactionData.image);
  console.log(dataOut);
  if (props.selectedTransaction)
    emit('updateTransaction', {
      id: props.selectedTransaction.id,
      updatedData: dataOut,
    });
  else emit('createTransaction', dataOut);
  emitCloseModal();
};

// Emit closeModal event
const emitCloseModal = () => {
  emit('closeModal');
};
</script>
<style></style>
