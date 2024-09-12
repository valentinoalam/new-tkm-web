<template>
  <div>
    <Toaster />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner';
</script>
