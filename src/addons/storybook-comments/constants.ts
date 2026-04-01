export const ADDON_ID = 'storybook-pinned-comments';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const TOOL_ID = `${ADDON_ID}/tool`;

/** Global toggled by toolbar — synced to preview iframe */
export const GLOBAL_ANNOTATE_MODE = 'annotateMode';

/** Manager → preview: explicit sync when toolbar toggles (in addition to Storybook globals) */
export const EVENT_ANNOTATE_MODE_CHANGED = `${ADDON_ID}/annotate-mode-changed`;
export const EVENT_THREADS_FOR_STORY = `${ADDON_ID}/threads-for-story`;
export const EVENT_THREADS_UPDATED = `${ADDON_ID}/threads-updated`;
export const EVENT_PIN_PLACEMENT_STARTED = `${ADDON_ID}/pin-placement-started`;
export const EVENT_PIN_CLICKED = `${ADDON_ID}/pin-clicked`;
/** Manager → preview: show only this thread's pin on canvas (null = clear solo view) */
export const EVENT_PANEL_PIN_FOCUS = `${ADDON_ID}/panel-pin-focus`;
export const EVENT_REQUEST_EXIT_ANNOTATE = `${ADDON_ID}/request-exit-annotate`;
export const EVENT_PREVIEW_PIN_SHOW = `${ADDON_ID}/preview-pin-show`;
export const EVENT_PREVIEW_PIN_REMOVE = `${ADDON_ID}/preview-pin-remove`;
export const EVENT_REQUEST_THREADS = `${ADDON_ID}/request-threads`;

export const STORAGE_KEY_THREADS = `${ADDON_ID}:threads`;
export const STORAGE_KEY_IDENTITY = `${ADDON_ID}:identity`;
