import type { CommentThread, Message, PinPlacementPayload, UserIdentity } from '../types';
import { createId } from './uuid';
import { nowIso } from './time';

export function createMessage(
  threadId: string,
  body: string,
  author: UserIdentity,
  type: Message['type'] = 'comment',
): Message {
  return {
    id: createId(),
    threadId,
    body,
    author,
    type,
    createdAt: nowIso(),
    editedAt: null,
    deletedAt: null,
  };
}

export function createThreadFromPlacement(
  payload: PinPlacementPayload,
  body: string,
  author: UserIdentity,
): CommentThread {
  const threadId = createId();
  const msg = createMessage(threadId, body, author, 'comment');
  const t = nowIso();
  return {
    id: threadId,
    storyId: payload.storyId,
    storyTitle: payload.storyTitle,
    pin: {
      xPercent: payload.xPercent,
      yPercent: payload.yPercent,
      viewportWidth: payload.viewportWidth,
      viewportHeight: payload.viewportHeight,
      anchor: null,
    },
    status: 'open',
    messages: [msg],
    createdBy: author,
    createdAt: t,
    updatedAt: t,
    deletedAt: null,
    metadata: {
      globals: payload.globals,
      args: payload.args,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    },
  };
}
