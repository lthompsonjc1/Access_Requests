import React from 'react';
import type { CommentThread, UserIdentity } from '../types';
import { ThreadStatusBadge } from './ThreadStatusBadge';
import { MessageBubble } from './MessageBubble';
import { CommentComposer } from './CommentComposer';
import { createMessage } from '../utils/threadFactory';
import { nowIso } from '../utils/time';
import type { StorageService } from '../services/StorageService';

export function ThreadDetail({
  thread,
  currentUser,
  storage,
  onThreadUpdated,
  onBack,
  refreshThreads,
  storyId,
}: {
  thread: CommentThread;
  currentUser: UserIdentity;
  storage: StorageService;
  onThreadUpdated: (t: CommentThread) => void;
  onBack: () => void;
  refreshThreads: () => Promise<void>;
  storyId: string;
}) {
  const isCreator = thread.createdBy.id === currentUser.id;

  const pushUpdate = async (updated: CommentThread) => {
    onThreadUpdated(updated);
    await refreshThreads();
  };

  const addReply = async (body: string) => {
    const msg = createMessage(thread.id, body, currentUser, 'comment');
    const updated = await storage.addMessage(thread.id, msg);
    await pushUpdate(updated);
  };

  const resolve = async () => {
    const sys = createMessage(
      thread.id,
      `Resolved by ${currentUser.displayName}`,
      currentUser,
      'system',
    );
    let updated = await storage.updateThread(thread.id, { status: 'resolved' });
    updated = await storage.addMessage(thread.id, sys);
    await pushUpdate(updated);
  };

  const reopen = async () => {
    const sys = createMessage(
      thread.id,
      `Reopened by ${currentUser.displayName}`,
      currentUser,
      'system',
    );
    let updated = await storage.updateThread(thread.id, { status: 'open' });
    updated = await storage.addMessage(thread.id, sys);
    await pushUpdate(updated);
  };

  const deleteThread = async () => {
    if (!isCreator) return;
    await storage.softDeleteThread(thread.id);
    await refreshThreads();
    onBack();
  };

  const editMessage = async (messageId: string, body: string) => {
    await storage.updateMessage(thread.id, messageId, { body, editedAt: nowIso() });
    const list = await storage.getThreadsForStory(storyId);
    const updated = list.find((x) => x.id === thread.id);
    if (updated) await pushUpdate(updated);
  };

  const deleteMessage = async (messageId: string) => {
    await storage.softDeleteMessage(thread.id, messageId);
    const list = await storage.getThreadsForStory(storyId);
    const updated = list.find((x) => x.id === thread.id);
    if (updated) await pushUpdate(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="sb-comments-panel__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" className="sb-comments-btn" onClick={onBack}>
          ← Back
        </button>
        <span style={{ flex: 1 }}>Thread #{thread.pinIndex ?? ''}</span>
        <ThreadStatusBadge status={thread.status} />
      </div>
      <div className="sb-comments-panel__scroll" style={{ flex: 1 }}>
        {thread.messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            currentUser={currentUser}
            onEdit={editMessage}
            onDelete={deleteMessage}
          />
        ))}
      </div>
      <div className="sb-comments-composer" style={{ borderTop: '1px solid var(--sb-border, #e0e0e0)' }}>
        <div className="sb-comments-actions" style={{ marginBottom: 8 }}>
          {thread.status === 'open' ? (
            <button type="button" className="sb-comments-btn sb-comments-btn--primary" onClick={() => void resolve()}>
              Resolve
            </button>
          ) : (
            <button type="button" className="sb-comments-btn" onClick={() => void reopen()}>
              Reopen
            </button>
          )}
          {isCreator && (
            <button type="button" className="sb-comments-btn sb-comments-btn--danger" onClick={() => void deleteThread()}>
              Delete thread
            </button>
          )}
        </div>
        <CommentComposer placeholder="Write a reply…" submitLabel="Reply" onSubmit={(b) => void addReply(b)} />
      </div>
    </div>
  );
}
