import type { Preview, Decorator } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { decorators as annotationDecorators, initialGlobals as annotationGlobals } from '../src/addons/storybook-comments/preview';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import circuitConfig from '@jumpcloud/circuit/primevue';
import '../src/assets/main.css';

// Register PrimeVue with Circuit's passthrough theme configuration.
// circuitConfig already contains { unstyled: true, pt: { ...all 29 components } }
// We add theme: 'none' to fully disable PrimeVue's built-in theme CSS injection,
// since Circuit DS handles all theming via Tailwind CSS custom properties.
setup((app) => {
  app.use(PrimeVue, {
    ...circuitConfig,
    theme: 'none',
  });
  app.use(ToastService);
  app.directive('tooltip', Tooltip);

  // Provide $testId global property used by Circuit custom components for data-test-id attributes
  app.config.globalProperties.$testId = (suffix: string) => suffix;
});

// Custom decorator that sets the Circuit DS data-theme attribute on <html>
// and applies bg-neutral-base to <body> so the background follows the theme.
const withCircuitTheme: Decorator = (storyFn, context) => {
  const theme = context.globals.theme || 'light';
  const attrValue = theme === 'dark' ? 'circuit-dark' : 'circuit-light';
  document.documentElement.setAttribute('data-theme', attrValue);
  document.body.classList.add('bg-neutral-base');
  return storyFn();
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Disable Storybook's built-in backgrounds addon toolbar —
    // Circuit DS bg-neutral-base handles the background and switches with the theme.
    backgrounds: { disable: true },
    outline: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Circuit DS theme',
      toolbar: {
        title: 'Theme',
        icon: 'moon',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    ...annotationGlobals,
  },
  decorators: [withCircuitTheme, ...annotationDecorators],
};

export default preview;
