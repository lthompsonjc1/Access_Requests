import React from 'react';
import type { ThreadStatus } from '../types';

export function ThreadStatusBadge({ status }: { status: ThreadStatus }) {
  if (status === 'resolved') {
    return <span className="sb-comments-badge sb-comments-badge--resolved">Resolved</span>;
  }
  return <span className="sb-comments-badge sb-comments-badge--open">Open</span>;
}
