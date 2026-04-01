import type { CommentThread, Message } from '../types';

export interface StorageService {
  getThreadsForStory(storyId: string): Promise<CommentThread[]>;
  getAllThreads(): Promise<CommentThread[]>;
  createThread(thread: CommentThread): Promise<CommentThread>;
  updateThread(threadId: string, patch: Partial<CommentThread>): Promise<CommentThread>;
  addMessage(threadId: string, message: Message): Promise<CommentThread>;
  updateMessage(threadId: string, messageId: string, patch: Partial<Message>): Promise<Message>;
  softDeleteThread(threadId: string): Promise<void>;
  softDeleteMessage(threadId: string, messageId: string): Promise<void>;
}
