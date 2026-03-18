/**
 * JumpCloud API Actions for DI Event Triggered Workflows
 * Based on docs/JUMPCLOUD_API_IMPLEMENTATION_PLAN.md
 */
import type { Component } from 'vue';

export type FieldType = 'text' | 'select' | 'multiselect' | 'textarea' | 'number';

export interface ActionFieldOption {
  label: string;
  value: string;
}

/** When set, parameter supports Select (e.g. pick from list) or Manual input (e.g. enter ID/variable) */
export interface InputModeToggle {
  selectLabel: string;
  manualLabel: string;
}

/** Parameter location: path (URL), query (?key=val), or body (JSON) */
export type ParamIn = 'path' | 'query' | 'body';

export interface ActionField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: ActionFieldOption[];
  /** For path params, use {{workflow.resource.id}} etc. */
  defaultValue?: string;
  /** When set, shows Select vs Manual toggle (e.g. Select Device / Enter ID) */
  inputModeToggle?: InputModeToggle;
  /** Placeholder when in manual mode, supports variables e.g. $input.device.objectID */
  manualPlaceholder?: string;
  /** Parameter location — path, query string, or request body. Default: body */
  paramIn?: ParamIn;
}

export interface ApiAction {
  id: string;
  label: string;
  description: string;
  icon: Component;
  group: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiDoc: string;
  fields: ActionField[];
}

// Icons are passed from the story; we use string keys that map to components
export type ActionIconKey = 'UserIcon' | 'ComputerDesktopIcon' | 'UsersIcon' | 'CommandLineIcon' | 'EnvelopeIcon' | 'LockClosedIcon' | 'KeyIcon' | 'UserGroupIcon' | 'DeviceListIcon';

export const API_ACTION_GROUPS = [
  'User Management',
  'Device Management',
  'Group Membership',
  'Commands',
  'Groups',
  'Notifications',
] as const;

export type ApiActionGroup = (typeof API_ACTION_GROUPS)[number];

/** Action definitions — icons are injected by the consumer */
export function getApiActions(icons: Record<string, Component>): ApiAction[] {
  return [
    {
      id: 'change-user-state',
      label: 'Change User Object State',
      description: 'Change the user object state (staged, active, suspended)',
      icon: icons.UserIcon ?? (() => null),
      group: 'User Management',
      method: 'PUT',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systemusers/operation/systemusers_put',
      fields: [
        { name: 'id', label: 'User ID', type: 'text', required: true, placeholder: 'input.resource.id', manualPlaceholder: '$input.resource.id', helpText: 'Path parameter. System user ID.', inputModeToggle: { selectLabel: 'Select User', manualLabel: 'Enter ID' }, paramIn: 'path' },
        { name: 'fullValidationDetails', label: 'Validation details', type: 'text', required: false, placeholder: 'e.g. password', helpText: 'Query parameter. Pass "password" for validation details.', paramIn: 'query' },
        { name: 'state', label: 'State', type: 'select', required: true, options: [
          { label: 'Active', value: 'ACTIVATED' },
          { label: 'Staged', value: 'STAGED' },
          { label: 'Suspended', value: 'SUSPENDED' },
        ], paramIn: 'body' },
      ],
    },
    {
      id: 'device-lock',
      label: 'Device Lock',
      description: 'Lock the device',
      icon: icons.LockClosedIcon ?? icons.ComputerDesktopIcon ?? (() => null),
      group: 'Device Management',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systems/operation/systems_lock',
      fields: [
        { name: 'system_id', label: 'Device', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter device ID', manualPlaceholder: '$input.device.objectID', helpText: 'Path param. Device to lock.', inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'device-restart',
      label: 'Device Restart',
      description: 'Restart the device',
      icon: icons.ComputerDesktopIcon ?? (() => null),
      group: 'Device Management',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systems/operation/systems_restart',
      fields: [
        { name: 'system_id', label: 'Device', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter device ID', manualPlaceholder: '$input.device.objectID', helpText: 'Path param. Device to restart.', inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'device-shutdown',
      label: 'Device Shutdown',
      description: 'Shutdown the device',
      icon: icons.ComputerDesktopIcon ?? (() => null),
      group: 'Device Management',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systems/operation/systems_shutdown',
      fields: [
        { name: 'system_id', label: 'Device', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter device ID', manualPlaceholder: '$input.device.objectID', helpText: 'Path param. Device to shutdown.', inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'device-erase',
      label: 'Device Erase',
      description: 'Erase the device (Linux/Windows only)',
      icon: icons.ComputerDesktopIcon ?? (() => null),
      group: 'Device Management',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#operation/systems_commandBuiltinErase',
      fields: [
        { name: 'system_id', label: 'Device', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter device ID', manualPlaceholder: '$input.device.objectID', helpText: 'Path param. Device to erase.', inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'user-group-association',
      label: 'Add/Remove User to/from User Group',
      description: 'Add or remove a user object to or from a user group',
      icon: icons.UsersIcon ?? icons.UserIcon ?? (() => null),
      group: 'Group Membership',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/2.0/index.html#tag/Users/operation/graph_userAssociationsPost',
      fields: [
        { name: 'user_id', label: 'User', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter user ID', manualPlaceholder: '$input.resource.id', helpText: 'Path param. User to add/remove.', inputModeToggle: { selectLabel: 'Select User', manualLabel: 'Enter ID' } },
        { name: 'op', label: 'Operation', type: 'select', required: true, paramIn: 'body', options: [
          { label: 'Add', value: 'add' },
          { label: 'Remove', value: 'remove' },
        ]},
        { name: 'type', label: 'Association Type', type: 'text', required: true, paramIn: 'body', defaultValue: 'user_group', placeholder: 'user_group', helpText: 'Type of association.' },
        { name: 'id', label: 'User Group', type: 'text', required: true, paramIn: 'body', placeholder: 'Select or enter group ID', manualPlaceholder: 'Group ID', helpText: 'ID of the user group.', inputModeToggle: { selectLabel: 'Select Group', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'device-group-association',
      label: 'Add/Remove Device to/from Device Group',
      description: 'Add or remove a device object to or from a device group',
      icon: icons.ComputerDesktopIcon ?? (() => null),
      group: 'Group Membership',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/2.0/index.html#tag/System-Groups/operation/graph_systemGroupAssociationsPost',
      fields: [
        { name: 'system_id', label: 'Device', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter device ID', manualPlaceholder: '$input.device.objectID', helpText: 'Path param. Device to add/remove.', inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' } },
        { name: 'op', label: 'Operation', type: 'select', required: true, paramIn: 'body', options: [
          { label: 'Add', value: 'add' },
          { label: 'Remove', value: 'remove' },
        ]},
        { name: 'type', label: 'Association Type', type: 'text', required: true, paramIn: 'body', defaultValue: 'system_group', placeholder: 'system_group', helpText: 'Type of association.' },
        { name: 'id', label: 'Device Group', type: 'text', required: true, paramIn: 'body', placeholder: 'Select or enter group ID', manualPlaceholder: 'Group ID', helpText: 'ID of the system group.', inputModeToggle: { selectLabel: 'Select Group', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'run-command',
      label: 'Run Command on Device',
      description: 'Run a specific command on a device. Command must be created beforehand.',
      icon: icons.CommandLineIcon ?? (() => null),
      group: 'Commands',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Commands/operation/commands_run',
      fields: [
        {
          name: 'device',
          label: 'Device',
          type: 'text',
          required: true,
          paramIn: 'body',
          placeholder: 'Select or enter device ID',
          manualPlaceholder: '$input.device.objectID',
          helpText: 'Device to run the command on.',
          inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' },
        },
        {
          name: 'command_id',
          label: 'Commands',
          type: 'text',
          required: true,
          paramIn: 'body',
          placeholder: 'Select or enter command ID',
          helpText: 'Command to run.',
          inputModeToggle: { selectLabel: 'Select', manualLabel: 'Enter ID' },
        },
        { name: 'systemIds', label: 'Device IDs (optional)', type: 'text', required: false, paramIn: 'body', placeholder: 'Comma-separated system IDs', helpText: 'Optional. If omitted, runs on command-bound devices.' },
      ],
    },
    {
      id: 'change-user-attribute',
      label: 'Change User Object Attribute Value',
      description: 'Change the value of a specific user object attribute',
      icon: icons.UserIcon ?? (() => null),
      group: 'User Management',
      method: 'PUT',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systemusers/operation/systemusers_put',
      fields: [
        { name: 'id', label: 'User', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter user ID', manualPlaceholder: '$input.resource.id', helpText: 'Path param. User to update.', inputModeToggle: { selectLabel: 'Select User', manualLabel: 'Enter ID' } },
        { name: 'attribute_name', label: 'Attribute Name', type: 'text', required: true, paramIn: 'body', placeholder: 'e.g. department, costCenter', helpText: 'Name of the attribute to update.' },
        { name: 'attribute_value', label: 'Attribute Value', type: 'text', required: true, paramIn: 'body', placeholder: 'New value', helpText: 'New value for the attribute.' },
      ],
    },
    {
      id: 'change-device-attribute',
      label: 'Change Device Object Attribute Value',
      description: 'Change the value of a specific device object attribute',
      icon: icons.ComputerDesktopIcon ?? (() => null),
      group: 'Device Management',
      method: 'PUT',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systems/operation/systems_put',
      fields: [
        { name: 'id', label: 'Device', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter device ID', manualPlaceholder: '$input.device.objectID', helpText: 'Path param. Device to update.', inputModeToggle: { selectLabel: 'Select Device', manualLabel: 'Enter ID' } },
        { name: 'displayName', label: 'Display Name', type: 'text', required: false, paramIn: 'body', placeholder: 'New display name', helpText: 'Update the device display name.' },
        { name: 'tags', label: 'Tags', type: 'text', required: false, paramIn: 'body', placeholder: 'tag1, tag2', helpText: 'Comma-separated tags.' },
      ],
    },
    {
      id: 'user-password-reset',
      label: 'User Password Reset',
      description: 'Initiate a user password reset (expire password)',
      icon: icons.KeyIcon ?? icons.UserIcon ?? (() => null),
      group: 'User Management',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/1.0/index.html#tag/Systemusers/operation/systemusers_expire',
      fields: [
        { name: 'id', label: 'User', type: 'text', required: true, paramIn: 'path', placeholder: 'Select or enter user ID', manualPlaceholder: '$input.resource.id', helpText: 'Path param. User to reset password for.', inputModeToggle: { selectLabel: 'Select User', manualLabel: 'Enter ID' } },
      ],
    },
    {
      id: 'create-user-group',
      label: 'Create User Group',
      description: 'Create a new User Group with defined configuration (including rules)',
      icon: icons.UsersIcon ?? (() => null),
      group: 'Groups',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/2.0/index.html#tag/User-Groups/operation/groups_user_post',
      fields: [
        { name: 'name', label: 'Group Name', type: 'text', required: true, paramIn: 'body', placeholder: 'Group name', helpText: 'Name of the new user group.' },
        { name: 'description', label: 'Description', type: 'textarea', required: false, paramIn: 'body', placeholder: 'Optional description', helpText: 'Group description.' },
      ],
    },
    {
      id: 'create-device-group',
      label: 'Create Device Group',
      description: 'Create a new Device Group with defined configuration (including rules)',
      icon: icons.ComputerDesktopIcon ?? (() => null),
      group: 'Groups',
      method: 'POST',
      apiDoc: 'https://docs.jumpcloud.com/api/2.0/index.html#tag/System-Groups/operation/groups_system_post',
      fields: [
        { name: 'name', label: 'Group Name', type: 'text', required: true, paramIn: 'body', placeholder: 'Group name', helpText: 'Name of the new device group.' },
        { name: 'description', label: 'Description', type: 'textarea', required: false, paramIn: 'body', placeholder: 'Optional description', helpText: 'Group description.' },
      ],
    },
    {
      id: 'notify-email',
      label: 'Notify via Email Channel',
      description: 'Trigger a notification via an email channel',
      icon: icons.EnvelopeIcon ?? (() => null),
      group: 'Notifications',
      method: 'POST',
      apiDoc: '#',
      fields: [
        { name: 'channel_id', label: 'Channel ID', type: 'text', required: true, paramIn: 'body', placeholder: 'Email channel ID', helpText: 'Payload/recipients — needs API clarity.' },
        { name: 'subject', label: 'Subject', type: 'text', required: false, paramIn: 'body', placeholder: 'Email subject' },
        { name: 'body', label: 'Body', type: 'textarea', required: false, paramIn: 'body', placeholder: 'Email body content' },
      ],
    },
    {
      id: 'notify-webhook',
      label: 'Notify via Webhook Channel',
      description: 'Trigger a notification via a webhook channel',
      icon: icons.EnvelopeIcon ?? (() => null),
      group: 'Notifications',
      method: 'POST',
      apiDoc: '#',
      fields: [
        { name: 'channel_id', label: 'Channel ID', type: 'text', required: true, paramIn: 'body', placeholder: 'Webhook channel ID', helpText: 'Payload — needs API clarity.' },
        { name: 'payload', label: 'Payload (JSON)', type: 'textarea', required: false, paramIn: 'body', placeholder: '{"key": "value"}', helpText: 'Optional JSON payload.' },
      ],
    },
  ];
}
