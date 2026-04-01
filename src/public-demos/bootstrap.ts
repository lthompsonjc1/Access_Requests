import { createApp, type Component } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import circuitConfig from '@jumpcloud/circuit/primevue';
import '@/assets/main.css';

export function mountDemo(component: Component) {
  document.documentElement.setAttribute('data-theme', 'circuit-light');
  document.body.classList.add('bg-neutral-base');

  const app = createApp(component);
  app.use(PrimeVue, { ...circuitConfig, theme: 'none' });
  app.use(ToastService);
  app.directive('tooltip', Tooltip);
  app.config.globalProperties.$testId = (suffix: string) => suffix;
  app.mount('#app');
}
