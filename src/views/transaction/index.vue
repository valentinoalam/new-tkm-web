<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold">Transaction Data</h2>
      <button @click="openCreateModal" class="btn-primary">
        Add Transaction
      </button>
    </div>
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        class="input"
        type="text"
        placeholder="Search..."
      />
    </div>
    <TanStackTable :columns="columns" :data="filteredData" />
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import { ref, computed, h } from 'vue';
import { useTransactionApi } from '@/api/transactionApi';

const searchQuery = ref('');
const transactions = ref([]);
const { fetchTransactions, deleteTransaction } = useTransactionApi();

// Fetch transactions on component mount
fetchTransactions().then(data => {
  transactions.value = data;
});

// Filter data based on search query
const filteredData = computed(() =>
  transactions.value.filter(transaction =>
    transaction.description
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

// Define table columns
const columns = [
  { Header: 'No', accessor: (row, index) => index + 1 },
  { Header: 'Description', accessor: 'description' },
  { Header: 'Value', accessor: 'value' },
  { Header: 'Date', accessor: 'dateTransaction' },
  { Header: 'Category', accessor: 'categoryId' },
  {
    Header: 'Action',
    accessor: 'id',
    Cell: ({ row }) =>
      h('div', { class: 'flex justify-around' }, [
        h(
          'button',
          {
            class: 'btn-view',
            onClick: () => openViewModal(row.original),
          },
          'View'
        ),
        h(
          'button',
          {
            class: 'btn-edit',
            onClick: () => openEditModal(row.original),
          },
          'Edit'
        ),
        h(
          'button',
          {
            class: 'btn-delete',
            onClick: () => handleDelete(row.original.id),
          },
          'Delete'
        ),
      ]),
  },
];

// Handle delete
const handleDelete = id => {
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
      deleteTransaction(id).then(() => {
        transactions.value = transactions.value.filter(t => t.id !== id);
        Swal.fire('Deleted!', 'Your transaction has been deleted.', 'success');
      });
    }
  });
};

// Open modals
const openCreateModal = () => {
  /* logic to open create modal */
};
const openEditModal = transaction => {
  /* logic to open edit modal */
};
const openViewModal = transaction => {
  /* logic to open view modal */
};
</script>

<style scoped>
.btn-primary {
  /* your styles */
}
.btn-view {
  /* your styles */
}
.btn-edit {
  /* your styles */
}
.btn-delete {
  /* your styles */
}
.input {
  /* your styles */
}
</style>
