import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(false);
  const selected = useStorage('selected', ref('eCommerce'));
  const page = useStorage('page', ref('Dashboard'));

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  return { isSidebarOpen, toggleSidebar, selected, page };
});

// import { defineStore } from 'pinia';

// this is sidebar data s
// if your adding a router or link add data use object
// here

// export const useSidebar = defineStore({
//   state: () => ({
//     menu: [
//       {
//         name: 'MENU',
//         children: [
//           {
//             name: 'Dashboard',
//             icon: 'bxs:dashboard',
//             type: 'default',
//             url: '/',
//           },
//           {
//             name: 'Components',
//             icon: '',
//             type: 'accordion',
//             url: false,
//             isChildren: true,
//             children: [
//               {
//                 name: 'Alert',
//                 icon: false,
//                 type: 'default',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   }),
// });
