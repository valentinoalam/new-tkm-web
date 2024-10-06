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
    :classes="{
      form: 'p-4 space-y-4 gap-x-px bg-blue-50 flex flex-wrap justify-between rounded-lg shadow-md',
      help: {
        'bg-red-500': true,
      },
    }"
    class=""
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
          v-model="selectedCategory"
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
      :classes="{
        outer: 'basis-full flex-1',
        help: {
          'bg-red-500': true,
        },
      }"
    />

    <!-- Amount -->
    <FormKit
      type="number"
      :label="`Amount: [${formatCurrency(form.amount)}]`"
      name="amount"
      @input="trimLeadingZeros"
      input-class="w-full"
      label-class="text-sm font-semibold text-gray-600"
      validation-label-class="text-xs text-red-500"
      :classes="{
        outer: 'basis-2/5 shrink flex-0',
        help: {
          'bg-red-500': true,
        },
      }"
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
      :classes="{
        outer: 'basis-2/5',
        help: {
          'bg-red-500': true,
        },
      }"
    />

    <!-- File Upload -->
    <FormKit
      v-if="!props.selectedTransaction"
      type="file"
      name="image"
      label="Image"
      input-class="w-full"
      label-class="text-sm font-semibold text-gray-600"
    />

    <!-- Buttons -->
    <div class="flex items-end justify-end">
      <div class="content-end h-12 space-x-3">
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
    </div>
  </FormKit>
</template>

<script lang="ts" setup>
import { FormKit, createInput } from '@formkit/vue';
import { FormKitNode } from '@formkit/core';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as yup from 'yup';
// import toggle from '@/components/atoms/toggle.vue';
import { getAllCategories } from '@/service/appsheetService';
import 'vue-select/dist/vue-select.css'; // Import gaya vue-select
import vSelect from '@/components/forms/vue-select.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageData {
  file: File; // Assuming each image object has a 'file' property of type File
}
interface TransactionFormData {
  description: string;
  category: { label: string; value: string };
  date: string; // Use Date type if needed
  amount: number;
  image: ImageData[] | null;
}

interface Options {
  label: string;
  value: string;
}

type Category = { type: string; category: string; id: string };
type DataOut = {
  [key: string]: string | number | boolean | File | null;
};
const props = defineProps({
  selectedTransaction: {
    type: Object,
    default: null,
  },
});

const vueSelect = createInput(vSelect, {
  props: ['options', 'value'],
});

const formDefault = {
  description: '',
  category: { label: '', value: '' },
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  image: null,
};
const form = ref(formDefault);

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
    categoryOptions.value =
      transactionType.value === 'Penerimaan'
        ? incomeCategories
        : expendCategories;
  } catch (error) {
    console.error('Error fetching categories', error);
  }
}

function trimLeadingZeros(value: string | undefined, node: FormKitNode) {
  node.input(Number(value));
}
function formatCurrency(value: number) {
  if (!value) return '';
  const numericValue = value.toString();

  // Split the numeric value into whole and decimal parts
  const wholePart = numericValue.split('.')[0];
  const decimalPart = numericValue.split('.')[1] || '';

  // Format the whole part with commas
  const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // Combine whole part with decimal part
  const formattedValue = `Rp ${formattedWhole}${decimalPart ? ',' + decimalPart : ''}`;
  return formattedValue;
}

const transactionType = ref(
  props.selectedTransaction ? props.selectedTransaction.type : 'Pengeluaran'
);

const categories = ref([]);
const categoryOptions = ref();
const selectedCategory = ref<{ label: string; value: string }>({
  label: '',
  value: '',
});
const lastSelectedExpendCategory = ref<{ label: string; value: string }>({
  label: '',
  value: '',
});
const lastSelectedIncomeCategory = ref<{ label: string; value: string }>({
  label: '',
  value: '',
});

watch(
  () => selectedCategory.value,
  currentSelected => {
    if (transactionType.value === 'Pengeluaran') {
      lastSelectedExpendCategory.value = { ...currentSelected };
    } else {
      lastSelectedIncomeCategory.value = { ...currentSelected };
    }
  }
);
watch(
  () => transactionType.value,
  inTransactionType => {
    if (inTransactionType === 'Pengeluaran') {
      if (lastSelectedExpendCategory.value)
        selectedCategory.value = lastSelectedExpendCategory.value;
    } else {
      if (lastSelectedIncomeCategory.value)
        selectedCategory.value = lastSelectedIncomeCategory.value;
    }
  }
);

watch(transactionType, (newValue: string) => {
  categoryOptions.value =
    newValue === 'Penerimaan' ? incomeCategories : expendCategories;
});

onMounted(async () => {
  form.value = formDefault;
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
onUnmounted(() => {
  form.value = formDefault;
  emitCloseModal();
});

// Method to submit the form
const submitForm = () => {
  const transactionData: TransactionFormData = form.value;

  if (props.selectedTransaction) {
    const dataOut: DataOut = {};
    if (transactionData.description !== props.selectedTransaction.activity)
      dataOut.activity = transactionData.description;
    if (transactionData.category.value !== props.selectedTransaction.categoryId)
      dataOut.categoryId = transactionData.category.value;
    if (transactionData.amount !== props.selectedTransaction.value) {
      dataOut.value = transactionData.amount;
    }
    if (
      transactionData.date !==
      new Date(props.selectedTransaction.dtTransaction)
        .toISOString()
        .split('T')[0]
    )
      dataOut.dtTransaction = new Date(transactionData.date)
        .toISOString()
        .split('T')[0];
    emit('updateTransaction', {
      id: props.selectedTransaction.id,
      updatedData: dataOut,
    });
  } else {
    const dataOut: DataOut = {
      activity: transactionData.description,
      categoryId: transactionData.category.value,
      dtTransaction: new Date(transactionData.date).toISOString().split('T')[0],
      value: transactionData.amount,
    };
    if (transactionData.image && transactionData.image.length)
      dataOut.file = Array.isArray(transactionData.image)
        ? (transactionData.image[0].file as File)
        : null;
    emit('createTransaction', dataOut);
  }
  emitCloseModal();
};

// Emit closeModal event
const emitCloseModal = () => {
  emit('closeModal');
};
</script>
<style></style>
