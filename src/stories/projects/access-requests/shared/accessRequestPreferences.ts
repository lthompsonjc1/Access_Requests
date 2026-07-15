import {
  fetchPreferences,
  isAccessRequestsApiConfigured,
  savePreferences,
} from './accessRequestsApi';

export type RequestQueueSubTab = 'administrator' | 'delegated';

const DEFAULT_REQUEST_QUEUE_SUB_TAB_KEY = 'access-requests.defaultRequestQueueSubTab';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readLocalDefault(): RequestQueueSubTab {
  if (!canUseStorage()) return 'administrator';

  try {
    const value = window.localStorage.getItem(DEFAULT_REQUEST_QUEUE_SUB_TAB_KEY);
    if (value === 'administrator' || value === 'delegated') return value;
  } catch {
    // Ignore storage access issues in restricted environments.
  }

  return 'administrator';
}

function writeLocalDefault(value: RequestQueueSubTab): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(DEFAULT_REQUEST_QUEUE_SUB_TAB_KEY, value);
  } catch {
    // Ignore storage access issues in restricted environments.
  }
}

/** Sync read used for initial Storybook/page defaults. */
export function getDefaultRequestQueueSubTab(): RequestQueueSubTab {
  return readLocalDefault();
}

export function setDefaultRequestQueueSubTab(value: RequestQueueSubTab): void {
  writeLocalDefault(value);

  if (!isAccessRequestsApiConfigured()) return;

  void savePreferences({ defaultRequestQueueSubTab: value }).catch((error) => {
    console.warn('Failed to persist default request queue sub tab to API', error);
  });
}

/** Prefer API when configured; fall back to localStorage. */
export async function loadDefaultRequestQueueSubTab(): Promise<RequestQueueSubTab> {
  if (!isAccessRequestsApiConfigured()) {
    return readLocalDefault();
  }

  try {
    const preferences = await fetchPreferences();
    const value =
      preferences.defaultRequestQueueSubTab === 'delegated' ? 'delegated' : 'administrator';
    writeLocalDefault(value);
    return value;
  } catch (error) {
    console.warn('Failed to load preferences from API; using local fallback', error);
    return readLocalDefault();
  }
}

export async function persistDefaultRequestQueueSubTab(
  value: RequestQueueSubTab,
): Promise<void> {
  writeLocalDefault(value);

  if (!isAccessRequestsApiConfigured()) return;

  await savePreferences({ defaultRequestQueueSubTab: value });
}
