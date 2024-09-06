<template>
  <div>
    <div v-if="isLoading">
      <looping-rhombuses-spinner
        class="absolute top-[32dvh] left-[45vw]"
        :animation-duration="2500"
        :rhombus-size="15"
        color="#CAFFBF"
      />
    </div>
    <div v-else class="space-y-7">
      <VueApexCharts type="bar" :options="chartOptions" :series="chartSeries" />
      <!-- Modal Form -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50"
      >
        <div
          v-if="modalContent === ModalContent[1]"
          class="w-1/3 p-8 bg-white rounded-lg"
        >
          <h2 class="mb-4 text-2xl">
            {{
              selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'
            }}
          </h2>
          <AddOrEditTransaction
            :selectedTransaction="selectedTransaction"
            @closeModal="closeModal"
            @updateTransaction="handleUpdateTransaction"
          />
        </div>
        <EditCategory
          v-else-if="modalContent === ModalContent[2]"
          :id="selectedCategory"
          :color="categoryColor"
          :category-name="categoryName"
          @update-category="handleUpdateCategory"
        />
      </div>
      <!-- Transaction Table -->
      <Table
        v-else
        :data="transactions"
        :columns="columns"
        :getRowClass="getRowClass"
        :buttonName="'New Entry'"
        :totalRecords="totalRecords"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        @fetchPage="handlePageChange"
        @changePageSize="handlePageSizeChange"
        @fetchData="handleDateRange"
        @create="onCreate"
        @edit="onEdit"
        @delete="onDelete"
        @editCategory="onEditCategory"
      />
    </div>
  </div>
</template>

<script setup>
// import/no-extraneous-dependencies
import chroma from 'chroma-js';
import { LoopingRhombusesSpinner } from 'epic-spinners';

import Swal from 'sweetalert2';
import { computed, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import columns, { getRowClass } from './colDef';
import EditCategory from './kategori/EditCategory.vue';
import AddOrEditTransaction from './transaksi/AddOrEdit.vue';
import Table from '@/components/Table.vue';
import { MONTHS } from '@/constant';
import {
  getTransactionDataChart,
  getAllTransactions,
  deleteTransactionById,
  updateCategoryById,
} from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

let maxValue;

const isLoading = ref(false);
const chartData = ref([]);
const transactions = ref({}); // Transactions data from API
const transactionsDataChart = ref([]);
const isModalOpen = ref(false); // Controls modal visibility
const modalContent = ref(''); // Controls modal visibility
const selectedTransaction = ref(null); // Selected transaction for editing
const selectedCategory = ref(null);
const pageSize = ref(10);
const currentPage = ref(0);
const totalRecords = ref(0);
const totalPages = ref(0);
const categoryName = ref('');
const categoryColor = ref('');
const ModalContent = ['none', 'transaction', 'category'];

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  selectedTransaction.value = null;
  isModalOpen.value = false;
  modalContent.value = ModalContent[0];
};

async function handleDateRange(dtStart, dtEnd) {
  await fetchTransactions(dtStart, dtEnd);
}

// Fetch transactions from API
const fetchTransactions = async (dtStart = null, dtEnd = null) => {
  try {
    let response;
    if (dtStart || dtEnd)
      response = await getAllTransactions({
        startDate: dtStart,
        endDate: dtEnd,
        page: currentPage.value,
        limit: pageSize.value,
      });
    else
      response = await getAllTransactions({
        page: currentPage.value,
        limit: pageSize.value,
      });
    transactions.value = response.data;
    totalRecords.value = response.totalRecords;
    totalPages.value = response.totalPages;
    console.log(transactions.value);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

const fetchDataChart = async () => {
  try {
    const response = await getTransactionDataChart(); //axios.get('/dari-appsheet/transactions');
    transactionsDataChart.value = response;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

const handlePageChange = async newPage => {
  currentPage.value = newPage;
  await fetchTransactions();
};

const handlePageSizeChange = async newPageSize => {
  pageSize.value = newPageSize;
  console.log(pageSize.value);
  await fetchTransactions();
};

const handleUpdateCategory = async ({ id, color }) => {
  await updateCategoryById(id, { color });
  await fetchTransactions();
};

function onCreate() {
  modalContent.value = ModalContent[1];
  openModal();
}
function onEdit(id) {
  modalContent.value = ModalContent[1];
  selectedTransaction.value = id;
  openModal();
}
function onEditCategory(id, color, name) {
  modalContent.value = ModalContent[2];
  selectedCategory.value = id;
  categoryColor.value = color;
  categoryName.value = name;
  openModal();
}

function onDelete(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this transaction!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(result => {
    if (result.isConfirmed) {
      deleteTransactionById(id).then(() => {
        transactions.value = transactions.value.filter(t => t.id !== id);
        Swal.fire('Deleted!', 'Your transaction has been deleted.', 'success');
      });
    }
  });
}

function addPrefixToDuplicateNames(series) {
  const nameTracker = {};

  series.forEach(item => {
    const { name, group } = item;

    // Check if the name already exists in the tracker
    if (!nameTracker[name]) {
      nameTracker[name] = group;
    } else {
      // If it exists and belongs to a different group, prefix both
      if (nameTracker[name] !== group) {
        const prefix = group === 'Penerimaan' ? 'in_' : 'out_';
        item.name = prefix + name;

        // Also update the original entry with the appropriate prefix
        const originalPrefix =
          nameTracker[name] === 'Penerimaan' ? 'in_' : 'out_';
        const originalItem = series.find(
          s => s.name === name && s.group === nameTracker[name]
        );
        if (originalItem) {
          originalItem.name = originalPrefix + name;
        }
      }
    }
  });
}

// Function to aggregate monthly totals by group
function calculateGroupTotals(series) {
  const monthlyTotals = {};

  series.forEach(item => {
    const { group, data } = item;

    data.forEach((value, index) => {
      const month = MONTHS[index]; // Assumes MONTHS is an array of month names or identifiers

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { Penerimaan: 0, Pengeluaran: 0 };
      }

      if (group === 'Penerimaan') {
        monthlyTotals[month]['Penerimaan'] += value;
      } else if (group === 'Pengeluaran') {
        monthlyTotals[month]['Pengeluaran'] += value;
      }
    });
  });

  return monthlyTotals;
}

function sortStacks(series) {
  // Sort series based on the sum of data values for each stack
  return series.sort((a, b) => {
    // Compare sums of data for each series to sort the series itself
    const sumA = a.data.reduce((acc, val) => acc + val, 0);
    const sumB = b.data.reduce((acc, val) => acc + val, 0);
    return sumA - sumB;
  });
}

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    height: 450,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 12,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'end',
      columnWidth: '70%',
      barHeight: '70%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: val => {
      return val / 1000000 + 'M';
    },
    style: {
      colors: ['#fff'],
    },
    dropShadow: {
      enabled: true,
    },
    offsetX: 0, // Adjust X offset as needed
    offsetY: 0, // Adjust Y offset as needed
  },
  stroke: {
    show: true,
    width: 0.1,
    colors: ['transparent'],
  },
  xaxis: {
    type: 'category',
    categories: chartData.value.map(item => item.month),
  },
  yaxis: {
    title: {
      text: 'Amount perMillion (IDR)',
    },
    labels: {
      formatter: function (val) {
        // Format the label with appropriate units
        return val / 1000000; // Converts to millions
      },
    },
    tickAmount: 14, // Adjust the number of ticks if needed
    min: 0, // Minimum value of the y-axis
    max: Math.ceil(maxValue / 5000000) * 5000000,
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const category = w.globals.seriesNames[seriesIndex];
      const value = series[seriesIndex][dataPointIndex];
      const group = w.config.series[seriesIndex].group;
      // Calculate total value for the stacked categories in the same group
      let totalValue = 0;
      w.config.series.forEach((s, i) => {
        if (s.group === group) {
          totalValue += series[i][dataPointIndex];
        }
      });
      return `<div class="apexcharts-tooltip-title">${group} (${formatRupiah(totalValue)})</div>
                <div>${category}: ${formatRupiah(value)} </div>`;
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      useSeriesColors: true, // Use colors defined for each series
    },
    items: Array.from(legendItems).map(category => ({
      name: category,
      color: colors[cats.indexOf(category)],
    })),
  },
}));

// Initialize an object to store totals by month
const monthlyTotals = {};
let chartSeries = [];
const legendItems = new Set();
let cats = [];
// const colors = [
//   '#FFADAD',
//   '#FFD6A5',
//   '#FDFFB6',
//   '#CAFFBF',
//   '#9BF6FF',
//   '#A0C4FF',
//   '#BDB2FF',
//   '#C9E4DE',
//   '#C6DEF1',
//   '#DBCDF0',
//   '#F2C6DE',
// ];
const colorScale = chroma.scale([
  'yellow',
  'lightgreen',
  '008ae5',
  '9BF6FF',
  'FFADAD',
]); // Adjust colors as needed
const colors = colorScale.colors(15); // Generate 10 hex colors

// Initialize data on component mount
onMounted(async () => {
  isLoading.value = true;
  await fetchDataChart();
  await fetchTransactions();

  cats = Array.from(new Set(transactionsDataChart.value.map(i => i.category)));

  transactionsDataChart.value.forEach(transaction => {
    const [monthIndex] = new Date(transaction.dtTransaction)
      .toLocaleDateString()
      .split('/');
    const month = MONTHS[parseInt(monthIndex) - 1];
    const category = transaction.category;
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = {};
    }

    if (!monthlyTotals[month][category]) {
      monthlyTotals[month][category] = { IN: 0, OUT: 0 };
    }

    if (transaction.in_out === 'Penerimaan') {
      monthlyTotals[month][category].IN += parseFloat(transaction.value);
    } else if (transaction.in_out === 'Pengeluaran') {
      monthlyTotals[month][category].OUT += parseFloat(transaction.value);
    }
  });
  // Convert the object into an array for charting
  chartData.value = Object.entries(monthlyTotals)
    .map(([month, totals]) => ({
      month,
      income: Object.entries(totals).map(([kategori, val]) => ({
        [kategori]: val.IN,
      })), //.reduce((acc, val) => acc + val.IN, 0),
      expense: Object.entries(totals).map(([kategori, val]) => ({
        [kategori]: val.OUT,
      })), //.reduce((acc, val) => acc + val.OUT, 0),
    }))
    .sort((a, b) => {
      // Parse the 'month' strings to Date objects for comparison
      const dateA = MONTHS.indexOf(a.month);
      const dateB = MONTHS.indexOf(b.month);
      return dateA < dateB ? -1 : 1;
    });
  chartData.value.forEach(({ month, income, expense }) => {
    income.forEach(item => {
      const [category, value] = Object.entries(item)[0];
      if (value) {
        legendItems.add(category);
        chartSeries.push({
          name: category,
          group: 'Penerimaan',
          color: colors[cats.indexOf(category)],
          data: chartData.value.map(d => (d.month === month ? value : 0)),
        });
      }
    });

    expense.forEach(item => {
      const [category, value] = Object.entries(item)[0];
      if (value) {
        legendItems.add(category);
        chartSeries.push({
          name: category,
          group: 'Pengeluaran',
          color: colors[cats.indexOf(category)],
          data: chartData.value.map(d => (d.month === month ? value : 0)),
        });
      }
    });
  });

  const mergedData = chartSeries.reduce((acc, curr) => {
    const existingEntry = acc.find(
      entry =>
        entry.name === curr.name &&
        entry.group === curr.group &&
        entry.color === curr.color
    );

    if (existingEntry) {
      existingEntry.data = existingEntry.data.map(
        (value, index) => value + curr.data[index]
      );
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  chartSeries = mergedData;
  addPrefixToDuplicateNames(chartSeries);
  // Calculate totals
  const groupTotals = calculateGroupTotals(chartSeries);

  // Find the maximum value across all groups
  maxValue = Math.max(
    ...Object.values(groupTotals).flatMap(totals => Object.values(totals))
  );
  const sortedSeries = sortStacks(chartSeries);
  chartSeries = sortedSeries;
  isLoading.value = false;
});
</script>

<style></style>
