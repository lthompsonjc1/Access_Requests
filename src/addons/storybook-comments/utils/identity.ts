import type { UserIdentity } from '../types';
import { STORAGE_KEY_IDENTITY } from '../constants';
import { createId } from './uuid';

export function loadIdentity(): UserIdentity | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IDENTITY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserIdentity;
    if (parsed?.id && parsed?.displayName) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveIdentity(identity: UserIdentity): void {
  localStorage.setItem(STORAGE_KEY_IDENTITY, JSON.stringify(identity));
}

export function createGuestIdentity(displayName: string): UserIdentity {
  return {
    id: createId(),
    displayName: displayName.trim() || 'Guest',
    avatarUrl: null,
  };
}
