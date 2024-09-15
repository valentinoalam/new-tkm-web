<template>
  <div class="w-full p-4">
    <h5 class="mb-4 text-lg font-semibold">Users List</h5>
    <AddUser :isOpen="isModalOpen" @close="closeModal" />
    <Table
      :data="dtUser"
      :columns="columns"
      :buttonName="'New Entry'"
      @create="openModal"
    />
  </div>
</template>

<script setup>
import { createColumnHelper } from '@tanstack/vue-table';
import { LucideView, LucideEdit, LucideDelete } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { ref, onMounted, h } from 'vue';
import AddUser from './addUser.vue';
import Table from '@/components/tables/table.vue';
import * as UsersAPI from '@/service/userService';
// const userInfo = useSelector(state => state.app.userInfo);
// const selectionMode = useSelector(state => state.selectionMode);
// const groupMap = useSelector(state => state.groupMapping);

// const dtRole = ref([]);
const dtUser = ref([]);
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
onMounted(async () => {
  // RoleAPI.getAll().then(res => {
  //   dtRole.value = res;
  // });
  await fetchUsers();
});

const fetchUsers = async () => {
  const users = await UsersAPI.getAll();
  dtUser.value = users.data.user.records;
  console.log(dtUser.value);
};
const columnHelper = createColumnHelper();
const columns = [
  {
    accessor: 'no',
    header: 'No',
    cell: ({ row }) => `${row.index + 1} `,
  },
  columnHelper.accessor('username', {
    header: 'Nama',
    enableSorting: true, // Sorting enabled for this column
    enableColumnFilter: true, // Filtering enabled for this column
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('lastActive', {
    header: 'Last Active',
    cell: info => info.getValue(),
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
                'w-full text-white justify-center py-1 inline-flex bg-emerald-500 hover:bg-green-700 items-center rounded-t-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => openView(row.original),
            },
            h(LucideView)
          ),
          h(
            'button',
            {
              type: 'button',
              class:
                'flex-1 text-white justify-center bg-blue-500 hover:bg-blue-700 py-1 inline-flex items-center rounded-bl-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => openEdit(row.original),
            },
            h(LucideEdit)
          ),
          h(
            'button',
            {
              type: 'button',
              class:
                'flex-1 text-white justify-center bg-red-500 hover:bg-red-700 py-1 px-auto inline-flex items-center rounded-br-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
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

// const handleUserClick = userId => {
//   if (groupMap[userId]) {
//     dispatch('removeUser', userId);
//   } else {
//     switch (selectionMode.group) {
//       case 'PJ1':
//         dispatch('addPJ1', userId);
//         break;
//       case 'PJ2':
//         dispatch('addPJ2', userId);
//         break;
//       case 'PJ3':
//         dispatch('addPJ3', userId);
//         break;
//     }
//   }
// };

const openView = user => {
  selectedUser.value = user;
  isViewOpen.value = true;
};

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
      UsersAPI.deleteById(id)
        .then(() => {
          alert('User deleted successfully');
          fetchUsers();
        })
        .catch(() => alert('Failed to delete user'));
    }
  });
};
</script>

<style scoped></style>
