/** Catalog of Access Request webhook events — shown for every configured channel; admins toggle per channel. */

export interface WebhookAccessEventDefinition {
  id: string;
  key: string;
  description: string;
}

export const WEBHOOK_ACCESS_EVENT_DEFINITIONS: WebhookAccessEventDefinition[] = [
  {
    id: 'access_management_access_request',
    key: 'access_management_access_request',
    description: 'Access Management request is created.',
  },
  {
    id: 'access_management_access_request_approval',
    key: 'access_management_access_request_approval',
    description: 'Access Management request is approved or denied.',
  },
  {
    id: 'access_management_association_change',
    key: 'access_management_association_change',
    description: 'Access Workflow request is executed.',
  },
  {
    id: 'access_management_approval_flow_create',
    key: 'access_management_approval_flow_create',
    description: 'Access Management approval flow is created.',
  },
  {
    id: 'access_management_approval_flow_update',
    key: 'access_management_approval_flow_update',
    description: 'Access Management approval flow is updated.',
  },
  {
    id: 'access_management_approval_flow_delete',
    key: 'access_management_approval_flow_delete',
    description: 'Access Management approval flow is deleted.',
  },
  {
    id: 'access_management_access_request_settings_update',
    key: 'access_management_access_request_settings_update',
    description: 'Access Management settings updated.',
  },
];

export interface SettingsWebhookChannelState {
  id: string;
  name: string;
  expanded: boolean;
  eventSelection: Record<string, boolean>;
}

export function createEmptyEventSelection(): Record<string, boolean> {
  const r: Record<string, boolean> = {};
  for (const e of WEBHOOK_ACCESS_EVENT_DEFINITIONS) {
    r[e.id] = false;
  }
  return r;
}

export function createWebhookChannelState(
  id: string,
  name: string,
  expanded: boolean,
  initialSelectedIds: string[],
): SettingsWebhookChannelState {
  const eventSelection = createEmptyEventSelection();
  for (const sid of initialSelectedIds) {
    if (sid in eventSelection) eventSelection[sid] = true;
  }
  return { id, name, expanded, eventSelection };
}

export function createDefaultSettingsWebhookChannels(): SettingsWebhookChannelState[] {
  return [
    createWebhookChannelState('1', 'Access Requests - DJ Test', true, [
      'access_management_access_request',
      'access_management_access_request_approval',
      'access_management_association_change',
      'access_management_approval_flow_create',
      'access_management_approval_flow_update',
      'access_management_approval_flow_delete',
    ]),
    createWebhookChannelState('2', 'Test Channel', false, ['access_management_access_request']),
  ];
}

export function countSelectedWebhookEvents(eventSelection: Record<string, boolean>): number {
  return Object.values(eventSelection).filter(Boolean).length;
}

export function webhookChannelEventsTagLabel(eventSelection: Record<string, boolean>): string {
  const n = countSelectedWebhookEvents(eventSelection);
  return n === 1 ? '1 EVENT' : `${n} EVENTS`;
}

export function isWebhookChannelSelectAllChecked(channel: SettingsWebhookChannelState): boolean {
  return countSelectedWebhookEvents(channel.eventSelection) === WEBHOOK_ACCESS_EVENT_DEFINITIONS.length;
}

export function isWebhookChannelSelectAllIndeterminate(channel: SettingsWebhookChannelState): boolean {
  const n = countSelectedWebhookEvents(channel.eventSelection);
  return n > 0 && n < WEBHOOK_ACCESS_EVENT_DEFINITIONS.length;
}

export function setAllWebhookChannelEvents(channel: SettingsWebhookChannelState, value: boolean): void {
  for (const e of WEBHOOK_ACCESS_EVENT_DEFINITIONS) {
    channel.eventSelection[e.id] = value;
  }
}
