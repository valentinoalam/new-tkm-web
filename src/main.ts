import 'normalize.css';
import '@/assets/css/main.css';
import 'vue3-perfect-scrollbar/style.css';
import 'cropperjs/dist/cropper.css';
import 'preline/preline';
import '@formkit/themes/genesis';

import { defaultConfig, plugin } from '@formkit/vue';
import vClickOutside from 'click-outside-vue3';
import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';

import DashboardLayout from '@/layouts/DashboardLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);
app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);
app.use(router);

// Use the plugins
app.use(plugin, defaultConfig);
app.use(PerfectScrollbarPlugin);
app.use(VueApexCharts);
app.use(vClickOutside);
app.mount('#app');
