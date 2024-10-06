<template>
  <div>
    <!-- Loading Spinner -->
    <div
      ref="parentElement"
      v-if="isLoading"
      class="flex items-center justify-center w-full h-full"
    >
      <looping-rhombuses-spinner
        :animation-duration="2500"
        :rhombus-size="15"
        color="#CAFFBF"
      />
    </div>

    <div v-else>
      <!-- Transaction Table -->
      <Table
        :data="transactions"
        :columns="columns"
        :getRowClass="getRowClass"
        :buttonName="'New Entry'"
        :totalRecords="totalRecords"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        @fetchPage="handlePageChange"
        @changePageSize="handlePageSizeChange"
        @fetchData="handleDateRange"
        @create="onCreate"
        @edit="onEdit"
        @delete="onDelete"
        @search="handleSearch"
        @editCategory="onEditCategory"
      />

      <!-- Dynamic Modal Content -->
      <div
        v-if="isVisible()"
        ref="menu"
        class="absolute top-0 bottom-0 left-0 right-0 z-50 w-full py-4 overflow-y-auto bg-white rounded-lg h-max lg:w-1/2"
      >
        <!-- Transaction Modal -->
        <div v-if="currentModalContent === ModalContent[1]">
          <h2 class="px-2 mb-4 text-2xl">
            {{ selectedTransaction ? 'Edit Transaction' : 'Add Transaction' }}
          </h2>
          <div class="px-4 pb-1">
            <AddOrEditTransaction
              :selectedTransaction="selectedTransaction"
              @closeModal="closeModal"
              @updateTransaction="handleUpdateTransaction"
              @createTransaction="handleCreateTransaction"
            />
          </div>
        </div>
        <!-- Edit Category Modal -->
        <EditCategory
          v-else-if="currentModalContent === ModalContent[2]"
          :id="selectedCategory"
          :color="categoryColor"
          :category-name="categoryName"
          @update-category="handleUpdateCategory"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// import/no-extraneous-dependencies
// import chroma from 'chroma-js';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import Swal from 'sweetalert2';
import { onMounted, ref, inject, useTemplateRef } from 'vue';
import EditCategory from '../kategori/EditCategory.vue';
// import FinancialReport from '../laporan/FinancialReport.vue';
import AddOrEditTransaction from './AddOrEdit.vue';
import columns, { getRowClass } from './colDef';
import Table from '@/components/Table.vue';
import {
  getAllTransactions,
  deleteTransactionById,
  createTransaction,
  updateTransactionById,
  updateCategoryById,
} from '@/service/appsheetService';
import { useBackdrop } from '@/composables/useBackdrop';

const { isVisible, menu, show, hide } = useBackdrop();
menu.value = useTemplateRef('menu');
const isLoading = ref(false);
const transactions = ref({}); // Transactions data from API
const currentModalContent = ref(''); // Controls modal visibility
const selectedTransaction = ref(null); // Selected transaction for editing
const selectedCategory = ref(null);
const pageSize = ref(10);
const currentPage = ref(1);
const totalRecords = ref(0);
const totalPages = ref(0);
const categoryName = ref('');
const categoryColor = ref('');
const search = ref('');
const ModalContent = ['none', 'transaction', 'category'];
const parentElement = ref(null);

async function handleDateRange(dtStart, dtEnd) {
  await fetchTransactions(dtStart, dtEnd);
}

// Fetch transactions from API
const fetchTransactions = async (dtStart = null, dtEnd = null) => {
  try {
    let response;
    response = await getAllTransactions({
      startDate: dtStart,
      endDate: dtEnd,
      page: currentPage.value,
      limit: pageSize.value,
      search: search.value,
    });
    transactions.value = response.data;
    totalRecords.value = response.totalRecords;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

const handlePageChange = async newPage => {
  currentPage.value = newPage;
  await fetchTransactions();
};

const handlePageSizeChange = async newPageSize => {
  pageSize.value = newPageSize;
  await fetchTransactions();
};

const handleUpdateCategory = async data => {
  if (!data) return closeModal();
  const { id, color, name } = data;
  await updateCategoryById(id, { color, name });
  closeModal();
  await fetchTransactions();
};

const handleSearch = async query => {
  search.value = query;
  currentPage.value = 1;
  await fetchTransactions();
};
const handleCreateTransaction = async data => {
  await createTransaction(data);
  await fetchTransactions();
};
const handleUpdateTransaction = async ({ id, updatedData }) => {
  await updateTransactionById(id, updatedData);
  await fetchTransactions();
};

function onCreate() {
  currentModalContent.value = ModalContent[1];
  openModal();
}

function onEdit(id) {
  currentModalContent.value = ModalContent[1];
  selectedTransaction.value = id;
  openModal();
}

function onEditCategory(id, color, name) {
  currentModalContent.value = ModalContent[2];
  selectedCategory.value = id;
  categoryColor.value = color;
  categoryName.value = name;
  openModal();
}

function onDelete(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this transaction!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(result => {
    if (result.isConfirmed) {
      deleteTransactionById(id).then(() => {
        transactions.value = transactions.value.filter(t => t.id !== id);
        Swal.fire('Deleted!', 'Your transaction has been deleted.', 'success');
      });
    }
  });
}

const openModal = () => {
  show();
};

const closeModal = () => {
  selectedTransaction.value = null;
  hide();
  currentModalContent.value = ModalContent[0];
};

onMounted(async () => {
  isLoading.value = true;
  await fetchTransactions();
  isLoading.value = false;
});
</script>
<style scoped></style>
