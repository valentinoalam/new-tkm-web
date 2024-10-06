<template>
  <div
    class="inline-block mx-auto mt-2 mb-5 overflow-hidden align-middle rounded-lg shadow-lg"
  >
    <table
      class="overflow-x-auto leading-normal bg-white border-collapse divide-y divide-gray-200 shadow-sm table-auto dark:divide-neutral-700"
    >
      <thead>
        <tr>
          <th
            class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200"
          >
            Account
          </th>
          <th
            class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200"
          >
            Debits
          </th>
          <th
            class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200"
          >
            Credits
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td class="px-2 py-2 text-sm text-center text-gray-500">
            {{ row.getValue('categoryName') }}
          </td>
          <td class="px-2 py-2 text-sm text-right text-gray-500">
            {{ parseFloat(row.getValue('debit')).toLocaleString() }}
          </td>
          <td class="px-2 py-2 text-sm text-right text-gray-500">
            {{ parseFloat(row.getValue('credit')).toLocaleString() }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td class="pl-1"><strong>Total</strong></td>
          <td class="pr-2 text-right">
            <strong>{{ formatRupiah(totalDebit) }}</strong>
          </td>
          <td class="pr-2 text-right">
            <strong>{{ formatRupiah(totalCredit) }}</strong>
          </td>
        </tr>
        <tr>
          <td class="pl-3"><strong>Saldo Akhir</strong></td>
          <td
            :class="
              balanceStatus === '-'
                ? 'text-red-500'
                : balanceStatus === '+'
                  ? 'text-green-500'
                  : ''
            "
            class="flex justify-end"
          >
            <strong>{{ balanceStatus }} </strong>
            {{ formatRupiah(balanceDifference) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { ref, onMounted, computed, watch } from 'vue';
import { getBalanceReport } from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

const trialBalanceData = ref([]);
const totalDebit = ref(0);
const totalCredit = ref(0);
const fetchTrialBalance = async () => {
  try {
    const params = {
      year: new Date().getFullYear(),
      month: props.month,
    };
    if (props.week) params.week = props.week;
    const response = await getBalanceReport(params); // Replace with your API endpoint
    const { result, totalDebit: tdebit, totalCredit: tcredit } = response.data;
    trialBalanceData.value = result.sort(
      (a, b) => Number(b.debit) - Number(a.debit)
    );
    localStorage.setItem(
      'trial-balance',
      JSON.stringify(trialBalanceData.value)
    );
    totalDebit.value = tdebit;
    totalCredit.value = tcredit;
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return [];
  }
};

const props = defineProps({
  month: {
    type: Number,
    default: null,
  },
  week: {
    type: Number,
    default: null,
  },
});
// Watch for changes in month or week and refetch data when they change
watch(
  () => [props.month, props.week], // Watch the `month` and `week` props
  (newValues, oldValues) => {
    // Check if either month or week has changed and refetch the data
    if (newValues !== oldValues) {
      fetchTrialBalance();
    }
  }
);
const columnHelper = createColumnHelper();
const table = useVueTable({
  columns: [
    columnHelper.accessor('categoryName', {
      header: 'Account Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('debit', {
      header: 'Debit',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('credit', {
      header: 'Credit',
      cell: info => info.getValue(),
    }),
  ],
  get data() {
    return trialBalanceData.value;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});

onMounted(async () => {
  await fetchTrialBalance();
});
// Calculate balance difference (Debit - Credit)
const balanceDifference = computed(() => {
  return totalCredit.value - totalDebit.value;
});

// Determine if the balance is a plus or minus
const balanceStatus = computed(() => {
  if (balanceDifference.value > 0) {
    return '+';
  } else if (balanceDifference.value < 0) {
    return '-';
  } else {
    return 'Balanced';
  }
});
</script>
