// src/components/ReportChart.vue
<template>
  <div>
    <bar-chart :chart-data="dataCollection" :options="options"></bar-chart>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';

export default {
  components: {
    'bar-chart': Bar,
  },
  data() {
    return {
      dataCollection: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'Income',
            backgroundColor: '#f87979',
            data: [40, 39, 10, 40, 39, 80, 40],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>
