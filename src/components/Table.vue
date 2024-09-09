<template>
  <div class="gap-y-2">
    <div class="flow-root mb-8 p-1.5 min-w-full align-middle">
      <div class="-my-2 overflow-hidden">
        <div class="flex justify-between">
          <div class="relative flex max-w-xs">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                class="text-gray-400 size-4 dark:text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <input
              type="text"
              class="block w-full px-3 text-sm border border-gray-200 rounded-lg shadow-sm ps-9 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Search"
              @input="handleSearch"
              v-model="filter"
            />
          </div>
          <div class="flex items-center justify-start gap-2">
            <!-- <DateSelector :dateStart="internalDateStart" :dateEnd="internalDateEnd" /> -->
            <input
              v-model="internalDateStart"
              type="date"
              placeholder="Start Date"
              class="w-40 py-1 pl-4 pr-2 my-auto font-medium leading-none text-gray-600 rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
            />
            <input
              v-model="internalDateEnd"
              type="date"
              placeholder="End Date"
              class="w-40 py-1 pl-4 pr-2 my-auto font-medium leading-none text-gray-600 rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
            />
            <button
              @click="handleDateRange"
              type="button"
              class="inline-flex items-center px-4 py-1 my-auto text-sm font-medium text-blue-800 bg-blue-300 border border-gray-200 rounded-lg shadow-sm text-nowrap w-max gap-x-2 hover:bg-blue-50"
            >
              Filter Transactions
            </button>
          </div>
          <button
            type="button"
            @click="handleClick"
            class="inline-flex items-center px-4 text-sm font-medium text-blue-800 bg-blue-300 border border-transparent rounded-lg gap-x-2 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:bg-blue-900"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            {{ buttonName }}
          </button>
        </div>
        <div
          class="inline-block min-w-full mt-2 mb-5 space-y-2 overflow-x-auto align-middle rounded-lg shadow-lg"
        >
          <table
            class="w-full min-w-full leading-normal border-collapse divide-y divide-gray-200 shadow-sm table-auto dark:divide-neutral-700"
          >
            <thead>
              <tr
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <th
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  scope="col"
                  class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200 cursor-pointer w-"
                  :class="{
                    'cursor-pointer select-none': header.column.getCanSort(),
                  }"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender
                    :render="
                      typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header()
                        : header.column.columnDef.header
                    "
                    :props="header.getContext()"
                  />
                  {{ getSortingIndicator(header.column) }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :class="rowClass(row)"
              >
                <td
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  class="px-2 py-2 text-sm text-center text-gray-500"
                >
                  <tippy
                    v-if="cell.column.columnDef.header === 'Tanggal'"
                    :content="getCellTooltip(cell.column, row)"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </tippy>
                  <FlexRender
                    v-else
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Pagination Wrapper -->
      <div class="mt-4">
        <div class="flex self-center justify-center mx-auto text-sm gap-x-auto">
          Show Page {{ currentPage }} of {{ totalPages }} -
          {{ totalRecords }} results
        </div>
        <div class="flex items-center justify-between w-full sm:flex">
          <div class="flex-1"></div>
          <div
            class="flex flex-col border rounded-lg shadow-sm grow-0 sm:inline-flex sm:flex-row"
          >
            <button
              class="inline-flex items-center justify-center px-4 py-2 -mt-px text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm gap-x-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none -ms-px first:rounded-t-md last:rounded-b-md sm:first:rounded-s-md sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-md focus:z-10 focus:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              @click="fetchPage(0)"
              :disabled="currentPage === 0"
            >
              First page
            </button>
            <button
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 gap-x-2 first:rounded-t-md last:rounded-b-md sm:first:rounded-s-md sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-md focus:z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="fetchPage(currentPage - 1)"
              :disabled="currentPage === 0"
            >
              <svg
                class="self-end shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Prev
            </button>
            <button
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 gap-x-2 first:rounded-t-md last:rounded-b-md sm:first:rounded-s-md sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-md focus:z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="fetchPage(currentPage + 1)"
              :disabled="currentPage === totalPages - 1"
            >
              Next
              <svg
                class="self-end shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <button
              class="inline-flex items-center justify-center px-4 py-2 -mt-px text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm gap-x-2 -ms-px first:rounded-t-md last:rounded-b-md sm:first:rounded-s-md sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-md focus:z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="fetchPage(totalPages - 1)"
              :disabled="currentPage === totalPages - 1"
            >
              Last page
            </button>
          </div>
          <div class="flex justify-end flex-1 gap-2">
            <label for="pageSize">Rows per page:</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="handlePageSizeChange"
            >
              <option v-for="size in [5, 10, 20, 50]" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- End Pagination Wrapper -->
    </div>
  </div>
</template>

<script setup>
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { debounce } from 'lodash';
import { computed, ref } from 'vue';
import { Tippy } from 'vue-tippy';
// import DateSelector from './dateSelector.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  getRowClass: {
    type: Function,
    required: false,
  },
  buttonName: {
    type: String,
    required: true,
  },
  totalRecords: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});

// Internal state
const today = new Date();
const internalDateStart = ref(
  new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10)
);
const internalDateEnd = ref(today.toISOString().slice(0, 10));

const emit = defineEmits([
  'search',
  'create',
  'fetchData',
  'edit',
  'delete',
  'fetchPage',
  'changePageSize',
]);

// Emit openModal event
const handleClick = () => {
  emit('create');
};

const handleSearch = event => {
  // Debounce or throttle the event handler to avoid frequent updates
  debounce(() => {
    // Your logic here
    emit('search', event.target.value);
  }, 600)();
};

const handleDateRange = () => {
  emit('fetchData', internalDateStart.value, internalDateEnd.value);
};

const handlePageSizeChange = () => {
  emit('changePageSize', pageSize.value);
};
const fetchPage = page => {
  if (page >= 0 && page < props.totalPages) {
    emit('fetchPage', page);
  }
};

const data = computed(() => props.data);

// State variables
const sorting = ref([]);
const grouping = ref([]);
// const filter = ref('');
const pageSize = ref(props.pageSize);

const rowClass = row => {
  // Use the getRowClass function if it exists, otherwise use a default class
  return props.getRowClass
    ? props.getRowClass(row.original)
    : 'lg:odd:bg-gray-100/50 lg:dark:odd:bg-slate-800/50';
};

// Helper function to get cell tooltip content
const getCellTooltip = (column, row) => {
  // You can customize this logic to return dynamic content based on column and row
  if (column.columnDef.header === 'Tanggal')
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(row.original.dtTransaction));
};

const table = useVueTable({
  get data() {
    return data.value;
  },
  columns: props.columns.map(col => ({
    ...col,
    cell: cellProps => {
      // Pass the emit function down to the column definition
      return col.cell({ ...cellProps, emit });
    },
  })),
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    // get globalFilter() {
    //   return filter.value;
    // },
    get grouping() {
      return grouping.value;
    },
  },
  globalFilterFn: fuzzyFilter,
  onGroupingChange: newGrouping => {
    grouping.value = newGrouping; // Handle grouping changes
  },
  onSortingChange: updaterOrValue => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
  },
  enableMultiSort: true,
});

function getSortingIndicator(column) {
  const indicators = {
    asc: ' ↑',
    desc: ' ↓',
  };
  return indicators[column.getIsSorted()];
}

function fuzzyFilter(row, columnId, value, addMeta) {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the ranking info
  addMeta(itemRank);
  // Return if the item should be filtered in/out
  return itemRank.passed;
}
</script>

<style scoped>
/* table {
  border: 1px solid lightgray;
} */

tbody {
  border-bottom: 1px solid lightgray;
}

/* 
th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
} */

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
</style>
