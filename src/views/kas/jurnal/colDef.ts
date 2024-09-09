import { compareItems, RankingInfo } from '@tanstack/match-sorter-utils';
import {
  CellContext,
  createColumnHelper,
  SortingFn,
  sortingFns,
} from '@tanstack/vue-table';
import { LucideEdit, LucideDelete } from 'lucide-vue-next';
import { h } from 'vue';
import Editor from '@/components/Editor.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogClose,
  // DialogFooter,
} from '@/components/ui/dialog';
import { formatRupiah } from '@/utils/formatRupiah';

const appUrl = 'https://dkm.assalamjs.online/';

type ExtendedCellContext<TData extends RowData, TValue> = CellContext<
  TData,
  TValue
> & {
  emit: (event: string, ...args: unknown[]) => void;
};
type RowData = {
  id: string;
  dtTransaction: Date;
  categoryId: string;
  category: string;
  color: string;
  activity: string;
  amount: bigint;
  type: string;
  photo: string;
};

function shortDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

const columnHelper = createColumnHelper<RowData>();

const fuzzySort: SortingFn<RowData> = (rowA, rowB, columnId) => {
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
  {
    accessor: 'category',
    header: 'Kategori',
    enableSorting: false,
    cell: ({ row, emit }: ExtendedCellContext<RowData, string>) => {
      const color = (row.original as RowData).color;
      return h(
        'span',
        {
          class: `inline-flex min-h-6 min-w-28 items-center leading-none py-1 px-1 rounded-3xl justify-center font-extralight text-white cursor-pointer dark:border-neutral-200 dark:text-white`,
          style: {
            backgroundColor: color,
          },
          onClick: () =>
            emit(
              'editCategory',
              row.original.categoryId,
              color,
              row.original.category
            ),
        },
        row.original.category
      );
    },
  },
  columnHelper.accessor('amount', {
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
  columnHelper.accessor('type', {
    header: 'Keluar/Masuk',
    enableSorting: true,
    enableGrouping: true, // Grouping enabled for this column
    cell: info => info.getValue(), // Simply returns the value
  }),
  columnHelper.accessor('photo', {
    header: 'Photo',
    cell: info =>
      info.getValue()
        ? h(Dialog, [
            h(DialogTrigger, { asChild: true }, () =>
              h(
                'Button',
                { variant: 'outline' },
                h('img', {
                  src: `${appUrl}img/small/${info.getValue()}`, // Replace with the actual image path
                  alt: 'Image description',
                  width: 200,
                  height: 150,
                  style: {
                    objectFit: 'cover', // This ensures the image fills the container while preserving its aspect ratio
                    width: '200px', // Set the width explicitly
                    height: '150px', // Set the height explicitly
                    overflow: 'hidden',
                  },
                })
              )
            ),
            h(
              DialogContent,
              {
                class: 'overflow-auto p-0 h-dvh w-dvh',
              },
              [
                h(DialogHeader, { class: 'pt-3 pb-0 mb-0 px-5' }, [
                  h(
                    DialogTitle,
                    `View Nota (${info.row.original.type} ${shortDate(info.row.original.dtTransaction)})`
                  ),
                  h(
                    DialogDescription,
                    info.row.original.activity +
                      ' = ' +
                      formatRupiah(info.row.original.amount)
                  ),
                ]),
                h(
                  'div',
                  {
                    class:
                      'w-full h-full bg-gray-100 flex items-center justify-center',
                  },
                  h(Editor, {
                    data: {
                      cropped: false,
                      cropping: false,
                      loaded: true,
                      name: info.getValue(),
                      previousUrl: `${appUrl}img/${info.getValue()}`,
                      type: '',
                      url: `${appUrl}img/${info.getValue()}`,
                    },
                    // width: 400,
                    // height: 450,
                    // onClick: () => displayImage(info.row.id),
                  })
                ),
                // h(DialogFooter, { class: 'sm:justify-center mr-5 mb-2' }, [
                //   h(DialogClose, { asChild: true }, () =>
                //     h(
                //       'Button',
                //       {
                //         type: 'button',
                //         variant: 'secondary',
                //         class:
                //           'px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700',
                //       },
                //       'Close'
                //     )
                //   ),
                // ]),
              ]
            ),
          ])
        : '', // Simply returns the value
  }),
  {
    accessor: 'id',
    id: 'actions', // Unique identifier for this column
    header: 'Actions',
    cell: ({ row, emit }: ExtendedCellContext<RowData, string>) => {
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
                'w-12 text-white justify-center bg-blue-500 hover:bg-blue-700 py-3 px-auto inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => emit('edit', row.original),
            },
            h(LucideEdit)
          ),
          h(
            'button',
            {
              type: 'button',
              class:
                'w-12 text-white justify-center bg-red-500 hover:bg-red-700 py-3 px-auto inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => emit('delete', row.original.id),
            },
            h(LucideDelete)
          ),
          // Add more buttons or actions as needed
        ]
      );
    },
  },
];

export const getRowClass = (row: RowData) => {
  return row.type === 'Penerimaan'
    ? 'bg-green-50 border-green-600'
    : 'bg-rose-50  border-rose-600';
};

export default columns;
// function displayImage(url: string) {
//   return h(dialog, { url });
// }
