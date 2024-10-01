<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Account</th>
          <th>Debits</th>
          <th>Credits</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td>{{ row.original.categoryName }}</td>
          <!-- Display category name -->
          <td>{{ row.original.debit }}</td>
          <td>{{ row.original.credit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useVueTable, getCoreRowModel } from '@tanstack/vue-table';
import axios from 'axios';
import { ref, computed } from 'vue';

export default {
  setup() {
    const columns = [
      { header: 'Account (Category)', accessorKey: 'categoryName' },
      { header: 'Debits', accessorKey: 'debit' },
      { header: 'Credits', accessorKey: 'credit' },
    ];

    const data = ref([]);
    const table = useVueTable({
      columns,
      data: computed(() => data.value),
      getCoreRowModel: getCoreRowModel(),
    });

    const fetchReportData = async (month, year) => {
      const response = await axios.get(`/api/report/balance`, {
        params: { month, year },
      });
      data.value = response.data.map(item => ({
        categoryName: item.categoryName, // Add category name from API response
        debit: item._sum.value > 0 ? item._sum.value : 0,
        credit: item._sum.value < 0 ? Math.abs(item._sum.value) : 0,
      }));
    };

    fetchReportData(8, 2024); // Example to fetch for August 2024

    return { table };
  },
};
</script>

<!-- 
<template>
  <div>
    <h2>Transactions Grouped by Type</h2>
    <div v-for="(transactions, type) in groupedTransactions" :key="type">
      <h3>{{ type }}</h3>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Value</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.activity }}</td>
            <td>{{ transaction.value }}</td>
            <td>{{ transaction.category.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      groupedTransactions: {}
    };
  },
  async mounted() {
    const response = await axios.get('/api/transactions/groupedByType');
    this.groupedTransactions = response.data;
  }
};
</script>


<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Activity</th>
          <th>Kategori</th>
          <th>Debit</th>
          <th>Credit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ formatDate(row.dtTransaction) }}</td>
          <td>{{ row.activity }}</td>
          <td>{{ row.category }}</td>
          <td v-if="row.in_out === 'Penerimaan'">{{ formatCurrency(row.value) }}</td>
          <td v-else></td>
          <td v-if="row.in_out === 'Pengeluaran'">{{ formatCurrency(row.value) }}</td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
});

const rows = ref(props.transactions);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style> -->
