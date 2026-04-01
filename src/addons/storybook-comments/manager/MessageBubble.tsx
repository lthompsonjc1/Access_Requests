import React, { useState } from 'react';
import type { Message, UserIdentity } from '../types';
import { formatRelativeTime } from '../utils/time';

export function MessageBubble({
  message,
  currentUser,
  onEdit,
  onDelete,
}: {
  message: Message;
  currentUser: UserIdentity;
  onEdit: (messageId: string, body: string) => void;
  onDelete: (messageId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.body);

  const isAuthor = message.author.id === currentUser.id;
  const isSystem = message.type === 'system';
  const isDeleted = Boolean(message.deletedAt);

  if (isSystem) {
    return (
      <div className="sb-comments-message" style={{ fontStyle: 'italic', opacity: 0.85 }}>
        <div className="sb-comments-message__meta">System · {formatRelativeTime(message.createdAt)}</div>
        <div>{message.body}</div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="sb-comments-message" style={{ opacity: 0.6 }}>
        <div className="sb-comments-message__meta">
          {message.author.displayName} · {formatRelativeTime(message.createdAt)}
        </div>
        <div>[message deleted]</div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="sb-comments-message">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} style={{ width: '100%', minHeight: 60 }} />
        <div className="sb-comments-actions">
          <button
            type="button"
            className="sb-comments-btn sb-comments-btn--primary"
            onClick={() => {
              onEdit(message.id, draft);
              setEditing(false);
            }}
          >
            Save
          </button>
          <button type="button" className="sb-comments-btn" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-comments-message">
      <div className="sb-comments-message__meta">
        {message.author.displayName} · {formatRelativeTime(message.createdAt)}
        {message.editedAt ? ' · (edited)' : ''}
      </div>
      <div style={{ whiteSpace: 'pre-wrap' }}>{message.body}</div>
      {isAuthor && (
        <div className="sb-comments-actions" style={{ marginTop: 6 }}>
          <button type="button" className="sb-comments-btn" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button type="button" className="sb-comments-btn sb-comments-btn--danger" onClick={() => onDelete(message.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
