<template>
  <div class="inline-flex rounded-lg shadow-sm">
    <button
      type="button"
      class="inline-flex items-center justify-center w-12 py-3 text-sm font-medium text-white bg-blue-500 shadow-sm hover:bg-blue-700 px-auto gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg focus:z-10 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
      @click="handleEdit(value)"
    >
      <LucideEdit />
    </button>
    <button
      type="button"
      class="inline-flex items-center justify-center w-12 py-3 text-sm font-medium text-white bg-red-500 shadow-sm hover:bg-red-700 px-auto gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg focus:z-10 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
      @click="handleDelete(value)"
    >
      <LucideDelete />
    </button>
    <!-- Add more buttons or actions as needed -->
  </div>
</template>

<script lang="ts">
import { LucideEdit, LucideDelete } from 'lucide-vue-next';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    LucideEdit,
    LucideDelete,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleEdit(id: string) {
      this.$emit('edit', id);
    },
    handleDelete(id: string) {
      this.$emit('delete', id);
    },
  },
});
</script>

<style scoped>
/* Add any scoped styles if needed */
</style>
