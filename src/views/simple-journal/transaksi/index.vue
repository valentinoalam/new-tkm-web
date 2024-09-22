<template>
  <div v-if="isLoading" class="flex items-center justify-center w-full h-full">
    <looping-rhombuses-spinner
      :animation-duration="2500"
      :rhombus-size="15"
      color="#CAFFBF"
    />
  </div>
  <div v-else>
    <!-- Modal Form -->
    <div
      v-show="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center w-full transition-opacity bg-black bg-opacity-50"
    >
      <div
        class="absolute top-0 right-0 z-50 flex flex-col items-center h-full mt-4 mr-4 text-sm text-white cursor-pointer"
      >
        <svg
          class="text-white fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
          />
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>
      <div
        v-if="modalContent === ModalContent[1]"
        ref="menu"
        class="w-1/3 py-4 bg-white rounded-lg h-[92%] min-w-72"
      >
        <h2 class="px-2 mb-4 text-2xl">
          {{ selectedTransaction ? 'Edit Transaction' : 'Add New Transaction' }}
        </h2>
        <div class="h-[90%] px-4 pb-1 overflow-y-auto">
          <AddOrEditTransaction
            :selectedTransaction="selectedTransaction"
            @closeModal="closeModal"
            @updateTransaction="handleUpdateTransaction"
            @createTransaction="handleCreateTransaction"
          />
        </div>
      </div>
      <EditCategory
        v-else-if="modalContent === ModalContent[2]"
        :id="selectedCategory"
        :color="categoryColor"
        :category-name="categoryName"
        @update-category="handleUpdateCategory"
      />
    </div>
    <div class="space-y-7">
      <VueApexCharts
        type="bar"
        :options="chartOptions"
        :series="chartSeries"
        height="450"
      />
      <FinancialReport :monthAvail="monthAvail" />
      <!-- Transaction Table -->
      <Table
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
        @search="handleSearch"
        @editCategory="onEditCategory"
      />
    </div>
  </div>
</template>

<script setup>
// import/no-extraneous-dependencies
// import chroma from 'chroma-js';
import { LoopingRhombusesSpinner } from 'epic-spinners';

import Swal from 'sweetalert2';
import { computed, onMounted, onBeforeUnmount, ref, useTemplateRef } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import EditCategory from '../kategori/EditCategory.vue';
import FinancialReport from '../laporan/FinancialReport.vue';
import AddOrEditTransaction from '../transaksi/AddOrEdit.vue';
import columns, { getRowClass } from './colDef';
import Table from '@/components/Table.vue';
import { MONTHS } from '@/constant';
import {
  getTransactionDataChart,
  getAllTransactions,
  deleteTransactionById,
  createTransaction,
  updateTransactionById,
  updateCategoryById,
} from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

const isLoading = ref(false);
const transactions = ref({}); // Transactions data from API
const transactionsDataChart = ref([]);
const isModalOpen = ref(false); // Controls modal visibility
const modalContent = ref(''); // Controls modal visibility
const selectedTransaction = ref(null); // Selected transaction for editing
const selectedCategory = ref(null);
const pageSize = ref(10);
const currentPage = ref(1);
const totalRecords = ref(0);
const totalPages = ref(0);
const categoryName = ref('');
const categoryColor = ref('');
const search = ref('');
const ModalContent = ['none', 'transaction', 'category'];
const maxValue = ref();
const chartHeight = ref(window.innerHeight * 0.85);
const chartWidth = ref(window.innerWidth * 0.9);

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};
const updateChartSize = () => {
  chartHeight.value = window.innerHeight * 0.85; // Update height based on window size
  chartWidth.value = window.innerWidth * 0.9;
};

// Debounced version of the updateChartHeight function
const debouncedUpdateChartSize = debounce(updateChartSize, 300); // 300ms delay

async function handleDateRange(dtStart, dtEnd) {
  await fetchTransactions(dtStart, dtEnd);
}

// Fetch transactions from API
const fetchTransactions = async (dtStart = null, dtEnd = null) => {
  try {
    let response;
    response = await getAllTransactions({
      startDate: dtStart,
      endDate: dtEnd,
      page: currentPage.value,
      limit: pageSize.value,
      search: search.value,
    });
    transactions.value = response.data;
    totalRecords.value = response.totalRecords;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

const fetchDataChart = async () => {
  try {
    const response = await getTransactionDataChart(); //axios.get('/dari-appsheet/transactions');
    transactionsDataChart.value = response.result;

    monthAvail = response.months;
    const chartData = await transactionsDataChart.value.filter(item =>
      item.data.some(value => value !== 0)
    );
    const groupTotals = await calculateGroupTotals(chartData);
    // Find the maximum value across all groups
    maxValue.value = await Math.max(
      ...Object.values(groupTotals).flatMap(totals => Object.values(totals))
    );
    const sortedSeries = await sortStacks(chartData);
    chartSeries.value = sortedSeries;
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
  await fetchTransactions();
};

const handleUpdateCategory = async data => {
  if (!data) return closeModal();
  const { id, color, name } = data;
  await updateCategoryById(id, { color, name });
  closeModal();
  await fetchTransactions();
  await fetchDataChart();
};

const handleSearch = async query => {
  search.value = query;
  currentPage.value = 1;
  await fetchTransactions();
};
const handleCreateTransaction = async data => {
  await createTransaction(data);
  await fetchTransactions();
};
const handleUpdateTransaction = async data => {
  await updateTransactionById(data);
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

// Function to aggregate monthly totals by group
function calculateGroupTotals(series) {
  const monthlyTotals = {};

  series.forEach(item => {
    const { group, data } = item;

    data.forEach((value, index) => {
      const month = MONTHS[monthAvail[index] - 1]; // Assumes MONTHS is an array of month names or identifiers

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { Penerimaan: 0, Pengeluaran: 0 };
      }

      if (group === 'Penerimaan') {
        monthlyTotals[month]['Penerimaan'] += parseFloat(value);
      } else if (group === 'Pengeluaran') {
        monthlyTotals[month]['Pengeluaran'] += parseFloat(value);
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
    height: chartHeight.value,
    width: chartWidth.value,
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
      return (val / 1000000).toFixed(2) + 'M';
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
    categories:
      monthAvail && monthAvail.length > 0
        ? monthAvail.map(i => MONTHS[i - 1])
        : MONTHS,
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
    max: Math.ceil(maxValue.value / 5000000) * 5000000,
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
      useSeriesColors: false, // Use colors defined for each series
    },
  },
}));

let chartSeries = ref([]);
let monthAvail = [];

const openModal = () => {
  isModalOpen.value = true;
  // Defer adding the event listener to avoid it triggering immediately
  setTimeout(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscKey);
  }, 0);
};

const closeModal = () => {
  selectedTransaction.value = null;
  isModalOpen.value = false;
  modalContent.value = ModalContent[0];
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleEscKey);
};

const menu = useTemplateRef('menu');
function handleClickOutside(event) {
  if (menu && !menu.value.contains(event.target)) {
    closeModal();
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape') {
    closeModal(); // Close modal if the Esc key is pressed
  }
}
onMounted(async () => {
  isLoading.value = true;
  chartWidth.value = window.innerWidth * 0.9;
  window.addEventListener('resize', debouncedUpdateChartSize);

  await fetchDataChart();
  await fetchTransactions();
  isLoading.value = false;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedUpdateChartSize);
  window.removeEventListener('click', handleClickOutside);
});
</script>
<style>
#chart {
  max-width: 760px;
  margin: 35px auto;
  opacity: 0.9;
}
</style>
