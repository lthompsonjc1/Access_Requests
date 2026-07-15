export type RequestQueueSubTab = 'administrator' | 'delegated';

const DEFAULT_REQUEST_QUEUE_SUB_TAB_KEY = 'access-requests.defaultRequestQueueSubTab';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getDefaultRequestQueueSubTab(): RequestQueueSubTab {
  if (!canUseStorage()) return 'administrator';

  try {
    const value = window.localStorage.getItem(DEFAULT_REQUEST_QUEUE_SUB_TAB_KEY);
    if (value === 'administrator' || value === 'delegated') return value;
  } catch {
    // Ignore storage access issues in restricted environments.
  }

  return 'administrator';
}

export function setDefaultRequestQueueSubTab(value: RequestQueueSubTab): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(DEFAULT_REQUEST_QUEUE_SUB_TAB_KEY, value);
  } catch {
    // Ignore storage access issues in restricted environments.
  }
}
