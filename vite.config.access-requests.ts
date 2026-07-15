import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const ROOT = __dirname;
const GEN_DIR = path.resolve(ROOT, '.generated-demos');
const DEMO_ID = 'Circuit-access-requests';
const HTML_ENTRY = path.resolve(ROOT, `.demo-${DEMO_ID}.html`);

fs.mkdirSync(GEN_DIR, { recursive: true });
fs.writeFileSync(
  path.join(GEN_DIR, `${DEMO_ID}.ts`),
  `import { mountDemo } from '@/public-demos/bootstrap';\nimport C from '@/stories/projects/access-requests/pages/AccessRequestsDemo.vue';\nmountDemo(C);\n`,
);
fs.writeFileSync(
  HTML_ENTRY,
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>Circuit Access Requests — JumpCloud Demo</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/.generated-demos/${DEMO_ID}.ts"></script>
</body>
</html>`,
);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ROOT, '');
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(ROOT, 'src') },
    },
    base: './',
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
    },
    build: {
      outDir: `dist-demos/${DEMO_ID}`,
      emptyOutDir: true,
      rollupOptions: {
        input: HTML_ENTRY,
      },
    },
  };
});
