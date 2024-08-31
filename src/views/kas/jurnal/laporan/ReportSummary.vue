<template>
  <div>
    <h2>Report from {{ report.periodStart }} to {{ report.periodEnd }}</h2>
    <p>Total Income: {{ report.totalIncome }}</p>
    <p>Total Expense: {{ report.totalExpense }}</p>
    <p>Net Income: {{ report.netIncome }}</p>
  </div>
</template>

<script>
export default {
  props: {
    report: Object,
  },
};
</script>
