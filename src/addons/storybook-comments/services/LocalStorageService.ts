import { STORAGE_KEY_THREADS } from '../constants';
import type { CommentThread, Message } from '../types';
import { nowIso } from '../utils/time';
import type { StorageService } from './StorageService';

function readAll(): CommentThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THREADS);
    if (!raw) return [];
    const data = JSON.parse(raw) as CommentThread[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeAll(threads: CommentThread[]): void {
  localStorage.setItem(STORAGE_KEY_THREADS, JSON.stringify(threads));
}

function withPinIndices(storyId: string, threads: CommentThread[]): CommentThread[] {
  return threads
    .filter((t) => t.storyId === storyId && !t.deletedAt)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((t, i) => ({ ...t, pinIndex: i + 1 }));
}

export class LocalStorageService implements StorageService {
  async getThreadsForStory(storyId: string): Promise<CommentThread[]> {
    return withPinIndices(storyId, readAll());
  }

  async getAllThreads(): Promise<CommentThread[]> {
    return readAll().filter((t) => !t.deletedAt);
  }

  async createThread(thread: CommentThread): Promise<CommentThread> {
    const threads = readAll();
    threads.push(thread);
    writeAll(threads);
    const [withIdx] = withPinIndices(thread.storyId, threads).filter((t) => t.id === thread.id);
    return withIdx ?? { ...thread, pinIndex: 1 };
  }

  async updateThread(threadId: string, patch: Partial<CommentThread>): Promise<CommentThread> {
    const threads = readAll();
    const i = threads.findIndex((t) => t.id === threadId);
    if (i < 0) throw new Error(`Thread ${threadId} not found`);
    const updated = { ...threads[i], ...patch, updatedAt: nowIso() };
    threads[i] = updated;
    writeAll(threads);
    const listed = withPinIndices(updated.storyId, threads);
    return listed.find((t) => t.id === threadId) ?? updated;
  }

  async addMessage(threadId: string, message: Message): Promise<CommentThread> {
    const threads = readAll();
    const i = threads.findIndex((t) => t.id === threadId);
    if (i < 0) throw new Error(`Thread ${threadId} not found`);
    const thread = threads[i];
    const updated: CommentThread = {
      ...thread,
      messages: [...thread.messages, message],
      updatedAt: nowIso(),
    };
    threads[i] = updated;
    writeAll(threads);
    return updated;
  }

  async updateMessage(
    threadId: string,
    messageId: string,
    patch: Partial<Message>,
  ): Promise<Message> {
    const threads = readAll();
    const ti = threads.findIndex((t) => t.id === threadId);
    if (ti < 0) throw new Error(`Thread ${threadId} not found`);
    const thread = threads[ti];
    const mi = thread.messages.findIndex((m) => m.id === messageId);
    if (mi < 0) throw new Error(`Message ${messageId} not found`);
    const msg = { ...thread.messages[mi], ...patch };
    const messages = [...thread.messages];
    messages[mi] = msg;
    threads[ti] = { ...thread, messages, updatedAt: nowIso() };
    writeAll(threads);
    return msg;
  }

  async softDeleteThread(threadId: string): Promise<void> {
    await this.updateThread(threadId, { deletedAt: nowIso() });
  }

  async softDeleteMessage(threadId: string, messageId: string): Promise<void> {
    await this.updateMessage(threadId, messageId, { deletedAt: nowIso() });
  }
}

export const localStorageService = new LocalStorageService();
