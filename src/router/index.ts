import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import ImageEditor from '@/views/ImageEditor.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: defineAsyncComponent(() => import('@/views/Home.vue')), // Lazy load Home component
    meta: { title: 'Beranda' },
  },
  {
    path: '/image-editor',
    name: 'Editor',
    component: ImageEditor,
    meta: { title: 'Image Editor', layout: 'empty' },
  },
  {
    path: '/kas',
    name: 'kas',
    // component: () => import('@/views/kas/Kas.vue'), // Create a parent component for better organization
    children: [
      {
        path: '',
        name: 'Transaksi',
        component: defineAsyncComponent(
          () => import('@/views/kas/jurnal/index.vue')
        ), // Lazy load TransactionList
        meta: { requiresAuth: false, title: 'Beranda_Inventory' },
      },
      // {
      //   path: 'cash/laporan',
      //   name: 'FinancialReport',
      //   component: defineAsyncComponent(
      //     () => import('@/views/kas/jurnal/laporan/FinancialReport.vue')
      //   ), // Lazy load FinancialReport
      // },
      {
        path: 'cash/budget',
        name: 'Budget',
        component: defineAsyncComponent(
          () => import('@/views/kas/anggaran/Budget.vue')
        ), // Lazy load Budget
      },
    ],
  },
  // {
  //   path: '/aset',
  //   name: 'aset',
  //   component: () => import('@/views/aset/Inventory.vue')),
  // },
  // {
  //   path: '/agenda',
  //   name: 'kajian',
  //   component:
  //     () => import('@/views/kegiatan/Activities.vue')
  //   ),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  console.log('Navigating to:', to.fullPath);
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`;
  next();
});

router.afterEach((to, from) => {
  console.log('Navigation completed to:', to.fullPath, 'from:', from.fullPath);
});

export default router;
