import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddonPanel } from 'storybook/internal/components';
import { useStorybookApi, useGlobals } from 'storybook/internal/manager-api';
import { addons } from 'storybook/internal/manager-api';
import { STORY_CHANGED } from 'storybook/internal/core-events';
import type { CommentThread, PinPlacementPayload, UserIdentity } from '../types';
import {
  EVENT_PIN_PLACEMENT_STARTED,
  EVENT_PIN_CLICKED,
  EVENT_REQUEST_EXIT_ANNOTATE,
  EVENT_THREADS_UPDATED,
  EVENT_PANEL_PIN_FOCUS,
  EVENT_PREVIEW_PIN_SHOW,
  EVENT_PREVIEW_PIN_REMOVE,
  EVENT_REQUEST_THREADS,
  GLOBAL_ANNOTATE_MODE,
} from '../constants';
import { localStorageService } from '../services/LocalStorageService';
import { loadIdentity, saveIdentity } from '../utils/identity';
import { createThreadFromPlacement } from '../utils/threadFactory';
import { UserIdentityPrompt } from './UserIdentityPrompt';
import { EmptyState } from './EmptyState';
import { ThreadList } from './ThreadList';
import { ThreadDetail } from './ThreadDetail';
import { CommentComposer } from './CommentComposer';
import '../styles/panel.css';

type View = 'list' | 'compose' | 'detail';

export function CommentsPanel({ active }: { active: boolean }) {
  const api = useStorybookApi();
  const [, updateGlobals] = useGlobals();
  const [identity, setIdentity] = useState<UserIdentity | null>(() => loadIdentity());
  const [threads, setThreads] = useState<CommentThread[]>([]);
  const [view, setView] = useState<View>('list');
  const [placement, setPlacement] = useState<PinPlacementPayload | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const identityRef = useRef(identity);
  identityRef.current = identity;

  const story = api.getCurrentStoryData();
  const storyId = story?.id ?? '';


  const emitThreadsToPreview = useCallback(
    (sid: string, list: CommentThread[]) => {
      if (!sid) return;
      addons.getChannel().emit(EVENT_THREADS_UPDATED, { storyId: sid, threads: list });
    },
    [],
  );

  const refreshThreads = useCallback(async () => {
    const s = api.getCurrentStoryData();
    if (!s?.id) {
      setThreads([]);
      return;
    }
    const list = await localStorageService.getThreadsForStory(s.id);
    setThreads(list);
    emitThreadsToPreview(s.id, list);
  }, [api, emitThreadsToPreview]);

  useEffect(() => {
    const ch = addons.getChannel();
    const onStory = () => {
      setView('list');
      setPlacement(null);
      setSelectedId(null);
      ch.emit(EVENT_PANEL_PIN_FOCUS, { threadId: null });
      void refreshThreads();
    };
    ch.on(STORY_CHANGED, onStory);
    void refreshThreads();
    return () => {
      ch.off(STORY_CHANGED, onStory);
    };
  }, [refreshThreads]);

  useEffect(() => {
    const ch = addons.getChannel();
    const onPinPlacement = (payload: PinPlacementPayload) => {
      const sid = api.getCurrentStoryData()?.id;
      if (!sid || payload.storyId !== sid) return;
      if (!identityRef.current) return;
      setPlacement(payload);
      setView('compose');
      ch.emit(EVENT_PANEL_PIN_FOCUS, { threadId: null });
      ch.emit(EVENT_PREVIEW_PIN_SHOW, {
        xPercent: payload.xPercent,
        yPercent: payload.yPercent,
      });
    };
    const onPinClick = (data: { threadId: string }) => {
      setSelectedId(data.threadId);
      setView('detail');
      ch.emit(EVENT_PANEL_PIN_FOCUS, { threadId: data.threadId });
    };
    const onExitAnnotate = () => {
      updateGlobals({ [GLOBAL_ANNOTATE_MODE]: false });
    };
    const onRequestThreads = () => {
      void refreshThreads();
    };
    ch.on(EVENT_PIN_PLACEMENT_STARTED, onPinPlacement);
    ch.on(EVENT_PIN_CLICKED, onPinClick);
    ch.on(EVENT_REQUEST_EXIT_ANNOTATE, onExitAnnotate);
    ch.on(EVENT_REQUEST_THREADS, onRequestThreads);
    return () => {
      ch.off(EVENT_PIN_PLACEMENT_STARTED, onPinPlacement);
      ch.off(EVENT_PIN_CLICKED, onPinClick);
      ch.off(EVENT_REQUEST_EXIT_ANNOTATE, onExitAnnotate);
      ch.off(EVENT_REQUEST_THREADS, onRequestThreads);
    };
  }, [api, updateGlobals, refreshThreads]);

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedId) ?? null,
    [threads, selectedId],
  );

  const handleSelectThread = (threadId: string) => {
    setSelectedId(threadId);
    setView('detail');
    addons.getChannel().emit(EVENT_PANEL_PIN_FOCUS, { threadId });
  };

  const handleIdentitySave = (id: UserIdentity) => {
    saveIdentity(id);
    setIdentity(id);
  };

  if (!identity) {
    return (
      <AddonPanel active={active} key="comments-panel">
        <div className="sb-comments-panel">
          <UserIdentityPrompt onSave={handleIdentitySave} />
        </div>
      </AddonPanel>
    );
  }

  return (
    <AddonPanel active={active} key="comments-panel">
      <div className="sb-comments-panel">
        {view === 'list' && (
          <>
            <div className="sb-comments-panel__header">Comments</div>
            {threads.length === 0 ? (
              <EmptyState message="No comments yet. Turn on Annotate mode and click the preview to add one." />
            ) : (
              <ThreadList threads={threads} selectedId={selectedId} onSelect={handleSelectThread} />
            )}
          </>
        )}

        {view === 'compose' && placement && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="sb-comments-panel__header">New comment</div>
            <div style={{ padding: '8px 12px', fontSize: 12, opacity: 0.75 }}>
              Pin at {placement.xPercent.toFixed(1)}%, {placement.yPercent.toFixed(1)}%
            </div>
            <CommentComposer
              placeholder="Write your comment…"
              submitLabel="Post"
              onCancel={() => {
                addons.getChannel().emit(EVENT_PREVIEW_PIN_REMOVE);
                setPlacement(null);
                setView('list');
              }}
              onSubmit={async (body) => {
                addons.getChannel().emit(EVENT_PREVIEW_PIN_REMOVE);
                const t = createThreadFromPlacement(placement, body, identity);
                await localStorageService.createThread(t);
                setPlacement(null);
                setView('list');
                await refreshThreads();
              }}
            />
          </div>
        )}

        {view === 'detail' && selectedThread && storyId && (
          <ThreadDetail
            thread={selectedThread}
            currentUser={identity}
            storage={localStorageService}
            storyId={storyId}
            onThreadUpdated={(t) => {
              setThreads((prev) => prev.map((x) => (x.id === t.id ? t : x)));
            }}
            onBack={() => {
              addons.getChannel().emit(EVENT_PANEL_PIN_FOCUS, { threadId: null });
              setSelectedId(null);
              setView('list');
            }}
            refreshThreads={refreshThreads}
          />
        )}

        {view === 'detail' && !selectedThread && (
          <div className="sb-comments-panel__scroll">
            <EmptyState message="Thread not found." />
            <button
              type="button"
              className="sb-comments-btn"
              style={{ margin: 16 }}
              onClick={() => {
                addons.getChannel().emit(EVENT_PANEL_PIN_FOCUS, { threadId: null });
                setView('list');
              }}
            >
              Back to list
            </button>
          </div>
        )}
      </div>
    </AddonPanel>
  );
}
