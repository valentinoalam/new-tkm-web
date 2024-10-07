<template>
  <div class="bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
    <Header />
    <slot />
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/landing/header.vue';
import Footer from '@/components/landing/footer.vue';
</script>
