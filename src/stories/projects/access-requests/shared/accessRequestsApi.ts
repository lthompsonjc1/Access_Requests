const FALLBACK_API_BASE = '';

function apiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.replace(/\/$/, '');
  }
  return FALLBACK_API_BASE;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = apiBaseUrl();
  if (!base) {
    throw new Error('API base URL is not configured');
  }

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`API ${path} failed (${response.status}): ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function isAccessRequestsApiConfigured(): boolean {
  return Boolean(apiBaseUrl());
}

export type PreferencesResponse = {
  defaultRequestQueueSubTab: 'administrator' | 'delegated';
};

export type SavedViewPayload = {
  id: string | number;
  label: string;
  isFavorite?: boolean;
  editable?: boolean;
  deletable?: boolean;
  data?: {
    filters: Array<{
      id: string;
      key: string;
      operator: string;
      value: string;
    }>;
  };
};

export type SavedViewsResponse = {
  selectedViewId: string | number | null;
  views: SavedViewPayload[];
};

export async function fetchPreferences(): Promise<PreferencesResponse> {
  return request<PreferencesResponse>('/preferences');
}

export async function savePreferences(
  preferences: PreferencesResponse,
): Promise<PreferencesResponse> {
  return request<PreferencesResponse>('/preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences),
  });
}

export async function fetchSavedViews(): Promise<SavedViewsResponse> {
  return request<SavedViewsResponse>('/saved-views');
}

export async function saveSavedViews(
  payload: SavedViewsResponse,
): Promise<SavedViewsResponse> {
  return request<SavedViewsResponse>('/saved-views', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
