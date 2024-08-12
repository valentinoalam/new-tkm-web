import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: defineAsyncComponent(() => import('@/views/Home.vue')), // Lazy load Home component
    meta: { title: 'Beranda' },
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
          () => import('@/views/kas/jurnal/TransactionList.vue')
        ), // Lazy load TransactionList
        meta: { requiresAuth: false, title: 'Beranda_Inventory' },
      },
      {
        path: '/cash/laporan',
        name: 'FinancialReport',
        component: defineAsyncComponent(
          () => import('@/views/kas/laporan/FinancialReport.vue')
        ), // Lazy load FinancialReport
      },
      {
        path: '/cash/budget',
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
  //   component: defineAsyncComponent(() => import('@/views/aset/Inventory.vue')),
  // },
  // {
  //   path: '/agenda',
  //   name: 'kajian',
  //   component: defineAsyncComponent(
  //     () => import('@/views/kegiatan/Activities.vue')
  //   ),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
