// eslint-disable-next-line import/no-extraneous-dependencies
import { compareItems, RankingInfo } from '@tanstack/match-sorter-utils';
import { createColumnHelper, SortingFn, sortingFns } from '@tanstack/vue-table';
import { LucideEdit, LucideDelete } from 'lucide-vue-next';
import { defineEmits, h } from 'vue';

import { formatRupiah } from '@/utils/formatRupiah';

const appUrl = 'https://dkm.assalamjs.online/';

type RowData = {
  id: string;
  dtTransaction: Date;
  category: string;
  color: string;
  activity: string;
  value: bigint;
  in_out: string;
  photo: string;
};

// In your setup function or script block
const emit = defineEmits(['edit', 'delete']);

const handleEdit = (row: RowData) => {
  emit('edit', row);
};

const handleDelete = (row: RowData) => {
  emit('delete', row);
};
const columnHelper = createColumnHelper<RowData>();

const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  // Check if the column has ranking information
  const metaA = rowA.columnFiltersMeta[columnId] as RankingInfo | undefined;
  const metaB = rowB.columnFiltersMeta[columnId] as RankingInfo | undefined;

  if (metaA && metaB) {
    // Compare the ranks if both rows have ranking information
    dir = compareItems(metaA, metaB);
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const columns = [
  columnHelper.accessor('dtTransaction', {
    header: 'Tanggal',
    enableSorting: true, // Sorting enabled for this column
    enableColumnFilter: true, // Filtering enabled for this column
    cell: info =>
      new Intl.DateTimeFormat('id-ID', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(info.getValue())), //new Date(info.getValue()).toLocaleDateString(), // Formats the date
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('activity', {
    header: 'Perihal',
    cell: info => info.getValue(),
    enableSorting: false,
    enableColumnFilter: true, // Filtering enabled for this column
  }),
  columnHelper.accessor('category', {
    header: 'Kategori',
    enableSorting: false,
    cell: info => {
      const color = (info.row.original as RowData).color;
      return h(
        'span',
        {
          class: `inline-flex min-h-6 min-w-28 items-center leading-none py-1 px-1 rounded-3xl justify-center font-extralight text-white dark:border-neutral-200 dark:text-white`,
          style: {
            backgroundColor: color,
          },
        },
        info.getValue()
      ); // Simply returns the value
    },
  }),
  columnHelper.accessor('value', {
    header: 'Nominal',
    cell: info => {
      const value = info.getValue();
      return h(
        'div',
        {
          style: {
            textAlign: 'right', // Aligns text to the right
            fontWeight: 'bold', // Makes the text bold
          },
        },
        formatRupiah(value) // Formats the value using `formatRupiah`
      );
    },
    sortingFn: fuzzySort,
  }),
  columnHelper.accessor('in_out', {
    header: 'Keluar/Masuk',
    enableSorting: false,
    enableGrouping: true, // Grouping enabled for this column
    cell: info => info.getValue(), // Simply returns the value
  }),
  columnHelper.accessor('photo', {
    header: 'Photo',
    cell: info =>
      info.getValue()
        ? h('img', {
            src: `${appUrl}img/small/${info.getValue()}`, // Replace with the actual image path
            alt: 'Image description',
            width: 200,
            height: 150,
            onClick: () => displayImage(info.row.id),
          })
        : '', // Simply returns the value
  }),
  columnHelper.accessor('id', {
    id: 'actions', // Unique identifier for this column
    header: 'Actions',
    cell: ({ row }) => {
      return h(
        'div',
        {
          class: 'inline-flex rounded-lg shadow-sm',
        },
        [
          h(
            'button',
            {
              type: 'button',
              class:
                'w-12 text-white justify-center bg-blue-500 hover:bg-blue-700 py-3 px-auto inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => handleEdit(row.original),
            },
            h(LucideEdit)
          ),
          h(
            'button',
            {
              type: 'button',
              class:
                'w-12 text-white justify-center bg-red-500 hover:bg-red-700 py-3 px-auto inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => handleDelete(row.original),
            },
            h(LucideDelete)
          ),
          // Add more buttons or actions as needed
        ]
      );
    },
  }),
];

export const getRowClass = (row: RowData) => {
  return row.in_out === 'Penerimaan'
    ? 'bg-green-50 border-green-600'
    : 'bg-rose-50  border-rose-600';
};

export default columns;
function displayImage(id: string): unknown {
  throw new Error('Function not implemented.');
}
