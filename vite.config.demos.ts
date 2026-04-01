import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { demos } from './src/public-demos/demos.config';

const ROOT = __dirname;
const GEN_DIR = path.resolve(ROOT, '.generated-demos');

function generateDemoEntries() {
  fs.mkdirSync(GEN_DIR, { recursive: true });

  for (const demo of demos) {
    // TS entry in .generated-demos/
    fs.writeFileSync(
      path.join(GEN_DIR, `${demo.id}.ts`),
      `import { mountDemo } from '@/public-demos/bootstrap';\nimport C from '${demo.component}';\nmountDemo(C);\n`,
    );

    // HTML entry at project root (so Vite base: './' produces correct relative paths)
    fs.writeFileSync(
      path.join(ROOT, `.demo-${demo.id}.html`),
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>${demo.name} — JumpCloud Demo</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/.generated-demos/${demo.id}.ts"></script>
</body>
</html>`,
    );
  }
}

generateDemoEntries();

/**
 * Dev server: path-based routing.
 *   /              → index listing
 *   /<demo-id>/    → that demo
 */
function demoDevRouter(): Plugin {
  return {
    name: 'demo-dev-router',
    configureServer(s) {
      s.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const segment = url.pathname.split('/').filter(Boolean)[0];
        const found = segment ? demos.find((d) => d.id === segment) : null;

        if (found && (url.pathname === `/${found.id}` || url.pathname === `/${found.id}/`)) {
          req.url = `/.demo-${found.id}.html`;
          return next();
        }

        if (url.pathname === '/' || url.pathname === '/index.html') {
          const items = demos
            .map((d) => `<li><a href="/${d.id}/">${d.name}</a><span class="id">${d.id}</span></li>`)
            .join('\n    ');
          res.setHeader('content-type', 'text/html');
          res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demos</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Inter,system-ui,sans-serif;background:#fafafa;padding:3rem 1.5rem}
    h1{font-size:1.5rem;font-weight:600;color:#111;margin-bottom:.5rem}
    p{color:#666;margin-bottom:2rem;font-size:.9375rem}
    ul{list-style:none;display:flex;flex-direction:column;gap:.75rem;max-width:480px}
    li{background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between}
    li:hover{border-color:#ccc}
    a{color:#111;text-decoration:none;font-weight:500}
    a:hover{text-decoration:underline}
    .id{font-size:.8125rem;color:#999;font-family:monospace}
  </style>
</head>
<body>
  <h1>Public Demos</h1>
  <p>Select a demo to preview.</p>
  <ul>
    ${items}
  </ul>
</body>
</html>`);
          return;
        }

        next();
      });
    },
  };
}

const demoId = process.env.DEMO_ID;
const buildInput = demoId
  ? path.resolve(ROOT, `.demo-${demoId}.html`)
  : undefined;

export default defineConfig({
  plugins: [vue(), tailwindcss(), demoDevRouter()],
  resolve: {
    alias: { '@': path.resolve(ROOT, 'src') },
  },
  base: './',
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    outDir: demoId ? `dist-demos/${demoId}` : 'dist-demos',
    emptyOutDir: true,
    rollupOptions: {
      input: buildInput,
    },
  },
});
