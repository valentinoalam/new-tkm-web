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
        class="relative w-full mx-auto overflow-y-auto bg-gray-200 h-[60dvh] min-h-dvh"
      >
        <perfect-scrollbar :options="{ suppressScrollX: true }">
          <!-- The <slot /> will render child components here -->
          <div class="px-2 py-8 lg:container">
            <slot />
          </div>
          <!-- Modal Structure -->
          <div>
            <div
              v-show="isVisible()"
              class="fixed inset-0 flex items-center justify-center w-full transition-opacity bg-black bg-opacity-50 z-1"
            >
              <div
                class="absolute top-0 right-0 z-10 flex flex-col items-center h-full mt-4 mr-4 text-sm text-white cursor-pointer"
                @click="closeModal"
              >
                <svg
                  class="text-white fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path
                    d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                  />
                </svg>
                <span class="text-sm">(Esc)</span>
              </div>
            </div>
          </div>
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
import { useBackdrop } from '@/composables/useBackdrop';

const { isOpen } = useSidebar();
const { isVisible } = useBackdrop();

// Access the current route
const route = useRoute();
// // Watch for changes in the route
watch(route, () => {
  if (window.innerWidth < 720) {
    isOpen.value = false; // Close sidebar when the screen width is smaller than large (1024px)
  }
});

onMounted(() => {
  const bodyScrollElement = document.querySelector('#body-scroll');
  if (bodyScrollElement) {
    Scrollbar.init(bodyScrollElement);
  }
  // const storedValue = localStorage.getItem('sidebar-open');
  // console.log(JSON.parse(storedValue));
  // if (storedValue !== null) {
  //   isOpen.value = JSON.parse(storedValue);
  // }
});
</script>

<style scoped>
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
