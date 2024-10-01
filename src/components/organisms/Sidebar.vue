<template>
  <aside class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 h-screen p-4 text-white transition duration-300 transform w-sidebar bg-gray-50 no-scrollbar lg:translate-x-0 lg:static lg:inset-0"
    >
      <!-- <SidebarToggle /> -->
      <!-- sidebar head -->
      <div class="flex items-center justify-center mt-8 sidebar-head">
        <Logo />
        <div
          class="absolute hidden px-2 py-1 mt-3 text-xs text-gray-200 bg-gray-700 rounded-md dark:block"
        >
          Dark mode
        </div>
      </div>
      <nav class="mt-10">
        <ul>
          <li v-for="route in navRoutes" :key="route.path">
            <div v-if="route.children" class="menu-item">
              <MenuAccordion
                :is-active="
                  $route.matched.some(record => record.path === route.path)
                "
              >
                <template v-if="route.icon" v-slot:icon>
                  <Icon icon="gg:components" />
                </template>
                <template v-slot:title> {{ route.name }} </template>
                <template v-slot:content>
                  <div
                    v-for="childroute in route.children"
                    :key="childroute.path"
                  >
                    <router-link
                      :to="route.path + '/' + childroute.path"
                      exact-active-class="font-extrabold bg-opacity-25 border-blue-500"
                      class="block w-full p-2 text-sm text-left border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {{ childroute.name }}
                    </router-link>
                  </div>
                </template>
              </MenuAccordion>
            </div>
            <div v-else class="item">
              <router-link
                :to="route.path"
                exact-active-class="text-gray-100 bg-gray-600 bg-opacity-25 border-blue-500"
                class="flex items-center px-6 py-2 mt-4 text-gray-500 duration-200 rounded-md hover:bg-gray-200 hover:bg-opacity-25 hover:text-gray-100"
              >
                <!-- <component v-if="route?.icon" :is="route.icon" /> -->
                <i v-if="route.icon" class="mr-3 text-xl"
                  ><Icon icon="bxs:route.icon" class="w-5 h-5"
                /></i>

                <span class="mx-4">{{ route.name }}</span>
              </router-link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

import Logo from '@/components/molecules/layouts/Logo.vue';
import SidebarToggle from '@/components/molecules/layouts/SidebarToggle.vue';
import MenuAccordion from '@/components/molecules/MenuAccordion.vue';
import { useSidebar } from '@/composables/useSidebar';
import { routes } from '@/router';

const navRoutes = ref(routes[0].children);
console.log(navRoutes);
const { isOpen } = useSidebar();
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
