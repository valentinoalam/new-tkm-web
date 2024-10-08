<template>
  <div
    class="flex flex-col items-center justify-center pt-3 sm:flex-row sm:justify-between gap-y-2 sm:gap-x-5"
  >
    <ul class="flex flex-wrap items-center justify-center sm:justify-end">
      <!-- Breadcrumb for Root/Admin Route -->
      <!-- <li
        v-if="Object.keys($route).length > 0"
        class="text-xl text-gray-400 capitalize"
      >
        <router-link
          class="text-gray-700 transition duration-300 ease-linear db-breadcrumb-link hover:text-primary"
          :to="'/admin' + $route.path"
        >
          {{ $route.name }}
        </router-link>
      </li> -->
      <!-- Dynamic Breadcrumb Items -->
      <li
        v-for="(val, key) of breadcrumbs"
        :key="key"
        class="text-xl text-gray-400 capitalize"
      >
        <span v-if="key !== Object.keys(breadcrumbs).length - 1">
          <router-link
            class="text-gray-700 transition duration-300 ease-linear db-breadcrumb-link hover:text-primary"
            :to="val.path"
          >
            {{ val.meta.breadcrumb }}
          </router-link>
        </span>
        <span v-else>
          {{ val.meta.breadcrumb }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BreadcrumbComponent',
  data() {
    return {
      breadcrumbs: [],
    };
  },
  created() {
    this.setBreadcrumbs();
  },
  watch: {
    $route(to, from) {
      this.setBreadcrumbs(); // Update breadcrumbs on route change
    },
  },
  methods: {
    setBreadcrumbs() {
      this.breadcrumbs = this.$route.matched.filter(
        route => route.meta && route.meta.breadcrumb
      );
    },
  },
};
</script>

<style scoped>
.db-breadcrumb-link::after {
  padding-left: 0.375rem; /* Padding on left side */
  padding-right: 0.375rem; /* Padding on right side */
  --tw-text-opacity: 1; /* Setting text opacity */
  color: rgb(110 113 145 / var(--tw-text-opacity)); /* Light gray color */
  content: '/'; /* Slash as separator */
}
</style>
