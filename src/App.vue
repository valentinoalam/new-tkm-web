<script lang="ts" setup>
import { computed, onMounted, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/stores/auth';

const defaultLayout = 'default';
const isLayoutReady = ref(false); // Reactive flag to control rendering
const route = useRoute();

const layout = computed(() => {
  const layoutName = `${route.meta.layout || defaultLayout}-layout`;
  console.log('Computed layout:', layoutName); // Debugging output
  return layoutName;
});

onBeforeMount(() => {
  const authStore = useAuth();
  authStore.checkCredentials();
});

onMounted(() => {
  if (route) {
    isLayoutReady.value = true; // Set the flag to true once layout is ready
  }
});
</script>

<template>
  <component v-if="isLayoutReady" :is="layout">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </component>
</template>
