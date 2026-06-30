import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, computed, markRaw, defineComponent, watch } from 'vue';
import {
  AppNavigation,
  PageHeader,
  DataTable,
  DataTableToolbar,
  DataTableCellLink,
  DataTableCellText,
  FilterModal,
  FormField,
  LinkText,
  MessageNotification,
  ToggleSwitch,
} from '@jumpcloud/circuit/components';
import Menu from 'primevue/menu';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

import TopBar from '@/components/TopBar.vue';
import {
  ACCESS_REQUESTS_SETTINGS_STORY_PATH,
  menuItems,
  navigateToStorybookStory,
  profileMenuItems,
} from '../shared/navigation';

// ─── Types ───

interface AccessRequest {
  id: number;
  received: string;
  /** Request type: resource (app) approval vs device administration */
  type: 'Resource Approval' | 'Device Admin';
  name: string;
  requester: string;
  department: string;
  /** Approval mode: Manual or Automatic */
  approvalType: 'Manual' | 'Automatic';
  status: 'Error' | 'Missing Data' | 'Pending' | 'Approved' | 'Denied' | 'Expired';
  /** Expanded view fields */
  approvalTitle: string;
  manager: string;
  duration: string;
  reasonForRequest: string;
  approver: string;
  approvalProgressStatus: string;
  /** Others tab: progress counts (1–3 approvers) */
  approvedCount?: number;
  totalApprovers?: number;
  /** Missing Data expanded view */
  approvalFlowDescription?: string;
  approvalSteps?: Array<{
    type: 'actionRequired' | 'pending' | 'approved';
    approver: string;
    status: string;
    actionLink?: { label: string; href: string };
  }>;
}

/** Approval Flows tab — configuration rows (not request queue items) */
interface ApprovalFlowRow {
  id: string;
  name: string;
  flowType: 'Device Admin' | 'Resource Approval';
  /** Resource Approval flows only; Device Admin flows omit assignment (shown as --) */
  userGroupAssignment: string;
  approvalMode: 'Manual' | 'Automatic';
  /** Shown in Status column (toggle + label) */
  enabled: boolean;
  /** Row expansion: intro copy */
  expansionDescription?: string;
  /** Row expansion: horizontal approval steps */
  configurationSteps?: Array<{ name: string; roleLabel: string }>;
}

const initialApprovalFlows: ApprovalFlowRow[] = [
  {
    id: 'f-admins',
    name: 'Confluence - Admins',
    flowType: 'Resource Approval',
    userGroupAssignment: 'Confluence For Admins',
    approvalMode: 'Manual',
    enabled: true,
    expansionDescription:
      "Approval Flow description goes here. A long description can fit and if necessary it can even wrap but I don't think that will be neccessary.",
    configurationSteps: [
      { name: 'Katana Blade', roleLabel: 'Required Approver' },
      { name: 'Johnny Cage', roleLabel: 'Optional Approver' },
    ],
  },
  { id: 'f1', name: 'Sudo Admin - 1 hr', flowType: 'Device Admin', userGroupAssignment: '', approvalMode: 'Manual', enabled: true },
  {
    id: 'f2',
    name: 'Confluence - Users',
    flowType: 'Resource Approval',
    userGroupAssignment: 'Confluence For Users',
    approvalMode: 'Manual',
    enabled: true,
    expansionDescription:
      'Grants Confluence user permissions to members of the assigned user group after manager and team lead approval.',
    configurationSteps: [
      { name: 'Sarah Chen', roleLabel: 'Required Approver' },
      { name: 'Marcus Webb', roleLabel: 'Required Approver' },
      { name: 'Elena Vasquez', roleLabel: 'Optional Approver' },
    ],
  },
  {
    id: 'f3',
    name: 'UX Tools',
    flowType: 'Resource Approval',
    userGroupAssignment: 'Design Tools',
    approvalMode: 'Automatic',
    enabled: true,
    expansionDescription:
      'Provides access to UX and design tooling for designers; automatic approval when eligibility criteria are met.',
    configurationSteps: [
      { name: 'Priya Narayan', roleLabel: 'Required Approver' },
      { name: 'David Okonkwo', roleLabel: 'Optional Approver' },
    ],
  },
  { id: 'f4', name: 'DEV Tools', flowType: 'Device Admin', userGroupAssignment: '', approvalMode: 'Automatic', enabled: true },
];

/** Active Sessions — Timed Access tab */
interface TimedAccessSessionRow {
  id: string;
  user: string;
  approvalFlow: string;
  groupAssignment: string;
  timeRemainingLabel: string;
}

/** Active Sessions — Device Admin tab */
interface DeviceAdminSessionRow {
  id: string;
  user: string;
  device: string;
  os: string;
  /** Remaining time label — same format as Timed Access (e.g. 4h:23m, 6d:23h:18m) */
  timeRemainingLabel: string;
}

const PAGINATION_THRESHOLD = 10;

const grantAccessDurationOptions = [
  { label: '30 Days', value: 30 },
  { label: '60 Days', value: 60 },
  { label: '90 Days', value: 90 },
  { label: '365 Days', value: 365 },
];

function parseDurationDays(duration: string | undefined): number {
  const match = duration?.match(/(\d+)/);
  if (!match) return 90;
  const days = Number(match[1]);
  return grantAccessDurationOptions.some((opt) => opt.value === days) ? days : 90;
}

function formatGrantAccessExpiration(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function shouldShowTablePaginator(total: number): boolean {
  return total >= PAGINATION_THRESHOLD;
}

function formatCompactPageReport(total: number): string {
  if (total <= 0) return '0-0 of 0';
  return `1-${total} of ${total}`;
}

const timedAccessSessionsData: TimedAccessSessionRow[] = [
  {
    id: 'ts-1',
    user: 'Lorie Thompson (Manager)',
    approvalFlow: 'SalesForce Admins',
    groupAssignment: 'SalesForce_Admins_Only',
    timeRemainingLabel: '4h:23m',
  },
  {
    id: 'ts-2',
    user: 'Ravi Kumar',
    approvalFlow: 'SalesForce Admins',
    groupAssignment: 'SalesForce_Admins_Only',
    timeRemainingLabel: '6d:23h:18m',
  },
  {
    id: 'ts-3',
    user: 'Casey Nguyen',
    approvalFlow: 'SalesForce Admins',
    groupAssignment: 'SalesForce_Admins_Only',
    timeRemainingLabel: '2d:5h:12m',
  },
];

const deviceAdminSessionsData: DeviceAdminSessionRow[] = [
  { id: 'da-1', user: 'Jamie Rivera', device: 'MacBook Pro #4421', os: 'macOS', timeRemainingLabel: '4h:23m' },
  { id: 'da-2', user: 'Mel Park', device: 'Windows VM #882', os: 'Windows', timeRemainingLabel: '0h:45m' },
  { id: 'da-4', user: 'Quinn Frost', device: 'Chromebook fleet #1204', os: 'Chrome OS', timeRemainingLabel: '23h:59m' },
];

// ─── Mock Data (matches image) ───

const accessRequestsData: AccessRequest[] = [
  { id: 1, received: 'January 27, 2026 at 9:11 AM', type: 'Device Admin', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Timed access for design review tasks', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 2, received: 'January 19, 2026 at 10:11 AM', type: 'Resource Approval', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Design project', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 3, received: 'January 12, 2026 at 10:31 AM', type: 'Resource Approval', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'UX research', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 4, received: 'December 18, 2025 at 6:38 AM', type: 'Resource Approval', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Prototyping', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 5, received: 'December 18, 2025 at 6:36 AM', type: 'Resource Approval', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Collaboration', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 6, received: 'December 15, 2025 at 2:14 PM', type: 'Resource Approval', name: 'Onboarding Resources for new employees', requester: 'Julian Upton', department: 'Product', approvalType: 'Manual', status: 'Missing Data', approvalTitle: 'Onboarding Resources for new employees', manager: 'Not Provided', duration: '30 Days', reasonForRequest: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval', approvalFlowDescription: 'Approval Flow description goes here. Truncate longer descriptions. Let\'s try a max width 800px. Include show more link', approvalSteps: [{ type: 'actionRequired', approver: 'Manager Missing', status: 'Action Required', actionLink: { label: 'Add in users', href: '#' } }, { type: 'pending', approver: 'Johnny Cage', status: 'Pending Required Approval' }] },
  { id: 7, received: 'December 10, 2025 at 11:22 AM', type: 'Resource Approval', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Approved', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Design sprint', approver: 'Lorie Thompson', approvalProgressStatus: 'Approved' },
  { id: 8, received: 'December 5, 2025 at 9:00 AM', type: 'Resource Approval', name: 'Jira', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Pending', approvalTitle: 'Jira Project Access', manager: 'Sarah Chen', duration: '90 Days', reasonForRequest: 'Project management', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 9, received: 'November 28, 2025 at 3:45 PM', type: 'Resource Approval', name: 'Confluence', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Denied', approvalTitle: 'Confluence Space Access', manager: 'Sarah Chen', duration: '30 Days', reasonForRequest: 'Documentation', approver: 'Lorie Thompson', approvalProgressStatus: 'Denied' },
  { id: 10, received: 'November 15, 2025 at 10:00 AM', type: 'Resource Approval', name: 'GitHub', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Expired', approvalTitle: 'GitHub Repository Access', manager: 'Sarah Chen', duration: '60 Days', reasonForRequest: 'Code review', approver: 'Lorie Thompson', approvalProgressStatus: 'Expired' },
];

// Mock data for Others tab (non-admin approvers / multi-step approvals)
// Progress: 0–3 of 1–3 approvals depending on configured approval flow
const othersRequestsData: AccessRequest[] = [
  { id: 11, received: 'March 17, 2026 at 2:30 PM', type: 'Device Admin', name: 'TESTING timed access', requester: 'Jessica Rabbit (End User)', department: 'Engineering', approvalType: 'Manual', status: 'Pending', approvalTitle: 'TESTING timed access', manager: 'Sarah Chen', duration: '30 Days', reasonForRequest: 'Testing access flow', approver: 'Barış Ermut', approvalProgressStatus: 'Pending Required Approval', approvedCount: 0, totalApprovers: 1 },
  { id: 12, received: 'March 2, 2026 at 10:15 AM', type: 'Resource Approval', name: 'Serhat Test App', requester: 'Serhat Can', department: 'Product', approvalType: 'Manual', status: 'Pending', approvalTitle: 'Serhat Test App', manager: 'Not Provided', duration: 'N/A', reasonForRequest: 'need access to serhat app please please!!!', approver: 'Barış Ermut', approvalProgressStatus: 'Pending Required Approval', approvedCount: 0, totalApprovers: 2 },
  { id: 13, received: 'March 1, 2026 at 9:00 AM', type: 'Resource Approval', name: 'Design System Access', requester: 'Alex Chen', department: 'Design', approvalType: 'Manual', status: 'Pending', approvalTitle: 'Design System Access', manager: 'Jane Doe', duration: '90 Days', reasonForRequest: 'Design project', approver: 'Barış Ermut', approvalProgressStatus: 'Pending Required Approval', approvedCount: 1, totalApprovers: 2 },
  { id: 14, received: 'February 28, 2026 at 9:00 AM', type: 'Resource Approval', name: 'Repo Access', requester: 'Sam Dev', department: 'Engineering', approvalType: 'Manual', status: 'Approved', approvalTitle: 'Repo Access', manager: 'Tech Lead', duration: '365 Days', reasonForRequest: 'Code contribution', approver: 'Barış Ermut', approvalProgressStatus: 'Approved', approvedCount: 1, totalApprovers: 1 },
  { id: 15, received: 'February 25, 2026 at 2:00 PM', type: 'Resource Approval', name: 'Multi-step Flow', requester: 'Test User', department: 'Product', approvalType: 'Manual', status: 'Pending', approvalTitle: 'Multi-step Flow', manager: 'Manager', duration: '30 Days', reasonForRequest: 'Testing', approver: 'Barış Ermut', approvalProgressStatus: 'Pending Required Approval', approvedCount: 2, totalApprovers: 3 },
];

// ─── Status Cell ───

const statusTokenMapping: Record<string, { label: string; severity: string }> = {
  Error: { label: 'ERROR', severity: 'danger' },
  'Missing Data': { label: 'MISSING DATA', severity: 'danger' },
  Pending: { label: 'PENDING', severity: 'warn' },
  Approved: { label: 'APPROVED', severity: 'success' },
  Denied: { label: 'DENIED', severity: 'danger' },
  Expired: { label: 'EXPIRED', severity: 'secondary' },
};

// ─── Progress Cell (Others tab: "X of Y approval(s)") ───

const ProgressCell = defineComponent({
  name: 'ProgressCell',
  props: {
    approvedCount: { type: Number, default: 0 },
    totalApprovers: { type: Number, default: 1 },
  },
  setup(props) {
    const label = computed(() => {
      const approved = props.approvedCount ?? 0;
      const total = props.totalApprovers ?? 1;
      const suffix = total === 1 ? 'approval' : 'approvals';
      return `${approved} of ${total} ${suffix}`;
    });
    return { label };
  },
  template: `
    <div class="flex items-center p-2 min-h-12">
      <span class="text-body-md text-neutral-base">{{ label }}</span>
    </div>
  `,
});

// ─── Status Cell (DataTableCellToken hardcodes green for Status type; use Tag with mapping) ───

const StatusCell = defineComponent({
  name: 'StatusCell',
  components: { Tag },
  props: {
    statusLabel: { type: String, required: true },
    tokenMapping: { type: Object as () => Record<string, { label: string; severity: string }>, required: true },
  },
  setup(props) {
    const config = computed(
      () => props.tokenMapping[props.statusLabel] ?? { label: props.statusLabel, severity: 'secondary' },
    );
    return { config };
  },
  template: `
    <div class="flex items-center p-2 min-h-12">
      <Tag :value="config.label" :severity="config.severity" class="shrink-0" />
    </div>
  `,
});

// ─── Actions Cell (Grant Access / Deny Access for Pending, disabled otherwise) ───

const ActionsCell = defineComponent({
  name: 'ActionsCell',
  components: { Button, Menu, EllipsisVerticalIcon },
  props: {
    status: { type: String, required: true },
    requestId: { type: Number, required: true },
    onGrantAccess: { type: Function, default: undefined },
    onDenyAccess: { type: Function, default: undefined },
  },
  setup(props) {
    const menuRef = ref<InstanceType<typeof Menu> | null>(null);
    const hasActions = computed(
      () => props.status === 'Pending' || props.status === 'Missing Data',
    );

    const menuItems = computed(() => [
      {
        label: 'Grant Access',
        command: () => props.onGrantAccess?.(props.requestId),
      },
      {
        label: 'Deny Access',
        command: () => props.onDenyAccess?.(props.requestId),
      },
    ]);

    function toggleMenu(event: Event) {
      if (hasActions.value && menuRef.value) {
        menuRef.value.toggle(event);
      }
    }

    return { menuRef, hasActions, menuItems, toggleMenu };
  },
  template: `
    <div class="flex items-center p-2 min-h-12">
      <Button
        variant="text"
        severity="secondary"
        size="small"
        :disabled="!hasActions"
        :aria-disabled="!hasActions"
        aria-label="Row actions"
        @click="toggleMenu"
      >
        <template #icon>
          <EllipsisVerticalIcon class="size-4" />
        </template>
      </Button>
      <Menu ref="menuRef" :model="menuItems" :popup="true" />
    </div>
  `,
});

// ─── Approval Flows tab cells ───

const FlowNameCell = defineComponent({
  name: 'FlowNameCell',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const letter = computed(() => props.name.charAt(0).toUpperCase() || '?');
    return { letter };
  },
  template: `
    <div class="flex items-center gap-sm p-2 min-h-12 min-w-0">
      <div class="size-8 shrink-0 rounded flex items-center justify-center bg-info-surface border border-info-base/20">
        <span class="text-body-sm font-bold text-info-base">{{ letter }}</span>
      </div>
      <span class="text-body-md text-neutral-base truncate">{{ name }}</span>
    </div>
  `,
});

const FlowEnabledStatusCell = defineComponent({
  name: 'FlowEnabledStatusCell',
  components: { ToggleSwitch, InformationCircleIcon },
  props: {
    enabled: { type: Boolean, default: true },
    flowId: { type: String, required: true },
    onToggle: {
      type: Function as unknown as () => (flowId: string, nextEnabled: boolean) => void,
      required: true,
    },
  },
  template: `
    <div class="flex min-w-0 items-center gap-sm p-2 min-h-12">
      <ToggleSwitch
        :model-value="enabled"
        aria-label="Toggle approval flow enabled"
        @update:model-value="onToggle(flowId, $event)"
      />
      <span class="text-body-md shrink-0 text-neutral-base">{{ enabled ? 'Enabled' : 'Disabled' }}</span>
      <InformationCircleIcon
        v-tooltip.top="'When enabled, this approval flow runs for matching access requests.'"
        class="size-4 shrink-0 text-neutral-subtle"
        aria-hidden="true"
      />
    </div>
  `,
});

/** Timed Access + Device Admin active-session tables (same cell) */
const ActiveSessionRevokeCell = defineComponent({
  name: 'ActiveSessionRevokeCell',
  components: { Button },
  props: {
    sessionId: { type: String, required: true },
    onRevoke: { type: Function, default: undefined },
  },
  template: `
    <div class="flex items-center p-2 min-h-12">
      <Button
        label="Revoke"
        severity="danger"
        variant="outlined"
        size="small"
        :aria-label="'Revoke session ' + sessionId"
        @click="onRevoke?.(sessionId)"
      />
    </div>
  `,
});

const FlowActionsCell = defineComponent({
  name: 'FlowActionsCell',
  components: { Button, Menu, EllipsisVerticalIcon },
  setup() {
    const menuRef = ref<InstanceType<typeof Menu> | null>(null);
    const menuItems = computed(() => [
      { label: 'Edit', command: () => {} },
      { label: 'Duplicate', command: () => {} },
      { label: 'Delete', command: () => {} },
    ]);
    function toggleMenu(event: Event) {
      menuRef.value?.toggle(event);
    }
    return { menuRef, menuItems, toggleMenu };
  },
  template: `
    <div class="flex items-center p-2 min-h-12">
      <Button
        variant="text"
        severity="secondary"
        size="small"
        aria-label="Row actions"
        @click="toggleMenu"
      >
        <template #icon>
          <EllipsisVerticalIcon class="size-4" />
        </template>
      </Button>
      <Menu ref="menuRef" :model="menuItems" :popup="true" />
    </div>
  `,
});

const timedAccessColumns = [
  {
    field: 'user',
    header: 'User',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.user as string,
      href: '#',
    }),
  },
  {
    field: 'approvalFlow',
    header: 'Approval Flow',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.approvalFlow as string,
      href: '#',
    }),
  },
  {
    field: 'groupAssignment',
    header: 'Group Assignment',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.groupAssignment as string,
      href: '#',
    }),
  },
  {
    field: 'timeRemainingLabel',
    header: 'Time Remaining',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.timeRemainingLabel as string,
    }),
  },
  {
    field: 'actions',
    header: 'Actions',
    component: markRaw(ActiveSessionRevokeCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      sessionId: sp.data.id as string,
    }),
  },
];

const deviceAdminSessionColumns = [
  {
    field: 'user',
    header: 'User',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.user as string,
      href: '#',
    }),
  },
  {
    field: 'device',
    header: 'Device',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.device as string,
      href: '#',
    }),
  },
  {
    field: 'os',
    header: 'OS',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.os as string,
    }),
  },
  {
    field: 'timeRemainingLabel',
    header: 'Time Remaining',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.timeRemainingLabel as string,
    }),
  },
  {
    field: 'actions',
    header: 'Actions',
    component: markRaw(ActiveSessionRevokeCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      sessionId: sp.data.id as string,
    }),
  },
];

// ─── Column Definitions (order matches image) ───
// Progress column only shown for Others tab (multi-step approvals); Administrator approves all directly

const requestQueueAdministratorColumns = [
  {
    field: 'received',
    header: 'Received',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.received as string,
    }),
  },
  {
    field: 'type',
    header: 'Type',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.type as string,
    }),
  },
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.name as string,
    }),
  },
  {
    field: 'requester',
    header: 'Requester',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.requester as string,
      href: '#',
    }),
  },
  {
    field: 'department',
    header: 'Department',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.department as string,
    }),
  },
  {
    field: 'approvalType',
    header: 'Approval Mode',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.approvalType as string,
    }),
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    component: markRaw(StatusCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      statusLabel: sp.data.status as string,
      tokenMapping: statusTokenMapping,
    }),
  },
  {
    field: 'actions',
    header: 'Actions',
    component: markRaw(ActionsCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      status: sp.data.status as string,
      requestId: sp.data.id as number,
    }),
  },
];

const requestQueueOthersColumns = [
  {
    field: 'received',
    header: 'Received',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.received as string,
    }),
  },
  {
    field: 'type',
    header: 'Type',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.type as string,
    }),
  },
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.name as string,
    }),
  },
  {
    field: 'requester',
    header: 'Requester',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.requester as string,
      href: '#',
    }),
  },
  {
    field: 'department',
    header: 'Department',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.department as string,
    }),
  },
  {
    field: 'approvalType',
    header: 'Approval Mode',
    sortable: true,
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.approvalType as string,
    }),
  },
  {
    field: 'approvalProgressStatus',
    header: 'Progress',
    sortable: true,
    component: markRaw(ProgressCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      approvedCount: (sp.data.approvedCount as number) ?? 0,
      totalApprovers: (sp.data.totalApprovers as number) ?? 1,
    }),
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    component: markRaw(StatusCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      statusLabel: sp.data.status as string,
      tokenMapping: statusTokenMapping,
    }),
  },
  {
    field: 'actions',
    header: 'Actions',
    component: markRaw(ActionsCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      status: sp.data.status as string,
      requestId: sp.data.id as number,
    }),
  },
];

// ─── Filter Config ───

const basicFilters = [
  {
    id: 'received',
    label: 'Received',
    type: 'date' as const,
  },
  {
    id: 'requester',
    label: 'Requester',
    type: 'text' as const,
    placeholder: 'Search',
  },
  {
    id: 'type',
    label: 'Type',
    type: 'multiSelect' as const,
    options: [
      { label: 'Resource', value: 'Resource Approval' },
      { label: 'Device Admin', value: 'Device Admin' },
    ],
  },
  {
    id: 'approvalType',
    label: 'Approval Type',
    type: 'multiSelect' as const,
    options: [
      { label: 'Manual', value: 'Manual' },
      { label: 'Auto-Approval', value: 'Automatic' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'multiSelect' as const,
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Denied', value: 'Denied' },
      { label: 'Deprovisioned', value: 'Deprovisioned' },
      { label: 'Error', value: 'Error' },
      { label: 'Expired', value: 'Expired' },
      { label: 'Canceled', value: 'Canceled' },
      { label: 'Missing Data', value: 'Missing Data' },
    ],
  },
];

type AppliedFilterChip = {
  id: string;
  key: string;
  operator: string;
  value: string;
};

type ModalAppliedFilter = {
  id: string;
  value: string | string[] | { operator: string; value: string } | null;
};

const FILTER_ID_TO_KEY: Record<string, string> = {
  requester: 'Requester',
  received: 'Received',
  type: 'Type',
  approvalType: 'Approval Mode',
  status: 'Status',
};

const FILTER_KEY_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(FILTER_ID_TO_KEY).map(([id, key]) => [key, id]),
);

const MULTI_SELECT_FILTER_IDS = new Set(['type', 'approvalType', 'status']);

function chipsToModalFilters(chips: AppliedFilterChip[]): ModalAppliedFilter[] {
  const byId = new Map<string, ModalAppliedFilter>();

  for (const chip of chips) {
    const id = FILTER_KEY_TO_ID[chip.key] ?? chip.id;
    if (!id) continue;

    if (MULTI_SELECT_FILTER_IDS.has(id)) {
      const existing = byId.get(id);
      const values =
        existing && Array.isArray(existing.value) ? [...existing.value] : [];
      values.push(chip.value);
      byId.set(id, { id, value: values });
    } else if (id === 'requester' || id === 'received') {
      byId.set(id, {
        id,
        value: { operator: chip.operator || 'contains', value: chip.value },
      });
    }
  }

  return Array.from(byId.values());
}

function modalFiltersToChips(filters: ModalAppliedFilter[]): AppliedFilterChip[] {
  const chips: AppliedFilterChip[] = [];
  let chipIndex = 0;

  for (const filter of filters) {
    const key = FILTER_ID_TO_KEY[filter.id] ?? filter.id;
    if (filter.value === null || filter.value === undefined) continue;

    if (Array.isArray(filter.value)) {
      for (const value of filter.value) {
        chips.push({
          id: `${filter.id}-${chipIndex++}`,
          key,
          operator: 'is',
          value: String(value),
        });
      }
      continue;
    }

    if (typeof filter.value === 'object' && 'operator' in filter.value) {
      const filterValue = filter.value;
      if (!filterValue.value?.trim()) continue;
      chips.push({
        id: `${filter.id}-${chipIndex++}`,
        key,
        operator: filterValue.operator,
        value: filterValue.value,
      });
      continue;
    }

    if (typeof filter.value === 'string' && filter.value.trim() !== '') {
      chips.push({
        id: `${filter.id}-${chipIndex++}`,
        key,
        operator: 'is',
        value: filter.value,
      });
    }
  }

  return chips;
}

function parseReceivedDate(received: string): Date | null {
  const parsed = new Date(received);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseIsoDate(value: string): Date | null {
  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || !month || !day) return null;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// ─── Main tabs and sub-tabs ───

const mainTabs = [
  { label: 'Request Queue (6)', value: 'request-queue' },
  { label: 'Active Sessions (6)', value: 'active-sessions' },
  { label: 'Approval Flows (5)', value: 'approval-flows' },
];

const activeSessionsSubTabOptions = [
  { label: 'Device Admin (3)', value: 'device-admin' },
  { label: 'Timed Access (3)', value: 'timed-access' },
];

const subTabOptions = [
  { label: 'Administrator', value: 'administrator' },
  { label: 'Others', value: 'others' },
];

// ─── Export options ───

const exportOptions = [
  { id: 'csv', label: 'Export as CSV' },
  { id: 'xlsx', label: 'Export as Excel' },
];

// ─── Initial active filters ───

const initialFilters = [
  { key: 'Approval Mode', operator: 'is', value: 'Manual', id: 'filter-1' },
  { key: 'Status', operator: 'is', value: 'Pending', id: 'filter-2' },
  { key: 'Status', operator: 'is', value: 'Error', id: 'filter-3' },
];

function formatGroupedValues(values: string[], maxVisible = 2): string {
  if (values.length <= maxVisible) return values.join(', ');
  return `${values.slice(0, maxVisible).join(', ')}, +${values.length - maxVisible}`;
}

function sortedStringArrayEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

// ─── Component ───

const AccessRequestsListPage = defineComponent({
  name: 'AccessRequestsListPage',
  props: {
    initialSubTab: { type: String as () => 'administrator' | 'others', default: 'administrator' },
    initialMainTab: {
      type: String as () => 'request-queue' | 'active-sessions' | 'approval-flows',
      default: 'request-queue',
    },
    initialActiveSessionsSubTab: {
      type: String as () => 'device-admin' | 'timed-access',
      default: 'device-admin',
    },
  },
  components: {
    AppNavigation,
    PageHeader,
    CircuitDataTable: DataTable,
    DataTableToolbar,
    FilterModal,
    FormField,
    TopBar,
    SelectButton,
    Button,
    ToggleSwitch,
    LinkText,
    MessageNotification,
    Dialog,
    IconField,
    InputIcon,
    InputText,
    Select,
    Textarea,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ClipboardDocumentCheckIcon,
    Cog6ToothIcon,
    Menu,
    EllipsisHorizontalIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    XCircleIcon,
    XMarkIcon,
  },
  setup(props) {
    const requests = ref<AccessRequest[]>([...accessRequestsData]);
    const showFilterModal = ref(false);
    const appliedFilters = ref<AppliedFilterChip[]>(initialFilters);
    const filterModalAppliedFilters = computed(() => chipsToModalFilters(appliedFilters.value));
    const activeMainTab = ref(props.initialMainTab);
    const activeSubTab = ref(props.initialSubTab);
    const activeSessionsSubTab = ref(props.initialActiveSessionsSubTab);

    const timedAccessRows = ref<TimedAccessSessionRow[]>([...timedAccessSessionsData]);
    const timedAccessSelection = ref<TimedAccessSessionRow[]>([]);
    const deviceAdminRows = ref<DeviceAdminSessionRow[]>(deviceAdminSessionsData.map((r) => ({ ...r })));
    const deviceAdminSelection = ref<DeviceAdminSessionRow[]>([]);
    const activeSessionsActionsMenuRef = ref<InstanceType<typeof Menu> | null>(null);

    function toggleActiveSessionsActionsMenu(event: Event) {
      activeSessionsActionsMenuRef.value?.toggle(event);
    }

    function handleActiveSessionsRefresh() {
      // Story placeholder
    }

    function handleActiveSessionsSearch(_query: string) {
      // Story placeholder
    }

    const approvalFlowsData = ref<ApprovalFlowRow[]>(
      initialApprovalFlows.map((r) => ({
        ...r,
        configurationSteps: r.configurationSteps?.map((s) => ({ ...s })),
      })),
    );

    const showApprovalFlowFilterDialog = ref(false);
    const appliedFlowUserGroupSearch = ref('');
    const draftFlowUserGroupSearch = ref('');
    const appliedFlowTypes = ref<string[]>([]);
    const draftFlowTypes = ref<string[]>([]);
    const appliedFlowApprovalModes = ref<string[]>([]);
    const draftFlowApprovalModes = ref<string[]>([]);
    const appliedFlowStatuses = ref<string[]>([]);
    const draftFlowStatuses = ref<string[]>([]);

    const approvalFlowFilterFlowTypes = ['Device Admin', 'Resource Approval'] as const;
    const approvalFlowFilterApprovalModes = ['Manual', 'Automatic'] as const;
    const approvalFlowFilterStatuses = ['Enabled', 'Disabled'] as const;

    const showDisableApprovalFlowDialog = ref(false);
    const disableApprovalFlowIdPending = ref<string | null>(null);

    function handleApprovalFlowToggle(flowId: string, nextEnabled: boolean) {
      if (nextEnabled) {
        const row = approvalFlowsData.value.find((r) => r.id === flowId);
        if (row) row.enabled = true;
        return;
      }
      disableApprovalFlowIdPending.value = flowId;
      showDisableApprovalFlowDialog.value = true;
    }

    function closeDisableApprovalFlowDialog() {
      showDisableApprovalFlowDialog.value = false;
    }

    function confirmDisableApprovalFlow() {
      const id = disableApprovalFlowIdPending.value;
      if (id) {
        const row = approvalFlowsData.value.find((r) => r.id === id);
        if (row) row.enabled = false;
      }
      showDisableApprovalFlowDialog.value = false;
    }

    watch(showDisableApprovalFlowDialog, (open) => {
      if (!open) disableApprovalFlowIdPending.value = null;
    });

    const showGrantAccessDialog = ref(false);
    const showDenyAccessDialog = ref(false);
    const accessActionRequestIdPending = ref<number | null>(null);
    const grantAccessDuration = ref(90);
    const grantAccessMessage = ref('');
    const denyAccessReason = ref('');
    const denyAccessInternalNotes = ref('');

    const denyAccessConfirmDisabled = computed(() => !denyAccessReason.value.trim());

    const grantAccessExpirationLabel = computed(() =>
      formatGrantAccessExpiration(grantAccessDuration.value),
    );

    const pendingAccessRequest = computed(() => {
      const id = accessActionRequestIdPending.value;
      if (id == null) return null;
      return sourceData.value.find((r) => r.id === id) ?? null;
    });

    const grantAccessResourceName = computed(() => {
      const request = pendingAccessRequest.value;
      if (!request) return '';
      return request.approvalTitle || request.name;
    });

    function updateRequestStatus(requestId: number, status: 'Approved' | 'Denied') {
      const applyUpdate = (row: AccessRequest) => {
        row.status = status;
        row.approvalProgressStatus = status === 'Approved' ? 'Approved' : 'Denied';
      };

      const administratorRow = requests.value.find((r) => r.id === requestId);
      if (administratorRow) applyUpdate(administratorRow);

      const othersRow = othersRequestsData.find((r) => r.id === requestId);
      if (othersRow) applyUpdate(othersRow);
    }

    function openGrantAccessDialog(requestId: number) {
      accessActionRequestIdPending.value = requestId;
      grantAccessMessage.value = '';
      const request =
        requests.value.find((r) => r.id === requestId) ??
        othersRequestsData.find((r) => r.id === requestId);
      grantAccessDuration.value = parseDurationDays(request?.duration);
      showGrantAccessDialog.value = true;
    }

    function openDenyAccessDialog(requestId: number) {
      accessActionRequestIdPending.value = requestId;
      denyAccessReason.value = '';
      denyAccessInternalNotes.value = '';
      showDenyAccessDialog.value = true;
    }

    function closeGrantAccessDialog() {
      showGrantAccessDialog.value = false;
    }

    function closeDenyAccessDialog() {
      showDenyAccessDialog.value = false;
    }

    function confirmGrantAccess() {
      const id = accessActionRequestIdPending.value;
      if (id != null) updateRequestStatus(id, 'Approved');
      grantAccessMessage.value = '';
      showGrantAccessDialog.value = false;
    }

    function confirmDenyAccess() {
      const id = accessActionRequestIdPending.value;
      if (id != null && denyAccessReason.value.trim()) updateRequestStatus(id, 'Denied');
      denyAccessReason.value = '';
      denyAccessInternalNotes.value = '';
      showDenyAccessDialog.value = false;
    }

    watch([showGrantAccessDialog, showDenyAccessDialog], ([grantOpen, denyOpen]) => {
      if (!grantOpen && !denyOpen) accessActionRequestIdPending.value = null;
    });

    const showRevokeTimedAccessDialog = ref(false);
    const revokeTimedAccessSessionIdPending = ref<string | null>(null);

    const pendingRevokeTimedAccessSession = computed(() => {
      const id = revokeTimedAccessSessionIdPending.value;
      if (!id) return null;
      return timedAccessRows.value.find((row) => row.id === id) ?? null;
    });

    const timedAccessColumnsWithActions = computed(() =>
      timedAccessColumns.map((column) => {
        if (column.field !== 'actions') return column;

        return {
          ...column,
          componentProps: (sp: { data: Record<string, unknown> }) => ({
            sessionId: sp.data.id as string,
            onRevoke: openRevokeTimedAccessDialog,
          }),
        };
      }),
    );

    function openRevokeTimedAccessDialog(sessionId: string) {
      revokeTimedAccessSessionIdPending.value = sessionId;
      showRevokeTimedAccessDialog.value = true;
    }

    function closeRevokeTimedAccessDialog() {
      showRevokeTimedAccessDialog.value = false;
    }

    function confirmRevokeTimedAccess() {
      const id = revokeTimedAccessSessionIdPending.value;
      if (id) {
        timedAccessRows.value = timedAccessRows.value.filter((row) => row.id !== id);
      }
      showRevokeTimedAccessDialog.value = false;
    }

    watch(showRevokeTimedAccessDialog, (open) => {
      if (!open) revokeTimedAccessSessionIdPending.value = null;
    });

    const showRevokeDeviceAdminDialog = ref(false);
    const revokeDeviceAdminBulkMode = ref(false);
    const revokeDeviceAdminSessionIdPending = ref<string | null>(null);
    const revokeDeviceAdminPendingIds = ref<string[]>([]);

    const pendingRevokeDeviceAdminSession = computed(() => {
      const id = revokeDeviceAdminSessionIdPending.value;
      if (!id) return null;
      return deviceAdminRows.value.find((row) => row.id === id) ?? null;
    });

    const pendingRevokeDeviceAdminSessions = computed(() =>
      deviceAdminRows.value.filter((row) => revokeDeviceAdminPendingIds.value.includes(row.id)),
    );

    const revokeDeviceAdminSelectedUserCount = computed(
      () => new Set(pendingRevokeDeviceAdminSessions.value.map((row) => row.user)).size,
    );

    const deviceAdminColumnsWithActions = computed(() =>
      deviceAdminSessionColumns.map((column) => {
        if (column.field !== 'actions') return column;

        return {
          ...column,
          componentProps: (sp: { data: Record<string, unknown> }) => ({
            sessionId: sp.data.id as string,
            onRevoke: openRevokeDeviceAdminDialog,
          }),
        };
      }),
    );

    function openRevokeDeviceAdminDialog(sessionId: string) {
      revokeDeviceAdminBulkMode.value = false;
      revokeDeviceAdminSessionIdPending.value = sessionId;
      revokeDeviceAdminPendingIds.value = [sessionId];
      showRevokeDeviceAdminDialog.value = true;
    }

    function openRevokeDeviceAdminBulkDialog() {
      revokeDeviceAdminBulkMode.value = true;
      revokeDeviceAdminSessionIdPending.value = null;
      revokeDeviceAdminPendingIds.value = deviceAdminSelection.value.map((row) => row.id);
      showRevokeDeviceAdminDialog.value = true;
    }

    function closeRevokeDeviceAdminDialog() {
      showRevokeDeviceAdminDialog.value = false;
    }

    function confirmRevokeDeviceAdmin() {
      const idsToRemove = revokeDeviceAdminBulkMode.value
        ? revokeDeviceAdminPendingIds.value
        : revokeDeviceAdminSessionIdPending.value
          ? [revokeDeviceAdminSessionIdPending.value]
          : [];

      if (idsToRemove.length) {
        const idSet = new Set(idsToRemove);
        deviceAdminRows.value = deviceAdminRows.value.filter((row) => !idSet.has(row.id));
        deviceAdminSelection.value = deviceAdminSelection.value.filter((row) => !idSet.has(row.id));
      }
      showRevokeDeviceAdminDialog.value = false;
    }

    watch(showRevokeDeviceAdminDialog, (open) => {
      if (!open) {
        revokeDeviceAdminBulkMode.value = false;
        revokeDeviceAdminSessionIdPending.value = null;
        revokeDeviceAdminPendingIds.value = [];
      }
    });

    const activeSessionsActionsMenuItems = computed(() => {
      const singleTimedAccessSelected = timedAccessSelection.value.length === 1;
      const deviceAdminSelectedCount = deviceAdminSelection.value.length;

      return [
        {
          label: 'Revoke selected',
          disabled:
            activeSessionsSubTab.value === 'timed-access'
              ? !singleTimedAccessSelected
              : activeSessionsSubTab.value === 'device-admin'
                ? deviceAdminSelectedCount === 0
                : true,
          command: () => {
            if (activeSessionsSubTab.value === 'timed-access' && singleTimedAccessSelected) {
              openRevokeTimedAccessDialog(timedAccessSelection.value[0].id);
            } else if (activeSessionsSubTab.value === 'device-admin' && deviceAdminSelectedCount === 1) {
              openRevokeDeviceAdminDialog(deviceAdminSelection.value[0].id);
            } else if (activeSessionsSubTab.value === 'device-admin' && deviceAdminSelectedCount > 1) {
              openRevokeDeviceAdminBulkDialog();
            }
          },
        },
        { label: 'Export list', command: () => {} },
      ];
    });

    const approvalFlowColumns = [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        component: markRaw(FlowNameCell),
        componentProps: (sp: { data: Record<string, unknown> }) => ({
          name: sp.data.name as string,
        }),
      },
      {
        field: 'flowType',
        header: 'Flow Type',
        sortable: true,
        component: markRaw(DataTableCellText),
        componentProps: (sp: { data: Record<string, unknown> }) => ({
          label: sp.data.flowType as string,
        }),
      },
      {
        field: 'userGroupAssignment',
        header: 'User Group Assignment',
        sortable: true,
        component: markRaw(DataTableCellText),
        componentProps: (sp: { data: Record<string, unknown> }) => {
          if (sp.data.flowType === 'Device Admin') {
            return { label: '--' };
          }
          const raw = sp.data.userGroupAssignment as string;
          return { label: raw?.trim() ? raw : '--' };
        },
      },
      {
        field: 'approvalMode',
        header: 'Approval Mode',
        sortable: true,
        component: markRaw(DataTableCellText),
        componentProps: (sp: { data: Record<string, unknown> }) => ({
          label: sp.data.approvalMode as string,
        }),
      },
      {
        field: 'status',
        header: 'Status',
        sortable: true,
        component: markRaw(FlowEnabledStatusCell),
        componentProps: (sp: { data: Record<string, unknown> }) => ({
          enabled: (sp.data.enabled as boolean) !== false,
          flowId: sp.data.id as string,
          onToggle: handleApprovalFlowToggle,
        }),
      },
      {
        field: 'actions',
        header: 'Actions',
        component: markRaw(FlowActionsCell),
        componentProps: () => ({}),
      },
    ];

    const filteredApprovalFlows = computed(() => {
      let rows = approvalFlowsData.value;
      const q = appliedFlowUserGroupSearch.value.trim().toLowerCase();
      if (q) {
        rows = rows.filter((r) => r.userGroupAssignment.toLowerCase().includes(q));
      }
      if (appliedFlowTypes.value.length) {
        rows = rows.filter((r) => appliedFlowTypes.value.includes(r.flowType));
      }
      if (appliedFlowApprovalModes.value.length) {
        rows = rows.filter((r) => appliedFlowApprovalModes.value.includes(r.approvalMode));
      }
      if (appliedFlowStatuses.value.length) {
        rows = rows.filter((r) =>
          appliedFlowStatuses.value.includes(r.enabled ? 'Enabled' : 'Disabled'),
        );
      }
      return rows;
    });

    const approvalFlowsTotalRecords = computed(() => filteredApprovalFlows.value.length);

    const activeApprovalFlowFilterChips = computed(() => {
      const chips: { id: string; key: string; operator: string; value: string }[] = [];
      const search = appliedFlowUserGroupSearch.value.trim();
      if (search) {
        chips.push({
          id: 'flowUserGroup',
          key: 'User Group Assignment',
          operator: 'contains',
          value: search,
        });
      }
      if (appliedFlowTypes.value.length) {
        chips.push({
          id: 'flowType',
          key: 'Flow Type',
          operator: 'is',
          value: formatGroupedValues(appliedFlowTypes.value),
        });
      }
      if (appliedFlowApprovalModes.value.length) {
        chips.push({
          id: 'flowApprovalMode',
          key: 'Approval Mode',
          operator: 'is',
          value: formatGroupedValues(appliedFlowApprovalModes.value),
        });
      }
      if (appliedFlowStatuses.value.length) {
        chips.push({
          id: 'flowStatus',
          key: 'Status',
          operator: 'is',
          value: formatGroupedValues(appliedFlowStatuses.value),
        });
      }
      return chips;
    });

    const approvalFlowFilterApplyDisabled = computed(
      () =>
        draftFlowUserGroupSearch.value.trim() === appliedFlowUserGroupSearch.value.trim() &&
        sortedStringArrayEqual(draftFlowTypes.value, appliedFlowTypes.value) &&
        sortedStringArrayEqual(draftFlowApprovalModes.value, appliedFlowApprovalModes.value) &&
        sortedStringArrayEqual(draftFlowStatuses.value, appliedFlowStatuses.value),
    );

    function openApprovalFlowFilterDialog() {
      draftFlowUserGroupSearch.value = appliedFlowUserGroupSearch.value;
      draftFlowTypes.value = [...appliedFlowTypes.value];
      draftFlowApprovalModes.value = [...appliedFlowApprovalModes.value];
      draftFlowStatuses.value = [...appliedFlowStatuses.value];
      showApprovalFlowFilterDialog.value = true;
    }

    function applyApprovalFlowFilters() {
      appliedFlowUserGroupSearch.value = draftFlowUserGroupSearch.value;
      appliedFlowTypes.value = [...draftFlowTypes.value];
      appliedFlowApprovalModes.value = [...draftFlowApprovalModes.value];
      appliedFlowStatuses.value = [...draftFlowStatuses.value];
      showApprovalFlowFilterDialog.value = false;
    }

    function cancelApprovalFlowFilterDialog() {
      showApprovalFlowFilterDialog.value = false;
    }

    function clearDraftApprovalFlowFilters() {
      draftFlowUserGroupSearch.value = '';
      draftFlowTypes.value = [];
      draftFlowApprovalModes.value = [];
      draftFlowStatuses.value = [];
    }

    function clearAllApprovalFlowFilters() {
      appliedFlowUserGroupSearch.value = '';
      appliedFlowTypes.value = [];
      appliedFlowApprovalModes.value = [];
      appliedFlowStatuses.value = [];
    }

    function removeApprovalFlowFilterChip(chip: { id?: string }) {
      const chipId = chip.id ?? '';
      if (chipId === 'flowUserGroup') appliedFlowUserGroupSearch.value = '';
      else if (chipId === 'flowType') appliedFlowTypes.value = [];
      else if (chipId === 'flowApprovalMode') appliedFlowApprovalModes.value = [];
      else if (chipId === 'flowStatus') appliedFlowStatuses.value = [];
    }

    function toggleDraftFlowType(value: string) {
      const cur = draftFlowTypes.value;
      draftFlowTypes.value = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    }

    function toggleDraftFlowApprovalMode(value: string) {
      const cur = draftFlowApprovalModes.value;
      draftFlowApprovalModes.value = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
    }

    function toggleDraftFlowStatus(value: string) {
      const cur = draftFlowStatuses.value;
      draftFlowStatuses.value = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
    }

    const sourceData = computed(() =>
      activeSubTab.value === 'others' ? othersRequestsData : requests.value,
    );

    const columns = computed(() => {
      const baseColumns =
        activeSubTab.value === 'others' ? requestQueueOthersColumns : requestQueueAdministratorColumns;

      return baseColumns.map((column) => {
        if (column.field !== 'actions') return column;

        return {
          ...column,
          componentProps: (sp: { data: Record<string, unknown> }) => ({
            status: sp.data.status as string,
            requestId: sp.data.id as number,
            onGrantAccess: openGrantAccessDialog,
            onDenyAccess: openDenyAccessDialog,
          }),
        };
      });
    });

    const currentPageData = computed(() => {
      const filters = appliedFilters.value;
      const data = sourceData.value;
      if (!filters.length) return data;

      // Group filters by key (OR within same key, AND between keys)
      const filtersByKey = new Map<string, { operator: string; value: string }[]>();
      for (const f of filters) {
        const key = f.key;
        if (!filtersByKey.has(key)) filtersByKey.set(key, []);
        filtersByKey.get(key)!.push({ operator: f.operator, value: f.value });
      }

      return data.filter((r) => {
        for (const [key, keyFilters] of filtersByKey) {
          if (key === 'Status') {
            const statusValues = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
            if (statusValues.length && !statusValues.includes(r.status)) return false;
          } else if (key === 'Requester') {
            const reqFilter = keyFilters[0];
            if (reqFilter?.value) {
              const search = reqFilter.value.toLowerCase();
              const requester = r.requester.toLowerCase();
              if (reqFilter.operator === 'equals' && requester !== search) return false;
              if (reqFilter.operator === 'notEquals' && requester === search) return false;
              if (reqFilter.operator === 'startsWith' && !requester.startsWith(search)) return false;
              if (reqFilter.operator === 'endsWith' && !requester.endsWith(search)) return false;
              if (reqFilter.operator === 'notContains' && requester.includes(search)) return false;
              if (
                (reqFilter.operator === 'contains' || reqFilter.operator === 'is') &&
                !requester.includes(search)
              ) {
                return false;
              }
            }
          } else if (key === 'Type') {
            const typeValues = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
            if (typeValues.length && !typeValues.includes(r.type)) return false;
          } else if (key === 'Approval Mode') {
            const approvalValues = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
            if (approvalValues.length && !approvalValues.includes(r.approvalType)) return false;
          } else if (key === 'Received') {
            const dateFilter = keyFilters[0];
            if (dateFilter?.value) {
              const receivedDate = parseReceivedDate(r.received);
              const filterDate = parseIsoDate(dateFilter.value);
              if (receivedDate && filterDate) {
                if (dateFilter.operator === 'isBefore') {
                  const receivedDay = new Date(
                    receivedDate.getFullYear(),
                    receivedDate.getMonth(),
                    receivedDate.getDate(),
                  );
                  if (receivedDay >= filterDate) return false;
                }
                if (dateFilter.operator === 'isAfter') {
                  const receivedDay = new Date(
                    receivedDate.getFullYear(),
                    receivedDate.getMonth(),
                    receivedDate.getDate(),
                  );
                  if (receivedDay <= filterDate) return false;
                }
              }
            }
          }
        }
        return true;
      });
    });
    const totalRecords = computed(() => currentPageData.value.length);

    const showRequestQueuePaginator = computed(() =>
      shouldShowTablePaginator(totalRecords.value),
    );
    const showTimedAccessPaginator = computed(() =>
      shouldShowTablePaginator(timedAccessRows.value.length),
    );
    const showDeviceAdminPaginator = computed(() =>
      shouldShowTablePaginator(deviceAdminRows.value.length),
    );
    const showApprovalFlowsPaginator = computed(() =>
      shouldShowTablePaginator(approvalFlowsTotalRecords.value),
    );

    function handleSearch(_query: string) {
      // Placeholder for search
    }

    function handleFilter() {
      showFilterModal.value = true;
    }

    function handleRefresh() {
      // Placeholder for actual refresh logic
    }

    function handleExportSelect(option: { id: string }) {
      if (option.id === 'csv') {
        // Placeholder for CSV export
      } else if (option.id === 'xlsx') {
        // Placeholder for Excel export
      }
    }

    function handleFilterApply(filters: ModalAppliedFilter[]) {
      appliedFilters.value = modalFiltersToChips(filters);
      showFilterModal.value = false;
    }

    function handleFilterClearAll() {
      appliedFilters.value = [];
      showFilterModal.value = false;
    }

    function handleFilterRemove(filter: {
      id?: string | number;
      key: string;
      operator?: string;
      value?: string;
    }) {
      const hasId = filter.id != null && String(filter.id) !== '';
      appliedFilters.value = appliedFilters.value.filter((f) => {
        if (hasId) {
          return f.id !== filter.id;
        }
        if (filter.value !== undefined) {
          const op = filter.operator ?? 'is';
          return !(f.key === filter.key && f.operator === op && f.value === filter.value);
        }
        return f.key !== filter.key;
      });
    }

    function handleRowClick() {
      // Placeholder for row click navigation to detail
    }

    function handleApprovalFlowSearch(_query: string) {
      // Placeholder
    }

    function handleApprovalFlowFilter() {
      openApprovalFlowFilterDialog();
    }

    function handleAddApprovalFlow() {
      // Placeholder
    }

    function navigateToSettings() {
      navigateToStorybookStory(ACCESS_REQUESTS_SETTINGS_STORY_PATH);
    }

    /** Full-bleed table: avoid intrinsic table width + horizontal centering on wide viewports */
    const listPageTableSectionClass =
      'flex min-h-0 min-w-0 w-full flex-1 flex-col px-2';
    const listPageTableCardClass =
      'flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-default_solid bg-neutral-base shadow-e100';
    const listPageDataTablePt = {
      root: {
        class: 'min-w-0 w-full max-w-none self-stretch',
        style: 'flex: 1 1 0; min-height: 0; height: 100%; width: 100%; min-width: 0;',
      },
      tableContainer: {
        class: 'min-w-0 w-full max-w-none',
        style: 'flex: 1 1 0; min-height: 0; height: 100%; width: 100%; min-width: 0;',
      },
      table: {
        class: '!min-w-full w-full !max-w-none',
        style: 'table-layout: fixed; width: 100%; min-width: 100%;',
      },
      rowExpansion: {
        class: '!max-w-none w-full min-w-0',
      },
      rowExpansionCell: {
        class: 'w-full min-w-0 max-w-none p-0 align-top',
      },
      virtualScroller: {
        root: { class: 'min-h-0 min-w-0 w-full max-w-none flex-1' },
      },
      footer: {
        class: 'pl-4 pr-4',
      },
    };

    return {
      listPageTableSectionClass,
      listPageTableCardClass,
      listPageDataTablePt,
      menuItems,
      profileMenuItems,
      columns,
      currentPageData,
      totalRecords,
      showRequestQueuePaginator,
      showTimedAccessPaginator,
      showDeviceAdminPaginator,
      showApprovalFlowsPaginator,
      formatCompactPageReport,
      showFilterModal,
      basicFilters,
      appliedFilters,
      filterModalAppliedFilters,
      mainTabs,
      subTabOptions,
      activeMainTab,
      activeSubTab,
      activeSessionsSubTab,
      activeSessionsSubTabOptions,
      timedAccessRows,
      timedAccessColumnsWithActions,
      timedAccessSelection,
      deviceAdminRows,
      deviceAdminColumnsWithActions,
      deviceAdminSelection,
      activeSessionsActionsMenuRef,
      activeSessionsActionsMenuItems,
      toggleActiveSessionsActionsMenu,
      handleActiveSessionsRefresh,
      handleActiveSessionsSearch,
      exportOptions,
      handleSearch,
      handleFilter,
      handleFilterApply,
      handleFilterClearAll,
      handleFilterRemove,
      handleRefresh,
      handleExportSelect,
      handleRowClick,
      approvalFlowsData,
      filteredApprovalFlows,
      approvalFlowColumns,
      approvalFlowsTotalRecords,
      handleApprovalFlowSearch,
      handleApprovalFlowFilter,
      handleAddApprovalFlow,
      showApprovalFlowFilterDialog,
      activeApprovalFlowFilterChips,
      approvalFlowFilterApplyDisabled,
      draftFlowUserGroupSearch,
      draftFlowTypes,
      draftFlowApprovalModes,
      draftFlowStatuses,
      approvalFlowFilterFlowTypes,
      approvalFlowFilterApprovalModes,
      approvalFlowFilterStatuses,
      applyApprovalFlowFilters,
      cancelApprovalFlowFilterDialog,
      clearDraftApprovalFlowFilters,
      clearAllApprovalFlowFilters,
      removeApprovalFlowFilterChip,
      toggleDraftFlowType,
      toggleDraftFlowApprovalMode,
      toggleDraftFlowStatus,
      navigateToSettings,
      showDisableApprovalFlowDialog,
      closeDisableApprovalFlowDialog,
      confirmDisableApprovalFlow,
      showGrantAccessDialog,
      showDenyAccessDialog,
      pendingAccessRequest,
      grantAccessDurationOptions,
      grantAccessDuration,
      grantAccessMessage,
      grantAccessExpirationLabel,
      grantAccessResourceName,
      denyAccessReason,
      denyAccessInternalNotes,
      denyAccessConfirmDisabled,
      openGrantAccessDialog,
      openDenyAccessDialog,
      closeGrantAccessDialog,
      closeDenyAccessDialog,
      confirmGrantAccess,
      confirmDenyAccess,
      showRevokeTimedAccessDialog,
      pendingRevokeTimedAccessSession,
      closeRevokeTimedAccessDialog,
      confirmRevokeTimedAccess,
      showRevokeDeviceAdminDialog,
      revokeDeviceAdminBulkMode,
      pendingRevokeDeviceAdminSession,
      revokeDeviceAdminSelectedUserCount,
      closeRevokeDeviceAdminDialog,
      confirmRevokeDeviceAdmin,
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="access"
        :collapsible="true"
        :topNavToggle="true"
      />
      <div class="main flex h-full min-h-0 min-w-0 w-full flex-[1_1_0] flex-col self-stretch overflow-hidden">
      
        <TopBar />
        <div class="flex min-h-0 h-full w-full min-w-0 flex-[1_1_0] flex-col">
        <PageHeader
          class="shrink-0"
          title="Access Requests"
          :tabs="mainTabs"
          :activeTab="activeMainTab"
          @update:activeTab="activeMainTab = $event"
        >
          <template #icon>
            <ClipboardDocumentCheckIcon class="size-7" />
          </template>
          <template #actions>
            <Button label="Settings" severity="secondary" variant="outlined" @click="navigateToSettings">
              <template #icon>
                <Cog6ToothIcon class="size-5" />
              </template>
            </Button>
          </template>
        </PageHeader>

        <div v-if="activeMainTab === 'request-queue'" class="relative flex min-h-0 min-w-0 w-full flex-1 flex-col items-stretch overflow-y-auto bg-neutral-surface px-6 pb-6">
          <!-- Sub-tabs: Administrator / Others (matches Device Detail pattern) -->
          <div class="flex w-full min-w-0 items-center justify-between mb-4 pt-6">
            <SelectButton
              v-model="activeSubTab"
              :options="subTabOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <!-- DataTableToolbar (outside DataTable - Circuit DataTable does not support #toolbar slot) -->
          <div class="shrink-0 w-full min-w-0 pb-4">
            <DataTableToolbar
              search-placeholder="Search"
              :show-add-button="false"
              :show-filter-button="true"
              :show-refresh-button="true"
              :show-columns-button="true"
              :show-download-button="true"
              :show-save-view-button="false"
              :active-filters="appliedFilters"
              :export-options="exportOptions"
              @filter-remove="handleFilterRemove"
              @clear-all="handleFilterClearAll"
              @search="handleSearch"
              @filter="handleFilter"
              @refresh="handleRefresh"
              @export-select="handleExportSelect"
            >
              <template #saved-views>
                <span class="text-body-sm text-neutral-subtle">Last refreshed an hour ago</span>
              </template>
            </DataTableToolbar>
          </div>

          <div :class="listPageTableSectionClass">
            <div :class="listPageTableCardClass">
            <CircuitDataTable
              class="min-h-0 min-w-0 w-full flex-1"
              :data="currentPageData"
              :columns="columns"
              :paginator="showRequestQueuePaginator"
              :rows="50"
              :total-records="totalRecords"
              :rows-per-page-options="[
                { label: '10 Items per page', value: 10 },
                { label: '20 Items per page', value: 20 },
                { label: '50 Items per page', value: 50 },
              ]"
              :show-rows-per-page-options="showRequestQueuePaginator"
              :show-page-report="true"
              :card="false"
              size="default"
              :expander="true"
              scrollable
              scroll-height="flex"
              data-key="id"
              @row-click="handleRowClick"
              :pt="listPageDataTablePt"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
            >
            <template #expansion="{ data }">
              <div class="box-border border-t border-neutral-default_solid bg-neutral-surface px-md py-5">
                <!-- Error: Approval flow changed during execution -->
                <div
                  v-if="data.status === 'Error'"
                  class="flex max-w-2xl items-start gap-3 rounded-lg border border-error-base/30 bg-feedback-error-surface p-4"
                >
                  <ExclamationTriangleIcon class="size-6 shrink-0 text-error-base" aria-hidden="true" />
                  <p class="text-body-md text-neutral-base">
                    Changes to the approval flow were made during the execution of the approval process. This request is no longer valid and must be re-requested by the end user.
                  </p>
                </div>

                <!-- Approval flow visual (hidden for Error — replaced by error message above) -->
                <div v-if="data.status !== 'Error'" class="flex max-w-4xl flex-col gap-6">
                <!-- Header: App icon + Title or Approval Flow Description -->
                <div class="flex items-center gap-3">
                  <div class="size-8 shrink-0 rounded flex items-center justify-center bg-info-surface border border-info-base/20">
                    <span class="text-body-sm font-bold text-info-base">{{ data.name?.charAt(0) || '?' }}</span>
                  </div>
                  <div class="flex flex-col gap-1 min-w-0">
                    <span v-if="data.approvalFlowDescription" class="text-heading-4 text-neutral-base line-clamp-2">{{ data.approvalFlowDescription }}</span>
                    <span v-else class="text-heading-4 text-neutral-base">{{ data.approvalTitle }}</span>
                    <LinkText v-if="data.approvalFlowDescription" label="Show More" href="#" class="text-body-md shrink-0" />
                  </div>
                </div>

                <!-- Request Details (2-column grid with vertical label/value pairs) -->
                <div class="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-20 sm:gap-y-5">
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Requester</span>
                    <LinkText :label="data.requester" href="#" class="text-body-md" />
                  </div>
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Manager</span>
                    <span
                      v-if="data.manager === 'Not Provided' || !data.manager"
                      class="text-body-md text-error-base"
                    >{{ data.manager || 'Not Provided' }}</span>
                    <LinkText v-else :label="data.manager" href="#" class="text-body-md" />
                  </div>
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Duration</span>
                    <span class="text-body-md text-neutral-base">
                      {{ (data.manager === 'Not Provided' || !data.manager || data.status === 'Missing Data') ? 'N/A' : data.duration }}
                    </span>
                  </div>
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Reason for Request</span>
                    <span class="text-body-md text-neutral-base">{{ data.reasonForRequest }}</span>
                  </div>
                </div>

                <!-- Approval Progress: Multi-step for Missing Data, single for others -->
                <div class="flex flex-col gap-4 border-t border-neutral-default_solid pt-6">
                  <span class="text-body-md-semi-bold text-neutral-base">Approval Progress</span>
                  <template v-if="data.status === 'Missing Data' && data.approvalSteps?.length">
                    <div
                      v-for="(step, idx) in data.approvalSteps"
                      :key="idx"
                      class="flex items-start gap-3"
                    >
                      <div
                        class="flex shrink-0 items-center justify-center rounded-full border-2"
                        :class="[
                          step.type === 'pending' ? 'h-[22px] w-[22px]' : 'size-6',
                          step.type === 'actionRequired'
                            ? 'border-error-base bg-error-base'
                            : step.type === 'approved'
                              ? 'border-success-base bg-success-base'
                              : 'border-warning-base bg-transparent',
                        ]"
                      >
                        <ExclamationTriangleIcon
                          v-if="step.type === 'actionRequired'"
                          class="size-4 text-neutral-ghost"
                          aria-hidden="true"
                        />
                        <EllipsisHorizontalIcon
                          v-else-if="step.type === 'pending'"
                          class="h-[16px] w-[16px] shrink-0 text-warning-base"
                          aria-hidden="true"
                        />
                        <CheckCircleIcon
                          v-else-if="step.type === 'approved'"
                          class="size-4 text-neutral-ghost"
                          aria-hidden="true"
                        />
                      </div>
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span
                          class="text-body-md"
                          :class="step.type === 'actionRequired' ? 'text-error-base' : 'text-neutral-base'"
                        >{{ step.approver }}</span>
                        <span v-if="step.actionLink" class="flex items-center gap-1">
                          <LinkText :label="step.actionLink.label" :href="step.actionLink.href" class="text-body-md" />
                          <ArrowTopRightOnSquareIcon class="size-4 text-info-base shrink-0" />
                        </span>
                        <span class="text-body-sm text-neutral-subtle">{{ step.status }}</span>
                      </div>
                    </div>
                  </template>
                  <div v-else class="flex items-start gap-3">
                    <div
                      class="flex shrink-0 items-center justify-center rounded-full border-2"
                      :class="[
                        data.approvalProgressStatus !== 'Approved' &&
                        data.status !== 'Approved' &&
                        data.approvalProgressStatus !== 'Denied' &&
                        data.status !== 'Denied' &&
                        data.approvalProgressStatus !== 'Expired' &&
                        data.status !== 'Expired'
                          ? 'h-[22px] w-[22px]'
                          : 'size-6',
                        data.approvalProgressStatus === 'Approved' || data.status === 'Approved'
                          ? 'border-success-base bg-success-base'
                          : data.approvalProgressStatus === 'Denied' || data.status === 'Denied'
                            ? 'border-error-base bg-error-base'
                            : data.approvalProgressStatus === 'Expired' || data.status === 'Expired'
                              ? 'border-neutral-default_solid bg-transparent'
                              : 'border-warning-base bg-transparent',
                      ]"
                    >
                      <CheckCircleIcon
                        v-if="data.approvalProgressStatus === 'Approved' || data.status === 'Approved'"
                        class="size-4 text-neutral-ghost"
                        aria-hidden="true"
                      />
                      <XCircleIcon
                        v-else-if="data.approvalProgressStatus === 'Denied' || data.status === 'Denied'"
                        class="size-4 text-neutral-ghost"
                        aria-hidden="true"
                      />
                      <XCircleIcon
                        v-else-if="data.approvalProgressStatus === 'Expired' || data.status === 'Expired'"
                        class="size-4 text-neutral-subtle"
                        aria-hidden="true"
                      />
                      <EllipsisHorizontalIcon
                        v-else
                        class="h-[16px] w-[16px] shrink-0 text-warning-base"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="text-body-md text-neutral-base">{{ data.approver }}</span>
                      <span class="text-body-sm text-neutral-subtle">{{ data.approvalProgressStatus }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons (for Pending and Missing Data) -->
                <div
                  v-if="data.status === 'Pending' || data.status === 'Missing Data'"
                  class="flex gap-sm border-t border-neutral-default_solid pt-4"
                >
                  <Button
                    label="Deny Access"
                    severity="danger"
                    variant="outlined"
                    @click="openDenyAccessDialog(data.id)"
                  />
                  <Button label="Grant Access" @click="openGrantAccessDialog(data.id)" />
                </div>
                </div>
              </div>
            </template>

            <template #empty>
              <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                <span class="text-body-md">No requests match your filters</span>
                <span class="text-body-sm mt-1">Try adjusting your search or filter criteria</span>
              </div>
            </template>

            <template #initialEmpty>
              <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                <span class="text-body-md">No access requests yet</span>
                <span class="text-body-sm mt-1">Create your first request to get started</span>
              </div>
            </template>
            </CircuitDataTable>
            </div>
            <p
              v-if="!showRequestQueuePaginator && totalRecords > 0"
              class="shrink-0 pt-3 pl-2 text-left text-body-sm text-neutral-subtle"
            >
              {{ formatCompactPageReport(totalRecords) }}
            </p>
          </div>

          <FilterModal
            v-model:visible="showFilterModal"
            :basic-filters="basicFilters"
            :applied-filters="filterModalAppliedFilters"
            @apply="handleFilterApply"
            @clear-all="handleFilterClearAll"
          />
        </div>

        <div v-else-if="activeMainTab === 'active-sessions'" class="relative flex min-h-0 min-w-0 w-full flex-1 flex-col items-stretch overflow-y-auto bg-neutral-surface px-6 pb-6">
          <div class="flex w-full min-w-0 items-center justify-between mb-4 pt-6">
            <SelectButton
              v-model="activeSessionsSubTab"
              :options="activeSessionsSubTabOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <template v-if="activeSessionsSubTab === 'timed-access'">
            <div class="flex shrink-0 w-full min-w-0 items-start gap-sm pb-4">
              <div class="min-w-0 flex-1">
                <DataTableToolbar
                  search-placeholder="Search"
                  :show-add-button="false"
                  :show-filter-button="false"
                  :show-columns-button="false"
                  :show-download-button="false"
                  :show-save-view-button="false"
                  :show-refresh-button="true"
                  :active-filters="[]"
                  @search="handleActiveSessionsSearch"
                  @refresh="handleActiveSessionsRefresh"
                >
                  <template #saved-views>
                    <span class="text-body-sm text-neutral-subtle">Last refreshed a minute ago</span>
                  </template>
                </DataTableToolbar>
              </div>
              <div class="flex shrink-0 items-start pt-0.5">
                <Button
                  label="Actions"
                  severity="secondary"
                  variant="outlined"
                  icon-pos="right"
                  aria-haspopup="true"
                  aria-label="Open actions menu"
                  @click="toggleActiveSessionsActionsMenu"
                >
                  <template #icon>
                    <ChevronDownIcon class="size-4" aria-hidden="true" />
                  </template>
                </Button>
              </div>
            </div>

            <div :class="listPageTableSectionClass">
              <div :class="listPageTableCardClass">
              <CircuitDataTable
                class="min-h-0 min-w-0 w-full flex-1"
                :data="timedAccessRows"
                :columns="timedAccessColumnsWithActions"
                selection-mode="multiple"
                v-model:selection="timedAccessSelection"
                :paginator="showTimedAccessPaginator"
                :rows="20"
                :total-records="timedAccessRows.length"
                :rows-per-page-options="[
                  { label: '10 Items per page', value: 10 },
                  { label: '20 Items per page', value: 20 },
                  { label: '50 Items per page', value: 50 },
                ]"
                :show-rows-per-page-options="showTimedAccessPaginator"
                :show-page-report="true"
                :card="false"
                size="default"
                scrollable
                scroll-height="flex"
                data-key="id"
                :pt="listPageDataTablePt"
                :ptOptions="{ mergeSections: true, mergeProps: true }"
              >
                <template #empty>
                  <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                    <span class="text-body-md">No timed access sessions match your search</span>
                    <span class="text-body-sm mt-1">Try adjusting your search</span>
                  </div>
                </template>
                <template #initialEmpty>
                  <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                    <span class="text-body-md">No timed access sessions</span>
                    <span class="text-body-sm mt-1">Active timed grants will appear here</span>
                  </div>
                </template>
              </CircuitDataTable>
              </div>
              <p
                v-if="!showTimedAccessPaginator && timedAccessRows.length > 0"
                class="shrink-0 pt-3 pl-2 text-left text-body-sm text-neutral-subtle"
              >
                {{ formatCompactPageReport(timedAccessRows.length) }}
              </p>
            </div>
          </template>

          <template v-else-if="activeSessionsSubTab === 'device-admin'">
            <div class="flex shrink-0 w-full min-w-0 items-start gap-sm pb-4">
              <div class="min-w-0 flex-1">
                <DataTableToolbar
                  search-placeholder="Search"
                  :show-add-button="false"
                  :show-filter-button="false"
                  :show-columns-button="false"
                  :show-download-button="false"
                  :show-save-view-button="false"
                  :show-refresh-button="true"
                  :active-filters="[]"
                  @search="handleActiveSessionsSearch"
                  @refresh="handleActiveSessionsRefresh"
                >
                  <template #saved-views>
                    <span class="text-body-sm text-neutral-subtle">Last refreshed a minute ago</span>
                  </template>
                </DataTableToolbar>
              </div>
              <div class="flex shrink-0 items-start pt-0.5">
                <Button
                  label="Actions"
                  severity="secondary"
                  variant="outlined"
                  icon-pos="right"
                  aria-haspopup="true"
                  aria-label="Open actions menu"
                  @click="toggleActiveSessionsActionsMenu"
                >
                  <template #icon>
                    <ChevronDownIcon class="size-4" aria-hidden="true" />
                  </template>
                </Button>
              </div>
            </div>

            <div :class="listPageTableSectionClass">
              <div :class="listPageTableCardClass">
              <CircuitDataTable
                class="min-h-0 min-w-0 w-full flex-1"
                :data="deviceAdminRows"
                :columns="deviceAdminColumnsWithActions"
                selection-mode="multiple"
                v-model:selection="deviceAdminSelection"
                :paginator="showDeviceAdminPaginator"
                :rows="20"
                :total-records="deviceAdminRows.length"
                :rows-per-page-options="[
                  { label: '10 Items per page', value: 10 },
                  { label: '20 Items per page', value: 20 },
                  { label: '50 Items per page', value: 50 },
                ]"
                :show-rows-per-page-options="showDeviceAdminPaginator"
                :show-page-report="true"
                :card="false"
                size="default"
                scrollable
                scroll-height="flex"
                data-key="id"
                :pt="listPageDataTablePt"
                :ptOptions="{ mergeSections: true, mergeProps: true }"
              >
                <template #empty>
                  <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                    <span class="text-body-md">No device admin sessions match your search</span>
                  </div>
                </template>
                <template #initialEmpty>
                  <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                    <span class="text-body-md">No device admin sessions</span>
                  </div>
                </template>
              </CircuitDataTable>
              </div>
              <p
                v-if="!showDeviceAdminPaginator && deviceAdminRows.length > 0"
                class="shrink-0 pt-3 pl-2 text-left text-body-sm text-neutral-subtle"
              >
                {{ formatCompactPageReport(deviceAdminRows.length) }}
              </p>
            </div>
          </template>

          <Menu ref="activeSessionsActionsMenuRef" :model="activeSessionsActionsMenuItems" :popup="true" />
        </div>

        <div v-else-if="activeMainTab === 'approval-flows'" class="relative flex min-h-0 min-w-0 w-full flex-1 flex-col items-stretch overflow-y-auto bg-neutral-surface px-6 pb-6">
          <div class="shrink-0 w-full min-w-0 pt-6 pb-4">
            <DataTableToolbar
              add-button-label="Add Approval Flow"
              search-placeholder="Search"
              :show-add-button="true"
              :show-filter-button="true"
              :show-refresh-button="false"
              :show-columns-button="false"
              :show-download-button="false"
              :show-save-view-button="false"
              :active-filters="activeApprovalFlowFilterChips"
              :max-visible-filters="5"
              @search="handleApprovalFlowSearch"
              @filter="handleApprovalFlowFilter"
              @filter-remove="removeApprovalFlowFilterChip"
              @clear-all="clearAllApprovalFlowFilters"
              @add="handleAddApprovalFlow"
            />
          </div>

          <div :class="listPageTableSectionClass">
            <div :class="listPageTableCardClass">
            <CircuitDataTable
              class="min-h-0 min-w-0 w-full flex-1"
              :data="filteredApprovalFlows"
              :columns="approvalFlowColumns"
              :paginator="showApprovalFlowsPaginator"
              :rows="20"
              :total-records="approvalFlowsTotalRecords"
              :rows-per-page-options="[
                { label: '10 Items per page', value: 10 },
                { label: '20 Items per page', value: 20 },
                { label: '50 Items per page', value: 50 },
              ]"
              :show-rows-per-page-options="showApprovalFlowsPaginator"
              :show-page-report="true"
              :card="false"
              size="default"
              :expander="true"
              scrollable
              scroll-height="flex"
              data-key="id"
              :pt="listPageDataTablePt"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
            >
            <template #expansion="{ data }">
              <div
                class="box-border flex w-full min-w-0 max-w-none flex-col gap-4 border-t border-neutral-default_solid bg-neutral-surface p-md text-start"
              >
                <p v-if="data.flowType === 'Device Admin'" class="text-body-md text-neutral-base">
                  Device admin flows are approved by administrators.
                </p>
                <p v-else-if="data.expansionDescription" class="text-body-md text-neutral-base">
                  {{ data.expansionDescription }}
                </p>
                <p v-else class="text-body-md text-neutral-subtle">
                  Approval flow configuration for <span class="text-body-md-semi-bold text-neutral-base">{{ data.name }}</span>
                </p>
                <div v-if="data.configurationSteps?.length" class="flex flex-col gap-3">
                  <span class="text-body-md-semi-bold text-neutral-base">Approval Configuration</span>
                  <div class="flex flex-col">
                    <template v-for="(step, idx) in data.configurationSteps" :key="idx">
                      <div class="flex gap-sm">
                        <div class="flex shrink-0 flex-col items-center">
                          <div
                            class="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-warning-base bg-transparent"
                          >
                            <EllipsisHorizontalIcon
                              class="h-[16px] w-[16px] shrink-0 text-warning-base"
                              aria-hidden="true"
                            />
                          </div>
                          <div
                            v-if="idx < data.configurationSteps.length - 1"
                            class="w-px min-h-10 shrink-0 grow-0 bg-neutral-default_solid"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          class="flex min-w-0 flex-col gap-0.5"
                          :class="idx < data.configurationSteps.length - 1 ? 'pb-6' : ''"
                        >
                          <span class="text-body-md-semi-bold text-neutral-base">{{ step.name }}</span>
                          <span class="text-body-sm text-neutral-subtle">{{ step.roleLabel }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="flex flex-wrap gap-sm pt-1">
                  <Button label="Delete" severity="danger" variant="outlined" />
                  <Button label="Edit" severity="secondary" variant="outlined" />
                </div>
              </div>
            </template>

            <template #empty>
              <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                <span class="text-body-md">No approval flows match your search</span>
                <span class="text-body-sm mt-1">Try adjusting your search or filters</span>
              </div>
            </template>

            <template #initialEmpty>
              <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                <span class="text-body-md">No approval flows yet</span>
                <span class="text-body-sm mt-1">Add an approval flow to get started</span>
              </div>
            </template>
            </CircuitDataTable>
            </div>
            <p
              v-if="!showApprovalFlowsPaginator && approvalFlowsTotalRecords > 0"
              class="shrink-0 pt-3 pl-2 text-left text-body-sm text-neutral-subtle"
            >
              {{ formatCompactPageReport(approvalFlowsTotalRecords) }}
            </p>
          </div>
        </div>

        </div>
      </div>

      <Dialog
        v-model:visible="showApprovalFlowFilterDialog"
        :draggable="false"
        modal
        header="Filter"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <FormField label="User Group Assignment">
            <template #default="{ inputId }">
              <IconField>
                <InputIcon>
                  <MagnifyingGlassIcon />
                </InputIcon>
                <InputText
                  :id="inputId"
                  v-model="draftFlowUserGroupSearch"
                  placeholder="Search"
                  class="w-full"
                />
              </IconField>
            </template>
          </FormField>
          <FormField label="Flow Type">
            <template #default>
              <div class="flex flex-wrap gap-sm">
                <button
                  v-for="opt in approvalFlowFilterFlowTypes"
                  :key="opt"
                  type="button"
                  class="inline-flex items-center gap-sm rounded-full border px-md py-sm text-body-md transition-colors"
                  :class="
                    draftFlowTypes.includes(opt)
                      ? 'border-info-base bg-info-surface text-info-base'
                      : 'border-neutral-default_solid text-neutral-base'
                  "
                  :aria-pressed="draftFlowTypes.includes(opt)"
                  @click="toggleDraftFlowType(opt)"
                >
                  <CheckCircleIcon
                    v-if="draftFlowTypes.includes(opt)"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    v-else
                    class="box-border size-4 shrink-0 rounded-full border-2 border-neutral-default_solid"
                    aria-hidden="true"
                  />
                  <span>{{ opt }}</span>
                </button>
              </div>
            </template>
          </FormField>
          <FormField label="Approval Mode">
            <template #default>
              <div class="flex flex-wrap gap-sm">
                <button
                  v-for="opt in approvalFlowFilterApprovalModes"
                  :key="opt"
                  type="button"
                  class="inline-flex items-center gap-sm rounded-full border px-md py-sm text-body-md transition-colors"
                  :class="
                    draftFlowApprovalModes.includes(opt)
                      ? 'border-info-base bg-info-surface text-info-base'
                      : 'border-neutral-default_solid text-neutral-base'
                  "
                  :aria-pressed="draftFlowApprovalModes.includes(opt)"
                  @click="toggleDraftFlowApprovalMode(opt)"
                >
                  <CheckCircleIcon
                    v-if="draftFlowApprovalModes.includes(opt)"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    v-else
                    class="box-border size-4 shrink-0 rounded-full border-2 border-neutral-default_solid"
                    aria-hidden="true"
                  />
                  <span>{{ opt }}</span>
                </button>
              </div>
            </template>
          </FormField>
          <FormField label="Status">
            <template #default>
              <div class="flex flex-wrap gap-sm">
                <button
                  v-for="opt in approvalFlowFilterStatuses"
                  :key="opt"
                  type="button"
                  class="inline-flex items-center gap-sm rounded-full border px-md py-sm text-body-md transition-colors"
                  :class="
                    draftFlowStatuses.includes(opt)
                      ? 'border-info-base bg-info-surface text-info-base'
                      : 'border-neutral-default_solid text-neutral-base'
                  "
                  :aria-pressed="draftFlowStatuses.includes(opt)"
                  @click="toggleDraftFlowStatus(opt)"
                >
                  <CheckCircleIcon
                    v-if="draftFlowStatuses.includes(opt)"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    v-else
                    class="box-border size-4 shrink-0 rounded-full border-2 border-neutral-default_solid"
                    aria-hidden="true"
                  />
                  <span>{{ opt }}</span>
                </button>
              </div>
            </template>
          </FormField>
        </div>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0">
            <Button
              label="Clear all"
              severity="secondary"
              variant="text"
              @click="clearDraftApprovalFlowFilters"
            />
          </div>
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="text"
              @click="cancelApprovalFlowFilterDialog"
            />
            <Button
              label="Apply"
              :disabled="approvalFlowFilterApplyDisabled"
              @click="applyApprovalFlowFilters"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showDisableApprovalFlowDialog"
        :draggable="false"
        modal
        header="Disable Approval Flow"
        :style="{ width: '480px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <MessageNotification
          severity="warn"
          detail="If this approval flow is disabled, any pending requests will be canceled."
        />
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeDisableApprovalFlowDialog"
            />
            <Button
              label="Disable Flow"
              severity="danger"
              variant="outlined"
              @click="confirmDisableApprovalFlow"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showGrantAccessDialog"
        :draggable="false"
        modal
        header="Grant Access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <p class="text-body-md text-neutral-base">
            <span class="text-body-md-semi-bold">{{ pendingAccessRequest?.requester }}</span>
            will be given access to
            <span class="text-body-md-semi-bold">{{ grantAccessResourceName }}.</span>
          </p>

          <div class="grid grid-cols-2 gap-md">
            <FormField label="Access Duration">
              <template #default="{ inputId }">
                <Select
                  :inputId="inputId"
                  v-model="grantAccessDuration"
                  :options="grantAccessDurationOptions"
                  optionLabel="label"
                  optionValue="value"
                  appendTo="body"
                  class="w-full"
                />
              </template>
            </FormField>
            <FormField label="Access Expiration">
              <template #default>
                <span class="text-body-md text-neutral-base">{{ grantAccessExpirationLabel }}</span>
              </template>
            </FormField>
          </div>

          <FormField label="Message to Requester (optional)">
            <template #default="{ inputId }">
              <Textarea
                :id="inputId"
                v-model="grantAccessMessage"
                class="w-full"
                rows="4"
              />
            </template>
          </FormField>
        </div>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeGrantAccessDialog"
            />
            <Button label="Grant Access" @click="confirmGrantAccess" />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showDenyAccessDialog"
        :draggable="false"
        modal
        header="Deny Access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <p class="text-body-md text-neutral-base">
            <span class="text-body-md-semi-bold">{{ pendingAccessRequest?.requester }}</span>
            will not be given access to
            <span class="text-body-md-semi-bold">{{ grantAccessResourceName }}.</span>
          </p>

          <FormField
            label="Reason"
            required
            helpText="Reason for denial will be provided to the requester."
          >
            <template #default="{ inputId }">
              <Textarea
                :id="inputId"
                v-model="denyAccessReason"
                class="w-full"
                rows="4"
              />
            </template>
          </FormField>

          <FormField
            label="Internal notes (optional)"
            helpText="Internal Notes will only be viewable in DI events."
          >
            <template #default="{ inputId }">
              <Textarea
                :id="inputId"
                v-model="denyAccessInternalNotes"
                class="w-full"
                rows="4"
              />
            </template>
          </FormField>
        </div>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeDenyAccessDialog"
            />
            <Button
              label="Deny Access"
              severity="danger"
              variant="outlined"
              :disabled="denyAccessConfirmDisabled"
              @click="confirmDenyAccess"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showRevokeTimedAccessDialog"
        :draggable="false"
        modal
        header="Revoke Access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <p class="text-body-md text-neutral-base">
          Are you sure you want to revoke the Timed Access session for
          <span class="text-body-md-semi-bold">{{ pendingRevokeTimedAccessSession?.user }}</span>?
        </p>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeRevokeTimedAccessDialog"
            />
            <Button
              label="Revoke"
              severity="danger"
              variant="outlined"
              @click="confirmRevokeTimedAccess"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showRevokeDeviceAdminDialog"
        :draggable="false"
        modal
        header="Revoke Access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <p v-if="revokeDeviceAdminBulkMode" class="text-body-md text-neutral-base">
          Are you sure you want to revoke the Device Admin sessions for the
          <span class="text-body-md-semi-bold">{{ revokeDeviceAdminSelectedUserCount }}</span>
          selected users?
        </p>
        <p v-else class="text-body-md text-neutral-base">
          Are you sure you want to revoke the Device Admin session for
          <span class="text-body-md-semi-bold">{{ pendingRevokeDeviceAdminSession?.user }}</span>
          on
          <span class="text-body-md-semi-bold">{{ pendingRevokeDeviceAdminSession?.device }}</span>?
        </p>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeRevokeDeviceAdminDialog"
            />
            <Button
              label="Revoke"
              severity="danger"
              variant="outlined"
              @click="confirmRevokeDeviceAdmin"
            />
          </div>
        </template>
      </Dialog>
    </div>
  `,
});

// ─── Story ───

const meta: Meta<typeof AccessRequestsListPage> = {
  title: 'Projects/Access Requests/Pages/Access Requests List',
  component: AccessRequestsListPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccessRequestsListPage>;

export const Default: Story = {};

export const OthersTab: Story = {
  args: {
    initialSubTab: 'others',
  },
};

export const ApprovalFlowsTab: Story = {
  args: {
    initialMainTab: 'approval-flows',
  },
};

export const ActiveSessionsTimedAccess: Story = {
  args: {
    initialMainTab: 'active-sessions',
    initialActiveSessionsSubTab: 'timed-access',
  },
};
