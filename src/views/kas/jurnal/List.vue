<template>
  <div class="container mx-auto">
    <VueApexCharts type="bar" :options="chartOptions" :series="chartSeries" />

    <div class="flex items-center justify-between mt-4">
      <div class="inline-flex gap-2">
        <input
          v-model="dateStart"
          type="date"
          placeholder="Start Date"
          class="w-full py-1 pl-4 pr-2 my-auto font-medium leading-none text-gray-600 rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
        />
        <input
          v-model="dateEnd"
          type="date"
          placeholder="End Date"
          class="w-full py-1 pl-4 pr-2 my-auto font-medium leading-none text-gray-600 rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
        />
        <button
          @click="fetchTransactions"
          type="button"
          class="inline-flex items-center px-4 py-1 my-auto text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm text-nowrap w-max gap-x-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        >
          Filter Transactions
        </button>
      </div>
      <button
        type="button"
        class="inline-flex items-center px-4 py-3 text-sm font-medium text-blue-800 bg-blue-300 border border-transparent rounded-lg mx-7 gap-x-2 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:bg-blue-900"
        @click="openModal()"
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
        New Entry
      </button>
    </div>

    <!-- Modal Form -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-8 bg-white rounded-lg">
        <h2 class="mb-4 text-2xl">
          {{ selectedTransaction ? 'Edit Transaction' : 'Add New Transaction' }}
        </h2>

        <!-- FormKit Form -->
        <FormKit type="form" :actions="false" @submit="submitForm">
          <FormKit
            type="text"
            label="Description"
            v-model="form.description"
            :validation="'required'"
          />
          <FormKit
            type="number"
            label="Amount"
            v-model="form.amount"
            :validation="'required|number'"
          />
          <FormKit
            type="date"
            label="Date"
            v-model="form.date"
            :validation="'required|date'"
          />
          <div class="flex justify-end mt-4">
            <button
              type="button"
              class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-700"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </FormKit>
      </div>
    </div>
    <!-- Transaction Table -->
    <Table
      v-else
      :data="transactions"
      :columns="columns"
      :getRowClass="getRowClass"
    />
  </div>
</template>

<script setup>
import { FormKit } from '@formkit/vue';
import { computed, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// import BarChart from '@/components/charts/BarChart.vue';
import Table from '@/components/Table.vue';
import { MONTHS } from '@/constant';
import { getAllTransactions } from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

import columns, { getRowClass } from './colDef';

const dtStart = ref();
const dtEnd = ref();

const chartData = ref([]);
const transactions = ref([]); // Transactions data from API
const isModalOpen = ref(false); // Controls modal visibility
const selectedTransaction = ref(null); // Selected transaction for editing
const form = ref({ description: '', amount: 0, date: '' }); // Form data
// Fetch transactions from API
const fetchTransactions = async () => {
  try {
    let response;
    if (dtStart.value || dtEnd.value)
      response = await getAllTransactions({
        startDate: dtStart.value.start,
        endDate: dtEnd.value.end,
      });
    else response = await getAllTransactions(); //axios.get('/dari-appsheet/transactions');
    transactions.value = response;
    console.log(transactions.value);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

// Initialize an object to store totals by month
const monthlyTotals = {};

const chartSeries = computed(() => [
  {
    name: 'Income',
    data: chartData.value.map(item => parseFloat(item.income)),
    color: '#42b883',
  },
  {
    name: 'Expense',
    data: chartData.value.map(item => parseFloat(item.expense)),
    color: '#ff6384',
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: chartData.value.map(item => item.month),
  },
  yaxis: {
    title: {
      text: 'Amount',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: val => formatRupiah(val),
    },
  },
}));
// Initialize data on component mount
onMounted(async () => {
  await fetchTransactions();
  transactions.value.forEach(transaction => {
    const [monthIndex] = new Date(transaction.dtTransaction)
      .toLocaleDateString()
      .split('/');
    // const month = months[parseInt(monthIndex) - 1];
    const month = MONTHS[parseInt(monthIndex) - 1];
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { IN: 0, OUT: 0 };
    }

    if (transaction.in_out === 'Penerimaan') {
      monthlyTotals[month].IN += parseFloat(transaction.value);
    } else if (transaction.in_out === 'Pengeluaran') {
      monthlyTotals[month].OUT += parseFloat(transaction.value);
    }
  });
  // Convert the object into an array for charting
  chartData.value = Object.entries(monthlyTotals)
    .map(([month, totals]) => ({
      month,
      income: totals.IN,
      expense: totals.OUT,
    }))
    .sort((a, b) => {
      // Parse the 'month' strings to Date objects for comparison
      const dateA = MONTHS.indexOf(a.month);
      const dateB = MONTHS.indexOf(b.month);
      return dateA < dateB ? -1 : 1;
    });
  console.log(chartData.value);
});
console.log(chartData.value);
// Modal Handling
const openModal = (transaction = null) => {
  selectedTransaction.value = transaction;
  form.value = transaction
    ? { ...transaction }
    : { description: '', amount: 0, date: '' };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitForm = () => {
  if (selectedTransaction.value) {
    // Update the existing transaction
    const index = transactions.value.findIndex(
      t => t.id === selectedTransaction.value.id
    );
    transactions.value[index] = { ...form.value };
  } else {
    // Add a new transaction
    transactions.value.push({ ...form.value, id: Date.now() });
  }
  closeModal();
};
</script>

<style></style>
