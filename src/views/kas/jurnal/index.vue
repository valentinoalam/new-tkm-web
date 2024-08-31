<template>
  <div class="container mx-auto">
    <VueApexCharts type="bar" :options="chartOptions" :series="chartSeries" />
    <Tables />
    <!-- Modal Form -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-8 bg-white rounded-lg">
        <h2 class="mb-4 text-2xl">
          {{ selectedTransaction ? 'Edit Transaction' : 'Add New Transaction' }}
        </h2>
        <AddOrEditTransaction
          :selectedTransaction="selectedTransaction"
          @closeModal="closeModal"
          @updateTransaction="handleUpdateTransaction"
        />
      </div>
    </div>
    <!-- Transaction Table -->
    <Table
      v-else
      :data="transactions"
      :columns="columns"
      :getRowClass="getRowClass"
      :buttonName="'New Entry'"
      @handleClick="openModal()"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import Tables from '@/components/organisms/Tables.vue';
// import BarChart from '@/components/charts/BarChart.vue';
import Table from '@/components/Table.vue';
import { MONTHS } from '@/constant';
import { getAllTransactions } from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

import columns, { getRowClass } from './colDef';
import AddOrEditTransaction from './transaksi/AddOrEdit.vue';

const dtStart = ref();
const dtEnd = ref();

const chartData = ref([]);
const transactions = ref([]); // Transactions data from API
const isModalOpen = ref(false); // Controls modal visibility
const selectedTransaction = ref(null); // Selected transaction for editing

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

function onEdit(row) {
  // Handle the edit action
  console.log('Edit:', row);
}
function onDelete(row) {
  // Handle the delete action
  console.log('Delete:', row);
}

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
</script>

<style></style>
