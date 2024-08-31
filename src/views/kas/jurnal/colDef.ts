import { createColumnHelper } from '@tanstack/vue-table';
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
            // Add more attributes as needed
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
            'Edit'
          ),
          h(
            'button',
            {
              type: 'button',
              class:
                'w-12 text-white justify-center bg-red-500 hover:bg-red-700 py-3 px-auto inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
              onClick: () => handleDelete(row.original),
            },
            'Delete'
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

// const chartCategories = computed(() => {
//   // Group transactions by month and year using Lodash
//   const groupedByMonth = _.groupBy(transactions.value, tx => {
//     return dayjs(tx.dtTransaction).format('MMMM YYYY'); // e.g., "August 2024"
//   });

//   // Get the list of month-year combinations as categories
//   return Object.keys(groupedByMonth);
// });
// const chartCategories = computed(() =>
//   transactions.value.map(tx => tx.dtTransaction)
// );
// const monthlyIncomeExpense = computed(() => {
//   const groupedByMonth = _.groupBy(transactions.value, tx =>
//     dayjs(tx.dtTransaction).format('MMMM YYYY')
//   );

//   return _.map(groupedByMonth, (monthData, monthYear) => {
//     const income = _.sumBy(monthData, tx =>
//       tx.in_out === 'Penerimaan' ? parseFloat(tx.value) : 0
//     );
//     const expense = _.sumBy(monthData, tx =>
//       tx.in_out === 'Pengeluaran' ? parseFloat(tx.value) : 0
//     );

//     return {
//       month: monthYear,
//       income,
//       expense,
//     };
//   });
// });
// const chartSeries = computed(() => [
//   {
//     name: 'Income',
//     data: monthlyIncomeExpense.value.map(data => data.income),
//     color: '#42b883',
//   },
//   {
//     name: 'Expense',
//     data: monthlyIncomeExpense.value.map(data => data.expense),
//     color: '#ff6384',
//   },
// ]);

// const chartOptions = computed(() => ({
//   chart: {
//     id: 'income-expense-chart',
//     stacked: false,
//   },
//   xaxis: {
//     categories: monthlyIncomeExpense.value.map(data => data.month),
//   },
//   yaxis: {
//     labels: {
//       formatter: value => `Rp ${value}`,
//     },
//   },
//   plotOptions: {
//     bar: {
//       horizontal: false,
//     },
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   tooltip: {
//     y: {
//       formatter: value => `Rp ${value}`,
//     },
//   },
// }));
