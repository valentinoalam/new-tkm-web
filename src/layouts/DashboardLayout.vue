<template>
  <!-- App -->
  <div class="box-border flex max-w-vw bg-gray-50 font-lexend dark:bg-gray-900">
    <div
      class="fixed z-20 flex-initial bg-white border-r-2 h-dvh dark:bg-gray-800 dark:border-gray-700 lg:z-0 lg:relative"
    >
      <transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <Sidebar v-if="isOpen" />
      </transition>
    </div>
    <div class="flex flex-col flex-1 w-4/6 transition-all duration-300">
      <admin-header :title="route.name" v-if="!route.meta.hideNav" />
      <main
        id="body-scroll"
        class="relative w-full px-2 py-8 mx-auto overflow-y-auto bg-gray-200 h-[60dvh] min-h-dvh lg:container"
      >
        <perfect-scrollbar :options="{ suppressScrollX: true }">
          <slot />
        </perfect-scrollbar>
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0px;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* ::-webkit-scrollbar {
    width: 0px;
  } */
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
