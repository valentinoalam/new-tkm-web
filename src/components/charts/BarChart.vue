<template>
  <div>
    <apexchart
      type="bar"
      :height="height"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'BarChart',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    series: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 350,
    },
    title: {
      type: String,
      default: 'Bar Chart',
    },
    xAxisTitle: {
      type: String,
      default: 'Categories',
    },
    yAxisTitle: {
      type: String,
      default: 'Values',
    },
  },
  setup(props) {
    const chartOptions = computed(() => ({
      chart: {
        id: 'bar-chart',
      },
      xaxis: {
        categories: props.categories,
        title: {
          text: props.xAxisTitle,
        },
      },
      yaxis: {
        title: {
          text: props.yAxisTitle,
        },
      },
      title: {
        text: props.title,
        align: 'center',
      },
    }));

    return {
      chartOptions,
    };
  },
});
</script>

<!-- <template>
  <div>
    <apexchart
      width="500"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const options = ref({
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
});
const series = ref([
  {
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
]);
</script> -->
