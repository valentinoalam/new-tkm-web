<template>
  <div class="w-full p-4">
    <Table
      :data="dtCategory"
      :columns="columns"
      :buttonName="'New Entry'"
      @create="openModal"
    />
  </div>
</template>

<script setup>
import { h, ref, onMounted } from 'vue';
import { getAllCategories } from '@/service/appsheetService';
import Table from '@/components/tables/table.vue';
import { createColumnHelper } from '@tanstack/vue-table';
import { LucideEdit, LucideDelete } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const isLoading = ref(false);
const dtCategory = ref([]);
// Fetch transactions from API
const fetchCategories = async () => {
  try {
    let response;
    response = await getAllCategories();
    localStorage.setItem(`categories`, JSON.stringify(response.data));
    dtCategory.value = response.data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

const columnHelper = createColumnHelper();
const columns = [
  {
    accessor: 'no',
    header: 'No',
    cell: ({ row }) => `${row.index + 1} `,
  },
  columnHelper.accessor('category', {
    header: 'Nama',
    enableSorting: true, // Sorting enabled for this column
    enableColumnFilter: true, // Filtering enabled for this column
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('color', {
    header: 'Color',
    cell: info => {
      const colorValue = info.getValue(); // Get the color value from the data

      return h('div', {
        class: 'w-10 h-10 rounded-lg',
        style: {
          backgroundColor: colorValue, // Set the background color
        }, // Set the background color
      });
    },
  }),
  columnHelper.accessor('id', {
    id: 'actions', // Unique identifier for this column
    header: 'Actions',
    // autoSize: true,
    // size: 50,
    enableSorting: false,
    style: {
      width: 0, // Set width to 30% of table width
    },
    cell: ({ row, emit }) => {
      return h(
        'div',
        {
          class: 'flex flex-wrap w-max rounded-lg shadow-sm',
        },
        [
          h(
            'button',
            {
              type: 'button',
              class:
                'flex-1 text-white justify-center bg-blue-500 hover:bg-blue-700 py-1 inline-flex items-center rounded-l-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => openEdit(row.original),
            },
            h(LucideEdit)
          ),
          h(
            'button',
            {
              type: 'button',
              class:
                'flex-1 text-white justify-center bg-red-500 hover:bg-red-700 py-1 px-auto inline-flex items-center rounded-r-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => deleteById(row.original.id, row.original.username),
            },
            h(LucideDelete)
          ),
          // Add more buttons or actions as needed
        ]
      );
    },
  }),
];
const isModalOpen = ref(false);
const isEditOpen = ref(false);
const isViewOpen = ref(false);
const selectedUser = ref(null);

function openModal() {
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}

const openEdit = user => {
  selectedUser.value = user;
  isEditOpen.value = true;
};
const deleteById = (id, name) => {
  Swal.fire({
    title: `Are you sure you want to delete?`,
    html: `<span class="text-xl font-bold">"${name}"</span>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d80b0b',
    cancelButtonColor: 'gray',
    confirmButtonText: 'Delete',
  }).then(result => {
    if (result.isConfirmed) {
      // UsersAPI.deleteById(id)
      //   .then(() => {
      //     alert('User deleted successfully');
      //     fetchCategories();
      //   })
      //   .catch(() => alert('Failed to delete user'));
    }
  });
};

onMounted(async () => {
  isLoading.value = true;

  await fetchCategories();

  isLoading.value = false;
});
</script>

<style scoped></style>
