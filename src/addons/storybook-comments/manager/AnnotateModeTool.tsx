import React, { memo, useEffect } from 'react';
import { IconButton } from 'storybook/internal/components';
import { useGlobals, useChannel } from 'storybook/internal/manager-api';
import { GLOBAL_ANNOTATE_MODE, EVENT_ANNOTATE_MODE_CHANGED, ADDON_ID } from '../constants';

const BORDER_ATTR = 'data-annotate-active';
const STYLE_ID = `${ADDON_ID}--annotate-border`;

function ensureStyleTag() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    html[${BORDER_ATTR}] {
      outline: 2px solid #0d9488 !important;
      outline-offset: -2px;
      box-shadow: inset 0 0 0 3px rgba(13, 148, 136, 0.12),
                  0 0 16px 3px rgba(13, 148, 136, 0.15) !important;
      transition: outline 0.25s ease, box-shadow 0.25s ease;
    }
  `;
  document.head.appendChild(style);
}

function applyAnnotateBorder() {
  ensureStyleTag();
  document.documentElement.setAttribute(BORDER_ATTR, '');
}

function removeAnnotateBorder() {
  document.documentElement.removeAttribute(BORDER_ATTR);
}

function AnnotateIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 8h10M7 12h6M5 20l2-4H6a4 4 0 01-4-4V6a4 4 0 014-4h12a4 4 0 014 4v6a4 4 0 01-4 4h-7l-2 4z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const AnnotateModeTool = memo(function AnnotateModeTool() {
  const [globals, updateGlobals] = useGlobals();
  const emit = useChannel({});
  const active = Boolean(globals[GLOBAL_ANNOTATE_MODE]);

  useEffect(() => {
    emit(EVENT_ANNOTATE_MODE_CHANGED, { active });
  }, [active, emit]);

  useEffect(() => {
    if (active) applyAnnotateBorder();
    else removeAnnotateBorder();
    return () => removeAnnotateBorder();
  }, [active]);

  const toggle = () => {
    updateGlobals({ [GLOBAL_ANNOTATE_MODE]: !active });
  };

  return (
    <IconButton key="annotate-mode" active={active} title="Annotate mode" onClick={toggle}>
      <AnnotateIcon />
    </IconButton>
  );
});
