<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, useTemplateRef } from 'vue';
import { addons } from 'storybook/internal/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import type { CommentThread } from '../types';
import {
  EVENT_THREADS_FOR_STORY,
  EVENT_THREADS_UPDATED,
  EVENT_PIN_PLACEMENT_STARTED,
  EVENT_PIN_CLICKED,
  EVENT_PANEL_PIN_FOCUS,
  EVENT_REQUEST_EXIT_ANNOTATE,
  EVENT_PREVIEW_PIN_SHOW,
  EVENT_PREVIEW_PIN_REMOVE,
  EVENT_REQUEST_THREADS,
  GLOBAL_ANNOTATE_MODE,
} from '../constants';
import { buildPinPlacementPayload } from './positionUtils';

const props = defineProps<{
  storyId: string;
  storyTitle: string;
  globals: Record<string, unknown>;
  args: Record<string, unknown>;
  viewMode: string;
}>();

const rootRef = useTemplateRef('rootRef');
const threads = ref<CommentThread[]>([]);
const annotateMode = ref(Boolean(props.globals[GLOBAL_ANNOTATE_MODE]));
/** When set (and annotate mode off), only this thread's pin is shown — driven by Comments panel selection */
const panelSoloThreadId = ref<string | null>(null);
const pendingPin = ref<{ xPercent: number; yPercent: number } | null>(null);

let channel = addons.getChannel();

// ─── Listen for globals changes from Storybook ─────────────────────
function onGlobalsUpdated(payload: { globals: Record<string, unknown> }) {
  annotateMode.value = Boolean(payload.globals?.[GLOBAL_ANNOTATE_MODE]);
}

function onThreadsPayload(data: { storyId: string; threads: CommentThread[] }) {
  if (data.storyId === props.storyId) {
    threads.value = data.threads;
  }
}

function onPanelPinFocus(data: { threadId: string | null }) {
  panelSoloThreadId.value = data.threadId;
}

function onPreviewPinShow(data: { xPercent: number; yPercent: number }) {
  pendingPin.value = { xPercent: data.xPercent, yPercent: data.yPercent };
}

function onPreviewPinRemove() {
  pendingPin.value = null;
}

onMounted(() => {
  channel = addons.getChannel();
  channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
  channel.on(EVENT_THREADS_FOR_STORY, onThreadsPayload);
  channel.on(EVENT_THREADS_UPDATED, onThreadsPayload);
  channel.on(EVENT_PANEL_PIN_FOCUS, onPanelPinFocus);
  channel.on(EVENT_PREVIEW_PIN_SHOW, onPreviewPinShow);
  channel.on(EVENT_PREVIEW_PIN_REMOVE, onPreviewPinRemove);
  channel.emit(EVENT_REQUEST_THREADS);
});

onUnmounted(() => {
  channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  channel.off(EVENT_THREADS_FOR_STORY, onThreadsPayload);
  channel.off(EVENT_THREADS_UPDATED, onThreadsPayload);
  channel.off(EVENT_PANEL_PIN_FOCUS, onPanelPinFocus);
  channel.off(EVENT_PREVIEW_PIN_SHOW, onPreviewPinShow);
  channel.off(EVENT_PREVIEW_PIN_REMOVE, onPreviewPinRemove);
  clearHighlight();
});

watch(
  () => props.storyId,
  () => {
    threads.value = [];
    panelSoloThreadId.value = null;
  },
);

const showAnnotateChrome = computed(
  () => annotateMode.value && props.viewMode === 'story',
);

/** All pins when annotate on; a single pin when panel solo focus is set (annotate off) */
const visibleThreadPins = computed(() => {
  if (showAnnotateChrome.value) return threads.value;
  const id = panelSoloThreadId.value;
  if (!id) return [];
  return threads.value.filter((t) => t.id === id);
});

const showPinLayer = computed(
  () =>
    props.viewMode === 'story' &&
    (pendingPin.value !== null || visibleThreadPins.value.length > 0),
);

watch(showAnnotateChrome, (active) => {
  if (!active) clearHighlight();
});

// ─── Element outline highlighting ───────────────────────────────────
let lastHighlighted: HTMLElement | null = null;
const OUTLINE_ATTR = 'data-sb-annotate-highlight';

function clearHighlight() {
  if (lastHighlighted) {
    lastHighlighted.removeAttribute(OUTLINE_ATTR);
    lastHighlighted = null;
  }
}

function highlightElement(el: HTMLElement | null) {
  if (el === lastHighlighted) return;
  clearHighlight();
  if (!el) return;

  const root = rootRef.value;
  if (!root || el === root || !root.contains(el)) return;

  const meaningfulTags = new Set([
    'BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL',
    'IMG', 'SVG', 'VIDEO', 'CANVAS', 'TABLE', 'FORM', 'NAV',
    'HEADER', 'FOOTER', 'SECTION', 'ARTICLE', 'ASIDE', 'MAIN',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'DIV', 'SPAN', 'P',
  ]);

  let target = el;
  while (
    target.parentElement &&
    target.parentElement !== root &&
    !meaningfulTags.has(target.tagName) &&
    target.childElementCount === 0 &&
    target.getBoundingClientRect().width < 20
  ) {
    target = target.parentElement;
  }

  target.setAttribute(OUTLINE_ATTR, '');
  lastHighlighted = target;
}

function onOverlayMouseMove(e: MouseEvent) {
  if (!showAnnotateChrome.value) return;
  const root = rootRef.value;
  if (!root) return;

  // elementsFromPoint returns elements in z-order; skip our own layers.
  const stack = document.elementsFromPoint(e.clientX, e.clientY);
  let target: HTMLElement | null = null;
  for (const el of stack) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.classList.contains('sb-annotate-overlay')) continue;
    if (el.classList.contains('sb-pin-layer')) continue;
    if (el.closest('.sb-pin-layer')) continue;
    if (el === root) continue;
    if (el.classList.contains('sb-comments-root')) continue;
    if (!root.contains(el)) continue;
    target = el;
    break;
  }

  highlightElement(target);
}

function onOverlayMouseLeave() {
  clearHighlight();
}

// ─── Pin placement ──────────────────────────────────────────────────
function onOverlayClick(e: MouseEvent) {
  const el = rootRef.value;
  if (!el) return;
  const payload = buildPinPlacementPayload(e, el, {
    storyId: props.storyId,
    storyTitle: props.storyTitle,
    globals: { ...props.globals },
    args: { ...props.args },
  });
  channel.emit(EVENT_PIN_PLACEMENT_STARTED, payload);
}

function onPinClick(threadId: string, e: MouseEvent) {
  e.stopPropagation();
  channel.emit(EVENT_PIN_CLICKED, { threadId });
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && annotateMode.value) {
    channel.emit(EVENT_REQUEST_EXIT_ANNOTATE, {});
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div
    ref="rootRef"
    class="sb-comments-root relative min-h-full w-full"
    @mouseleave="onOverlayMouseLeave"
  >
    <!-- Story slot -->
    <div>
      <slot />
    </div>

    <!-- Pins: all when Annotate on; one pin when a comment is selected in the panel; pending while composing -->
    <div
      v-if="showPinLayer"
      class="sb-pin-layer pointer-events-none absolute inset-0 z-10000"
      aria-hidden="true"
    >
      <button
        v-for="t in visibleThreadPins"
        :key="t.id"
        type="button"
        class="pointer-events-auto absolute flex size-7 -translate-x-1/2 -translate-y-full cursor-pointer items-center justify-center rounded-full border border-button-primary-base bg-button-primary-base text-body-sm font-semibold text-button-primary-base shadow-md transition-transform hover:scale-110"
        :class="{
          'ring-2 ring-chart-warning-base': panelSoloThreadId === t.id,
          'opacity-55': t.status === 'resolved',
        }"
        :style="{
          left: `${t.pin.xPercent}%`,
          top: `${t.pin.yPercent}%`,
        }"
        :title="`Comment ${t.pinIndex ?? ''}`"
        @click="onPinClick(t.id, $event)"
      >
        {{ t.pinIndex ?? '·' }}
      </button>

      <!-- Pending pin (shown while composing a new comment) -->
      <div
        v-if="pendingPin"
        class="sb-pending-pin absolute flex size-7 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-dashed border-button-primary-base bg-button-primary-base shadow-lg"
        :style="{
          left: `${pendingPin.xPercent}%`,
          top: `${pendingPin.yPercent}%`,
        }"
      >
        <span class="text-body-sm font-semibold text-button-primary-base">+</span>
      </div>
    </div>

    <!-- Transparent capture layer for new pins (above story, below pins) -->
    <div
      v-if="showAnnotateChrome"
      class="sb-annotate-overlay absolute inset-0 z-9999 cursor-crosshair"
      role="presentation"
      @click="onOverlayClick"
      @mousemove="onOverlayMouseMove"
      @mouseleave="onOverlayMouseLeave"
    />
  </div>
</template>

<style>
[data-sb-annotate-highlight] {
  outline: 2px solid #0ea5e9 !important;
  outline-offset: 2px !important;
  border-radius: 2px;
  transition: outline 0.1s ease;
}

.sb-pending-pin {
  animation: sb-pin-pulse 1.5s ease-in-out infinite;
  opacity: 0.85;
}

@keyframes sb-pin-pulse {
  0%, 100% { transform: translate(-50%, -100%) scale(1); opacity: 0.85; }
  50% { transform: translate(-50%, -100%) scale(1.15); opacity: 1; }
}
</style>
