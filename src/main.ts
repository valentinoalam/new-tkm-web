import 'normalize.css';
import '@/assets/css/main.css';
import 'vue3-perfect-scrollbar/style.css';
import 'cropperjs/dist/cropper.css';
import 'preline/preline';
import '@formkit/themes/genesis';
import 'tippy.js/dist/tippy.css';

import { defaultConfig, plugin } from '@formkit/vue';
import { createFormKitInputsPlugin } from '@kgierke/formkit-inputs';
import vClickOutside from 'click-outside-vue3';
import { createApp } from 'vue';
import VueTippy from 'vue-tippy';
import VueApexCharts from 'vue3-apexcharts';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';

import App from './App.vue';
import router from './router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

const formKitInputPlugin = createFormKitInputsPlugin();
const app = createApp(App);
app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);
app.use(router);

// Use the plugins
app.use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
    }, // => Global default options * see all props
  }
);
app.use(
  plugin,
  defaultConfig({
    plugins: [formKitInputPlugin],
  })
);
app.use(plugin, defaultConfig);
app.use(PerfectScrollbarPlugin);
app.use(VueApexCharts);
app.use(vClickOutside);
app.mount('#app');
