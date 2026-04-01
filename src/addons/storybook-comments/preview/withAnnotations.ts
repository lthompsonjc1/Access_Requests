import type { Decorator } from '@storybook/vue3';
import AnnotationShell from './AnnotationShell.vue';

/**
 * Wraps every story with the annotation shell (pins + annotate overlay).
 *
 * Globals reactivity is handled inside AnnotationShell itself by listening
 * to Storybook's GLOBALS_UPDATED channel event — we don't depend on the
 * decorator being re-called when globals change.
 */
export const withAnnotations: Decorator = (storyFn, context) => ({
  components: { AnnotationShell, StoryCmp: storyFn() },
  setup() {
    return {
      storyId: context.id,
      storyTitle:
        typeof context.title === 'string'
          ? context.title
          : Array.isArray(context.title)
            ? context.title.join('/')
            : '',
      viewMode: context.viewMode ?? 'story',
      sbGlobals: { ...context.globals } as Record<string, unknown>,
      sbArgs: { ...(context.args ?? {}) } as Record<string, unknown>,
    };
  },
  template: `
    <AnnotationShell
      :story-id="storyId"
      :story-title="storyTitle"
      :globals="sbGlobals"
      :args="sbArgs"
      :view-mode="viewMode"
    >
      <StoryCmp />
    </AnnotationShell>
  `,
});
