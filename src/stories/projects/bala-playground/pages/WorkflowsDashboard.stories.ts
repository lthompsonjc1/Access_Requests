/**
 * WorkflowsDashboard — Vue + Circuit DS version (converted from React).
 *
 * Features:
 *  - Full dashboard layout: AppNavigation, TopBar, PageHeader, DataTable
 *  - isEmpty toggle to preview the empty-state illustration + Create CTA
 *  - Add Workflow modal with Name, Type (Event / Schedule), and Status toggle
 *  - All mock data sourced from the reference design
 */

import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent, computed, h } from 'vue';
import {
  AppNavigation,
  PageHeader,
  DataTable,
  DataTableToolbar,
  DataTableCellLink,
  DataTableCellText,
  ToggleSwitch,
  RadioButtonWithLabel,
  FormField,
  Dropdown,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import RadioButtonGroup from 'primevue/radiobuttongroup';
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
  CalendarDaysIcon,
  XMarkIcon,
  PlusIcon,
  DocumentDuplicateIcon,
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

// ── Types ─────────────────────────────────────────────────────────────────
type WorkflowType = 'Event' | 'Schedule';
type WorkflowStatus = 'Enabled' | 'Disabled';

interface Workflow {
  id: number;
  name: string;
  description: string;
  type: WorkflowType;
  lastRan: string;
  status: WorkflowStatus;
  lastEdited: string;
  createdBy: string;
}

// ── Navigation items ─────────────────────────────────────────────────────
const menuItems = [
  { label: 'Get Started', leftIcon: markRaw(RocketLaunchIcon) },
  { label: 'Home', leftIcon: markRaw(HomeIcon) },
  { label: 'Alert', leftIcon: markRaw(BellIcon), count: 23, isNew: true },
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

// ── Initial workflow data ────────────────────────────────────────────────
const INITIAL_WORKFLOWS: Workflow[] = [
  { id: 1, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '3 hours ago', createdBy: 'Ricardo Diaz' },
  { id: 2, name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '1 hour ago', createdBy: 'Aiden Pearce' },
  { id: 3, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 day ago', createdBy: 'Lacey Bennett' },
  { id: 4, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '5 hours ago', createdBy: 'Arthur Morgan' },
  { id: 5, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 week ago', createdBy: 'Dutch Van Der Linde' },
  { id: 6, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '3 days ago', createdBy: 'Micah Bell' },
  { id: 7, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 month ago', createdBy: 'Sadie Adler' },
  { id: 8, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 week ago', createdBy: 'Charles Smith' },
  { id: 9, name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '5 hours ago', createdBy: 'Omar Little' },
  { id: 10, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 week ago', createdBy: 'Marlo Stanfield' },
  { id: 11, name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '3 days ago', createdBy: 'Stringer Bell' },
  { id: 12, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 month ago', createdBy: 'Tommy Vercetti' },
  { id: 13, name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '1 week ago', createdBy: 'Carl Johnson' },
  { id: 14, name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '3 hours ago', createdBy: 'Niko Bellic' },
  { id: 15, name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '1 day ago', createdBy: 'John Marston' },
];

// ── Custom cell: Type (Event / Schedule with icon) ─────────────────────────
const TypeCell = markRaw(
  defineComponent({
    name: 'TypeCell',
    props: { data: { type: Object, default: () => ({}) } },
    setup(props) {
      return () => {
        const type = (props.data as Workflow)?.type;
        const isEvent = type === 'Event';
        return h(
          'div',
          { class: 'flex items-center gap-xs p-2 min-h-12' },
          h(isEvent ? BoltIcon : CalendarDaysIcon, { class: 'size-4 text-neutral-subtle shrink-0' }),
          h('span', { class: 'text-body-md text-neutral-base' }, type),
        );
      };
    },
  }),
);

// ── Custom cell: Status toggle ───────────────────────────────────────────
const StatusToggleCell = markRaw(
  defineComponent({
    name: 'StatusToggleCell',
    props: { data: { type: Object, default: () => ({}) } },
    components: { ToggleSwitch },
    template: `
      <div class="flex items-center gap-sm p-2 min-h-12">
        <ToggleSwitch
          :modelValue="data.status === 'Enabled'"
          @update:modelValue="v => data.status = v ? 'Enabled' : 'Disabled'"
        />
        <span class="text-body-md text-neutral-base">{{ data.status }}</span>
      </div>
    `,
  }),
);

// ── Column definitions ───────────────────────────────────────────────────
const workflowColumns = [
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    width: '280px',
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: (sp.data as Workflow).name,
      description: (sp.data as Workflow).description,
      href: '#',
      size: 'default',
    }),
  },
  {
    field: 'type',
    header: 'Type',
    sortable: true,
    width: '140px',
    component: TypeCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'lastRan',
    header: 'Last Ran',
    sortable: true,
    width: '140px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: (sp.data as Workflow).lastRan,
      size: 'default',
    }),
  },
  {
    field: 'status',
    header: 'Status',
    width: '180px',
    component: StatusToggleCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'lastEdited',
    header: 'Last edited',
    sortable: true,
    width: '150px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: (sp.data as Workflow).lastEdited,
      size: 'default',
    }),
  },
  {
    field: 'createdBy',
    header: 'Created by',
    sortable: true,
    width: '180px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: (sp.data as Workflow).createdBy,
      size: 'default',
    }),
  },
];

const savedViews = [
  { id: '1', label: 'Active Workflows', isFavorite: true },
  { id: '2', label: 'Event Triggers', isFavorite: false },
  { id: '3', label: 'Scheduled Workflows', isFavorite: false },
];
const defaultViews = [{ id: 'default-all', label: 'Default', editable: false, deletable: false }];

// ── Component ───────────────────────────────────────────────────────────
const WorkflowsDashboard = defineComponent({
  name: 'WorkflowsDashboard',
  components: {
    AppNavigation,
    PageHeader,
    CircuitDataTable: DataTable,
    DataTableToolbar,
    ToggleSwitch,
    RadioButtonWithLabel,
    RadioButtonGroup,
    FormField,
    TopBar,
    PvButton: Button,
    PvDialog: Dialog,
    PvInputText: InputText,
    CircuitDropdown: Dropdown,
    XMarkIcon,
    PlusIcon,
    DocumentDuplicateIcon,
  },
  setup() {
    const activeTab = ref('overview');
    const selectedViewId = ref('default-all');
    const selectedWorkflows = ref<Workflow[]>([]);

    const workflowData = ref<Workflow[]>(INITIAL_WORKFLOWS.map((w) => ({ ...w })));

    const demoEmpty = ref(false);
    const isEmpty = computed(() => demoEmpty.value || workflowData.value.length === 0);

    const addOptions = [
      { label: 'New Workflow', value: 'new', icon: markRaw(PlusIcon) },
      { label: 'Use template', value: 'template', icon: markRaw(DocumentDuplicateIcon) },
    ];

    const handleAddSelect = (option: { value: string }) => {
      if (option.value === 'new') openAddDialog();
    };

    const showAddDialog = ref(false);
    const newName = ref('');
    const newType = ref<WorkflowType>('Event');
    const newStatus = ref(true);
    const nameError = ref('');

    const openAddDialog = () => {
      newName.value = '';
      newType.value = 'Event';
      newStatus.value = true;
      nameError.value = '';
      showAddDialog.value = true;
    };

    const handleAddWorkflow = () => {
      if (!newName.value.trim()) {
        nameError.value = 'Workflow name is required.';
        return;
      }
      const nextId = Math.max(0, ...workflowData.value.map((w) => w.id)) + 1;
      workflowData.value.unshift({
        id: nextId,
        name: newName.value.trim(),
        description: 'A brief summary of the alert',
        type: newType.value,
        lastRan: 'Never',
        status: newStatus.value ? 'Enabled' : 'Disabled',
        lastEdited: 'Just now',
        createdBy: 'You',
      });
      if (demoEmpty.value) demoEmpty.value = false;
      showAddDialog.value = false;
    };

    const tabs = [
      { label: 'Overview', value: 'overview' },
      { label: 'Stats', value: 'stats' },
    ];

    return {
      menuItems,
      profileMenuItems,
      tabs,
      activeTab,
      selectedViewId,
      selectedWorkflows,
      workflowColumns,
      workflowData,
      savedViews,
      defaultViews,
      isEmpty,
      demoEmpty,
      addOptions,
      handleAddSelect,
      showAddDialog,
      newName,
      newType,
      newStatus,
      nameError,
      openAddDialog,
      handleAddWorkflow,
      WorkflowIcon: markRaw(WorkflowIcon),
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

      <div class="flex-[1_1_0] flex flex-col min-w-0 w-full h-full self-stretch">
        <TopBar />

        <div class="flex-[1_1_0] flex flex-col min-h-0 h-full w-full">
          <PageHeader
            title="Workflows"
            :tabs="tabs"
            :activeTab="activeTab"
            @update:activeTab="activeTab = $event"
            class="shrink-0"
          />

          <div v-if="activeTab === 'overview'" class="flex-[1_1_0] flex flex-col min-h-0 h-full w-full bg-neutral-surface">
            <div class="shrink-0 px-6 flex items-center">
              <div class="py-4 pr-4 shrink-0">
                <CircuitDropdown
                  label="Add"
                  :options="addOptions"
                  menuWidth="180px"
                  @select="handleAddSelect"
                />
              </div>
              <div class="flex-1 min-w-0">
                <DataTableToolbar
                  searchPlaceholder="Search"
                  :showAddButton="false"
                  :showFilterButton="true"
                  :showRefreshButton="true"
                  :showColumnsButton="true"
                  :showExportButton="true"
                  :showSaveViewButton="true"
                  :savedViews="savedViews"
                  :defaultViews="defaultViews"
                  :selectedViewId="selectedViewId"
                  :showAddNewView="true"
                />
              </div>
            </div>

            <div class="flex justify-end px-6 pb-xs">
              <button
                class="text-body-sm text-neutral-ghost border border-dashed border-neutral-ghost rounded px-sm py-xs hover:text-neutral-subtle hover:border-neutral-subtle transition-colors"
                @click="demoEmpty = !demoEmpty"
              >
                {{ demoEmpty ? '← Back to data' : 'Preview empty state' }}
              </button>
            </div>

            <div v-if="isEmpty" class="flex-[1_1_0] flex flex-col items-center justify-center gap-lg bg-neutral-surface px-md">
              <svg width="148" height="124" viewBox="0 0 148 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="18" y="28" width="112" height="78" rx="8" fill="var(--jc-color-neutral-surface, #f8fafc)" stroke="var(--jc-color-neutral-default-solid, #e2e8f0)" stroke-width="1.5"/>
                <rect x="32" y="44" width="60" height="8" rx="4" fill="var(--jc-color-neutral-ghost, #cbd5e1)"/>
                <rect x="32" y="58" width="84" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid, #e2e8f0)"/>
                <rect x="32" y="68" width="72" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid, #e2e8f0)"/>
                <rect x="32" y="78" width="78" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid, #e2e8f0)"/>
                <circle cx="114" cy="36" r="20" fill="var(--jc-color-brand-primary-base, #0d9488)"/>
                <path d="M107 36h14M114 29v14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <div class="text-center flex flex-col gap-xs">
                <p class="text-heading-4 text-neutral-base">No workflows yet</p>
                <p class="text-body-md text-neutral-subtle max-w-xs">
                  Automate repetitive tasks by creating your first workflow.
                </p>
              </div>
              <PvButton label="Create Workflow" @click="openAddDialog">
                <template #icon>
                  <PlusIcon class="size-4" />
                </template>
              </PvButton>
            </div>

            <div v-else class="flex-[1_1_0] flex flex-col min-h-0 h-full px-6">
              <CircuitDataTable
                :columns="workflowColumns"
                :data="workflowData"
                dataKey="id"
                selectionMode="multiple"
                :selection="selectedWorkflows"
                @update:selection="selectedWorkflows = $event"
                :card="true"
                size="default"
                :scrollable="true"
                scrollHeight="flex"
                :paginator="true"
                :rows="15"
                :rowsPerPageOptions="[
                  { label: '10 Items per page', value: 10 },
                  { label: '15 Items per page', value: 15 },
                  { label: '25 Items per page', value: 25 },
                  { label: '50 Items per page', value: 50 },
                ]"
                :showRowsPerPageOptions="true"
                :showPageReport="true"
                :pt="{
                  root: { style: 'flex: 1 1 0; min-height: 0; height: 100%;' },
                  tableContainer: { style: 'flex: 1 1 0; min-height: 0; height: 100%;' },
                }"
                :ptOptions="{ mergeSections: true, mergeProps: true }"
              />
            </div>
          </div>

          <div v-if="activeTab === 'stats'" class="flex-[1_1_0] overflow-auto min-h-0 p-6 bg-neutral-surface">
            <div class="bg-neutral-base rounded-lg border border-neutral-default_solid p-8 text-center">
              <p class="text-body-lg text-neutral-subtle">Stats content coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <PvDialog
        v-model:visible="showAddDialog"
        :draggable="false"
        modal
        header="Add Workflow"
        :style="{ width: '480px' }"
      >
        <template #closeicon>
          <XMarkIcon class="size-5" />
        </template>
        <div class="flex flex-col gap-md">
          <FormField label="Workflow name" required>
            <template #default="{ inputId }">
              <PvInputText
                :id="inputId"
                v-model="newName"
                placeholder="e.g. Low Disk Space Alert"
                class="w-full"
                @input="nameError = ''"
              />
              <p v-if="nameError" class="text-body-sm text-feedback-error-base mt-xs">{{ nameError }}</p>
            </template>
          </FormField>
          <FormField label="Type" required>
            <template #default>
              <RadioButtonGroup v-model="newType" class="flex-col gap-sm">
                <RadioButtonWithLabel value="Event">
                  <template #label>Event</template>
                  <template #description>Triggered by a system event</template>
                </RadioButtonWithLabel>
                <RadioButtonWithLabel value="Schedule">
                  <template #label>Schedule</template>
                  <template #description>Runs on a set schedule</template>
                </RadioButtonWithLabel>
              </RadioButtonGroup>
            </template>
          </FormField>
          <div class="flex items-center justify-between px-md py-sm rounded-md border border-neutral-default_solid bg-neutral-surface">
            <div class="flex flex-col gap-xs">
              <p class="text-body-md-semi-bold text-neutral-base">Status</p>
              <p class="text-body-sm text-neutral-subtle">
                {{ newStatus ? 'Workflow will run automatically' : 'Workflow is paused' }}
              </p>
            </div>
            <ToggleSwitch v-model="newStatus" />
          </div>
        </div>
        <template #footer>
          <div class="flex items-center w-full"></div>
          <div class="flex gap-sm">
            <PvButton label="Cancel" severity="secondary" variant="text" @click="showAddDialog = false" />
            <PvButton label="Create Workflow" @click="handleAddWorkflow" />
          </div>
        </template>
      </PvDialog>
    </div>
  `,
});

const meta: Meta<typeof WorkflowsDashboard> = {
  title: 'Projects/Bala Playground/Pages/Workflows Dashboard',
  component: WorkflowsDashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof WorkflowsDashboard>;

export const Default: Story = {};
