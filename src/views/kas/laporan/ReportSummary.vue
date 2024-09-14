<template>
  <div>
    <table
      class="w-full min-w-full leading-normal border-collapse divide-y divide-gray-200 shadow-sm table-auto dark:divide-neutral-700"
    >
      <thead>
        <tr>
          <th
            class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200 cursor-pointer"
          >
            Account Name
          </th>
          <th
            class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200 cursor-pointer"
          >
            Debit
          </th>
          <th
            class="px-4 py-2 text-xs tracking-wider uppercase bg-gray-100 border-b-2 border-gray-200 cursor-pointer"
          >
            Credit
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
          <td><strong>Total</strong></td>
          <td class="text-right">
            <strong>{{ formatRupiah(totalDebit) }}</strong>
          </td>
          <td class="text-right">
            <strong>{{ formatRupiah(totalCredit) }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>Normal Balance</strong></td>
          <td class="flex justify-end">
            <strong>{{ balanceStatus }} </strong>
            {{ formatRupiah(balanceDifference) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { getBalanceReport } from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

export default defineComponent({
  setup() {
    const trialBalanceData = ref([]);
    const totalDebit = ref(0);
    const totalCredit = ref(0);
    const fetchTrialBalance = async () => {
      try {
        const response = await getBalanceReport(); // Replace with your API endpoint
        const {
          result,
          totalDebit: tdebit,
          totalCredit: tcredit,
        } = response.data;
        trialBalanceData.value = result.sort(
          (a, b) => Number(b.debit) - Number(a.debit)
        );
        totalDebit.value = tdebit;
        totalCredit.value = tcredit;
      } catch (error) {
        console.error('Error fetching trial balance:', error);
        return [];
      }
    };

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

    return {
      table,
      formatRupiah,
      totalDebit,
      totalCredit,
      balanceDifference,
      balanceStatus,
    };
  },
});
</script>
