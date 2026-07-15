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
  ActionsToolbar,
} from '@jumpcloud/circuit/components';
import type {
  Action,
  SelectedItem,
  DataTableToolbarSavedView,
  SaveViewData,
} from '@jumpcloud/circuit/components';
import Menu from 'primevue/menu';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

import TopBar from '@/components/TopBar.vue';
import { getDefaultRequestQueueSubTab } from '../shared/accessRequestPreferences';
import {
  ACCESS_REQUESTS_ADD_RESOURCE_FLOW_STORY_PATH,
  ACCESS_REQUESTS_SETTINGS_STORY_PATH,
  menuItems,
  navigateToStorybookStory,
  profileMenuItems,
} from '../shared/navigation';

// ─── Types ───

/** Phase 1 requestable resource types; Phase 2 adds tray-initiated device admin/sudo */
type AccessRequestResourceType =
  | 'SSO application'
  | 'Device group'
  | 'RADIUS'
  | 'Directory'
  | 'Device admin / sudo';

/** Phase 1 workflow states */
type AccessRequestStatus =
  | 'Pending'
  | 'Approved'
  | 'Granted'
  | 'Declined'
  | 'Expired'
  | 'Error';

interface AccessRequest {
  id: number;
  received: string;
  type: AccessRequestResourceType;
  name: string;
  requester: string;
  department: string;
  /** Approval mode: Manual or Automatic */
  approvalType: 'Manual' | 'Automatic';
  status: AccessRequestStatus;
  /** Expanded view fields */
  approvalTitle: string;
  manager: string;
  reasonForRequest: string;
  /** Target user group configured in access method */
  accessGroup: string;
  approver: string;
  approvalProgressStatus: string;
  /** Error expansion copy when status is Error */
  errorReason?: string;
  /** Phase 2: administrator vs delegated approval routing */
  approvalRoute: 'administrator' | 'delegated';
  /** Delegated flows: multi-step progress */
  approvedCount?: number;
  totalApprovers?: number;
  approvalSteps?: Array<{
    type: 'pending' | 'approved' | 'declined';
    approver: string;
    roleLabel: string;
    status: string;
  }>;
}

/** Approval flows tab — configuration rows (not request queue items) */
interface ApprovalFlowRow {
  id: string;
  name: string;
  flowType: 'Device admin' | 'Resource approval';
  /** Resource approval flows only; Device admin flows omit assignment (shown as --) */
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
    flowType: 'Resource approval',
    userGroupAssignment: 'Confluence For Admins',
    approvalMode: 'Manual',
    enabled: true,
    expansionDescription:
      "Approval flow description goes here. A long description can fit and if necessary it can even wrap but I don't think that will be neccessary.",
    configurationSteps: [
      { name: 'Katana Blade', roleLabel: 'Required approver' },
      { name: 'Johnny Cage', roleLabel: 'Optional approver' },
    ],
  },
  { id: 'f1', name: 'Sudo Admin - 1 hr', flowType: 'Device admin', userGroupAssignment: '', approvalMode: 'Manual', enabled: true },
  {
    id: 'f2',
    name: 'Confluence - Users',
    flowType: 'Resource approval',
    userGroupAssignment: 'Confluence For Users',
    approvalMode: 'Manual',
    enabled: true,
    expansionDescription:
      'Grants Confluence user permissions to members of the assigned user group after manager and team lead approval.',
    configurationSteps: [
      { name: 'Sarah Chen', roleLabel: 'Required approver' },
      { name: 'Marcus Webb', roleLabel: 'Required approver' },
      { name: 'Elena Vasquez', roleLabel: 'Optional approver' },
    ],
  },
  {
    id: 'f3',
    name: 'UX Tools',
    flowType: 'Resource approval',
    userGroupAssignment: 'Design Tools',
    approvalMode: 'Automatic',
    enabled: true,
    expansionDescription:
      'Provides access to UX and design tooling for designers; automatic approval when eligibility criteria are met.',
    configurationSteps: [
      { name: 'Priya Narayan', roleLabel: 'Required approver' },
      { name: 'David Okonkwo', roleLabel: 'Optional approver' },
    ],
  },
  { id: 'f4', name: 'DEV Tools', flowType: 'Device admin', userGroupAssignment: '', approvalMode: 'Automatic', enabled: true },
];

/** Active Sessions — Timed Access tab */
interface TimedAccessSessionRow {
  id: string;
  user: string;
  approvalFlow: string;
  groupAssignment: string;
  timeRemainingLabel: string;
}

/** Active Sessions — Device admin tab */
interface DeviceAdminSessionRow {
  id: string;
  user: string;
  device: string;
  os: string;
  /** Remaining time label — same format as Timed access (e.g. 4h:23m, 6d:23h:18m) */
  timeRemainingLabel: string;
}

const PAGINATION_THRESHOLD = 10;

/** Phase 1: incomplete requests expire after 30 days */
const REQUEST_EXPIRY_DAYS = 30;

function formatRequestExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + REQUEST_EXPIRY_DAYS);
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
];

// ─── Mock Data ───

const accessRequestsData: AccessRequest[] = [
  {
    id: 1,
    received: 'January 27, 2026 at 9:11 AM',
    type: 'SSO application',
    name: 'Figma for UX',
    requester: 'Urvashi Requester',
    department: 'Product',
    approvalType: 'Manual',
    status: 'Error',
    approvalTitle: 'Figma for UX',
    manager: 'Sarah Chen',
    reasonForRequest: 'Design project',
    accessGroup: 'Figma_Designers',
    approver: 'Administrator',
    approvalProgressStatus: 'Error',
    approvalRoute: 'administrator',
    errorReason:
      'Changes to the approval flow were made during the execution of the approval process. This request is no longer valid and must be re-requested by the end user.',
  },
  {
    id: 2,
    received: 'January 19, 2026 at 10:11 AM',
    type: 'SSO application',
    name: 'Salesforce Admin',
    requester: 'Alex Chen',
    department: 'Sales',
    approvalType: 'Manual',
    status: 'Error',
    approvalTitle: 'Salesforce Admin',
    manager: 'Jane Doe',
    reasonForRequest: 'Need admin access for quarterly reporting',
    accessGroup: 'Salesforce_Admins_Dynamic',
    approver: 'Administrator',
    approvalProgressStatus: 'Error',
    approvalRoute: 'administrator',
    errorReason:
      'The configured access group has reached its dynamic group exemption limit (50). The requester could not be added to the group.',
  },
  {
    id: 3,
    received: 'December 10, 2025 at 11:22 AM',
    type: 'SSO application',
    name: 'Figma for UX',
    requester: 'Urvashi Requester',
    department: 'Product',
    approvalType: 'Manual',
    status: 'Approved',
    approvalTitle: 'Figma for UX',
    manager: 'Sarah Chen',
    reasonForRequest: 'Design sprint',
    accessGroup: 'Figma_Designers',
    approver: 'Lorie Thompson',
    approvalProgressStatus: 'Approved',
    approvalRoute: 'administrator',
  },
  {
    id: 4,
    received: 'December 8, 2025 at 3:15 PM',
    type: 'SSO application',
    name: 'UX Tools',
    requester: 'Priya Narayan',
    department: 'Design',
    approvalType: 'Automatic',
    status: 'Granted',
    approvalTitle: 'UX Tools',
    manager: 'David Okonkwo',
    reasonForRequest: 'Design tooling for new project',
    accessGroup: 'Design_Tools',
    approver: 'Auto',
    approvalProgressStatus: 'Granted',
    approvalRoute: 'administrator',
  },
  {
    id: 5,
    received: 'December 5, 2025 at 9:00 AM',
    type: 'SSO application',
    name: 'Jira',
    requester: 'Urvashi Requester',
    department: 'Product',
    approvalType: 'Manual',
    status: 'Pending',
    approvalTitle: 'Jira Project Access',
    manager: 'Sarah Chen',
    reasonForRequest: 'Project management',
    accessGroup: 'Jira_Users',
    approver: 'Administrator',
    approvalProgressStatus: 'Pending administrator approval',
    approvalRoute: 'administrator',
  },
  {
    id: 9,
    received: 'July 2, 2026 at 8:42 AM',
    type: 'Device admin / sudo',
    name: 'Sudo Admin - 1 hr',
    requester: 'Jamie Rivera',
    department: 'Engineering',
    approvalType: 'Manual',
    status: 'Pending',
    approvalTitle: 'Temporary Admin on MacBook Pro #4421',
    manager: 'Sarah Chen',
    reasonForRequest: 'Install development tooling requiring elevated privileges',
    accessGroup: '—',
    approver: 'Administrator',
    approvalProgressStatus: 'Pending administrator approval',
    approvalRoute: 'administrator',
  },
  {
    id: 6,
    received: 'November 28, 2025 at 3:45 PM',
    type: 'SSO application',
    name: 'Confluence',
    requester: 'Urvashi Requester',
    department: 'Product',
    approvalType: 'Manual',
    status: 'Declined',
    approvalTitle: 'Confluence Space Access',
    manager: 'Sarah Chen',
    reasonForRequest: 'Documentation',
    accessGroup: 'Confluence_Users',
    approver: 'Lorie Thompson',
    approvalProgressStatus: 'Declined',
    approvalRoute: 'administrator',
  },
  {
    id: 7,
    received: 'November 15, 2025 at 10:00 AM',
    type: 'Device group',
    name: 'Engineering Laptops',
    requester: 'Sam Dev',
    department: 'Engineering',
    approvalType: 'Manual',
    status: 'Expired',
    approvalTitle: 'Engineering Laptops',
    manager: 'Tech Lead',
    reasonForRequest: 'Need device group access for testing',
    accessGroup: 'Engineering_Devices',
    approver: 'Administrator',
    approvalProgressStatus: 'Expired',
    approvalRoute: 'administrator',
  },
  {
    id: 8,
    received: 'November 10, 2025 at 2:00 PM',
    type: 'RADIUS',
    name: 'Office Wi-Fi',
    requester: 'Casey Nguyen',
    department: 'Operations',
    approvalType: 'Manual',
    status: 'Granted',
    approvalTitle: 'Office Wi-Fi Access',
    manager: 'Ops Manager',
    reasonForRequest: 'Remote office connectivity',
    accessGroup: 'RADIUS_Office_Access',
    approver: 'Lorie Thompson',
    approvalProgressStatus: 'Granted',
    approvalRoute: 'administrator',
  },
];

/** Phase 2: requests routed to non-admin approvers (admin portal is monitor-only) */
const delegatedRequestsData: AccessRequest[] = [
  {
    id: 11,
    received: 'March 17, 2026 at 2:30 PM',
    type: 'SSO application',
    name: 'Serhat Test App',
    requester: 'Serhat Can',
    department: 'Product',
    approvalType: 'Manual',
    status: 'Pending',
    approvalTitle: 'Serhat Test App',
    manager: 'Sarah Chen',
    reasonForRequest: 'Need access to Serhat Test App for QA validation',
    accessGroup: 'Serhat_Test_Users',
    approver: 'Barış Ermut',
    approvalProgressStatus: 'Pending required approval',
    approvalRoute: 'delegated',
    approvedCount: 0,
    totalApprovers: 2,
    approvalSteps: [
      {
        type: 'pending',
        approver: 'Barış Ermut',
        roleLabel: 'Resource owner',
        status: 'Pending required approval',
      },
      {
        type: 'pending',
        approver: 'Sarah Chen',
        roleLabel: "Requester's Manager",
        status: 'Pending required approval',
      },
    ],
  },
  {
    id: 12,
    received: 'March 2, 2026 at 10:15 AM',
    type: 'SSO application',
    name: 'Design System Access',
    requester: 'Alex Chen',
    department: 'Design',
    approvalType: 'Manual',
    status: 'Pending',
    approvalTitle: 'Design System Access',
    manager: 'Jane Doe',
    reasonForRequest: 'Design project collaboration',
    accessGroup: 'Design_System_Users',
    approver: 'Marcus Webb',
    approvalProgressStatus: 'Pending required approval',
    approvalRoute: 'delegated',
    approvedCount: 1,
    totalApprovers: 2,
    approvalSteps: [
      {
        type: 'approved',
        approver: 'Jane Doe',
        roleLabel: "Requester's Manager",
        status: 'Approved',
      },
      {
        type: 'pending',
        approver: 'Marcus Webb',
        roleLabel: 'Resource owner',
        status: 'Pending required approval',
      },
    ],
  },
  {
    id: 13,
    received: 'March 1, 2026 at 9:00 AM',
    type: 'SSO application',
    name: 'Repo Access',
    requester: 'Sam Dev',
    department: 'Engineering',
    approvalType: 'Manual',
    status: 'Granted',
    approvalTitle: 'Repo Access',
    manager: 'Tech Lead',
    reasonForRequest: 'Code contribution',
    accessGroup: 'Engineering_Repos',
    approver: 'Elena Vasquez',
    approvalProgressStatus: 'Granted',
    approvalRoute: 'delegated',
    approvedCount: 2,
    totalApprovers: 2,
    approvalSteps: [
      {
        type: 'approved',
        approver: 'Tech Lead',
        roleLabel: "Requester's Manager",
        status: 'Approved',
      },
      {
        type: 'approved',
        approver: 'Elena Vasquez',
        roleLabel: 'Resource owner',
        status: 'Approved',
      },
    ],
  },
  {
    id: 14,
    received: 'February 25, 2026 at 2:00 PM',
    type: 'SSO application',
    name: 'Security Tools',
    requester: 'Test User',
    department: 'Security',
    approvalType: 'Manual',
    status: 'Pending',
    approvalTitle: 'Security Tools',
    manager: 'Manager',
    reasonForRequest: 'Incident response tooling',
    accessGroup: 'Security_Tools',
    approver: 'Priya Narayan',
    approvalProgressStatus: 'Pending required approval',
    approvalRoute: 'delegated',
    approvedCount: 0,
    totalApprovers: 3,
    approvalSteps: [
      {
        type: 'pending',
        approver: 'Priya Narayan',
        roleLabel: 'Resource owner',
        status: 'Pending required approval',
      },
      {
        type: 'pending',
        approver: 'Manager',
        roleLabel: "Requester's Manager",
        status: 'Pending required approval',
      },
      {
        type: 'pending',
        approver: 'Security Team',
        roleLabel: 'Security review',
        status: 'Pending required approval',
      },
    ],
  },
];

// ─── Status Cell ───

const statusTokenMapping: Record<string, { label: string; severity: string }> = {
  Error: { label: 'ERROR', severity: 'danger' },
  Pending: { label: 'PENDING', severity: 'warn' },
  Approved: { label: 'APPROVED', severity: 'success' },
  Granted: { label: 'GRANTED', severity: 'success' },
  Declined: { label: 'DECLINED', severity: 'danger' },
  Expired: { label: 'EXPIRED', severity: 'secondary' },
};

// ─── Progress Cell (Phase 2 delegated flows: "X of Y approval(s)") ───

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

// ─── Actions Cell (Approve / Decline for Pending only) ───

const ActionsCell = defineComponent({
  name: 'ActionsCell',
  components: { Button, Menu, EllipsisVerticalIcon },
  props: {
    status: { type: String, required: true },
    requestId: { type: Number, required: true },
    canAct: { type: Boolean, default: true },
    onApproveAccess: { type: Function, default: undefined },
    onDeclineAccess: { type: Function, default: undefined },
  },
  setup(props) {
    const menuRef = ref<InstanceType<typeof Menu> | null>(null);
    const hasActions = computed(
      () => props.canAct && props.status === 'Pending',
    );

    const menuItems = computed(() => [
      {
        label: 'Approve access',
        command: () => props.onApproveAccess?.(props.requestId),
      },
      {
        label: 'Decline access',
        command: () => props.onDeclineAccess?.(props.requestId),
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

// ─── Approval flows tab cells ───

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

/** Timed Access + Device admin active-session tables (same cell) */
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
      { label: 'Copy', command: () => {} },
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
    header: 'Approval flow',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.approvalFlow as string,
      href: '#',
    }),
  },
  {
    field: 'groupAssignment',
    header: 'Group assignment',
    sortable: true,
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.groupAssignment as string,
      href: '#',
    }),
  },
  {
    field: 'timeRemainingLabel',
    header: 'Time remaining',
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
    header: 'Time remaining',
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

// ─── Column Definitions ───

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
    header: 'Approval mode',
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

const requestQueueDelegatedColumns = [
  ...requestQueueAdministratorColumns.slice(0, 6),
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
  ...requestQueueAdministratorColumns.slice(6, 7),
  {
    field: 'actions',
    header: 'Actions',
    component: markRaw(ActionsCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      status: sp.data.status as string,
      requestId: sp.data.id as number,
      canAct: false,
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
      { label: 'SSO application', value: 'SSO application' },
      { label: 'Device group', value: 'Device group' },
      { label: 'RADIUS', value: 'RADIUS' },
      { label: 'Directory', value: 'Directory' },
      { label: 'Device admin / sudo', value: 'Device admin / sudo' },
    ],
  },
  {
    id: 'approvalType',
    label: 'Approval type',
    type: 'multiSelect' as const,
    options: [
      { label: 'Manual', value: 'Manual' },
      { label: 'Auto-approval', value: 'Automatic' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'multiSelect' as const,
    options: [
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Granted', value: 'Granted' },
      { label: 'Declined', value: 'Declined' },
      { label: 'Expired', value: 'Expired' },
      { label: 'Error', value: 'Error' },
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

type FilterMapConfig = {
  idToKey: Record<string, string>;
  keyToId: Record<string, string>;
  multiSelectIds: Set<string>;
};

const REQUEST_QUEUE_FILTER_MAP: FilterMapConfig = {
  idToKey: {
    requester: 'Requester',
    received: 'Received',
    type: 'Type',
    approvalType: 'Approval mode',
    status: 'Status',
  },
  keyToId: {
    Requester: 'requester',
    Received: 'received',
    Type: 'type',
    'Approval mode': 'approvalType',
    Status: 'status',
  },
  multiSelectIds: new Set(['type', 'approvalType', 'status']),
};

const APPROVAL_FLOW_FILTER_MAP: FilterMapConfig = {
  idToKey: {
    flowUserGroup: 'User group assignment',
    flowType: 'Flow type',
    flowApprovalMode: 'Approval mode',
    flowStatus: 'Status',
  },
  keyToId: {
    'User group assignment': 'flowUserGroup',
    'Flow type': 'flowType',
    'Approval mode': 'flowApprovalMode',
    Status: 'flowStatus',
  },
  multiSelectIds: new Set(['flowType', 'flowApprovalMode', 'flowStatus']),
};

const approvalFlowBasicFilters = [
  {
    id: 'flowUserGroup',
    label: 'User group assignment',
    type: 'text' as const,
    placeholder: 'Search',
  },
  {
    id: 'flowType',
    label: 'Flow type',
    type: 'multiSelect' as const,
    options: [
      { label: 'Device admin', value: 'Device admin' },
      { label: 'Resource approval', value: 'Resource approval' },
    ],
  },
  {
    id: 'flowApprovalMode',
    label: 'Approval mode',
    type: 'multiSelect' as const,
    options: [
      { label: 'Manual', value: 'Manual' },
      { label: 'Automatic', value: 'Automatic' },
    ],
  },
  {
    id: 'flowStatus',
    label: 'Status',
    type: 'multiSelect' as const,
    options: [
      { label: 'Enabled', value: 'Enabled' },
      { label: 'Disabled', value: 'Disabled' },
    ],
  },
];

function chipsToModalFilters(
  chips: AppliedFilterChip[],
  config: FilterMapConfig = REQUEST_QUEUE_FILTER_MAP,
): ModalAppliedFilter[] {
  const byId = new Map<string, ModalAppliedFilter>();

  for (const chip of chips) {
    const id = config.keyToId[chip.key] ?? chip.id;
    if (!id) continue;

    if (config.multiSelectIds.has(id)) {
      const existing = byId.get(id);
      const values =
        existing && Array.isArray(existing.value) ? [...existing.value] : [];
      values.push(chip.value);
      byId.set(id, { id, value: values });
    } else {
      byId.set(id, {
        id,
        value: { operator: chip.operator || 'contains', value: chip.value },
      });
    }
  }

  return Array.from(byId.values());
}

function modalFiltersToChips(
  filters: ModalAppliedFilter[],
  config: FilterMapConfig = REQUEST_QUEUE_FILTER_MAP,
): AppliedFilterChip[] {
  const chips: AppliedFilterChip[] = [];
  let chipIndex = 0;

  for (const filter of filters) {
    const key = config.idToKey[filter.id] ?? filter.id;
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
  { label: 'Request queue (2)', value: 'request-queue' },
  { label: 'Active sessions (5)', value: 'active-sessions' },
  { label: 'Approval flows (5)', value: 'approval-flows' },
];

const requestQueueSubTabOptions = [
  { label: 'Administrator', value: 'administrator' },
  { label: 'Others', value: 'delegated' },
];

const activeSessionsSubTabOptions = [
  { label: 'Device admin (2)', value: 'device-admin' },
  { label: 'Timed access (3)', value: 'timed-access' },
];

// ─── Export options ───

const exportOptions = [
  { id: 'csv', label: 'Export as CSV' },
  { id: 'xlsx', label: 'Export as Excel' },
];

// ─── Initial active filters ───

const initialFilters: AppliedFilterChip[] = [
  { key: 'Status', operator: 'is', value: 'Pending', id: 'filter-1' },
];

type RequestQueueSavedView = DataTableToolbarSavedView & {
  data?: { filters: AppliedFilterChip[] };
};

const requestQueueDefaultViews: RequestQueueSavedView[] = [
  {
    id: 'default-all',
    label: 'All requests',
    editable: false,
    deletable: false,
    data: { filters: [] },
  },
];

const initialRequestQueueSavedViews: RequestQueueSavedView[] = [
  {
    id: 'view-pending',
    label: 'Pending requests',
    isFavorite: true,
    data: {
      filters: [{ id: 'filter-pending', key: 'Status', operator: 'is', value: 'Pending' }],
    },
  },
  {
    id: 'view-resource',
    label: 'Resource approvals',
    isFavorite: false,
    data: {
      filters: [
        { id: 'filter-resource', key: 'Type', operator: 'is', value: 'Resource approval' },
      ],
    },
  },
];

function approvalFlowMatchesFilters(row: ApprovalFlowRow, filters: AppliedFilterChip[]): boolean {
  if (!filters.length) return true;

  const filtersByKey = new Map<string, { operator: string; value: string }[]>();
  for (const filter of filters) {
    if (!filtersByKey.has(filter.key)) filtersByKey.set(filter.key, []);
    filtersByKey.get(filter.key)!.push({ operator: filter.operator, value: filter.value });
  }

  for (const [key, keyFilters] of filtersByKey) {
    if (key === 'User group assignment') {
      const search = keyFilters[0]?.value?.trim().toLowerCase() ?? '';
      if (search && !row.userGroupAssignment.toLowerCase().includes(search)) return false;
    } else if (key === 'Flow type') {
      const values = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
      if (values.length && !values.includes(row.flowType)) return false;
    } else if (key === 'Approval mode') {
      const values = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
      if (values.length && !values.includes(row.approvalMode)) return false;
    } else if (key === 'Status') {
      const values = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
      const status = row.enabled ? 'Enabled' : 'Disabled';
      if (values.length && !values.includes(status)) return false;
    }
  }

  return true;
}

const activeSessionBulkActions: Action[] = [{ id: 'revoke', label: 'Revoke' }];

// ─── Component ───

const AccessRequestsListPage = defineComponent({
  name: 'AccessRequestsListPage',
  props: {
    initialRequestQueueSubTab: {
      type: String as () => 'administrator' | 'delegated',
      default: () => getDefaultRequestQueueSubTab(),
    },
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
    ActionsToolbar,
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
    Textarea,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    Cog6ToothIcon,
    Menu,
    EllipsisHorizontalIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    XCircleIcon,
    XMarkIcon,
  },
  setup(props) {
    const requests = ref<AccessRequest[]>([...accessRequestsData]);
    const delegatedRequests = ref<AccessRequest[]>([...delegatedRequestsData]);
    const searchQuery = ref('');
    const showFilterModal = ref(false);
    const appliedFilters = ref<AppliedFilterChip[]>(
      initialRequestQueueSavedViews[0]?.data?.filters.map((f) => ({ ...f })) ?? [...initialFilters],
    );
    const filterModalAppliedFilters = computed(() => chipsToModalFilters(appliedFilters.value));
    const selectedViewId = ref<string | number | null>('view-pending');
    const savedViews = ref<RequestQueueSavedView[]>(
      initialRequestQueueSavedViews.map((view) => ({
        ...view,
        data: view.data
          ? { filters: view.data.filters.map((filter) => ({ ...filter })) }
          : undefined,
      })),
    );
    const showSaveViewPanel = ref(false);
    const saveViewPanelMode = ref<'save' | 'edit'>('save');
    const editingViewId = ref<string | number | null>(null);
    const editingViewName = ref('');
    const editingViewIsPrivate = ref(false);
    let savedViewSeq = initialRequestQueueSavedViews.length + 1;
    const activeMainTab = ref(props.initialMainTab);
    const activeRequestQueueSubTab = ref(props.initialRequestQueueSubTab);
    const activeSessionsSubTab = ref(props.initialActiveSessionsSubTab);

    const timedAccessRows = ref<TimedAccessSessionRow[]>([...timedAccessSessionsData]);
    const timedAccessSelection = ref<TimedAccessSessionRow[]>([]);
    const deviceAdminRows = ref<DeviceAdminSessionRow[]>(deviceAdminSessionsData.map((r) => ({ ...r })));
    const deviceAdminSelection = ref<DeviceAdminSessionRow[]>([]);

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

    const showApprovalFlowFilterModal = ref(false);
    const appliedApprovalFlowFilters = ref<AppliedFilterChip[]>([]);
    const approvalFlowFilterModalAppliedFilters = computed(() =>
      chipsToModalFilters(appliedApprovalFlowFilters.value, APPROVAL_FLOW_FILTER_MAP),
    );

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

    const showApproveAccessDialog = ref(false);
    const showDeclineAccessDialog = ref(false);
    const accessActionRequestIdPending = ref<number | null>(null);
    const approveAccessMessage = ref('');
    const declineAccessReason = ref('');
    const declineAccessInternalNotes = ref('');

    const declineAccessConfirmDisabled = computed(() => !declineAccessReason.value.trim());

    const requestExpiryLabel = computed(() => formatRequestExpiryDate());

    const pendingAccessRequest = computed(() => {
      const id = accessActionRequestIdPending.value;
      if (id == null) return null;
      return requests.value.find((r) => r.id === id) ?? null;
    });

    const approveAccessResourceName = computed(() => {
      const request = pendingAccessRequest.value;
      if (!request) return '';
      return request.approvalTitle || request.name;
    });

    function updateRequestStatus(requestId: number, status: 'Granted' | 'Declined') {
      const row = requests.value.find((r) => r.id === requestId);
      if (!row) return;

      if (status === 'Granted') {
        row.status = 'Granted';
        row.approvalProgressStatus = 'Granted';
        row.approver = 'Administrator';
      } else {
        row.status = 'Declined';
        row.approvalProgressStatus = 'Declined';
      }
    }

    const isDelegatedQueueView = computed(() => activeRequestQueueSubTab.value === 'delegated');

    const queueSourceData = computed(() =>
      isDelegatedQueueView.value ? delegatedRequests.value : requests.value,
    );

    function openApproveAccessDialog(requestId: number) {
      accessActionRequestIdPending.value = requestId;
      approveAccessMessage.value = '';
      showApproveAccessDialog.value = true;
    }

    function openDeclineAccessDialog(requestId: number) {
      accessActionRequestIdPending.value = requestId;
      declineAccessReason.value = '';
      declineAccessInternalNotes.value = '';
      showDeclineAccessDialog.value = true;
    }

    function closeApproveAccessDialog() {
      showApproveAccessDialog.value = false;
    }

    function closeDeclineAccessDialog() {
      showDeclineAccessDialog.value = false;
    }

    function confirmApproveAccess() {
      const id = accessActionRequestIdPending.value;
      if (id != null) updateRequestStatus(id, 'Granted');
      approveAccessMessage.value = '';
      showApproveAccessDialog.value = false;
    }

    function confirmDeclineAccess() {
      const id = accessActionRequestIdPending.value;
      if (id != null && declineAccessReason.value.trim()) updateRequestStatus(id, 'Declined');
      declineAccessReason.value = '';
      declineAccessInternalNotes.value = '';
      showDeclineAccessDialog.value = false;
    }

    watch([showApproveAccessDialog, showDeclineAccessDialog], ([approveOpen, declineOpen]) => {
      if (!approveOpen && !declineOpen) accessActionRequestIdPending.value = null;
    });

    const showRevokeTimedAccessDialog = ref(false);
    const revokeTimedAccessBulkMode = ref(false);
    const revokeTimedAccessSessionIdPending = ref<string | null>(null);
    const revokeTimedAccessPendingIds = ref<string[]>([]);

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
      revokeTimedAccessBulkMode.value = false;
      revokeTimedAccessSessionIdPending.value = sessionId;
      revokeTimedAccessPendingIds.value = [sessionId];
      showRevokeTimedAccessDialog.value = true;
    }

    function openRevokeTimedAccessBulkDialog() {
      revokeTimedAccessBulkMode.value = true;
      revokeTimedAccessSessionIdPending.value = null;
      revokeTimedAccessPendingIds.value = timedAccessSelection.value.map((row) => row.id);
      showRevokeTimedAccessDialog.value = true;
    }

    function closeRevokeTimedAccessDialog() {
      showRevokeTimedAccessDialog.value = false;
    }

    function confirmRevokeTimedAccess() {
      const idsToRemove = revokeTimedAccessBulkMode.value
        ? revokeTimedAccessPendingIds.value
        : revokeTimedAccessSessionIdPending.value
          ? [revokeTimedAccessSessionIdPending.value]
          : [];

      if (idsToRemove.length) {
        const idSet = new Set(idsToRemove);
        timedAccessRows.value = timedAccessRows.value.filter((row) => !idSet.has(row.id));
        timedAccessSelection.value = timedAccessSelection.value.filter((row) => !idSet.has(row.id));
      }
      showRevokeTimedAccessDialog.value = false;
    }

    watch(showRevokeTimedAccessDialog, (open) => {
      if (!open) {
        revokeTimedAccessBulkMode.value = false;
        revokeTimedAccessSessionIdPending.value = null;
        revokeTimedAccessPendingIds.value = [];
      }
    });

    const timedAccessToolbarSelectedItems = computed<SelectedItem[]>(() =>
      timedAccessSelection.value.map((row) => ({
        id: row.id,
        label: row.user,
        description: `${row.approvalFlow} • ${row.timeRemainingLabel}`,
      })),
    );

    function applyTimedAccessBulkAction(action: Action) {
      if (action.id !== 'revoke' || timedAccessSelection.value.length === 0) return;
      if (timedAccessSelection.value.length === 1) {
        openRevokeTimedAccessDialog(timedAccessSelection.value[0].id);
      } else {
        openRevokeTimedAccessBulkDialog();
      }
    }

    function handleTimedAccessDeselect(item: SelectedItem) {
      timedAccessSelection.value = timedAccessSelection.value.filter((row) => row.id !== item.id);
    }

    function clearTimedAccessSelection() {
      timedAccessSelection.value = [];
    }

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

    const deviceAdminToolbarSelectedItems = computed<SelectedItem[]>(() =>
      deviceAdminSelection.value.map((row) => ({
        id: row.id,
        label: row.user,
        description: `${row.device} • ${row.os}`,
      })),
    );

    function applyDeviceAdminBulkAction(action: Action) {
      if (action.id !== 'revoke' || deviceAdminSelection.value.length === 0) return;
      if (deviceAdminSelection.value.length === 1) {
        openRevokeDeviceAdminDialog(deviceAdminSelection.value[0].id);
      } else {
        openRevokeDeviceAdminBulkDialog();
      }
    }

    function handleDeviceAdminDeselect(item: SelectedItem) {
      deviceAdminSelection.value = deviceAdminSelection.value.filter((row) => row.id !== item.id);
    }

    function clearDeviceAdminSelection() {
      deviceAdminSelection.value = [];
    }

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
        header: 'Flow type',
        sortable: true,
        component: markRaw(DataTableCellText),
        componentProps: (sp: { data: Record<string, unknown> }) => ({
          label: sp.data.flowType as string,
        }),
      },
      {
        field: 'userGroupAssignment',
        header: 'User group assignment',
        sortable: true,
        component: markRaw(DataTableCellText),
        componentProps: (sp: { data: Record<string, unknown> }) => {
          if (sp.data.flowType === 'Device admin') {
            return { label: '--' };
          }
          const raw = sp.data.userGroupAssignment as string;
          return { label: raw?.trim() ? raw : '--' };
        },
      },
      {
        field: 'approvalMode',
        header: 'Approval mode',
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

    const filteredApprovalFlows = computed(() =>
      approvalFlowsData.value.filter((row) =>
        approvalFlowMatchesFilters(row, appliedApprovalFlowFilters.value),
      ),
    );

    const approvalFlowsTotalRecords = computed(() => filteredApprovalFlows.value.length);

    function handleApprovalFlowFilter() {
      showApprovalFlowFilterModal.value = true;
    }

    function handleApprovalFlowFilterApply(filters: ModalAppliedFilter[]) {
      appliedApprovalFlowFilters.value = modalFiltersToChips(filters, APPROVAL_FLOW_FILTER_MAP);
      showApprovalFlowFilterModal.value = false;
    }

    function handleApprovalFlowFilterClearAll() {
      appliedApprovalFlowFilters.value = [];
      showApprovalFlowFilterModal.value = false;
    }

    function handleApprovalFlowFilterRemove(filter: {
      id?: string | number;
      key: string;
      operator?: string;
      value?: string;
    }) {
      const hasId = filter.id != null && String(filter.id) !== '';
      appliedApprovalFlowFilters.value = appliedApprovalFlowFilters.value.filter((f) => {
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

    function clearAllApprovalFlowFilters() {
      appliedApprovalFlowFilters.value = [];
    }

    const columns = computed(() => {
      const baseColumns = isDelegatedQueueView.value
        ? requestQueueDelegatedColumns
        : requestQueueAdministratorColumns;

      return baseColumns.map((column) => {
        if (column.field !== 'actions') return column;

        return {
          ...column,
          componentProps: (sp: { data: Record<string, unknown> }) => ({
            status: sp.data.status as string,
            requestId: sp.data.id as number,
            canAct: !isDelegatedQueueView.value,
            onApproveAccess: openApproveAccessDialog,
            onDeclineAccess: openDeclineAccessDialog,
          }),
        };
      });
    });

    function requestMatchesFilters(row: AccessRequest, filters: AppliedFilterChip[]): boolean {
      if (!filters.length) return true;

      const filtersByKey = new Map<string, { operator: string; value: string }[]>();
      for (const f of filters) {
        const key = f.key;
        if (!filtersByKey.has(key)) filtersByKey.set(key, []);
        filtersByKey.get(key)!.push({ operator: f.operator, value: f.value });
      }

      for (const [key, keyFilters] of filtersByKey) {
        if (key === 'Status') {
          const statusValues = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
          if (statusValues.length && !statusValues.includes(row.status)) return false;
        } else if (key === 'Requester') {
          const reqFilter = keyFilters[0];
          if (reqFilter?.value) {
            const search = reqFilter.value.toLowerCase();
            const requester = row.requester.toLowerCase();
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
          if (typeValues.length && !typeValues.includes(row.type)) return false;
        } else if (key === 'Approval mode') {
          const approvalValues = keyFilters.filter((f) => f.operator === 'is').map((f) => f.value);
          if (approvalValues.length && !approvalValues.includes(row.approvalType)) return false;
        } else if (key === 'Received') {
          const dateFilter = keyFilters[0];
          if (dateFilter?.value) {
            const receivedDate = parseReceivedDate(row.received);
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
    }

    const currentPageData = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return queueSourceData.value.filter((row) => {
        if (!requestMatchesFilters(row, appliedFilters.value)) return false;
        if (!query) return true;
        const haystack = [
          row.name,
          row.requester,
          row.department,
          row.type,
          row.status,
          row.accessGroup,
          row.approvalTitle,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
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

    function handleSearch(query: string) {
      searchQuery.value = query;
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

    function openSaveViewPanel(mode: 'save' | 'edit', view?: RequestQueueSavedView) {
      saveViewPanelMode.value = mode;
      editingViewId.value = view?.id ?? null;
      editingViewName.value = view?.label ?? '';
      editingViewIsPrivate.value = false;
      showSaveViewPanel.value = true;
    }

    function handleSaveView() {
      openSaveViewPanel('save');
    }

    function handleAddNewView() {
      openSaveViewPanel('save');
    }

    function handleSaveViewCancel() {
      showSaveViewPanel.value = false;
      editingViewId.value = null;
      editingViewName.value = '';
      editingViewIsPrivate.value = false;
    }

    function handleSaveViewSubmit(data: SaveViewData) {
      const name = data.name.trim();
      if (!name) return;

      const filtersSnapshot = appliedFilters.value.map((filter) => ({ ...filter }));

      if (saveViewPanelMode.value === 'edit' && editingViewId.value != null) {
        savedViews.value = savedViews.value.map((view) =>
          view.id === editingViewId.value
            ? { ...view, label: name, data: { filters: filtersSnapshot } }
            : view,
        );
        selectedViewId.value = editingViewId.value;
      } else {
        const id = `view-${savedViewSeq++}`;
        savedViews.value = [
          ...savedViews.value,
          {
            id,
            label: name,
            isFavorite: false,
            data: { filters: filtersSnapshot },
          },
        ];
        selectedViewId.value = id;
      }

      handleSaveViewCancel();
    }

    function handleViewSelect(view: RequestQueueSavedView) {
      selectedViewId.value = view.id;
      const filters =
        view.data?.filters ??
        requestQueueDefaultViews.find((defaultView) => defaultView.id === view.id)?.data?.filters ??
        [];
      appliedFilters.value = filters.map((filter) => ({ ...filter }));
      showSaveViewPanel.value = false;
    }

    function handleViewFavorite(view: RequestQueueSavedView) {
      savedViews.value = savedViews.value.map((item) =>
        item.id === view.id ? { ...item, isFavorite: true } : item,
      );
    }

    function handleViewUnfavorite(view: RequestQueueSavedView) {
      savedViews.value = savedViews.value.map((item) =>
        item.id === view.id ? { ...item, isFavorite: false } : item,
      );
    }

    function handleViewEdit(view: RequestQueueSavedView) {
      selectedViewId.value = view.id;
      appliedFilters.value = (view.data?.filters ?? []).map((filter) => ({ ...filter }));
      openSaveViewPanel('edit', view);
    }

    function handleViewDelete(view: RequestQueueSavedView) {
      savedViews.value = savedViews.value.filter((item) => item.id !== view.id);
      if (selectedViewId.value === view.id) {
        selectedViewId.value = 'default-all';
        appliedFilters.value = [];
      }
      if (editingViewId.value === view.id) {
        handleSaveViewCancel();
      }
    }

    function handleRowClick() {
      // Placeholder for row click navigation to detail
    }

    function handleApprovalFlowSearch(_query: string) {
      // Placeholder
    }

    const addApprovalFlowMenuRef = ref<InstanceType<typeof Menu> | null>(null);

    const addApprovalFlowMenuItems = [
      {
        label: 'Resource request',
        command: () => handleAddApprovalFlow('Resource approval'),
      },
      {
        label: 'Device admin',
        command: () => handleAddApprovalFlow('Device admin'),
      },
    ];

    function toggleAddApprovalFlowMenu(event: Event) {
      addApprovalFlowMenuRef.value?.toggle(event);
    }

    function handleAddApprovalFlow(flowType: 'Resource approval' | 'Device admin') {
      if (flowType === 'Resource approval') {
        navigateToStorybookStory(ACCESS_REQUESTS_ADD_RESOURCE_FLOW_STORY_PATH);
      }
      // Device admin create flow — placeholder
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
      selectedViewId,
      savedViews,
      requestQueueDefaultViews,
      showSaveViewPanel,
      saveViewPanelMode,
      editingViewName,
      editingViewIsPrivate,
      handleSaveView,
      handleAddNewView,
      handleSaveViewSubmit,
      handleSaveViewCancel,
      handleViewSelect,
      handleViewFavorite,
      handleViewUnfavorite,
      handleViewEdit,
      handleViewDelete,
      mainTabs,
      requestQueueSubTabOptions,
      activeRequestQueueSubTab,
      isDelegatedQueueView,
      activeMainTab,
      activeSessionsSubTab,
      activeSessionsSubTabOptions,
      timedAccessRows,
      timedAccessColumnsWithActions,
      timedAccessSelection,
      deviceAdminRows,
      deviceAdminColumnsWithActions,
      deviceAdminSelection,
      activeSessionBulkActions,
      timedAccessToolbarSelectedItems,
      deviceAdminToolbarSelectedItems,
      applyTimedAccessBulkAction,
      applyDeviceAdminBulkAction,
      handleTimedAccessDeselect,
      handleDeviceAdminDeselect,
      clearTimedAccessSelection,
      clearDeviceAdminSelection,
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
      addApprovalFlowMenuRef,
      addApprovalFlowMenuItems,
      toggleAddApprovalFlowMenu,
      handleAddApprovalFlow,
      showApprovalFlowFilterModal,
      approvalFlowBasicFilters,
      appliedApprovalFlowFilters,
      approvalFlowFilterModalAppliedFilters,
      handleApprovalFlowFilterApply,
      handleApprovalFlowFilterClearAll,
      handleApprovalFlowFilterRemove,
      clearAllApprovalFlowFilters,
      navigateToSettings,
      showDisableApprovalFlowDialog,
      closeDisableApprovalFlowDialog,
      confirmDisableApprovalFlow,
      showApproveAccessDialog,
      showDeclineAccessDialog,
      pendingAccessRequest,
      approveAccessMessage,
      approveAccessResourceName,
      requestExpiryLabel,
      declineAccessReason,
      declineAccessInternalNotes,
      declineAccessConfirmDisabled,
      openApproveAccessDialog,
      openDeclineAccessDialog,
      closeApproveAccessDialog,
      closeDeclineAccessDialog,
      confirmApproveAccess,
      confirmDeclineAccess,
      showRevokeTimedAccessDialog,
      revokeTimedAccessBulkMode,
      revokeTimedAccessPendingIds,
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
          title="Access requests"
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
          <div class="flex w-full min-w-0 items-center justify-between mb-4 pt-6">
            <SelectButton
              v-model="activeRequestQueueSubTab"
              :options="requestQueueSubTabOptions"
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
              :show-save-view-button="true"
              :show-add-new-view="true"
              :saved-views="savedViews"
              :default-views="requestQueueDefaultViews"
              :selected-view-id="selectedViewId"
              :show-save-view-panel="showSaveViewPanel"
              :save-view-panel-mode="saveViewPanelMode"
              :editing-view-name="editingViewName"
              :editing-view-is-private="editingViewIsPrivate"
              :active-filters="appliedFilters"
              :export-options="exportOptions"
              @filter-remove="handleFilterRemove"
              @clear-all="handleFilterClearAll"
              @search="handleSearch"
              @filter="handleFilter"
              @refresh="handleRefresh"
              @export-select="handleExportSelect"
              @save-view="handleSaveView"
              @add-new-view="handleAddNewView"
              @save-view-submit="handleSaveViewSubmit"
              @save-view-cancel="handleSaveViewCancel"
              @view-select="handleViewSelect"
              @view-favorite="handleViewFavorite"
              @view-unfavorite="handleViewUnfavorite"
              @view-edit="handleViewEdit"
              @view-delete="handleViewDelete"
            >
              <template #right-section>
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
                <!-- Error state -->
                <div
                  v-if="data.status === 'Error'"
                  class="flex max-w-2xl items-start gap-3 rounded-lg border border-error-base/30 bg-feedback-error-surface p-4"
                >
                  <ExclamationTriangleIcon class="size-6 shrink-0 text-error-base" aria-hidden="true" />
                  <p class="text-body-md text-neutral-base">
                    {{ data.errorReason || 'This request encountered an error and must be re-requested by the end user after the workflow configuration is corrected.' }}
                  </p>
                </div>

                <div v-if="data.status !== 'Error'" class="flex max-w-4xl flex-col gap-6">
                <div class="flex items-center gap-3">
                  <div class="size-8 shrink-0 rounded flex items-center justify-center bg-info-surface border border-info-base/20">
                    <span class="text-body-sm font-bold text-info-base">{{ data.name?.charAt(0) || '?' }}</span>
                  </div>
                  <div class="flex flex-col gap-1 min-w-0">
                    <span class="text-heading-4 text-neutral-base">{{ data.approvalTitle }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-20 sm:gap-y-5">
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Requester</span>
                    <LinkText :label="data.requester" href="#" class="text-body-md" />
                  </div>
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Manager</span>
                    <LinkText :label="data.manager" href="#" class="text-body-md" />
                  </div>
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Access group</span>
                    <LinkText :label="data.accessGroup" href="#" class="text-body-md" />
                  </div>
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Request expires</span>
                    <span class="text-body-md text-neutral-base">30 days from submission if not completed</span>
                  </div>
                  <div class="flex min-w-0 flex-col gap-1 sm:col-span-2">
                    <span class="text-body-md-semi-bold text-neutral-base">Reason for Request</span>
                    <span class="text-body-md text-neutral-base">{{ data.reasonForRequest }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-4 border-t border-neutral-default_solid pt-6">
                  <span class="text-body-md-semi-bold text-neutral-base">Approval progress</span>
                  <template v-if="data.approvalSteps?.length">
                    <div
                      v-for="(step, idx) in data.approvalSteps"
                      :key="idx"
                      class="flex items-start gap-3"
                    >
                      <div
                        class="flex shrink-0 items-center justify-center rounded-full border-2"
                        :class="[
                          step.type === 'pending' ? 'h-[22px] w-[22px]' : 'size-6',
                          step.type === 'approved'
                            ? 'border-success-base bg-success-base'
                            : step.type === 'declined'
                              ? 'border-error-base bg-error-base'
                              : 'border-warning-base bg-transparent',
                        ]"
                      >
                        <CheckCircleIcon
                          v-if="step.type === 'approved'"
                          class="size-4 text-neutral-ghost"
                          aria-hidden="true"
                        />
                        <XCircleIcon
                          v-else-if="step.type === 'declined'"
                          class="size-4 text-neutral-ghost"
                          aria-hidden="true"
                        />
                        <EllipsisHorizontalIcon
                          v-else
                          class="h-[16px] w-[16px] shrink-0 text-warning-base"
                          aria-hidden="true"
                        />
                      </div>
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-body-md text-neutral-base">{{ step.approver }}</span>
                        <span class="text-body-sm text-neutral-subtle">{{ step.roleLabel }} — {{ step.status }}</span>
                      </div>
                    </div>
                  </template>
                  <div v-else class="flex items-start gap-3">
                    <div
                      class="flex shrink-0 items-center justify-center rounded-full border-2"
                      :class="[
                        data.status === 'Pending' ? 'h-[22px] w-[22px]' : 'size-6',
                        data.status === 'Granted' || data.status === 'Approved'
                          ? 'border-success-base bg-success-base'
                          : data.status === 'Declined'
                            ? 'border-error-base bg-error-base'
                            : data.status === 'Expired'
                              ? 'border-neutral-default_solid bg-transparent'
                              : 'border-warning-base bg-transparent',
                      ]"
                    >
                      <CheckCircleIcon
                        v-if="data.status === 'Granted' || data.status === 'Approved'"
                        class="size-4 text-neutral-ghost"
                        aria-hidden="true"
                      />
                      <XCircleIcon
                        v-else-if="data.status === 'Declined'"
                        class="size-4 text-neutral-ghost"
                        aria-hidden="true"
                      />
                      <XCircleIcon
                        v-else-if="data.status === 'Expired'"
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

                <div
                  v-if="data.status === 'Pending' && data.approvalRoute === 'administrator'"
                  class="flex gap-sm border-t border-neutral-default_solid pt-4"
                >
                  <Button
                    label="Decline access"
                    severity="danger"
                    variant="outlined"
                    @click="openDeclineAccessDialog(data.id)"
                  />
                  <Button label="Approve access" @click="openApproveAccessDialog(data.id)" />
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
            <div class="shrink-0 w-full min-w-0 pb-4">
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
                <template #right-section>
                  <span class="text-body-sm text-neutral-subtle">Last refreshed a minute ago</span>
                </template>
              </DataTableToolbar>
            </div>

            <div :class="listPageTableSectionClass" class="relative">
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
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-4"
              >
                <div
                  v-if="timedAccessSelection.length > 0"
                  class="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
                >
                  <ActionsToolbar
                    :actions="activeSessionBulkActions"
                    :selected-items="timedAccessToolbarSelectedItems"
                    :selection-label="timedAccessSelection.length === 1 ? 'Item selected' : 'Items selected'"
                    @action="applyTimedAccessBulkAction"
                    @deselect="handleTimedAccessDeselect"
                    @close="clearTimedAccessSelection"
                  />
                </div>
              </Transition>
            </div>
          </template>

          <template v-else-if="activeSessionsSubTab === 'device-admin'">
            <div class="shrink-0 w-full min-w-0 pb-4">
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
                <template #right-section>
                  <span class="text-body-sm text-neutral-subtle">Last refreshed a minute ago</span>
                </template>
              </DataTableToolbar>
            </div>

            <div :class="listPageTableSectionClass" class="relative">
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
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-4"
              >
                <div
                  v-if="deviceAdminSelection.length > 0"
                  class="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
                >
                  <ActionsToolbar
                    :actions="activeSessionBulkActions"
                    :selected-items="deviceAdminToolbarSelectedItems"
                    :selection-label="deviceAdminSelection.length === 1 ? 'Item selected' : 'Items selected'"
                    @action="applyDeviceAdminBulkAction"
                    @deselect="handleDeviceAdminDeselect"
                    @close="clearDeviceAdminSelection"
                  />
                </div>
              </Transition>
            </div>
          </template>
        </div>

        <div v-else-if="activeMainTab === 'approval-flows'" class="relative flex min-h-0 min-w-0 w-full flex-1 flex-col items-stretch overflow-y-auto bg-neutral-surface px-6 pb-6">
          <div class="flex shrink-0 w-full min-w-0 items-start gap-sm pt-6 pb-4">
            <div class="flex shrink-0 items-start pt-0.5">
              <Button
                label="Add flow"
                aria-haspopup="true"
                aria-label="Add flow"
                @click="toggleAddApprovalFlowMenu"
              >
                <template #icon="iconProps">
                  <PlusIcon :class="iconProps?.class" aria-hidden="true" />
                </template>
              </Button>
              <Menu ref="addApprovalFlowMenuRef" :model="addApprovalFlowMenuItems" :popup="true" />
            </div>
            <div class="min-w-0 flex-1">
              <DataTableToolbar
                search-placeholder="Search"
                :show-add-button="false"
                :show-filter-button="true"
                :show-refresh-button="false"
                :show-columns-button="false"
                :show-download-button="false"
                :show-save-view-button="false"
                :active-filters="appliedApprovalFlowFilters"
                :max-visible-filters="5"
                @search="handleApprovalFlowSearch"
                @filter="handleApprovalFlowFilter"
                @filter-remove="handleApprovalFlowFilterRemove"
                @clear-all="clearAllApprovalFlowFilters"
              />
            </div>
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
                <p v-if="data.flowType === 'Device admin'" class="text-body-md text-neutral-base">
                  Device admin flows are approved by administrators.
                </p>
                <p v-else-if="data.expansionDescription" class="text-body-md text-neutral-base">
                  {{ data.expansionDescription }}
                </p>
                <p v-else class="text-body-md text-neutral-subtle">
                  Approval flow configuration for <span class="text-body-md-semi-bold text-neutral-base">{{ data.name }}</span>
                </p>
                <div v-if="data.configurationSteps?.length" class="flex flex-col gap-3">
                  <span class="text-body-md-semi-bold text-neutral-base">Approval configuration</span>
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

          <FilterModal
            v-model:visible="showApprovalFlowFilterModal"
            :basic-filters="approvalFlowBasicFilters"
            :applied-filters="approvalFlowFilterModalAppliedFilters"
            @apply="handleApprovalFlowFilterApply"
            @clear-all="handleApprovalFlowFilterClearAll"
          />
        </div>

        </div>
      </div>

      <Dialog
        v-model:visible="showDisableApprovalFlowDialog"
        :draggable="false"
        modal
        header="Disable approval flow"
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
              label="Disable flow"
              severity="danger"
              variant="outlined"
              @click="confirmDisableApprovalFlow"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showApproveAccessDialog"
        :draggable="false"
        modal
        header="Approve access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <p class="text-body-md text-neutral-base">
            <span class="text-body-md-semi-bold">{{ pendingAccessRequest?.requester }}</span>
            will be given access to
            <span class="text-body-md-semi-bold">{{ approveAccessResourceName }}</span>
            via the
            <span class="text-body-md-semi-bold">{{ pendingAccessRequest?.accessGroup }}</span>
            user group.
          </p>

          <FormField label="Request expires">
            <template #default>
              <span class="text-body-md text-neutral-base">
                Incomplete requests expire 30 days from submission (by {{ requestExpiryLabel }}).
              </span>
            </template>
          </FormField>

          <FormField label="Message to requester (optional)">
            <template #default="{ inputId }">
              <Textarea
                :id="inputId"
                v-model="approveAccessMessage"
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
              @click="closeApproveAccessDialog"
            />
            <Button label="Approve access" @click="confirmApproveAccess" />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showDeclineAccessDialog"
        :draggable="false"
        modal
        header="Decline access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <p class="text-body-md text-neutral-base">
            <span class="text-body-md-semi-bold">{{ pendingAccessRequest?.requester }}</span>
            will not be given access to
            <span class="text-body-md-semi-bold">{{ approveAccessResourceName }}.</span>
          </p>

          <FormField
            label="Reason"
            required
            helpText="Reason for decline will be provided to the requester."
          >
            <template #default="{ inputId }">
              <Textarea
                :id="inputId"
                v-model="declineAccessReason"
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
                v-model="declineAccessInternalNotes"
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
              @click="closeDeclineAccessDialog"
            />
            <Button
              label="Decline access"
              severity="danger"
              variant="outlined"
              :disabled="declineAccessConfirmDisabled"
              @click="confirmDeclineAccess"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showRevokeTimedAccessDialog"
        :draggable="false"
        modal
        header="Revoke access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <p v-if="revokeTimedAccessBulkMode" class="text-body-md text-neutral-base">
          Are you sure you want to revoke the timed access sessions for the
          <span class="text-body-md-semi-bold">{{ revokeTimedAccessPendingIds.length }}</span>
          selected items?
        </p>
        <p v-else class="text-body-md text-neutral-base">
          Are you sure you want to revoke the timed access session for
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
        header="Revoke access"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <p v-if="revokeDeviceAdminBulkMode" class="text-body-md text-neutral-base">
          Are you sure you want to revoke the device admin sessions for the
          <span class="text-body-md-semi-bold">{{ revokeDeviceAdminSelectedUserCount }}</span>
          selected users?
        </p>
        <p v-else class="text-body-md text-neutral-base">
          Are you sure you want to revoke the device admin session for
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

export default AccessRequestsListPage;
export { AccessRequestsListPage };
