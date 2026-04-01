import type { PinPlacementPayload } from '../types';

export function buildPinPlacementPayload(
  event: MouseEvent,
  container: HTMLElement,
  meta: {
    storyId: string;
    storyTitle: string;
    globals: Record<string, unknown>;
    args: Record<string, unknown>;
  },
): PinPlacementPayload {
  const rect = container.getBoundingClientRect();
  const w = rect.width || 1;
  const h = rect.height || 1;
  return {
    storyId: meta.storyId,
    storyTitle: meta.storyTitle,
    xPercent: ((event.clientX - rect.left) / w) * 100,
    yPercent: ((event.clientY - rect.top) / h) * 100,
    viewportWidth: rect.width,
    viewportHeight: rect.height,
    globals: { ...meta.globals },
    args: { ...meta.args },
  };
}
