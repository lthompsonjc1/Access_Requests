/**
 * Demo manifest — the single source of truth.
 *
 * Add your demo here and it will:
 *   1. Show up in the local dev server (pnpm dev:demos)
 *   2. Get built and uploaded to R2 on merge to master
 *   3. Be available at demos.jumpcloud-test.workers.dev/<id>-latest/
 */
export const demos = [
  {
    id: 'hello-world',
    name: 'Hello World',
    component: '@/stories/projects/hello-world/HelloWorld.vue',
  },
  {
    id: 'mustafa-playground',
    name: "Mustafa's Playground",
    component: '@/stories/projects/mustafa-playground/pages/MustafaPlayground.vue',
  },
  {
    id: 'agent0-composable',
    name: 'Agent Zero — Composable',
    component: '@/stories/projects/burak-agent0/pages/Agent0ComposablePage.vue',
  },
  {
    id: 'agent0-alt02',
    name: 'Agent Zero — Alternative 02',
    component: '@/stories/projects/burak-agent0/pages/Agent0Alt02Page.vue',
  },
];
