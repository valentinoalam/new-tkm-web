<template>
  <div>
    <h1>Financial Report</h1>
    <form @submit.prevent="fetchReport">
      <select v-model="month">
        <option
          v-for="option in monthOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <button type="submit">Get Report</button>
    </form>
    <ReportSummary :month="month" :week="week" />
  </div>
</template>

<script>
import ReportSummary from './ReportSummary.vue';
import { MONTHS } from '@/constant';

export default {
  components: {
    ReportSummary,
  },
  props: {
    monthAvail: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      month: new Date().getMonth() + 1,
      report: null,
      monthOptions: this.monthAvail.map(i => ({
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
};
</script>
