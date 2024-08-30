<template>
  <div class="-m-1.5">
    <div class="flow-root mb-8 p-1.5 min-w-full align-middle">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle sm:px-6 lg:px-8"
        >
          <div class="px-4 py-3">
            <div class="relative max-w-xs">
              <label for="hs-table-search" class="sr-only">Search</label>
              <input
                type="text"
                class="block w-full px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm ps-9 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Search"
                v-model="filter"
              />

              <div
                class="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3"
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
            </div>
          </div>

          <table
            class="w-full min-w-full mt-5 border-collapse divide-y divide-gray-200 shadow-sm table-auto dark:divide-neutral-700"
          >
            <thead>
              <tr
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
                class="text-left bg-gray-50 dark:bg-meta-4"
              >
                <th
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  scope="col"
                  class="px-4 py-2 cursor-pointer"
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
                  {{ { asc: ' ↑', desc: '↓' }[header.column.getIsSorted()] }}
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
                  class="px-3 py-4 text-sm text-gray-500"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-8">
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }} -
        {{ table.getFilteredRowModel().rows.length }} results
      </div>
      <div class="mt-8 space-x-4">
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageSize(5)"
        >
          Page Size 5
        </button>
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageSize(10)"
        >
          Page Size 10
        </button>
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageSize(20)"
        >
          Page Size 20
        </button>
      </div>
      <div class="mt-8 space-x-4">
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageIndex(0)"
        >
          First page
        </button>
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          Last page
        </button>
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Prev page
        </button>
        <button
          class="px-2 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { computed, ref } from 'vue';

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
});

const rowClass = row => {
  // Use the getRowClass function if it exists, otherwise use a default class
  return props.getRowClass
    ? props.getRowClass(row.original)
    : 'lg:odd:bg-gray-100/50 lg:dark:odd:bg-slate-800/50';
};

const data = computed(() => props.data);
// State variables
const sorting = ref([]);
const grouping = ref([]);
const filter = ref('');
// data: computed(() => props.data), // Ensures reactivity if `data` prop changes
//   columns: computed(() => props.columns), // Ensures reactivity if `columns` prop changes
const table = useVueTable({
  get data() {
    return data.value;
  },
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return filter.value;
    },
    get grouping() {
      return grouping.value;
    },
  },
  // onColumnFiltersChange: columnFilters.value,
  onSortingChange: updaterOrValue => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
  },
  // initialState: {
  //   pagination: {
  //     pageSize: 10,
  //   },
  // },
});

// watchEffect(() => {
//   console.log(table.getState().sorting);
// });

// const sort = useVModel(props, "sort", emits, {
//   passive: true,
//   defaultValue: defu({}, props.sort, { column: null, direction: "asc" } as {
//     column: string | null
//     direction: "asc" | "desc"
//   }),
// })

// const savedSort = { column: sort.value.column, direction: null }

// const rows = computed(() => {
//   if (!sort.value?.column || props.sortMode === "manual") {
//     return props.rows
//   }

//   const { column, direction } = sort.value

//   return props.rows.slice().sort((a, b) => {
//     const aValue = get(a, column)
//     const bValue = get(b, column)

//     const sort =
//       columns.value.find((col) => col.key === column)?.sort ?? defaultSort

//     return sort(aValue, bValue, direction)
//   })
// })

// const selected = computed({
//   get() {
//     return props.modelValue
//   },
//   set(value) {
//     emits("update:modelValue", value)
//   },
// })
// const indeterminate = computed(
//   () =>
//     selected.value &&
//     selected.value.length > 0 &&
//     selected.value.length < props.rows.length
// )

// const emptyState = computed(() => {
//   if (props.emptyState === null) return null
//   return { ...ui.value.default.emptyState, ...props.emptyState }
// })

// const loadingState = computed(() => {
//   if (props.loadingState === null) return null
//   return { ...ui.value.default.loadingState, ...props.loadingState }
// })

// function compare(a: any, z: any) {
//   if (typeof props.by === "string") {
//     const property = props.by as unknown as any
//     return a?.[property] === z?.[property]
//   }
//   return a === z
// }

// function isSelected(row: Object) {
//   if (!props.modelValue) {
//     return false
//   }

//   return selected.value.some((item) => compare(toRaw(item), toRaw(row)))
// }

// function onSort(column: { key: string; direction?: "asc" | "desc" }) {
//   if (sort.value.column === column.key) {
//     const direction =
//       !column.direction || column.direction === "asc" ? "desc" : "asc"

//     if (sort.value.direction === direction) {
//       sort.value = defu({}, savedSort, {
//         column: null,
//         direction: "asc" as "asc" | "desc",
//       })
//     } else {
//       sort.value = {
//         column: sort.value.column,
//         direction: sort.value.direction === "asc" ? "desc" : "asc",
//       }
//     }
//   } else {
//     sort.value = { column: column.key, direction: column.direction || "asc" }
//   }
// }

// function onSelect(row: Object) {
//   if (!$attrs.onSelect) {
//     return
//   }

//   // @ts-ignore
//   $attrs.onSelect(row)
// }

// function selectAllRows() {
//   props.rows.forEach((row) => {
//     // If the row is already selected, don't select it again
//     if (isSelected(row)) {
//       return
//     }

//     // @ts-ignore
//     selected.value.push(row)
//   })
// }

// function onChange(event: any) {
//   if (event.target.checked) {
//     selectAllRows()
//   } else {
//     selected.value = []
//   }
// }

// function getRowData(
//   row: Object,
//   rowKey: string | string[],
//   defaultValue: any = ""
// ) {
//   return get(row, rowKey, defaultValue)
// }
</script>

<style scoped>
table {
  border: 1px solid lightgray;
}

tbody {
  border-bottom: 1px solid lightgray;
}

/* tbody tr:nth-child(odd) {
  @apply lg:bg-gray-100/50 lg:dark:bg-slate-800/50;
} */

th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
}

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
</style>
