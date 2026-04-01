import React, { useState } from 'react';

export function CommentComposer({
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  placeholder: string;
  submitLabel: string;
  onSubmit: (body: string) => void;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = body.trim();
    if (!t) return;
    onSubmit(t);
    setBody('');
  };

  return (
    <form className="sb-comments-composer" onSubmit={submit}>
      <textarea
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            submit(e);
          }
        }}
      />
      <div className="sb-comments-actions">
        {onCancel && (
          <button type="button" className="sb-comments-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="sb-comments-btn sb-comments-btn--primary">
          {submitLabel}
        </button>
      </div>
      <div style={{ fontSize: 11, opacity: 0.65 }}>⌘/Ctrl + Enter to send</div>
    </form>
  );
}
