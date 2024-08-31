<!-- <template>
  <div>
    <h1>Financial Report</h1>
    <form @submit.prevent="fetchReport">
      <div>
        <label for="startDate">Start Date:</label>
        <input type="date" v-model="startDate" required />
      </div>
      <div>
        <label for="endDate">End Date:</label>
        <input type="date" v-model="endDate" required />
      </div>
      <button type="submit">Get Report</button>
    </form>
    <ReportSummary v-if="report" :report="report" />
  </div>
</template>

<script>
import { fetchFinancialReport } from '@/service/transactionService';
import ReportSummary from './ReportSummary.vue';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      report: null,
    };
  },
  components: {
    ReportSummary,
  },
  methods: {
    async fetchReport() {
      try {
        this.report = await fetchFinancialReport(this.startDate, this.endDate);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    },
  },
};
</script> -->
