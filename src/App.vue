<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const defaultLayout = 'default';

const { currentRoute } = useRouter();

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
);
</script>

<template>
  <div class="grid min-h-[100dvh] grid-rows-[auto-1fr-auto]">
    <component :is="layout">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
  </div>
</template>
