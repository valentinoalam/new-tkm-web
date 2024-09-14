<template>
  <!-- App -->
  <div class="flex bg-gray-50 font-lexend dark:bg-gray-900">
    <div v-if="!$route.meta.hideNav" class="lg:block">
      <div
        class="fixed z-20 overflow-auto bg-white border-r-2 lg:flex-auto w-sidebar dark:bg-gray-800 dark:border-gray-700 lg:z-0 lg:relative"
      >
        <perfect-scrollbar class="h-screen">
          <Sidebar v-if="!$route.meta.hideNav" />
          <sidebarlist v-if="!$route.meta.hideNav" @sidebarToggle="close" />
        </perfect-scrollbar>
      </div>
    </div>
    <div
      class="w-full transition-colors grid min-h-dvh grid-rows-[auto_1fr_auto]"
    >
      <admin-header :title="route.name" v-if="!route.meta.hideNav" />
      <main class="relative bg-gray-200">
        <div class="h-full px-2 py-8 mx-auto lg:container">
          <slot />
        </div>
      </main>
      <!-- <admin-footer v-if="!$route.meta.hideNav">
          <span class="text-sm dark:text-gray-400">
            TataKelolaMasjid Made by ❤️ Valentino Alam
          </span>
        </admin-footer> -->
    </div>
  </div>
  <!-- End app -->
</template>

<script setup>
import Scrollbar from 'smooth-scrollbar';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// import AdminFooter from '@/components/organisms/AdminFooter.vue';
import AdminHeader from '@/components/organisms/AdminHeader.vue';
import Sidebar from '@/components/organisms/Sidebar.vue';
import { useSidebar } from '@/composables/useSidebar';

const { isOpen } = useSidebar();

// Access the current route
const route = useRoute();
// Watch for changes in the route
watch(route, () => {
  isOpen.value = false;
});

onMounted(() => {
  const bodyScrollElement = document.querySelector('#body-scroll');

  if (bodyScrollElement) {
    Scrollbar.init(bodyScrollElement);
  }
});
</script>

<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
