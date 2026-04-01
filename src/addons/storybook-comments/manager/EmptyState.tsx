import React from 'react';

export function EmptyState({ message }: { message: string }) {
  return <div className="sb-comments-panel__empty">{message}</div>;
}
