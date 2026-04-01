import React from 'react';
import type { CommentThread } from '../types';
import { ThreadStatusBadge } from './ThreadStatusBadge';

export function ThreadList({
  threads,
  selectedId,
  onSelect,
}: {
  threads: CommentThread[];
  selectedId: string | null;
  onSelect: (threadId: string) => void;
}) {
  return (
    <div className="sb-comments-panel__scroll">
      {threads.map((t) => {
        const first = t.messages.find((m) => m.type === 'comment' && !m.deletedAt);
        const preview = first?.body?.slice(0, 80) ?? '(empty)';
        return (
          <button
            key={t.id}
            type="button"
            className={`sb-comments-thread-row${selectedId === t.id ? ' sb-comments-thread-row--active' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <strong>#{t.pinIndex ?? '·'}</strong>
              <ThreadStatusBadge status={t.status} />
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{preview}{first && first.body.length > 80 ? '…' : ''}</div>
            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4 }}>
              {t.messages.filter((m) => m.type === 'comment' && !m.deletedAt).length} message(s)
            </div>
          </button>
        );
      })}
    </div>
  );
}
