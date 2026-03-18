import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, computed, markRaw, defineComponent, h } from 'vue';
import {
  AppNavigation,
  PageHeader,
  DataTable,
  DataTableCellText,
  CollapsiblePanel,
  LinkText,
  MessageNotification,
  ProgressSpinner,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
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
  CheckIcon,
  ClockIcon,
  XCircleIcon,
  ChevronRightIcon,
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

// ── TypeScript interfaces ────────────────────────────────────────────────────
type WorkflowRunStatus = 'running' | 'execution_error' | 'failed' | 'completed';
type TriggerType = 'event' | 'manual' | 'schedule';

interface WorkflowRun {
  id: string;
  runId: string;
  timestamp: string;
  status: WorkflowRunStatus;
  triggerType?: TriggerType;
}

interface ExecutionStepVariable {
  name: string;
  value: string | number | boolean;
}

interface ExecutionStep {
  id: string;
  label: string;
  status: 'completed' | 'waiting' | 'error';
  errorMessage?: string;
  content?: string;
  variables?: ExecutionStepVariable[];
  resultJson?: string;
}

interface ExecutionDetail {
  runId: string;
  timestamp: string;
  status: WorkflowRunStatus;
  triggerType?: TriggerType;
  inputJson: string;
  steps: ExecutionStep[];
  errorDetails?: string;
}

// ── Navigation items ──────────────────────────────────────────────────────────
const menuItems = [
  { label: 'Get Started', leftIcon: markRaw(RocketLaunchIcon) },
  { label: 'Home', leftIcon: markRaw(HomeIcon) },
  { label: 'Alerts', leftIcon: markRaw(BellIcon) },
  {
    label: 'User Management',
    leftIcon: markRaw(UserGroupIcon),
    items: [
      { label: 'Users', leftIcon: markRaw(UserIcon) },
      { label: 'User Groups', leftIcon: markRaw(UsersIcon) },
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
    label: 'Device Management',
    leftIcon: markRaw(DeviceManagementIcon),
    items: [
      { label: 'Devices', leftIcon: markRaw(DeviceListsIcon) },
      { label: 'Device Groups', leftIcon: markRaw(DeviceGroupsIcon) },
    ],
  },
  {
    label: 'Access',
    leftIcon: markRaw(AccessIcon),
    items: [
      { label: 'SSO Applications', leftIcon: markRaw(SsoIcon) },
      { label: 'SaaS Management', leftIcon: markRaw(SaasManagementIcon) },
    ],
  },
  { label: 'Security', leftIcon: markRaw(ShieldCheckIcon) },
  { label: 'Insights', leftIcon: markRaw(ChartBarSquareIcon) },
  { label: 'Settings', leftIcon: markRaw(Cog6ToothIcon) },
];

const profileMenuItems = [
  {
    label: 'User',
    itemType: 'profile_compact',
    initials: 'U',
    name: 'User',
    items: [
      { separator: true },
      { label: 'Logout', rightIcon: markRaw(ArrowRightStartOnRectangleIcon) },
      { label: 'Launch User Portal', rightIcon: markRaw(ArrowTopRightOnSquareIcon) },
    ],
  },
];

// ── Mock workflow runs data ──────────────────────────────────────────────────
const workflowRuns: WorkflowRun[] = [
  { id: '1', runId: 'run-001', timestamp: '2024-01-01 09:00', status: 'completed', triggerType: 'event' },
  { id: '2', runId: 'run-002', timestamp: '2024-01-01 08:45', status: 'running', triggerType: 'event' },
  { id: '3', runId: 'run-003', timestamp: '2024-01-01 08:30', status: 'execution_error', triggerType: 'event' },
  { id: '4', runId: 'run-004', timestamp: '2024-01-01 08:15', status: 'failed', triggerType: 'event' },
  { id: '5', runId: 'run-005', timestamp: '2024-01-01 08:00', status: 'completed', triggerType: 'manual' },
  { id: '6', runId: 'run-auth', timestamp: '2024-01-01 07:45', status: 'failed', triggerType: 'manual' },
  { id: '7', runId: 'run-validation', timestamp: '2024-01-01 07:30', status: 'execution_error', triggerType: 'manual' },
  { id: '8', runId: 'run-rate', timestamp: '2024-01-01 07:15', status: 'failed', triggerType: 'schedule' },
  { id: '9', runId: 'run-event-payload', timestamp: '2024-01-01 07:00', status: 'failed', triggerType: 'event' },
  { id: '10', runId: 'run-manual-input', timestamp: '2024-01-01 06:45', status: 'execution_error', triggerType: 'manual' },
  { id: '11', runId: 'run-schedule-conflict', timestamp: '2024-01-01 06:30', status: 'failed', triggerType: 'schedule' },
];

// ── Mock execution detail (selected run) ──────────────────────────────────────
const defaultExecutionDetail: ExecutionDetail = {
  runId: 'run-001',
  timestamp: '2024-01-01 09:00',
  status: 'completed',
  inputJson: JSON.stringify(
    {
      event_type: 'user_suspended',
      event_time: '2025-12-08T12:00:00.000Z',
      actor: { id: 'usr_001', type: 'admin' },
      resource: {
        id: '60b0c04a7e3d4b5c6d7e8f01',
        type: 'user',
        username: 'jdoe',
        email: 'jane.doe@example.com',
      },
    },
    null,
    2,
  ),
  steps: [
    {
      id: '1',
      label: 'User suspended',
      status: 'completed',
      content: 'Event received successfully.',
      variables: [
        { name: 'event_type', value: 'user_suspended' },
        { name: 'resource_id', value: '60b0c04a7e3d4b5c6d7e8f01' },
        { name: 'actor_id', value: 'usr_001' },
      ],
      resultJson: '{\n  "event_type": "user_suspended",\n  "resource": { "id": "60b0c04a7e3d4b5c6d7e8f01", "type": "user" },\n  "received_at": "2025-12-08T12:00:00.000Z"\n}',
    },
    {
      id: '2',
      label: 'Flow',
      status: 'completed',
      content: 'Flow executed.',
      variables: [
        { name: 'branch_taken', value: 'main' },
        { name: 'condition_met', value: true },
      ],
      resultJson: '{\n  "path": "main",\n  "evaluated": ["user.state === \'suspended\'"],\n  "result": true\n}',
    },
    {
      id: '3',
      label: 'Get Systems',
      status: 'completed',
      content: 'Retrieved 3 systems.',
      variables: [
        { name: 'systems_count', value: 3 },
        { name: 'user_id', value: '60b0c04a7e3d4b5c6d7e8f01' },
      ],
      resultJson: '{\n  "systems": [\n    { "id": "sys-001", "hostname": "DESKTOP-ABC", "os": "Windows" },\n    { "id": "sys-002", "hostname": "mbp-jdoe", "os": "macOS" },\n    { "id": "sys-003", "hostname": "ubuntu-dev", "os": "Linux" }\n  ],\n  "total": 3\n}',
    },
    {
      id: '4',
      label: 'Loop',
      status: 'completed',
      content: 'Iterated over systems.',
      variables: [
        { name: 'iterations', value: 3 },
        { name: 'current_index', value: 3 },
      ],
      resultJson: '{\n  "items": ["sys-001", "sys-002", "sys-003"],\n  "processed": 3,\n  "status": "complete"\n}',
    },
    { id: '5', label: 'Remove device', status: 'waiting', content: 'Waiting for user input.' },
    { id: '6', label: 'Send notification', status: 'waiting', content: 'Pending completion of previous step.' },
  ],
};

const failedExecutionDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-004',
  triggerType: 'event',
  status: 'failed',
  errorDetails: 'Error: Failed to connect to device management API. Status code: 503. Retry after 60 seconds.',
  steps: [
    { id: '1', label: 'User suspended', status: 'completed' },
    { id: '2', label: 'Flow', status: 'completed' },
    { id: '3', label: 'Get Systems', status: 'error', errorMessage: 'Connection timeout after 30s.' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

const executionErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-003',
  triggerType: 'event',
  status: 'execution_error',
  errorDetails: 'Step "Add device to group" failed: User ID not found. The resource may have been deleted.',
  steps: [
    { id: '1', label: 'User suspended', status: 'completed' },
    { id: '2', label: 'Flow', status: 'completed' },
    { id: '3', label: 'Get Systems', status: 'completed' },
    { id: '4', label: 'Add device to group', status: 'error', errorMessage: 'User ID not found. The resource may have been deleted.' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

const authErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-auth',
  triggerType: 'manual',
  status: 'failed',
  errorDetails: 'Authentication failed: Invalid or expired API key. Please refresh your credentials in Settings.',
  steps: [
    { id: '1', label: 'User suspended', status: 'completed' },
    { id: '2', label: 'Flow', status: 'completed' },
    { id: '3', label: 'Get Systems', status: 'error', errorMessage: '401 Unauthorized. Invalid or expired API key.' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

const validationErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-validation',
  triggerType: 'manual',
  status: 'execution_error',
  errorDetails: 'Validation failed: Required field "system_id" is missing or invalid in the request body.',
  steps: [
    { id: '1', label: 'User suspended', status: 'completed' },
    { id: '2', label: 'Flow', status: 'completed' },
    { id: '3', label: 'Device Lock', status: 'error', errorMessage: 'Required field "system_id" is missing or invalid.' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

const rateLimitErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-rate',
  triggerType: 'schedule',
  status: 'failed',
  errorDetails: 'Rate limit exceeded: Too many requests. Please wait 60 seconds before retrying.',
  steps: [
    { id: '1', label: 'User suspended', status: 'completed' },
    { id: '2', label: 'Flow', status: 'completed' },
    { id: '3', label: 'Get Systems', status: 'error', errorMessage: '429 Too Many Requests. Retry-After: 60' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

/** Event trigger error: Invalid/malformed event payload from event source */
const eventPayloadErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-event-payload',
  triggerType: 'event',
  status: 'failed',
  errorDetails: 'Event delivery failed: Event payload validation error. Missing required field "resource.id" in user_suspended event.',
  inputJson: JSON.stringify({ event_type: 'user_suspended', actor: { id: 'usr_001' } }, null, 2),
  steps: [
    { id: '1', label: 'User suspended', status: 'error', errorMessage: 'Invalid event payload: resource.id is required.' },
    { id: '2', label: 'Flow', status: 'waiting' },
    { id: '3', label: 'Get Systems', status: 'waiting' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

/** Manual trigger error: User provided invalid device ID when manually running */
const manualInputErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-manual-input',
  triggerType: 'manual',
  status: 'execution_error',
  errorDetails: 'Manual run failed: The provided device ID "invalid-id" was not found in the organization.',
  inputJson: JSON.stringify({ manual_run: true, device_id: 'invalid-id', initiated_by: 'admin@example.com' }, null, 2),
  steps: [
    { id: '1', label: 'Manual input', status: 'completed' },
    { id: '2', label: 'Flow', status: 'completed' },
    { id: '3', label: 'Get Systems', status: 'error', errorMessage: 'Device "invalid-id" not found in organization.' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

/** Schedule trigger error: Previous run still in progress, scheduled run skipped */
const scheduleConflictErrorDetail: ExecutionDetail = {
  ...defaultExecutionDetail,
  runId: 'run-schedule-conflict',
  triggerType: 'schedule',
  status: 'failed',
  errorDetails: 'Scheduled run failed: Execution skipped. Previous run (run-001) is still in progress. Consider increasing the schedule interval.',
  inputJson: JSON.stringify({ scheduled_run: true, cron: '0 * * * *', triggered_at: '2024-01-01T06:30:00Z' }, null, 2),
  steps: [
    { id: '1', label: 'Schedule trigger', status: 'completed', content: 'Scheduled run initiated at 06:30 UTC.' },
    { id: '2', label: 'Flow', status: 'error', errorMessage: 'Concurrent execution not allowed. Previous run still running.' },
    { id: '3', label: 'Get Systems', status: 'waiting' },
    { id: '4', label: 'Loop', status: 'waiting' },
    { id: '5', label: 'Remove device', status: 'waiting' },
    { id: '6', label: 'Send notification', status: 'waiting' },
  ],
};

function getExecutionDetailForRun(runId: string): ExecutionDetail {
  if (runId === 'run-004') return failedExecutionDetail;
  if (runId === 'run-003') return executionErrorDetail;
  if (runId === 'run-auth') return authErrorDetail;
  if (runId === 'run-validation') return validationErrorDetail;
  if (runId === 'run-rate') return rateLimitErrorDetail;
  if (runId === 'run-event-payload') return eventPayloadErrorDetail;
  if (runId === 'run-manual-input') return manualInputErrorDetail;
  if (runId === 'run-schedule-conflict') return scheduleConflictErrorDetail;
  const run = workflowRuns.find(r => r.runId === runId);
  return {
    ...defaultExecutionDetail,
    runId,
    timestamp: run?.timestamp ?? defaultExecutionDetail.timestamp,
    triggerType: run?.triggerType,
  };
}

// ── Custom cell: Workflow Run (runId + timestamp) ──────────────────────────────
const WorkflowRunCell = markRaw(
  defineComponent({
    name: 'WorkflowRunCell',
    props: { data: { type: Object, default: () => ({}) } },
    setup(props) {
      return () =>
        h('div', { class: 'flex flex-col gap-px p-2 min-h-12' }, [
          h('span', { class: 'text-body-md-semi-bold text-neutral-base' }, props.data.runId),
          h('span', { class: 'text-body-sm text-neutral-subtle' }, props.data.timestamp),
        ]);
    },
  }),
);

// ── Custom cell: Status with semantic tokens ───────────────────────────────────
const StatusCell = markRaw(
  defineComponent({
    name: 'StatusCell',
    props: { data: { type: Object, default: () => ({}) } },
    components: { Tag, ProgressSpinner },
    setup(props) {
      const status = props.data?.status as WorkflowRunStatus;
      const config = {
        running: { label: 'Running', severity: 'info' as const, showSpinner: true },
        execution_error: { label: 'Execution error', severity: 'warn' as const, showSpinner: false },
        failed: { label: 'Failed', severity: 'danger' as const, showSpinner: false },
        completed: { label: 'Completed', severity: 'success' as const, showSpinner: false },
      }[status] ?? { label: status, severity: 'secondary' as const, showSpinner: false };
      return () =>
        h('div', { class: 'flex items-center gap-xs p-2 min-h-12' }, [
          config.showSpinner ? h(ProgressSpinner, { size: 16, ariaLabel: 'Loading', class: 'shrink-0' }) : null,
          h(Tag, { value: config.label, severity: config.severity, class: 'shrink-0' }),
        ]);
    },
  }),
);

// ── Column definitions ────────────────────────────────────────────────────────
const columns = [
  {
    field: 'runId',
    header: 'Workflow Run',
    width: '240px',
    component: WorkflowRunCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'status',
    header: 'Status',
    width: '180px',
    component: StatusCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const WorkflowExecutionHistory = defineComponent({
  name: 'WorkflowExecutionHistory',
  props: {
    /** When set, pre-selects this run (e.g. run-004 for failed). Useful for demos. */
    initialRunId: { type: String, default: '' },
  },
  components: {
    AppNavigation,
    PageHeader,
    DataTable,
    DataTableCellText,
    CollapsiblePanel,
    LinkText,
    MessageNotification,
    TopBar,
    PvButton: Button,
    PvDivider: Divider,
    PvTag: Tag,
    PvTabs: Tabs,
    PvTabList: TabList,
    PvTab: Tab,
    PvTabPanels: TabPanels,
    PvTabPanel: TabPanel,
    CheckIcon,
    ClockIcon,
    XCircleIcon,
    ChevronRightIcon,
    ClipboardDocumentListIcon,
  },
  setup(props) {
    const initialRun = (props.initialRunId && props.initialRunId.trim())
      ? (workflowRuns.find(r => r.runId === props.initialRunId) ?? workflowRuns[0])
      : workflowRuns[0];
    const selectedRun = ref<WorkflowRun | null>(initialRun);
    const executionDetail = ref<ExecutionDetail>(getExecutionDetailForRun(initialRun.runId));
    const inputJsonTab = ref('text');
    const expandedSteps = ref<Record<string, boolean>>({});

    const breadcrumbs = [
      { label: 'Workflows', href: '#' },
      { label: 'Remove device of suspended users', href: '#' },
      { label: 'Execution history', href: undefined },
    ];

    function onRowSelect(run: WorkflowRun) {
      selectedRun.value = run;
      executionDetail.value = getExecutionDetailForRun(run.runId);
    }

    function copyError() {
      if (executionDetail.value?.errorDetails) {
        navigator.clipboard.writeText(executionDetail.value.errorDetails);
        return;
      }
      const errStep = executionDetail.value?.steps.find(s => s.status === 'error');
      if (errStep?.errorMessage) {
        navigator.clipboard.writeText(errStep.errorMessage);
      }
    }

    /** Main error message for right panel — shown when execution failed or has execution_error */
    const rightPanelErrorMessage = computed(() => {
      const detail = executionDetail.value;
      if (!detail) return null;
      const isFailed = detail.status === 'failed' || detail.status === 'execution_error';
      if (!isFailed) return null;
      if (detail.errorDetails) return detail.errorDetails;
      const errStep = detail.steps.find(s => s.status === 'error');
      return errStep?.errorMessage ?? null;
    });

    return {
      menuItems,
      profileMenuItems,
      workflowRuns,
      selectedRun,
      executionDetail,
      inputJsonTab,
      expandedSteps,
      breadcrumbs,
      columns,
      onRowSelect,
      copyError,
      rightPanelErrorMessage,
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

      <div class="flex-[1_1_0] flex flex-col min-w-0 w-full h-full">
        <TopBar
          showBackButton
          backButtonLabel="Back"
          searchPlaceholder="Search"
          shortcutLabel="⌘/Ctrl + K"
        />

        <!-- Sticky header: breadcrumbs only (error shown in right panel) ───────── -->
        <div class="shrink-0 border-b border-neutral-default_solid bg-neutral-base">
          <div class="px-6 py-3">
            <nav class="flex items-center gap-xs text-body-sm flex-wrap">
              <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
                <ChevronRightIcon v-if="idx > 0" class="size-4 text-neutral-ghost shrink-0" aria-hidden="true" />
                <LinkText
                  v-if="crumb.href"
                  :href="crumb.href"
                  class="text-neutral-subtle hover:text-neutral-base"
                >
                  {{ crumb.label }}
                </LinkText>
                <span v-else class="text-neutral-base font-medium">{{ crumb.label }}</span>
              </template>
            </nav>
          </div>
        </div>

        <!-- Dual-pane content ────────────────────────────────────────────────── -->
        <div class="flex-[1_1_0] flex min-h-0 overflow-hidden">
          <!-- Left: Workflow runs table ─────────────────────────────────────── -->
          <div class="w-[360px] shrink-0 border-r border-neutral-default_solid bg-neutral-base flex flex-col overflow-hidden">
            <div class="shrink-0 px-4 py-3 border-b border-neutral-default_solid">
              <h2 class="text-heading-4 text-neutral-base">Workflow Runs</h2>
            </div>
            <div class="flex-1 min-h-0 overflow-auto">
              <DataTable
                :columns="columns"
                :data="workflowRuns"
                dataKey="id"
                selectionMode="single"
                :selection="selectedRun ? [selectedRun] : []"
                @update:selection="v => onRowSelect((Array.isArray(v) ? v[0] : v) ?? workflowRuns[0])"
                :scrollable="true"
                scrollHeight="100%"
                :pt="{ bodyRow: ({ data }) => data?.id === selectedRun?.id ? 'bg-neutral-subtle_soft' : '' }"
                :ptOptions="{ mergeSections: true, mergeProps: true }"
              />
            </div>
          </div>

          <!-- Right: Execution detail ───────────────────────────────────────── -->
          <div class="flex-[1_1_0] flex flex-col min-w-0 overflow-auto bg-neutral-surface">
            <div v-if="executionDetail" class="p-6 flex flex-col gap-lg">
              <!-- Header: timestamp + status badge ────────────────────────────── -->
              <div class="flex items-center gap-md">
                <span class="text-body-lg text-neutral-base">{{ executionDetail.timestamp }}</span>
                <PvTag
                  :value="executionDetail.status === 'running' ? 'Running' : executionDetail.status === 'execution_error' ? 'Execution error' : executionDetail.status === 'failed' ? 'Failed' : 'Completed'"
                  :severity="executionDetail.status === 'running' ? 'info' : executionDetail.status === 'execution_error' ? 'warn' : executionDetail.status === 'failed' ? 'danger' : 'success'"
                  class="text-body-md font-medium"
                />
              </div>

              <!-- Execution failed message (right panel, not header) ─────────────── -->
              <div v-if="rightPanelErrorMessage" class="flex flex-col gap-sm">
                <MessageNotification
                  severity="error"
                  title="Execution failed"
                  :detail="rightPanelErrorMessage"
                />
                <PvButton label="Copy Error" severity="secondary" variant="outlined" size="small" @click="copyError">
                  <template #icon><ClipboardDocumentListIcon class="size-4" /></template>
                </PvButton>
              </div>

              <PvDivider class="my-0" />

              <!-- Input JSON: Text / Upload tabs ───────────────────────────────── -->
              <div class="flex flex-col gap-sm">
                <span class="text-body-md-semi-bold text-neutral-base">Input JSON</span>
                <PvTabs v-model:value="inputJsonTab">
                  <PvTabList>
                    <PvTab value="text">Text</PvTab>
                    <PvTab value="upload">Upload</PvTab>
                  </PvTabList>
                  <PvTabPanels>
                    <PvTabPanel value="text">
                      <pre class="rounded-md border border-neutral-default_solid bg-neutral-base p-4 text-body-sm font-mono text-neutral-base overflow-x-auto">{{ executionDetail.inputJson }}</pre>
                    </PvTabPanel>
                    <PvTabPanel value="upload">
                      <div class="rounded-md border border-neutral-default_solid bg-neutral-base p-6 text-center">
                        <p class="text-body-md text-neutral-subtle">Drag and drop a JSON file, or click to browse.</p>
                        <PvButton label="Browse" severity="secondary" variant="outlined" class="mt-sm" />
                      </div>
                    </PvTabPanel>
                  </PvTabPanels>
                </PvTabs>
              </div>

              <PvDivider class="my-0" />

              <!-- Execution Results Timeline (vertical stepper with collapsibles) ─ -->
              <div class="flex flex-col gap-sm">
                <span class="text-body-md-semi-bold text-neutral-base">Execution Results</span>
                <div class="flex flex-col">
                  <div
                    v-for="(step, idx) in executionDetail.steps"
                    :key="step.id"
                    class="flex"
                  >
                    <!-- Step indicator line ──────────────────────────────────── -->
                    <div class="flex flex-col items-center shrink-0 w-6">
                      <div
                        class="size-5 rounded-full flex items-center justify-center shrink-0"
                        :class="step.status === 'completed' ? 'bg-feedback-success-base text-neutral-inverted-base' : step.status === 'error' ? 'bg-feedback-error-base text-neutral-inverted-base' : 'bg-neutral-ghost text-neutral-subtle'"
                      >
                        <CheckIcon v-if="step.status === 'completed'" class="size-3" />
                        <XCircleIcon v-else-if="step.status === 'error'" class="size-3" />
                        <ClockIcon v-else class="size-3" />
                      </div>
                      <div
                        v-if="idx < executionDetail.steps.length - 1"
                        class="w-px flex-1 min-h-4 mt-1 bg-neutral-ghost"
                      />
                    </div>

                    <!-- Collapsible step content ───────────────────────────────── -->
                    <div class="flex-1 min-w-0 pb-4">
                      <CollapsiblePanel
                        :header="step.label"
                        toggleable
                        v-model:collapsed="expandedSteps[step.id]"
                      >
                        <template #toggleicon="iconProps">
                          <ChevronRightIcon :class="iconProps.class" />
                        </template>
                        <template #titleicon="iconProps">
                          <PvTag
                            :value="step.status === 'completed' ? 'Completed' : step.status === 'error' ? 'Error' : 'Waiting for Input'"
                            :severity="step.status === 'completed' ? 'success' : step.status === 'error' ? 'danger' : 'secondary'"
                            size="small"
                            :class="iconProps.class"
                          />
                        </template>
                        <div class="flex flex-col gap-md">
                          <p v-if="step.content" class="text-body-sm text-neutral-subtle">{{ step.content }}</p>
                          <!-- Variables (key-value) ──────────────────────────────────────────────── -->
                          <div v-if="step.variables && step.variables.length" class="flex flex-col gap-xs">
                            <span class="text-body-sm-semi-bold text-neutral-base">Variables</span>
                            <div class="rounded-md border border-neutral-default_solid bg-neutral-surface p-sm flex flex-col gap-xs">
                              <div
                                v-for="v in step.variables"
                                :key="v.name"
                                class="flex gap-sm text-body-sm"
                              >
                                <span class="text-neutral-subtle shrink-0 min-w-[120px]">{{ v.name }}</span>
                                <span class="text-brand-primary-base font-mono break-all">{{ typeof v.value === 'string' ? v.value : String(v.value) }}</span>
                              </div>
                            </div>
                          </div>
                          <!-- Result JSON ─────────────────────────────────────────────────────────── -->
                          <div v-if="step.resultJson" class="flex flex-col gap-xs">
                            <span class="text-body-sm-semi-bold text-neutral-base">Result JSON</span>
                            <pre class="rounded-md border border-neutral-default_solid bg-neutral-base p-4 text-body-sm font-mono text-neutral-base overflow-x-auto whitespace-pre-wrap break-words">{{ step.resultJson }}</pre>
                          </div>
                          <!-- Error state ────────────────────────────────────────────────────────── -->
                          <div v-if="step.status === 'error' && step.errorMessage" class="flex flex-col gap-xs">
                            <MessageNotification
                              severity="error"
                              title="Step failed"
                              :detail="step.errorMessage"
                            />
                            <PvButton label="Copy Error" severity="secondary" variant="outlined" size="small" @click="copyError" />
                          </div>
                        </div>
                      </CollapsiblePanel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
});

const meta: Meta<typeof WorkflowExecutionHistory> = {
  title: 'Projects/Bala Playground/Pages/Workflow Execution History',
  component: WorkflowExecutionHistory,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    initialRunId: {
      control: 'select',
      options: ['', 'run-001', 'run-003', 'run-004', 'run-auth', 'run-validation', 'run-rate', 'run-event-payload', 'run-manual-input', 'run-schedule-conflict'],
      description: 'Pre-select a run (use run-004, run-event-payload, etc. to see error in right panel)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkflowExecutionHistory>;

export const Default: Story = {};

/** Starts with a failed run selected to show the error notification in the right panel. */
export const WithFailedExecution: Story = {
  args: { initialRunId: 'run-004' },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the error notification displayed in the right panel when a failed or execution_error run is selected.',
      },
    },
  },
};
