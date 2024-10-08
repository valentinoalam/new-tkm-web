<template>
  <div
    :class="isOpen ? '' : 'lg:flex-nowrap'"
    class="flex flex-wrap justify-center w-full space-x-4 h-80"
  >
    <div :class="isOpen ? '' : 'lg:w-1/2'" class="w-full h-full">
      <VueApexCharts
        type="donut"
        :options="expenseChartOptions"
        :series="expenseSeries"
      />
    </div>
    <div :class="isOpen ? '' : 'lg:w-1/2'" class="w-full h-full">
      <VueApexCharts
        type="donut"
        :options="incomeChartOptions"
        :series="incomeSeries"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { computed, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
// import { MONTHS } from '@/constant';
import { getBalanceReport } from '@/service/appsheetService';
import { formatRupiah } from '@/utils/formatRupiah';
import { useSidebar } from '@/composables/useSidebar';

const { isOpen } = useSidebar();
const props = defineProps({
  month: {
    type: Number,
    default: 8,
  },
});

const totalDebit = ref(0);
const totalCredit = ref(0);
const expenseData = ref([]);
const incomeData = ref([]);

// Helper to safely fetch localStorage data
const getLocalStorageData = key => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Fetch data function
const fetchDataChart = async () => {
  try {
    const params = { year: new Date().getFullYear(), month: props.month };
    const response = await getBalanceReport(params);
    const { result, totalDebit: tdebit, totalCredit: tcredit } = response.data;

    const data = result.sort((a, b) => Number(b.debit) - Number(a.debit));
    localStorage.setItem(`trial-balance/${props.month}`, JSON.stringify(data));

    const expenseDataLocal = data
      .filter(i => i.debit !== 0)
      .map(i => ({ category: i.categoryName, value: i.debit }));

    const incomeDataLocal = data
      .filter(i => i.credit !== 0)
      .map(i => ({ category: i.categoryName, value: i.credit }));

    localStorage.setItem(
      `expense-${props.month}`,
      JSON.stringify(expenseDataLocal)
    );
    localStorage.setItem(
      `income-${props.month}`,
      JSON.stringify(incomeDataLocal)
    );

    totalDebit.value = tdebit;
    totalCredit.value = tcredit;

    expenseData.value = expenseDataLocal;
    incomeData.value = incomeDataLocal;
  } catch (error) {
    console.error('Error fetching trial balance:', error);
  }
};

// Load data from localStorage or fetch if not available
const loadData = async () => {
  const storedExpenseData = getLocalStorageData(`expense-${props.month}`);
  const storedIncomeData = getLocalStorageData(`income-${props.month}`);

  if (storedExpenseData && storedIncomeData) {
    expenseData.value = storedExpenseData;
    incomeData.value = storedIncomeData;
  } else {
    await fetchDataChart();
  }
};

watch(
  () => props.month,
  async () => {
    await loadData();
  }
);
// Fetch data when component is created
onMounted(() => {
  loadData();
});

// Helper function to get category color from localStorage
const getCategoryColor = (label, type) => {
  const catData = getLocalStorageData('categories');
  const matchedCategory = catData?.find(
    item => item.category === label && item.type === type
  );
  return matchedCategory ? matchedCategory.color : '#000000'; // Default to black
};

// Computed properties
const expenseCat = computed(() => expenseData.value.map(item => item.category));
const expenseSeries = computed(() =>
  expenseData.value.map(item => parseFloat(item.value))
);
const expenseColors = computed(() =>
  expenseCat.value.map(label => getCategoryColor(label, 'Pengeluaran'))
);

const incomeCat = computed(() => incomeData.value.map(item => item.category));
const incomeSeries = computed(() =>
  incomeData.value.map(item => parseFloat(item.value))
);
const incomeColors = computed(() =>
  incomeCat.value.map(label => getCategoryColor(label, 'Penerimaan'))
);

// Reusable chart options generator
const generateChartOptions = (
  title,
  categories,
  seriesColors,
  legendPosition = 'left'
) => ({
  labels: categories,
  chart: { type: 'donut', redrawOnParentResize: true },
  colors: seriesColors,
  legend: {
    position: legendPosition,
    width: 300,
    height: 300,
    horizontalAlign: 'center',
  },
  title: {
    text: title,
    align: 'center',
    style: { fontSize: '14px', fontWeight: 'bold', color: '#263238' },
  },
  tooltip: {
    y: { formatter: value => formatRupiah(value) },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' },
      },
    },
  ],
});

const expenseChartOptions = computed(() =>
  generateChartOptions(
    'Pengeluaran',
    expenseCat.value,
    expenseColors.value,
    'left'
  )
);
const incomeChartOptions = computed(() =>
  generateChartOptions(
    'Penerimaan',
    incomeCat.value,
    incomeColors.value,
    'right'
  )
);
</script>
<style scoped></style>
