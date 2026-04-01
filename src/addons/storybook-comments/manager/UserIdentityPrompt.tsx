import React, { useState } from 'react';
import type { UserIdentity } from '../types';
import { createGuestIdentity } from '../utils/identity';

export function UserIdentityPrompt({
  onSave,
}: {
  onSave: (identity: UserIdentity) => void;
}) {
  const [name, setName] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(createGuestIdentity(name));
  };

  return (
    <form className="sb-comments-identity" onSubmit={submit}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>Your display name</div>
      <p style={{ opacity: 0.8, margin: '8px 0', fontSize: 13 }}>
        Used on comments and replies (stored locally in this browser).
      </p>
      <input
        autoFocus
        placeholder="e.g. Alex"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="sb-comments-actions" style={{ marginTop: 12 }}>
        <button type="submit" className="sb-comments-btn sb-comments-btn--primary">
          Continue
        </button>
      </div>
    </form>
  );
}
