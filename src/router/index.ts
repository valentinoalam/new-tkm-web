import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

//auth
const login = defineAsyncComponent(() => import('@/views/auth/signin.vue'));
const imgEditor = defineAsyncComponent(() => import('@/views/imgEditor.vue'));
const SJ_base = defineAsyncComponent(
  () => import('@/views/apps/simple-journal/index.vue')
);
const SJ_dashboard = defineAsyncComponent(
  () => import('@/views/apps/simple-journal/dashboard/index.vue')
);
const SJ_transaction_list = defineAsyncComponent(
  () => import('@/views/apps/simple-journal/transaksi/index.vue')
);
const SJ_categories = defineAsyncComponent(
  () => import('@/views/apps/simple-journal/kategori/index.vue')
);
const SJ_reports = defineAsyncComponent(
  () => import('@/views/apps/simple-journal/laporan/FinancialReport.vue')
);
const home = defineAsyncComponent(() => import('@/views/home.vue'));
const landing = defineAsyncComponent(() => import('@/views/landing.vue'));
const about = defineAsyncComponent(() => import('@/views/about-me.vue'));

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    meta: { requiresAuth: true, breadcrumb: 'Admin' }, // Protect all child routes
    children: [
      {
        path: '/kas-kecil',
        name: 'Kas Kecil',
        component: SJ_base,
        meta: { title: 'Kas Kecil', breadcrumb: 'KasKecil' },
        children: [
          {
            path: '',
            name: 'Dashboard',
            component: SJ_dashboard,
            meta: { title: 'Beranda', breadcrumb: '' },
          },
          {
            path: 'transaction',
            name: 'Transaction',
            component: SJ_transaction_list,
            meta: { title: 'Transaction', breadcrumb: 'Transaction' },
          },
          {
            path: 'category',
            name: 'Category',
            component: SJ_categories,
            meta: { title: 'Category', breadcrumb: 'Category' },
          },
          {
            path: 'report',
            name: 'Report',
            component: SJ_reports,
            meta: { title: 'Report', breadcrumb: 'Report' },
          },
        ],
      },
      {
        path: 'users',
        name: 'User Management',
        component: defineAsyncComponent(() => import('@/views/user/index.vue')),
        meta: { title: 'Users', breadcrumb: 'user' },
      },
    ],
  },
  {
    path: '/image-editor',
    name: 'Editor',
    component: imgEditor,
    meta: { title: 'Image Editor' }, // Meta info specific to Image Editor
  },
  {
    path: '/login',
    name: 'Login',
    component: login,
    meta: { title: 'Login', layout: 'empty' },
  },
  {
    path: '/about',
    name: 'About',
    component: about,
    meta: { title: 'About', layout: 'guest' },
  },
  {
    path: '/home',
    name: 'Home',
    component: home,
    meta: { title: 'Login', layout: 'guest' },
  },
  {
    path: '/landing',
    name: 'Landing',
    component: landing,
    meta: { title: 'Landing', layout: 'guest' },
  },
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
  const isAuthenticated = !!localStorage.getItem('tkm_at'); // Replace with actual auth check

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' }); // Redirect to login if not authenticated
    } else {
      next(); // Proceed if authenticated
    }
  } else {
    next(); // No auth required, proceed
  }
  next();
});

router.afterEach((to, from) => {
  console.log('Navigation completed to:', to.fullPath, 'from:', from.fullPath);
});

export default router;
