<template>
  <div class="sj-base">
    <h1 class="-mt-5 text-2xl font-bold">{{ title }}</h1>
    <router-view />
    <!-- This will display child routes -->
  </div>
</template>

<script>
export default {
  name: 'SJBase',
  computed: {
    title() {
      return this.$route.meta.title || 'Simple Journal';
    },
  },
};
</script>

<style scoped>
.sj-base {
  padding: -2rem; /* Add some padding */
}
</style>
