import { ref, watch } from 'vue';
import { useDemoSettings, DEMO_API_HOST } from './useDemoSettings';
import type { Device } from '@/types/device';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return 'just now';
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toDevice(s: Record<string, any>): Device {
  const mdm = s.mdm;
  return {
    hostname: s.hostname || s.displayName || 'Unknown',
    os: [s.os, s.version].filter(Boolean).join(' ') || 'Unknown',
    serial: s.serialNumber || 'N/A',
    lastContact: s.lastContact ? timeAgo(s.lastContact) : 'Unknown',
    agent: s.agentVersion || 'N/A',
    mdm: mdm?.vendor != null && mdm.vendor !== 'unknown',
    compliant: Boolean(s.active),
    user: s.displayName || s.hostname || 'Unassigned',
  };
}

export function useDevices(limit = 10) {
  const { isLive, apiKey } = useDemoSettings();

  const devices = ref<Device[]>([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetch() {
    loading.value = true;
    error.value = null;

    const endpoint = isLive.value
      ? `${DEMO_API_HOST}/public-api/v1/systems?limit=${limit}`
      : `${DEMO_API_HOST}/fake-api/devices?limit=${limit}`;

    const headers: Record<string, string> = {};
    if (isLive.value) headers['x-api-key'] = apiKey.value;

    try {
      const res = await globalThis.fetch(endpoint, { headers });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      const data = await res.json();
      devices.value = (data.results ?? []).map(toDevice);
      totalCount.value = data.totalCount ?? devices.value.length;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      devices.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(isLive, fetch, { immediate: true });

  return { devices, totalCount, loading, error, fetch };
}
