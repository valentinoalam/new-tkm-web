<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="amount">Amount:</label>
      <input v-model="amount" name="amount" type="number" />
    </div>
    <div>
      <label for="date">Date:</label>
      <input v-model="date" name="date" type="date" />
    </div>
    <button type="submit">Add Transaction</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      amount: '',
      date: '',
    };
  },
  methods: {
    submitForm() {
      // Logic to submit form
    },
  },
};
</script>
