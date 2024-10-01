import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// import ImageEditor from '@/views/ImageEditor.vue';

//auth
const login = defineAsyncComponent(() => import('@/views/auth/signin.vue'));
const imgEditor = defineAsyncComponent(() => import('@/views/imgEditor.vue'));
const SJ_dashboard = defineAsyncComponent(
  () => import('@/views/apps/simple-journal/index.vue')
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
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: { requiresAuth: true }, // Protect all child routes
    children: [
      {
        path: '',
        name: 'Kas Kecil',
        children: [
          {
            path: '',
            name: 'Dashboard',
            component: SJ_dashboard,
            meta: { title: 'Beranda' },
          },
          {
            path: 'transaction',
            name: 'Transaction',
            component: SJ_transaction_list,
            meta: { title: 'Beranda' },
          },
          {
            path: 'category',
            name: 'Category',
            component: SJ_categories,
            meta: { title: 'Beranda' },
          },
          {
            path: 'report',
            name: 'Report',
            component: SJ_reports,
            meta: { title: 'Beranda' },
          },
        ],
      },
      {
        path: 'users',
        name: 'User Management',
        component: defineAsyncComponent(() => import('@/views/user/index.vue')),
        meta: { title: 'Users' },
      },
      // {
      //   path: 'account',
      //   name: 'Account',
      //   component: defineAsyncComponent(
      //     () => import('@/views/settings/AccountSettings.vue')
      //   ),
      //   meta: { title: 'account' },
      // },
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
