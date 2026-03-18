import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent, h, computed } from 'vue';
import {
  AppNavigation,
  PageHeader,
  DataTable,
  DataTableToolbar,
  DataTableCellLink,
  DataTableCellText,
  RadioButtonWithLabel,
  LinkText,
  FormField,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Menu from 'primevue/menu';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Tag from 'primevue/tag';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';

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
  PlusIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline';

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

import TopBar from '../../../../components/TopBar.vue';

// ── Navigation ──
const menuItems = [
  { label: 'Get Started', leftIcon: markRaw(RocketLaunchIcon) },
  { label: 'Home', leftIcon: markRaw(HomeIcon) },
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
    items: [{ label: 'Reports' }, { label: 'Directory Insights' }],
  },
  {
    label: 'Workflows',
    leftIcon: markRaw(WorkflowIcon as object),
    items: [{ label: 'Overview' }, { label: 'Templates' }],
  },
  {
    label: 'Settings',
    leftIcon: markRaw(Cog6ToothIcon),
    items: [{ label: 'Organization' }, { label: 'Connectors' }],
  },
  { label: 'Alert', leftIcon: markRaw(BellIcon), count: 23, isNew: true },
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
      { label: 'Logout', rightIcon: markRaw(ArrowRightStartOnRectangleIcon) },
      { separator: true },
      { label: 'Change Password' },
      { label: 'Launch User Portal', rightIcon: markRaw(ArrowTopRightOnSquareIcon) },
      { separator: true },
      { label: 'Billing' },
      { label: 'My API Key' },
      { separator: true },
      { label: 'Use Old Navigation', itemType: 'button' },
    ],
  },
];

// ── Page tabs ──
const pageTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Stats', value: 'stats' },
];

// ── DI event data ──
interface DiEvent {
  id: string;
  label: string;
  description: string;
  category: string;
}

const diEventsByCategory: Record<string, DiEvent[]> = {
  users: [
    { id: 'user_suspended', label: 'User Suspended', description: 'A user account has been suspended.', category: 'users' },
    { id: 'user_reinstated', label: 'User reinstated', description: 'A previously suspended user account has been reactivated.', category: 'users' },
    { id: 'password_reset', label: 'Password reset', description: 'A user has successfully changed their account password.', category: 'users' },
    { id: 'mfa_enabled', label: 'Two-factor authentication enabled', description: 'User has activated two-factor authentication for added security.', category: 'users' },
    { id: 'group_modified', label: 'Group membership modified', description: "User's group membership has been updated to reflect new access rights.", category: 'users' },
    { id: 'user_created', label: 'User created', description: 'A new user account has been created in the directory.', category: 'users' },
  ],
  devices: [
    { id: 'device_enrolled', label: 'Device enrolled', description: 'A new device has been enrolled in JumpCloud management.', category: 'devices' },
    { id: 'device_unenrolled', label: 'Device unenrolled', description: 'A device has been removed from JumpCloud management.', category: 'devices' },
    { id: 'policy_applied', label: 'Policy applied to device', description: 'A configuration policy has been applied to a managed device.', category: 'devices' },
    { id: 'agent_updated', label: 'Agent updated', description: 'The JumpCloud agent was updated on a device.', category: 'devices' },
  ],
  ldap: [
    { id: 'ldap_bind', label: 'LDAP bind attempt', description: 'An LDAP bind operation was attempted on the directory.', category: 'ldap' },
    { id: 'ldap_search', label: 'LDAP search query', description: 'An LDAP search query was executed against the directory.', category: 'ldap' },
  ],
  mdm: [
    { id: 'mdm_profile_installed', label: 'MDM profile installed', description: 'An MDM configuration profile was installed on a device.', category: 'mdm' },
    { id: 'mdm_command_sent', label: 'MDM command sent', description: 'An MDM command was sent to a managed device.', category: 'mdm' },
    { id: 'mdm_enrolled', label: 'MDM enrollment complete', description: 'A device successfully completed MDM enrollment.', category: 'mdm' },
  ],
  saas: [
    { id: 'saas_licensed', label: 'SaaS application licensed', description: 'A license was assigned to a user for a SaaS application.', category: 'saas' },
    { id: 'saas_access_revoked', label: 'SaaS access revoked', description: "A user's access to a SaaS application has been revoked.", category: 'saas' },
    { id: 'saas_app_added', label: 'SaaS application added', description: 'A new SaaS application was connected to JumpCloud.', category: 'saas' },
  ],
};

const allDiEvents: DiEvent[] = Object.values(diEventsByCategory).flat();

const diEventTabs = [
  { label: 'All', value: 'all' },
  { label: 'Users', value: 'users' },
  { label: 'Devices', value: 'devices' },
  { label: 'LDAP', value: 'ldap' },
  { label: 'MDM', value: 'mdm' },
  { label: 'SaaS Management', value: 'saas' },
];

// ── Custom table cells ──
const TypeCell = markRaw(defineComponent({
  name: 'TypeCell',
  props: { data: { type: Object, default: () => ({}) } },
  setup(props) {
    return () => {
      const type = props.data?.type as string;
      const isEvent = type === 'Event';
      return h('div', { class: 'flex items-center gap-1.5 p-2 min-h-12' }, [
        h(isEvent ? BoltIcon : CalendarDaysIcon, { class: 'size-4 text-neutral-subtle shrink-0' }),
        h('span', { class: 'text-body-md text-neutral-base' }, type),
      ]);
    };
  },
}));

const StatusCell = markRaw(defineComponent({
  name: 'StatusCell',
  props: { data: { type: Object, default: () => ({}) } },
  setup(props) {
    return () => {
      const status = props.data?.status as string;
      const isEnabled = status === 'Enabled';
      return h('div', { class: 'flex items-center gap-1.5 p-2 min-h-12' }, [
        h(isEnabled ? CheckCircleIcon : XCircleIcon, {
          class: isEnabled ? 'size-5 text-icon-success-base shrink-0' : 'size-5 text-icon-error-base shrink-0',
        }),
        h('span', { class: 'text-body-md text-neutral-base' }, status),
      ]);
    };
  },
}));

// ── Column definitions ──
const workflowColumns = [
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    width: '280px',
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.name,
      description: sp.data.description,
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
    componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.lastRan, size: 'default' }),
  },
  {
    field: 'status',
    header: 'Status',
    width: '150px',
    component: StatusCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'lastEdited',
    header: 'Last edited',
    sortable: true,
    width: '150px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.lastEdited, size: 'default' }),
  },
  {
    field: 'createdBy',
    header: 'Created by',
    sortable: true,
    width: '180px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.createdBy, size: 'default' }),
  },
];

// ── Workflow data ──
const workflowData = [
  { name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '3 hours ago', createdBy: 'Ricardo Diaz' },
  { name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '1 hour ago', createdBy: 'Aiden Pearce' },
  { name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 day ago', createdBy: 'Lacey Bennett' },
  { name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '5 hours ago', createdBy: 'Arthur Morgan' },
  { name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '5 hours ago', createdBy: 'Omar Little' },
  { name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 week ago', createdBy: 'Marlo Stanfield' },
  { name: 'Idle Device Purge', description: 'Compliance Check', type: 'Schedule', lastRan: '1 hour ago', status: 'Disabled', lastEdited: '3 days ago', createdBy: 'Stringer Bell' },
  { name: 'Low Disk Space Alert', description: 'A brief summary of the alert', type: 'Event', lastRan: '1 hour ago', status: 'Enabled', lastEdited: '1 month ago', createdBy: 'Tommy Vercetti' },
];

// ── Component ──
const DiEventsPage = defineComponent({
  name: 'DiEventsPage',
  components: {
    AppNavigation,
    PageHeader,
    CircuitDataTable: DataTable,
    DataTableToolbar,
    RadioButtonWithLabel,
    RadioButtonGroup,
    LinkText,
    FormField,
    TopBar,
    PvButton: Button,
    PvDialog: Dialog,
    PvDivider: Divider,
    PvInputText: InputText,
    PvIconField: IconField,
    PvInputIcon: InputIcon,
    PvMenu: Menu,
    PvStepper: Stepper,
    PvStepList: StepList,
    PvStep: Step,
    PvStepPanels: StepPanels,
    PvStepPanel: StepPanel,
    PvTag: Tag,
    PvTabs: Tabs,
    PvTabList: TabList,
    PvTab: Tab,
    XMarkIcon,
    BoltIcon,
    WrenchScrewdriverIcon,
    CalendarDaysIcon,
    PlusIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
  },
  setup() {
    const activePageTab = ref('overview');
    const showDialog = ref(true);
    const currentStep = ref('1');

    // Step 1 state
    const workflowType = ref('event');

    // Step 2 state
    const diEventTab = ref('all');
    const diEventSearch = ref('');
    const selectedDiEventId = ref('');
    const manualEventId = ref('');

    // Step 3 state
    const workflowName = ref('');
    const workflowDescription = ref('');

    // Add dropdown menu
    const addMenuRef = ref<InstanceType<typeof Menu> | null>(null);
    const addDropdownItems = [
      {
        label: 'New Workflow',
        command: () => {
          currentStep.value = '1';
          workflowType.value = 'event';
          diEventTab.value = 'all';
          diEventSearch.value = '';
          selectedDiEventId.value = '';
          manualEventId.value = '';
          workflowName.value = '';
          workflowDescription.value = '';
          showDialog.value = true;
        },
      },
      { label: 'Use template', command: () => {} },
    ];

    const selectedWorkflows = ref([]);

    // Filtered DI events based on tab + search
    const filteredDiEvents = computed<DiEvent[]>(() => {
      const base: DiEvent[] =
        diEventTab.value === 'all' ? allDiEvents : (diEventsByCategory[diEventTab.value] ?? []);
      const q = diEventSearch.value.toLowerCase().trim();
      if (!q) return base;
      return base.filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      );
    });

    function nextStep() {
      const order = ['1', '2', '3'];
      const idx = order.indexOf(currentStep.value);
      if (idx < order.length - 1) {
        currentStep.value = order[idx + 1];
      } else {
        showDialog.value = false;
      }
    }

    function prevStep() {
      const order = ['1', '2', '3'];
      const idx = order.indexOf(currentStep.value);
      if (idx > 0) currentStep.value = order[idx - 1];
    }

    const nextLabel = computed(() => (currentStep.value === '3' ? 'Save' : 'Next'));
    const nextDisabled = computed(() => {
      if (currentStep.value === '1') return !workflowType.value;
      if (currentStep.value === '2') return !selectedDiEventId.value && !manualEventId.value;
      if (currentStep.value === '3') return !workflowName.value.trim();
      return false;
    });

    return {
      menuItems,
      profileMenuItems,
      pageTabs,
      activePageTab,
      workflowColumns,
      workflowData,
      showDialog,
      currentStep,
      workflowType,
      diEventTabs,
      diEventTab,
      diEventSearch,
      selectedDiEventId,
      filteredDiEvents,
      manualEventId,
      workflowName,
      workflowDescription,
      selectedWorkflows,
      addMenuRef,
      addDropdownItems,
      nextStep,
      prevStep,
      nextLabel,
      nextDisabled,
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
            :tabs="pageTabs"
            v-model:activeTab="activePageTab"
            class="shrink-0"
          />

          <!-- Overview tab -->
          <div
            v-if="activePageTab === 'overview'"
            class="flex-[1_1_0] flex flex-col min-h-0 bg-neutral-surface"
          >
            <!-- Toolbar with custom Add dropdown -->
            <div class="shrink-0 px-6">
              <DataTableToolbar
                searchPlaceholder="Search"
                :showFilterButton="true"
                :showRefreshButton="true"
                :showColumnsButton="false"
                :showDownloadButton="false"
                :showAddButton="false"
              >
                <template #add-button>
                  <div class="flex items-center">
                    <PvButton label="Add" @click="addMenuRef && addMenuRef.toggle($event)">
                      <template #icon="iconProps">
                        <PlusIcon :class="iconProps.class" />
                      </template>
                    </PvButton>
                    <PvMenu ref="addMenuRef" :model="addDropdownItems" popup />
                  </div>
                </template>
              </DataTableToolbar>
            </div>

            <!-- Table -->
            <div class="flex-[1_1_0] flex flex-col min-h-0 px-6">
              <CircuitDataTable
                :columns="workflowColumns"
                :data="workflowData"
                selectionMode="multiple"
                :selection="selectedWorkflows"
                @update:selection="selectedWorkflows = $event"
                :scrollable="true"
                scrollHeight="flex"
                :pt="{
                  root: { style: 'flex: 1 1 0; min-height: 0; height: 100%;' },
                  tableContainer: { style: 'flex: 1 1 0; min-height: 0; height: 100%;' },
                }"
                :ptOptions="{ mergeSections: true, mergeProps: true }"
              />
            </div>
          </div>

          <!-- Stats tab placeholder -->
          <div
            v-if="activePageTab === 'stats'"
            class="flex-[1_1_0] flex items-center justify-center bg-neutral-surface"
          >
            <p class="text-body-lg text-neutral-subtle">Stats content coming soon</p>
          </div>
        </div>
      </div>

      <!-- ───── New Workflow Dialog ───── -->
      <PvDialog
        v-model:visible="showDialog"
        :draggable="false"
        modal
        header="New Workflow"
        :style="{ width: '600px' }"
      >
        <template #closeicon><XMarkIcon /></template>

        <!-- Step indicator -->
        <PvStepper :value="currentStep" :linear="true" class="-mx-md -mt-md">
          <PvStepList>
            <PvStep value="1">Select Workflow Type</PvStep>
            <PvStep value="2">Trigger Details</PvStep>
            <PvStep value="3">Workflow Details</PvStep>
          </PvStepList>
          <PvStepPanels class="px-0 py-0">

            <!-- ── STEP 1: Select Workflow Type ── -->
            <PvStepPanel value="1">
              <div class="flex flex-col gap-md pt-md">
                <RadioButtonWithLabel
                  v-model="workflowType"
                  value="manual"
                  name="workflowType"
                >
                  <template #label>
                    <div class="flex items-center gap-sm">
                      <WrenchScrewdriverIcon class="w-5 h-5 text-neutral-subtle shrink-0" />
                      <span class="text-body-md-bold">Manual</span>
                    </div>
                  </template>
                  <template #description>Run customized workflows based on manual input.</template>
                </RadioButtonWithLabel>

                <RadioButtonWithLabel
                  v-model="workflowType"
                  value="event"
                  name="workflowType"
                >
                  <template #label>
                    <div class="flex items-center gap-sm">
                      <BoltIcon class="w-5 h-5 text-neutral-subtle shrink-0" />
                      <span class="text-body-md-bold">Event</span>
                    </div>
                  </template>
                  <template #description>Create workflows triggered by DI events.</template>
                </RadioButtonWithLabel>

                <RadioButtonWithLabel
                  v-model="workflowType"
                  value="schedule"
                  name="workflowType"
                >
                  <template #label>
                    <div class="flex items-center gap-sm">
                      <CalendarDaysIcon class="w-5 h-5 text-neutral-subtle shrink-0" />
                      <span class="text-body-md-bold">Schedule</span>
                    </div>
                  </template>
                  <template #description>Schedule workflows to run automatically at specified times.</template>
                </RadioButtonWithLabel>
              </div>
            </PvStepPanel>

            <!-- ── STEP 2: Trigger Details (DI event selection) ── -->
            <PvStepPanel value="2">
              <div class="flex flex-col gap-md pt-md">
                <h3 class="text-heading-3 text-neutral-base">Select DI event</h3>

                <!-- Category tabs (no padding, flush with dialog edges via -mx) -->
                <PvTabs
                  :value="diEventTab"
                  @update:value="diEventTab = $event; selectedDiEventId = ''"
                  class="-mx-md"
                >
                  <PvTabList withPadding>
                    <PvTab
                      v-for="tab in diEventTabs"
                      :key="tab.value"
                      :value="tab.value"
                    >{{ tab.label }}</PvTab>
                  </PvTabList>
                </PvTabs>

                <!-- Search (below the tabs, as specified) -->
                <PvIconField>
                  <PvInputIcon>
                    <MagnifyingGlassIcon class="w-5 h-5" />
                  </PvInputIcon>
                  <PvInputText
                    v-model="diEventSearch"
                    placeholder="Search"
                    class="w-full"
                  />
                </PvIconField>

                <!-- Event list -->
                <div class="flex flex-col gap-sm max-h-52 overflow-y-auto pr-1">
                  <RadioButtonWithLabel
                    v-for="event in filteredDiEvents"
                    :key="event.id"
                    v-model="selectedDiEventId"
                    :value="event.id"
                    name="diEvent"
                  >
                    <template #label>
                      <span class="text-body-md-bold">{{ event.label }}</span>
                    </template>
                    <template #description>{{ event.description }}</template>
                  </RadioButtonWithLabel>

                  <div
                    v-if="filteredDiEvents.length === 0"
                    class="py-6 text-center text-body-md text-neutral-subtle"
                  >
                    No events match your search.
                  </div>
                </div>

                <PvDivider class="my-0" />

                <!-- Manual event ID entry -->
                <div class="flex flex-col gap-sm">
                  <p class="text-body-md-bold text-neutral-base">
                    Can't find the event? Enter the DI event ID manually.
                  </p>
                  <p class="text-body-md text-neutral-subtle">
                    You can find event IDs in the Directory Insights page.
                    <LinkText
                      href="https://console.jumpcloud.com/directory-insights"
                      target="_blank"
                      label="Learn more"
                    />
                  </p>
                  <FormField label="DI Event ID" class="w-full">
                    <template #default="{ inputId }">
                      <PvInputText
                        :id="inputId"
                        v-model="manualEventId"
                        placeholder="e.g. user_suspended"
                        class="w-full"
                        :disabled="!!selectedDiEventId"
                      />
                    </template>
                  </FormField>
                </div>
              </div>
            </PvStepPanel>

            <!-- ── STEP 3: Workflow Details ── -->
            <PvStepPanel value="3">
              <div class="flex flex-col gap-md pt-md">
                <h3 class="text-heading-3 text-neutral-base">Workflow Details</h3>
                <p class="text-body-md text-neutral-subtle">
                  Provide a name and description for your new workflow.
                </p>
                <FormField label="Workflow Name" class="w-full">
                  <template #default="{ inputId }">
                    <PvInputText
                      :id="inputId"
                      v-model="workflowName"
                      placeholder="e.g. Suspend User on MFA Disable"
                      class="w-full"
                    />
                  </template>
                </FormField>
                <FormField label="Description" class="w-full">
                  <template #default="{ inputId }">
                    <PvInputText
                      :id="inputId"
                      v-model="workflowDescription"
                      placeholder="Optional description"
                      class="w-full"
                    />
                  </template>
                </FormField>

                <!-- Selected trigger summary -->
                <div class="rounded-lg border border-neutral-default_solid bg-neutral-surface p-md flex flex-col gap-xs">
                  <p class="text-body-sm text-neutral-subtle uppercase tracking-wide">Trigger</p>
                  <div class="flex items-center gap-sm">
                    <BoltIcon class="w-4 h-4 text-neutral-subtle shrink-0" />
                    <span class="text-body-md-bold text-neutral-base">
                      {{ selectedDiEventId || manualEventId || '—' }}
                    </span>
                    <PvTag value="DI Event" severity="info" />
                  </div>
                </div>
              </div>
            </PvStepPanel>

          </PvStepPanels>
        </PvStepper>

        <!-- Dialog footer -->
        <template #footer>
          <div class="flex items-center w-full"></div>
          <div class="flex gap-sm">
            <PvButton
              label="Cancel"
              severity="secondary"
              variant="text"
              @click="showDialog = false"
            />
            <PvButton
              v-if="currentStep !== '1'"
              label="Previous"
              severity="secondary"
              variant="outlined"
              @click="prevStep"
            />
            <PvButton
              :label="nextLabel"
              :disabled="nextDisabled"
              @click="nextStep"
            />
          </div>
        </template>
      </PvDialog>
    </div>
  `,
});

const meta: Meta<typeof DiEventsPage> = {
  title: 'Projects/Bala Playground/Pages/DI Events',
  component: DiEventsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DiEventsPage>;

export const Default: Story = {};
