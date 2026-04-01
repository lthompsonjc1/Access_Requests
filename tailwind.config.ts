import type { Config } from 'tailwindcss';
import circuit from '@jumpcloud/circuit/tailwind';

export default {
  content: [
    './src/**/*.{vue,ts,tsx,mdx}',
    './src/addons/**/*.{vue,ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
    './node_modules/@jumpcloud/circuit/dist/**/*.{js,cjs}',
  ],
  presets: [circuit],
} satisfies Config;
