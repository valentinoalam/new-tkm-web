<template>
  <div class="flex flex-col mb-6 -mt-6">
    <div class="flex justify-center flex-row mt-1.5 space-x-2 align-middle">
      <label for="month" class="flex text-sm font-medium text-gray-900">
        Financial Report
      </label>
      <select
        id="month"
        v-model="month"
        class="px-2 text-gray-700 border-gray-300 rounded-lg w-max sm:text-sm"
      >
        <option
          v-for="option in monthOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <ReportSummary :month="month" :week="week" />
    <ReportChart :month="month" />
  </div>
</template>

<script>
import ReportSummary from './ReportSummary.vue';
import { MONTHS } from '@/constant';
import ReportChart from './ReportChart.vue';

export default {
  components: {
    ReportSummary,
    ReportChart,
  },

  data() {
    const monthAvail = JSON.parse(localStorage.getItem('monthAvail')) || []; // Parse the JSON or default to an empty array
    return {
      monthAvail,
      month: new Date().getMonth() + 1,
      report: null,
      monthOptions: monthAvail.map(i => ({
        value: i,
        label: MONTHS[i - 1],
      })),
      weekOptions: [
        { label: ' - ', value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
      ],
    };
  },
  computed: {
    monthName() {
      // If the month value is valid, return the corresponding month name
      return this.month >= 1 && this.month <= 12
        ? this.MONTHS[this.month - 1]
        : '';
    },
  },
};
</script>
