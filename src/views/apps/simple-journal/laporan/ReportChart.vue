<template>
  <div
    :class="isOpen ? '' : 'lg:flex-nowrap'"
    class="flex flex-wrap justify-center w-full space-x-4"
  >
    <div :class="isOpen ? '' : 'lg:w-1/2'" class="w-full">
      <VueApexCharts
        type="donut"
        :options="expenseChartOptions"
        :series="expenseSeries"
      />
    </div>
    <div :class="isOpen ? '' : 'lg:w-1/2'" class="w-full">
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
import { computed, watch } from 'vue';
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

const fetchDataChart = async () => {
  try {
    const params = {
      year: new Date().getFullYear(),
      month: props.month,
    };
    const response = await getBalanceReport(params); // Replace with your API endpoint
    const { result, totalDebit: tdebit, totalCredit: tcredit } = response.data;
    const data = result.sort((a, b) => Number(b.debit) - Number(a.debit));
    localStorage.setItem(`trial-balance/${props.month}`, JSON.stringify(data));
    const expenseData = data
      .filter(i => i.debit !== 0)
      .map(i => ({ category: i.categoryName, value: i.debit }));
    const incomeData = data
      .filter(i => i.credit !== 0)
      .map(i => ({ category: i.categoryName, value: i.credit }));
    localStorage.setItem(`expense-${props.month}`, JSON.stringify(expenseData));
    localStorage.setItem(`income-${props.month}`, JSON.stringify(incomeData));
    totalDebit.value = tdebit;
    totalCredit.value = tcredit;
    return result.sort((a, b) => Number(b.debit) - Number(a.debit));
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return [];
  }
};
// onMounted(() => {
//   if(localStorage.getItem(`expense-${props.month}`)) {

//   }
// });
const expenseData =
  JSON.parse(localStorage.getItem(`expense-${props.month}`)) ||
  fetchDataChart();
const incomeData = JSON.parse(localStorage.getItem(`income-${props.month}`));
// Watch for changes in month or week and refetch data when they change
watch(
  () => [props.month, props.week], // Watch the `month` and `week` props
  (newValues, oldValues) => {
    // Check if either month or week has changed and refetch the data
    if (newValues !== oldValues) {
      fetchDataChart();
    }
  }
);
const expenseCat = expenseData.map(item => item.category);
const expenseSeries = computed(() =>
  expenseData.map(item => parseFloat(item.value))
);
const incomeSeries = computed(() =>
  incomeData.map(item => parseFloat(item.value))
);
const expenseColors = expenseCat.map(label => {
  const catData = JSON.parse(localStorage.getItem(`categories`));
  const matchedCategory = catData.find(
    item => item.category === label && item.type === 'Pengeluaran'
  );
  return matchedCategory ? matchedCategory.color : '#000000'; // Default to black if no match is found
});

const incomeCat = incomeData.map(item => item.category);
const incomeColors = incomeCat.map(label => {
  const catData = JSON.parse(localStorage.getItem(`categories`));
  const matchedCategory = catData.find(
    item => item.category === label && item.type === 'Penerimaan'
  );
  return matchedCategory ? matchedCategory.color : '#000000'; // Default to black if no match is found
});
const expenseChartOptions = computed(() => ({
  labels: expenseCat,
  chart: {
    type: 'donut',
    width: 300,
    height: 300,
  },
  colors: expenseColors,
  legend: {
    position: 'left',
    width: 300,
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: 0,
  },
  title: {
    text: 'Pengeluaran',
    align: 'center',
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      // fontFamily:  undefined,
      color: '#263238',
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}));
const incomeChartOptions = computed(() => ({
  labels: incomeCat,
  chart: {
    type: 'donut',
    width: 300,
    height: 300,
  },
  colors: incomeColors,
  legend: {
    position: 'right',
    width: 300,
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: 0,
  },
  title: {
    text: 'Penerimaan',
    align: 'center',
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      // fontFamily:  undefined,
      color: '#263238',
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}));
</script>
<style scoped>
#chart {
  max-width: 760px;
  margin: 35px auto;
  opacity: 0.9;
}
</style>
