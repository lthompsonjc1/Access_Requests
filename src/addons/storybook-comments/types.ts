export interface UserIdentity {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ElementAnchor {
  selector: string;
  textContent: string;
  tagName: string;
}

export interface PinPosition {
  xPercent: number;
  yPercent: number;
  viewportWidth: number;
  viewportHeight: number;
  anchor: ElementAnchor | null;
}

export type ThreadStatus = 'open' | 'resolved';
export type MessageType = 'comment' | 'system';

export interface Message {
  id: string;
  threadId: string;
  body: string;
  author: UserIdentity;
  type: MessageType;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
}

export interface ThreadMetadata {
  globals: Record<string, unknown>;
  args: Record<string, unknown>;
  userAgent: string;
}

export interface CommentThread {
  id: string;
  storyId: string;
  storyTitle: string;
  pin: PinPosition;
  status: ThreadStatus;
  messages: Message[];
  createdBy: UserIdentity;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: ThreadMetadata;
  /** Display order on canvas (1-based), per story — computed when loading */
  pinIndex?: number;
}

export interface PinPlacementPayload {
  storyId: string;
  storyTitle: string;
  xPercent: number;
  yPercent: number;
  viewportWidth: number;
  viewportHeight: number;
  globals: Record<string, unknown>;
  args: Record<string, unknown>;
}

export interface ThreadsPayload {
  storyId: string;
  threads: CommentThread[];
}

export interface PinClickedPayload {
  threadId: string;
}

export interface PanelPinFocusPayload {
  threadId: string | null;
}

export interface AnnotateModePayload {
  active: boolean;
}
