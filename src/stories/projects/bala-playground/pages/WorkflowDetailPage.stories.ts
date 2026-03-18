import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent } from 'vue';
import {
  AppNavigation,
  PageHeader,
  ToggleSwitch,
  FormField,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

import {
  RocketLaunchIcon,
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  BellIcon,
  UserIcon,
  UsersIcon,
  CommandLineIcon,
  ClipboardDocumentListIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  PlayIcon,
  XMarkIcon,
  InformationCircleIcon,
  PlusIcon,
  EnvelopeIcon,
    ArrowPathIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsRightLeftIcon,
    ComputerDesktopIcon,
    ClockIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    PencilIcon,
} from '@heroicons/vue/24/outline';

import TopBar from '../../../../components/TopBar.vue';

import {
  DeviceManagementIcon,
  AccessIcon,
  DeviceListsIcon,
  DeviceGroupsIcon,
  SsoIcon,
  SaasManagementIcon,
  PasswordManagerIcon,
  WorkflowIcon,
} from '@jumpcloud/icons';

// ── Navigation items ──
const menuItems = [
  {
    label: 'Get Started',
    leftIcon: markRaw(RocketLaunchIcon),
  },
  {
    label: 'Home',
    leftIcon: markRaw(HomeIcon),
  },
  {
    label: 'Alert',
    leftIcon: markRaw(BellIcon),
    count: 23,
    isNew: true,
  },
  {
    label: 'User Management',
    leftIcon: markRaw(UserGroupIcon),
    items: [
      { label: 'Users', leftIcon: markRaw(UserIcon) },
      { label: 'User Groups', leftIcon: markRaw(UsersIcon) },
      { separator: true },
      { label: 'Active Directory' },
      { label: 'Cloud Directories' },
      { label: 'HR Directories' },
      { label: 'Identity Provider' },
    ],
  },
  {
    label: 'Device Management',
    leftIcon: markRaw(DeviceManagementIcon),
    items: [
      { label: 'Devices', leftIcon: markRaw(DeviceListsIcon) },
      { label: 'Device Groups', leftIcon: markRaw(DeviceGroupsIcon) },
      { label: 'Commands', leftIcon: markRaw(CommandLineIcon) },
      { label: 'Asset Management', leftIcon: markRaw(ClipboardDocumentListIcon), isNew: true },
      { separator: true },
      { label: 'Policy Management' },
      { label: 'Policy Groups' },
      { label: 'Software Deployment' },
      { label: 'MDM' },
    ],
  },
  {
    label: 'Access',
    leftIcon: markRaw(AccessIcon),
    items: [
      { label: 'SSO Applications', leftIcon: markRaw(SsoIcon) },
      { label: 'Access Reports', isNew: true },
      { label: 'SaaS Management', leftIcon: markRaw(SaasManagementIcon) },
      { label: 'Password Management', leftIcon: markRaw(PasswordManagerIcon) },
      { label: 'LDAP' },
      { label: 'RADIUS' },
    ],
  },
  {
    label: 'Workflows',
    leftIcon: markRaw(WorkflowIcon),
    items: [
      { label: 'All Workflows' },
      { label: 'Triggers' },
    ],
  },
  {
    label: 'Security',
    leftIcon: markRaw(ShieldCheckIcon),
    items: [
      { label: 'Conditional Access Policies' },
      { label: 'Conditional List' },
      { label: 'MFA Configurations' },
      { label: 'Device Trust' },
    ],
  },
  {
    label: 'Insights',
    leftIcon: markRaw(ChartBarSquareIcon),
    items: [
      { label: 'Reports' },
      { label: 'Directory Insights' },
    ],
  },
  {
    label: 'Settings',
    leftIcon: markRaw(Cog6ToothIcon),
  },
];

const profileMenuItems = [
  {
    label: 'Burak Başcı',
    itemType: 'profile_compact',
    initials: 'BB',
    name: 'Burak Başcı',
    items: [
      {
        label: 'Admin IT',
        itemType: 'profile_large',
        name: 'Admin IT',
        email: 'admin_it@company.com',
        initials: 'AT',
      },
      { separator: true },
      {
        label: 'Logout',
        rightIcon: markRaw(ArrowRightStartOnRectangleIcon),
      },
      { separator: true },
      { label: 'Change Password' },
      {
        label: 'Launch User Portal',
        rightIcon: markRaw(ArrowTopRightOnSquareIcon),
      },
      { separator: true },
      { label: 'Billing' },
      { label: 'My API Key' },
      { separator: true },
      {
        label: 'Use Old Navigation',
        itemType: 'button',
      },
    ],
  },
];

// ── Tab definitions ──
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Execution history', value: 'execution-history' },
];

// ── Component ──
const WorkflowDetailPage = defineComponent({
  name: 'WorkflowDetailPage',
  components: {
    AppNavigation,
    PageHeader,
    ToggleSwitch,
    FormField,
    PvButton: Button,
    PvTag: Tag,
    PvInputText: InputText,
    PvSelect: Select,
    PvDialog: Dialog,
    PvIconField: IconField,
    PvInputIcon: InputIcon,
    TopBar,
    BoltIcon,
    PlayIcon,
    XMarkIcon,
    InformationCircleIcon,
    PlusIcon,
    EnvelopeIcon,
    ArrowPathIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsRightLeftIcon,
    ComputerDesktopIcon,
    ClockIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ClipboardDocumentListIcon,
    PencilIcon,
  },
  setup() {
    const activeTab = ref('overview');
    const isEnabled = ref(true);
    const selectedStep = ref<string | null>(null);

    // ── Node name inline-editing ──
    const nodeNames = ref<Record<string, string>>({
      trigger: 'User suspended',
      loop: 'Loop',
      'remove-device': 'Remove device',
      'send-email': 'Send email',
      'if-else': 'If Else',
    });
    const editingNodeId = ref<string | null>(null);
    const editingValue = ref('');

    function startEditing(nodeId: string) {
      editingNodeId.value = nodeId;
      editingValue.value = nodeNames.value[nodeId] ?? '';
    }

    function finishEditing() {
      if (editingNodeId.value) {
        const trimmed = editingValue.value.trim();
        if (trimmed) nodeNames.value[editingNodeId.value] = trimmed;
      }
      editingNodeId.value = null;
      editingValue.value = '';
    }
    const loopInputValue = ref('List user systems');
    const emailSubject = ref('Device removed');
    const emailChannels = ref(['Email channel 1', 'Email channel 2', 'Email channel 3']);
    const showActionTypeModal = ref(false);
    const actionSearchQuery = ref('');

    const actionTypes = [
      {
        category: 'Flow',
        closable: true,
        items: [
          { id: 'if-else', label: 'If else', description: 'An if-else allows your workflow to make decisions based on conditions. If a specific condition is true, it executes a certain block of code; otherwise, it runs an alternative block.', icon: 'ArrowsRightLeftIcon', iconBg: 'bg-chart-violet-dark' },
          { id: 'loops', label: 'Loops', description: 'A for loop automates repetitive tasks by iterating over a set of items, allowing you to execute a block of code multiple times efficiently.', icon: 'ArrowPathIcon', iconBg: 'bg-chart-violet-dark' },
        ],
      },
      {
        category: 'Jumpcloud Actions',
        items: [
          { id: 'remove-devices', label: 'Remove devices', description: 'Removing devices will allow you to disconnect or uninstall hardware from your system, ensuring that it no longer interfere with your operations.', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
          { id: 'get-systems', label: 'Get Systems', description: 'To retrieve devices, ensuring that it collects the latest information on their status and availability.', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
          { id: 'send-email-channel', label: 'Send notification via email channel', description: 'Execute tailored or standard scripts seamlessly across macOS, Windows, and Linux platforms.', icon: 'EnvelopeIcon', iconBg: 'bg-chart-branding-base' },
          { id: 'send-webhook', label: 'Send notification via webhook', description: 'Execute tailored or standard scripts seamlessly across macOS, Windows, and Linux platforms.', icon: 'ClockIcon', iconBg: 'bg-chart-branding-base' },
        ],
      },
    ];

    const variableOptions = [
      { label: 'User suspended event', items: [
        { label: 'user.id', value: 'user.id' },
        { label: 'device id', value: 'device id' },
        { label: 'initiatedby.email', value: 'initiatedby.email' },
        { label: 'Variable name', value: 'Variable name' },
      ]},
      { label: 'Get Systems', items: [
        { label: 'List user systems', value: 'List user systems', description: 'This retrieves a list of systems linked to a user ID.' },
      ]},
    ];

    const removeChannel = (index: number) => {
      emailChannels.value.splice(index, 1);
    };

    const showIfElseNode = ref(false);
    const addingActionToBranchIndex = ref<number | null>(null);
    let nextConditionId = 2;
    let nextActionId = 1;

    const ifElseConditions = ref<Array<{
      id: number;
      type: string;
      variable: string;
      operator: string;
      value: string;
      expanded: boolean;
      actions: Array<{ id: number; actionId: string; label: string; icon: string; iconBg: string }>;
    }>>([
      { id: 1, type: 'if', variable: '', operator: 'equals', value: '', expanded: true, actions: [] },
    ]);

    const elseActions = ref<Array<{ id: number; actionId: string; label: string; icon: string; iconBg: string }>>([]);

    const operatorOptions = [
      { label: 'Equals', value: 'equals' },
      { label: 'Not equals', value: 'not_equals' },
      { label: 'Contains', value: 'contains' },
      { label: 'Does not contain', value: 'not_contains' },
      { label: 'Greater than', value: 'greater_than' },
      { label: 'Less than', value: 'less_than' },
      { label: 'Is empty', value: 'is_empty' },
      { label: 'Is not empty', value: 'is_not_empty' },
    ];

    const conditionVariables = [
      { label: 'user.id', value: 'user.id' },
      { label: 'device.id', value: 'device.id' },
      { label: 'initiatedby.email', value: 'initiatedby.email' },
      { label: 'input.resource.id', value: 'input.resource.id' },
    ];

    const actionIconMap: Record<string, { label: string; icon: string; iconBg: string }> = {
      'remove-devices': { label: 'Remove devices', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
      'get-systems': { label: 'Get Systems', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
      'send-email-channel': { label: 'Send notification via email channel', icon: 'EnvelopeIcon', iconBg: 'bg-chart-branding-base' },
      'send-webhook': { label: 'Send notification via webhook', icon: 'ClockIcon', iconBg: 'bg-chart-branding-base' },
      'loops': { label: 'Loops', icon: 'ArrowPathIcon', iconBg: 'bg-chart-violet-dark' },
    };

    const handleActionTypeSelect = (actionId: string) => {
      showActionTypeModal.value = false;

      if (addingActionToBranchIndex.value !== null) {
        const branchIdx = addingActionToBranchIndex.value;
        const meta = actionIconMap[actionId];
        if (meta) {
          const newAction = { id: nextActionId++, actionId, ...meta };
          if (branchIdx === -1) {
            elseActions.value.push(newAction);
          } else {
            ifElseConditions.value[branchIdx].actions.push(newAction);
          }
        }
        addingActionToBranchIndex.value = null;
        return;
      }

      if (actionId === 'if-else') {
        showIfElseNode.value = true;
        selectedStep.value = 'if-else';
      }
    };

    const addCondition = () => {
      ifElseConditions.value.push({
        id: nextConditionId++,
        type: 'else-if',
        variable: '',
        operator: 'equals',
        value: '',
        expanded: true,
        actions: [],
      });
    };

    const removeCondition = (index: number) => {
      ifElseConditions.value.splice(index, 1);
    };

    const openBranchActionModal = (branchIndex: number) => {
      addingActionToBranchIndex.value = branchIndex;
      showActionTypeModal.value = true;
    };

    const removeActionFromBranch = (branchIndex: number, actionIndex: number) => {
      if (branchIndex === -1) {
        elseActions.value.splice(actionIndex, 1);
      } else {
        ifElseConditions.value[branchIndex].actions.splice(actionIndex, 1);
      }
    };

    const toggleBranch = (index: number) => {
      ifElseConditions.value[index].expanded = !ifElseConditions.value[index].expanded;
    };

    return {
      menuItems,
      profileMenuItems,
      tabs,
      activeTab,
      isEnabled,
      selectedStep,
      loopInputValue,
      emailSubject,
      emailChannels,
      variableOptions,
      removeChannel,
      showActionTypeModal,
      actionSearchQuery,
      actionTypes,
      showIfElseNode,
      ifElseConditions,
      elseActions,
      operatorOptions,
      conditionVariables,
      handleActionTypeSelect,
      addCondition,
      removeCondition,
      openBranchActionModal,
      removeActionFromBranch,
      toggleBranch,
      addingActionToBranchIndex,
      WorkflowIcon: markRaw(WorkflowIcon),
      nodeNames,
      editingNodeId,
      editingValue,
      startEditing,
      finishEditing,
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="workflows"
        :collapsible="true"
      />
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar showBackButton backButtonLabel="Back" />

        <!-- Page Header with actions -->
        <PageHeader
          title="Remove device of suspended users"
          :tabs="tabs"
          :activeTab="activeTab"
          @update:activeTab="activeTab = $event"
        >
          <template #actions>
            <div class="flex items-center gap-sm">
              <ToggleSwitch v-model="isEnabled" label="Enabled" />
              <PvButton label="Cancel" severity="secondary" variant="outlined" />
              <PvButton severity="secondary" variant="outlined">
                <template #icon>
                  <PlayIcon class="size-5" />
                </template>
              </PvButton>
              <PvButton label="Save" />
            </div>
          </template>
        </PageHeader>

        <!-- Metadata bar -->
        <div class="flex items-center gap-md px-6 border-b border-neutral-default_solid bg-neutral-base shrink-0">
          <div class="flex items-center gap-sm py-2">
            <div class="flex items-center gap-xs">
              <BoltIcon class="size-4 text-neutral-subtle" />
              <span class="text-body-sm text-neutral-subtle">Event Trigger</span>
            </div>
            <span class="text-neutral-ghost">·</span>
            <span class="text-body-sm text-neutral-subtle">Last Ran: 2mins Ago</span>
            <span class="text-neutral-ghost">·</span>
            <span class="text-body-sm text-neutral-subtle">Created: 2d ago</span>
          </div>
        </div>

        <!-- Main content area -->
        <div v-if="activeTab === 'overview'" class="flex-1 flex min-h-0 overflow-hidden">
          <!-- Workflow canvas -->
          <div class="flex-1 overflow-auto bg-neutral-surface">
            <div class="flex flex-col items-center py-8 px-6 min-h-full">

              <!-- Trigger step card -->
              <div
                class="workflow-card w-[420px] rounded-lg border bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'trigger' ? 'border-2 border-brand-primary-base' : 'border-neutral-default_solid'"
                @click="selectedStep = 'trigger'"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-warning-light">
                    <BoltIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <div class="group flex items-center gap-xs min-w-0" @click.stop>
                    <span
                      v-if="editingNodeId !== 'trigger'"
                      class="text-body-md-semi-bold text-neutral-base cursor-text"
                      @dblclick.stop="startEditing('trigger')"
                    >{{ nodeNames['trigger'] }}</span>
                    <PencilIcon
                      v-if="editingNodeId !== 'trigger'"
                      class="size-3.5 text-neutral-ghost opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 transition-opacity"
                      @click.stop="startEditing('trigger')"
                    />
                    <PvInputText
                      v-else
                      v-model="editingValue"
                      autofocus
                      size="small"
                      class="h-6 py-0 px-1 min-w-0 w-36 text-body-md-semi-bold"
                      @blur="finishEditing"
                      @keydown.enter.prevent="finishEditing"
                      @keydown.esc="editingNodeId = null"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="px-4 pb-4 flex flex-col gap-1">
                  <span class="text-body-sm text-neutral-subtle">user_id</span>
                  <span class="text-body-sm text-neutral-subtle">input.resource.id</span>
                </div>
              </div>

              <!-- Connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Loop step card (selected) -->
              <div
                class="workflow-card w-[420px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'loop' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'loop'"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                    <ArrowPathIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <div class="group flex items-center gap-xs min-w-0" @click.stop>
                    <span
                      v-if="editingNodeId !== 'loop'"
                      class="text-body-md-semi-bold text-neutral-base cursor-text"
                      @dblclick.stop="startEditing('loop')"
                    >{{ nodeNames['loop'] }}</span>
                    <PencilIcon
                      v-if="editingNodeId !== 'loop'"
                      class="size-3.5 text-neutral-ghost opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 transition-opacity"
                      @click.stop="startEditing('loop')"
                    />
                    <PvInputText
                      v-else
                      v-model="editingValue"
                      autofocus
                      size="small"
                      class="h-6 py-0 px-1 min-w-0 w-36 text-body-md-semi-bold"
                      @blur="finishEditing"
                      @keydown.enter.prevent="finishEditing"
                      @keydown.esc="editingNodeId = null"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="px-4 pb-4 flex flex-col gap-1">
                  <span class="text-body-sm text-neutral-subtle">Count</span>
                  <span class="text-body-sm text-neutral-subtle">List user systems</span>
                </div>
              </div>

              <!-- Connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Remove device step card -->
              <div
                class="workflow-card w-[420px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'remove-device' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'remove-device'"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                    <BoltIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <div class="group flex items-center gap-xs min-w-0" @click.stop>
                    <span
                      v-if="editingNodeId !== 'remove-device'"
                      class="text-body-md-semi-bold text-neutral-base cursor-text"
                      @dblclick.stop="startEditing('remove-device')"
                    >{{ nodeNames['remove-device'] }}</span>
                    <PencilIcon
                      v-if="editingNodeId !== 'remove-device'"
                      class="size-3.5 text-neutral-ghost opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 transition-opacity"
                      @click.stop="startEditing('remove-device')"
                    />
                    <PvInputText
                      v-else
                      v-model="editingValue"
                      autofocus
                      size="small"
                      class="h-6 py-0 px-1 min-w-0 w-36 text-body-md-semi-bold"
                      @blur="finishEditing"
                      @keydown.enter.prevent="finishEditing"
                      @keydown.esc="editingNodeId = null"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="px-4 pb-4 flex flex-col gap-1">
                  <span class="text-body-sm text-neutral-subtle">user_id</span>
                  <span class="text-body-sm text-neutral-subtle">input.resource.id</span>
                </div>
              </div>

              <!-- Connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Send email step card -->
              <div
                class="workflow-card w-[420px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'send-email' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'send-email'"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-branding-base">
                    <EnvelopeIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <div class="group flex items-center gap-xs min-w-0" @click.stop>
                    <span
                      v-if="editingNodeId !== 'send-email'"
                      class="text-body-md-semi-bold text-neutral-base cursor-text"
                      @dblclick.stop="startEditing('send-email')"
                    >{{ nodeNames['send-email'] }}</span>
                    <PencilIcon
                      v-if="editingNodeId !== 'send-email'"
                      class="size-3.5 text-neutral-ghost opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 transition-opacity"
                      @click.stop="startEditing('send-email')"
                    />
                    <PvInputText
                      v-else
                      v-model="editingValue"
                      autofocus
                      size="small"
                      class="h-6 py-0 px-1 min-w-0 w-36 text-body-md-semi-bold"
                      @blur="finishEditing"
                      @keydown.enter.prevent="finishEditing"
                      @keydown.esc="editingNodeId = null"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="px-4 pb-4 flex flex-col gap-md">
                  <!-- Recipients -->
                  <div class="flex flex-col gap-1">
                    <span class="text-body-sm text-neutral-subtle">Recipients</span>
                    <div class="flex items-center gap-xs flex-wrap">
                      <PvTag value="4 email channels" severity="neutral" />
                      <PvTag value="1 email id" severity="neutral" />
                    </div>
                  </div>
                  <!-- Subject -->
                  <div class="flex flex-col gap-1">
                    <span class="text-body-sm text-neutral-subtle">Subject</span>
                    <span class="text-body-md text-neutral-base">Device Removed</span>
                  </div>
                  <!-- Email body -->
                  <div class="flex flex-col gap-1">
                    <span class="text-body-sm text-neutral-subtle">Email body</span>
                    <div class="flex items-center gap-xs flex-wrap">
                      <PvTag value="input.device_id" severity="info" />
                      <span class="text-body-sm text-neutral-base">is removed from the</span>
                      <PvTag value="input.user_id" severity="info" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- If Else node (dynamically added) -->
              <template v-if="showIfElseNode">
                <div class="flex flex-col items-center">
                  <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                  <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                  <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
                </div>

                <div
                  class="workflow-card w-[520px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                  :class="selectedStep === 'if-else' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                  @click="selectedStep = 'if-else'"
                >
                  <!-- Node header -->
                  <div class="flex items-center gap-sm px-4 pt-4 pb-3">
                    <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                      <ArrowsRightLeftIcon class="size-4 text-neutral-inverted-base" />
                    </div>
                    <div class="group flex items-center gap-xs min-w-0" @click.stop>
                      <span
                        v-if="editingNodeId !== 'if-else'"
                        class="text-body-md-semi-bold text-neutral-base cursor-text"
                        @dblclick.stop="startEditing('if-else')"
                      >{{ nodeNames['if-else'] }}</span>
                      <PencilIcon
                        v-if="editingNodeId !== 'if-else'"
                        class="size-3.5 text-neutral-ghost opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 transition-opacity"
                        @click.stop="startEditing('if-else')"
                      />
                      <PvInputText
                        v-else
                        v-model="editingValue"
                        autofocus
                        size="small"
                        class="h-6 py-0 px-1 min-w-0 w-36 text-body-md-semi-bold"
                        @blur="finishEditing"
                        @keydown.enter.prevent="finishEditing"
                        @keydown.esc="editingNodeId = null"
                        @click.stop
                      />
                    </div>
                  </div>

                  <!-- Branches visualization -->
                  <div class="px-4 pb-4 flex flex-col gap-2">
                    <div v-for="(cond, idx) in ifElseConditions" :key="cond.id" class="flex flex-col gap-1">
                      <div class="flex items-center gap-xs">
                        <span class="text-body-sm-semi-bold" :class="cond.type === 'if' ? 'text-brand-primary-base' : 'text-chart-violet-dark'">
                          {{ cond.type === 'if' ? 'If' : 'Else if' }}
                        </span>
                        <span class="text-body-sm text-neutral-subtle">
                          {{ cond.variable ? cond.variable + ' ' + cond.operator + (cond.value ? ' ' + cond.value : '') : 'Not configured' }}
                        </span>
                      </div>
                      <div v-if="cond.actions.length" class="ml-4 flex flex-col gap-1">
                        <div v-for="action in cond.actions" :key="action.id" class="flex items-center gap-xs">
                          <div class="flex items-center justify-center size-4 rounded shrink-0" :class="action.iconBg">
                            <component :is="action.icon" class="size-2.5 text-neutral-inverted-base" />
                          </div>
                          <span class="text-body-sm text-neutral-subtle truncate">{{ action.label }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <span class="text-body-sm-semi-bold text-neutral-subtle">Else</span>
                      <div v-if="elseActions.length" class="ml-4 flex flex-col gap-1">
                        <div v-for="action in elseActions" :key="action.id" class="flex items-center gap-xs">
                          <div class="flex items-center justify-center size-4 rounded shrink-0" :class="action.iconBg">
                            <component :is="action.icon" class="size-2.5 text-neutral-inverted-base" />
                          </div>
                          <span class="text-body-sm text-neutral-subtle truncate">{{ action.label }}</span>
                        </div>
                      </div>
                      <span v-else class="ml-4 text-body-sm text-neutral-subtle">Default path</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Connector to add button -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Add step button -->
              <PvButton
                severity="secondary"
                variant="outlined"
                rounded
                class="size-10"
                @click="showActionTypeModal = true"
              >
                <template #icon>
                  <PlusIcon class="size-5" />
                </template>
              </PvButton>

              <div class="h-8"></div>
            </div>
          </div>

          <!-- Right sidebar — Step configuration panel -->
          <div v-if="selectedStep" class="w-[380px] shrink-0 border-l border-neutral-default_solid bg-neutral-base overflow-y-auto">
            <!-- Sidebar header — dynamic per step -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-default_solid">
              <div class="flex items-center gap-sm">
                <template v-if="selectedStep === 'trigger'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-warning-light shrink-0">
                    <BoltIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base truncate">{{ nodeNames['trigger'] }}</span>
                </template>
                <template v-else-if="selectedStep === 'loop'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark shrink-0">
                    <ArrowPathIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base truncate">{{ nodeNames['loop'] }}</span>
                </template>
                <template v-else-if="selectedStep === 'remove-device'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark shrink-0">
                    <BoltIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base truncate">{{ nodeNames['remove-device'] }}</span>
                </template>
                <template v-else-if="selectedStep === 'send-email'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-branding-base shrink-0">
                    <EnvelopeIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base truncate">{{ nodeNames['send-email'] }}</span>
                </template>
                <template v-else-if="selectedStep === 'if-else'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark shrink-0">
                    <ArrowsRightLeftIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base truncate">{{ nodeNames['if-else'] }}</span>
                </template>
              </div>
              <PvButton severity="secondary" variant="text" size="small" @click="selectedStep = null">
                <template #icon>
                  <XMarkIcon class="size-5" />
                </template>
              </PvButton>
            </div>

            <!-- Sidebar content — dynamic per step -->
            <div class="p-4 flex flex-col gap-md">

              <!-- Node name field — always visible at the top -->
              <FormField label="Node name">
                <template #default="{ inputId }">
                  <PvInputText
                    :id="inputId"
                    :value="nodeNames[selectedStep]"
                    class="w-full"
                    @input="nodeNames[selectedStep] = $event.target.value"
                  />
                </template>
              </FormField>

              <!-- TRIGGER panel -->
              <template v-if="selectedStep === 'trigger'">
                <div class="flex flex-col gap-2">
                  <span class="text-body-sm-semi-bold text-neutral-base">Trigger variables</span>
                  <div class="flex flex-col gap-1 px-3 py-2 rounded-md border border-neutral-default_solid bg-neutral-surface">
                    <span class="text-body-sm text-neutral-subtle">user_id</span>
                    <span class="text-body-sm text-neutral-subtle">input.resource.id</span>
                  </div>
                </div>
              </template>

              <!-- LOOP panel -->
              <template v-else-if="selectedStep === 'loop'">
                <FormField label="Enter input value" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <PvSelect
                      :id="inputId"
                      v-model="loopInputValue"
                      :options="variableOptions"
                      optionLabel="label"
                      optionValue="value"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      placeholder="Select a variable"
                      class="w-full"
                    >
                      <template #optiongroup="slotProps">
                        <span class="text-body-sm-semi-bold text-neutral-subtle">{{ slotProps.option.label }}</span>
                      </template>
                      <template #option="slotProps">
                        <div>
                          <div class="text-body-sm text-neutral-base">{{ slotProps.option.label }}</div>
                          <div v-if="slotProps.option.description" class="text-body-sm text-neutral-subtle">{{ slotProps.option.description }}</div>
                        </div>
                      </template>
                    </PvSelect>
                  </template>
                </FormField>
              </template>

              <!-- REMOVE DEVICE panel -->
              <template v-else-if="selectedStep === 'remove-device'">
                <FormField label="User ID" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <PvInputText :id="inputId" modelValue="user_id" class="w-full" readonly />
                  </template>
                </FormField>
                <FormField label="Resource ID" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <PvInputText :id="inputId" modelValue="input.resource.id" class="w-full" readonly />
                  </template>
                </FormField>
              </template>

              <!-- SEND EMAIL panel -->
              <template v-else-if="selectedStep === 'send-email'">
                <FormField label="Select Email channels" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <div
                      :id="inputId"
                      class="flex items-center gap-xs flex-wrap border border-neutral-default_solid rounded-md px-3 py-2 bg-neutral-base min-h-[38px]"
                    >
                      <div
                        v-for="(channel, idx) in emailChannels"
                        :key="channel"
                        class="flex items-center gap-1 bg-neutral-surface border border-neutral-default_solid rounded px-2 py-0.5"
                      >
                        <span class="text-body-sm text-neutral-base">{{ channel }}</span>
                        <XMarkIcon class="size-3.5 text-neutral-subtle cursor-pointer hover:text-neutral-base" @click="removeChannel(idx)" />
                      </div>
                      <CheckIcon class="size-5 text-brand-primary-base ml-auto" />
                    </div>
                  </template>
                </FormField>

                <FormField label="Subject" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <PvInputText :id="inputId" v-model="emailSubject" class="w-full" />
                  </template>
                </FormField>

                <FormField label="Email body" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <div
                      :id="inputId"
                      class="border border-neutral-default_solid rounded-md px-3 py-3 bg-neutral-base min-h-[100px]"
                    >
                      <div class="flex items-center gap-xs flex-wrap">
                        <span class="inline-flex items-center rounded bg-brand-primary-ghost text-body-sm text-brand-primary-base px-1.5 py-0.5 font-mono">input.device_id</span>
                        <span class="text-body-sm text-neutral-base">is removed from the</span>
                        <span class="inline-flex items-center rounded bg-brand-primary-ghost text-body-sm text-brand-primary-base px-1.5 py-0.5 font-mono">input.user_id</span>
                      </div>
                    </div>
                  </template>
                </FormField>

                <div class="flex items-center gap-xs -mt-1">
                  <InformationCircleIcon class="size-4 text-neutral-subtle shrink-0" />
                  <span class="text-body-sm text-neutral-subtle">Type 'Input' to reference a variable</span>
                </div>
              </template>

              <!-- IF ELSE panel -->
              <template v-else-if="selectedStep === 'if-else'">
                <!-- Condition branches -->
                <div
                  v-for="(condition, idx) in ifElseConditions"
                  :key="condition.id"
                  class="flex flex-col gap-sm"
                  :class="idx > 0 ? 'pt-4 border-t border-neutral-default_solid' : ''"
                >
                  <!-- Branch header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-xs cursor-pointer" @click="toggleBranch(idx)">
                      <component :is="condition.expanded ? 'ChevronDownIcon' : 'ChevronRightIcon'" class="size-4 text-neutral-subtle" />
                      <span class="text-body-md-semi-bold text-neutral-base">
                        {{ condition.type === 'if' ? 'If' : 'Else if' }}
                      </span>
                    </div>
                    <PvButton
                      v-if="condition.type === 'else-if'"
                      severity="danger"
                      variant="text"
                      size="small"
                      @click="removeCondition(idx)"
                    >
                      <template #icon>
                        <TrashIcon class="size-4" />
                      </template>
                    </PvButton>
                  </div>

                  <template v-if="condition.expanded">
                    <!-- Condition fields -->
                    <FormField label="Variable" required>
                      <template #default="{ inputId }">
                        <PvSelect
                          :id="inputId"
                          v-model="condition.variable"
                          :options="conditionVariables"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select variable"
                          class="w-full"
                        />
                      </template>
                    </FormField>

                    <FormField label="Operator" required>
                      <template #default="{ inputId }">
                        <PvSelect
                          :id="inputId"
                          v-model="condition.operator"
                          :options="operatorOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select operator"
                          class="w-full"
                        />
                      </template>
                    </FormField>

                    <FormField label="Value">
                      <template #default="{ inputId }">
                        <PvInputText
                          :id="inputId"
                          v-model="condition.value"
                          placeholder="Enter value"
                          class="w-full"
                        />
                      </template>
                    </FormField>

                    <!-- Nested actions for this branch -->
                    <div class="flex flex-col gap-sm mt-2">
                      <span class="text-body-sm-semi-bold text-neutral-subtle">Actions</span>

                      <div
                        v-for="(action, aIdx) in condition.actions"
                        :key="action.id"
                        class="flex items-center gap-sm p-3 rounded-md border border-neutral-default_solid bg-neutral-surface"
                      >
                        <div class="flex items-center justify-center size-6 rounded shrink-0" :class="action.iconBg">
                          <component :is="action.icon" class="size-3.5 text-neutral-inverted-base" />
                        </div>
                        <span class="text-body-sm text-neutral-base flex-1 truncate">{{ action.label }}</span>
                        <PvButton severity="danger" variant="text" size="small" @click="removeActionFromBranch(idx, aIdx)">
                          <template #icon>
                            <TrashIcon class="size-3.5" />
                          </template>
                        </PvButton>
                      </div>

                      <PvButton
                        label="Add action"
                        severity="secondary"
                        variant="outlined"
                        size="small"
                        class="w-full"
                        @click="openBranchActionModal(idx)"
                      >
                        <template #icon>
                          <PlusIcon class="size-4" />
                        </template>
                      </PvButton>
                    </div>
                  </template>
                </div>

                <!-- Add else if button -->
                <PvButton
                  label="Add else if"
                  severity="secondary"
                  variant="outlined"
                  size="small"
                  class="w-full"
                  @click="addCondition"
                >
                  <template #icon>
                    <PlusIcon class="size-4" />
                  </template>
                </PvButton>

                <!-- Else section -->
                <div class="pt-4 border-t border-neutral-default_solid">
                  <div class="flex flex-col gap-sm">
                    <span class="text-body-md-semi-bold text-neutral-base">Else</span>
                    <div class="px-3 py-3 rounded-md border border-neutral-default_solid bg-neutral-surface">
                      <span class="text-body-sm text-neutral-subtle">Default path — executes when no conditions match</span>
                    </div>

                    <!-- Nested actions for else -->
                    <div class="flex flex-col gap-sm mt-1">
                      <div
                        v-for="(action, aIdx) in elseActions"
                        :key="action.id"
                        class="flex items-center gap-sm p-3 rounded-md border border-neutral-default_solid bg-neutral-surface"
                      >
                        <div class="flex items-center justify-center size-6 rounded shrink-0" :class="action.iconBg">
                          <component :is="action.icon" class="size-3.5 text-neutral-inverted-base" />
                        </div>
                        <span class="text-body-sm text-neutral-base flex-1 truncate">{{ action.label }}</span>
                        <PvButton severity="danger" variant="text" size="small" @click="removeActionFromBranch(-1, aIdx)">
                          <template #icon>
                            <TrashIcon class="size-3.5" />
                          </template>
                        </PvButton>
                      </div>

                      <PvButton
                        label="Add action"
                        severity="secondary"
                        variant="outlined"
                        size="small"
                        class="w-full"
                        @click="openBranchActionModal(-1)"
                      >
                        <template #icon>
                          <PlusIcon class="size-4" />
                        </template>
                      </PvButton>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Execution history tab -->
        <div v-if="activeTab === 'execution-history'" class="flex-1 overflow-auto bg-neutral-surface">
          <div class="p-6">
            <div class="bg-neutral-base rounded-lg border border-neutral-default_solid p-8 text-center">
              <p class="text-body-lg text-neutral-subtle">Execution history content coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Select Action Type Dialog -->
      <PvDialog
        v-model:visible="showActionTypeModal"
        :draggable="false"
        modal
        :style="{ width: '640px' }"
        @after-hide="addingActionToBranchIndex = null"
      >
        <template #header>
          <div class="flex items-center gap-sm">
            <ClipboardDocumentListIcon class="size-5 text-neutral-base" />
            <span>{{ addingActionToBranchIndex !== null ? 'Add Action to Branch' : 'Select Action Type' }}</span>
          </div>
        </template>
        <template #closeicon><XMarkIcon class="size-5" /></template>

        <div class="flex flex-col gap-md">
          <!-- Search + filter row -->
          <div class="flex items-center gap-sm">
            <PvIconField class="flex-1">
              <PvInputIcon>
                <MagnifyingGlassIcon class="size-4" />
              </PvInputIcon>
              <PvInputText v-model="actionSearchQuery" placeholder="Search" class="w-full" />
            </PvIconField>
            <PvButton severity="secondary" variant="outlined" size="small">
              <template #icon>
                <FunnelIcon class="size-4" />
              </template>
            </PvButton>
            <PvButton severity="secondary" variant="outlined" size="small">
              <template #icon>
                <ArrowPathIcon class="size-4" />
              </template>
            </PvButton>
          </div>

          <!-- Action type sections -->
          <template v-for="section in actionTypes" :key="section.category">
            <div class="flex items-center justify-between">
              <span class="text-body-md-semi-bold text-neutral-base">{{ section.category }}</span>
              <PvButton v-if="section.closable" severity="secondary" variant="text" size="small">
                <template #icon>
                  <XMarkIcon class="size-4" />
                </template>
              </PvButton>
            </div>

            <div class="flex flex-col gap-sm">
              <div
                v-for="item in section.items"
                :key="item.id"
                class="flex items-start gap-sm p-4 rounded-lg border border-neutral-default_solid bg-neutral-base cursor-pointer hover:border-brand-primary-base transition-colors"
                :class="{ 'opacity-40 pointer-events-none': addingActionToBranchIndex !== null && item.id === 'if-else' }"
                @click="handleActionTypeSelect(item.id)"
              >
                <div class="flex items-center justify-center size-8 rounded shrink-0" :class="item.iconBg">
                  <component :is="item.icon" class="size-4 text-neutral-inverted-base" />
                </div>
                <div class="flex flex-col gap-1 min-w-0">
                  <span class="text-body-md-semi-bold text-neutral-base">{{ item.label }}</span>
                  <span class="text-body-sm text-neutral-subtle">{{ item.description }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </PvDialog>
    </div>
  `,
});

const meta: Meta<typeof WorkflowDetailPage> = {
  title: 'Projects/Bala Playground/Pages/Workflow Detail',
  component: WorkflowDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof WorkflowDetailPage>;

export const Default: Story = {};
