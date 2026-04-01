import { ref, computed } from 'vue';

const STORAGE_KEYS = {
  dataMode: 'demoNav.dataMode',
  apiKey: 'demoNav.apiKey',
} as const;

export type DataMode = 'mock' | 'live';

export const DEMO_API_HOST = 'https://demos.jumpcloud-test.workers.dev';

// Singleton state — shared across all callers
const dataMode = ref<DataMode>('mock');
const apiKey = ref('');

function load() {
  const saved = localStorage.getItem(STORAGE_KEYS.dataMode);
  dataMode.value = saved === 'Live Data' ? 'live' : 'mock';
  apiKey.value = localStorage.getItem(STORAGE_KEYS.apiKey) ?? '';
}

// Read immediately on module load
load();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', load);
}

const isLive = computed(() => dataMode.value === 'live' && apiKey.value.length > 0);
const isMock = computed(() => !isLive.value);

export function useDemoSettings() {
  return { dataMode, apiKey, isLive, isMock, reload: load };
}
