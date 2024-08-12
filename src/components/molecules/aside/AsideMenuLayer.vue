<script lang="ts" setup>
import { mdiClose, mdiLogout } from '@mdi/js';
import { computed } from 'vue';

import BaseIcon from '@/components/BaseIcon.vue';
import AsideMenuItem from '@/components/Organisms/Aside/AsideMenuItem.vue';
import AsideMenuList from '@/components/Organisms/Aside/AsideMenuList.vue';

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['menu-click', 'aside-lg-close-click']);

const logoutItem = computed(() => ({
  label: 'Logout',
  icon: mdiLogout,
  color: 'info',
  isLogout: true,
}));

const menuClick = (event, item) => {
  emit('menu-click', event, item);
};

const asideLgCloseClick = event => {
  emit('aside-lg-close-click', event);
};
</script>

<template>
  <aside
    id="aside"
    class="fixed top-0 z-40 flex h-screen overflow-hidden lg:py-2 lg:pl-2 w-60 transition-position"
  >
    <div
      class="flex flex-col flex-1 overflow-hidden aside lg:rounded-2xl dark:bg-slate-900"
    >
      <div
        class="flex flex-row items-center justify-between aside-brand h-14 dark:bg-slate-900"
      >
        <div
          class="flex-1 text-center lg:text-left lg:pl-6 xl:text-center xl:pl-0"
        >
          <b class="font-black">One</b>
        </div>
        <button
          class="hidden p-3 lg:inline-block xl:hidden"
          @click.prevent="asideLgCloseClick"
        >
          <BaseIcon :path="mdiClose" />
        </button>
      </div>
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul>
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>
