import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import ImageEditor from '@/views/ImageEditor.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/image-editor',
    name: 'Editor',
    component: ImageEditor,
    meta: { title: 'Image Editor', layout: 'empty' },
  },
  {
    path: '/',
    name: 'Kas Kecil',
    component: defineAsyncComponent(
      () => import('@/views/kas/jurnal/index.vue')
    ),
    meta: { title: 'Beranda' },
  },
  {
    path: '/users',
    name: 'User Management',
    component: defineAsyncComponent(
      () => import('@/views/user/UserManagement.vue')
    ),
    meta: { title: 'users' },
  },
  // {
  //   path: '/account',
  //   name: 'Account',
  //   component: defineAsyncComponent(() => import('@/views/account/index.vue')),
  //   meta: { title: 'users' },
  // },
  {
    path: '/login',
    name: 'Log in',
    component: defineAsyncComponent(() => import('@/views/auth/signin.vue')),
    meta: { title: 'Login', layout: 'empty' },
  },
  // Create a parent component for better organization
  // children: [
  //   {
  //     path: '',
  //     name: 'Transaksi',
  //     component: defineAsyncComponent(
  //       () => import('@/views/kas/jurnal/index.vue')
  //     ), // Lazy load TransactionList
  //     meta: { requiresAuth: false, title: 'Jurnal' },
  //   },
  //   // {
  //   //   path: 'cash/laporan',
  //   //   name: 'FinancialReport',
  //   //   component: defineAsyncComponent(
  //   //     () => import('@/views/kas/jurnal/laporan/FinancialReport.vue')
  //   //   ), // Lazy load FinancialReport
  //   // },
  //   {
  //     path: 'cash/budget',
  //     name: 'Budget',
  //     component: defineAsyncComponent(
  //       () => import('@/views/kas/anggaran/Budget.vue')
  //     ), // Lazy load Budget
  //   },
  // ],
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
  document.title = `Masjidku ${to.meta.title} | Kelola Masjid`;
  next();
});

router.afterEach((to, from) => {
  console.log('Navigation completed to:', to.fullPath, 'from:', from.fullPath);
});

export default router;
