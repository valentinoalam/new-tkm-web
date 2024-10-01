<template>
  <div
    v-if="isLoading"
    ref="parentElement"
    class="flex items-center justify-center w-full h-dvh"
  >
    <looping-rhombuses-spinner
      :animation-duration="2500"
      :rhombus-size="15"
      color="#CAFFBF"
    />
  </div>
  <div v-else class="mb-9">
    <VueApexCharts
      type="bar"
      :options="chartOptions"
      :series="chartSeries"
      height="475"
    />
    <ReportChart />
  </div>
</template>

<script setup>
// import/no-extraneous-dependencies
// import chroma from 'chroma-js';
import ReportChart from './laporan/ReportChart.vue';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { computed, nextTick, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { MONTHS } from '@/constant';
import { getTransactionDataChart } from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';

const isLoading = ref(false);
const transactionsDataChart = ref([]);
const maxValue = ref();
const parentElement = ref(null);
const chartHeight = ref(window.innerHeight * 0.85);
const chartWidth = ref(0); // Store the calculated chart width

// Watch for changes in parentElement and update chartWidth after 3 seconds
let resizeTimeout = null; // Declare timeout variable

let chartSeries = ref([]);
let monthAvail = [];

const fetchDataChart = async () => {
  try {
    const response = await getTransactionDataChart(); //axios.get('/dari-appsheet/transactions');
    transactionsDataChart.value = response.result;

    monthAvail = response.months;
    localStorage.setItem('monthAvail', JSON.stringify(monthAvail));
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

watch(parentElement, newValue => {
  // Clear any existing timeout
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  // Set a new timeout to update chartWidth after 3 seconds
  resizeTimeout = setTimeout(() => {
    if (newValue) {
      chartWidth.value = newValue.getBoundingClientRect().width * 0.9;
    } else {
      chartWidth.value = 0; // Reset if newValue is not available
    }
  }, 300); // 3000 milliseconds (3 seconds)
});

// Optional: Initialize chartWidth when the component is mounted

onMounted(async () => {
  isLoading.value = true;
  await nextTick(); // Ensure the DOM is fully rendered before accessing the ref
  if (parentElement.value) {
    chartWidth.value = parentElement.value.getBoundingClientRect().width * 0.9;
  }
  await fetchDataChart();

  isLoading.value = false;
});

onBeforeUnmount(() => {});
</script>
<style scoped>
#chart {
  max-width: 760px;
  margin: 35px auto;
  opacity: 0.9;
}
</style>
