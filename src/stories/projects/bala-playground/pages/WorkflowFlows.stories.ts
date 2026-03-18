import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent, h, computed, watch, onMounted } from 'vue';
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
  Stepper,
  LinkText,
  CardButton,
  CollapsiblePanel,
  SeverityDialog,
} from '@jumpcloud/circuit/components';
import type { StepDefinition } from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import SelectButton from 'primevue/selectbutton';
import IconField from 'primevue/iconfield';
import Tag from 'primevue/tag';
import InputIcon from 'primevue/inputicon';
import Select from 'primevue/select';
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
  CheckIcon,
  DocumentDuplicateIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PencilIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  ArrowLongRightIcon,
  LockClosedIcon,
  KeyIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';
import { TrashIcon as TrashIconSolid } from '@heroicons/vue/24/solid';

import TopBar from '../../../../components/TopBar.vue';
import { getApiActions, API_ACTION_GROUPS } from '../api-actions';
import type { ApiAction, ActionField } from '../api-actions';

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

// ── Navigation items ──────────────────────────────────────────────────────────
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

// ── Page tabs ─────────────────────────────────────────────────────────────────
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Stats', value: 'stats' },
];

// ── Custom cell: Type ─────────────────────────────────────────────────────────
const TypeCell = markRaw(defineComponent({
  name: 'TypeCell',
  props: { data: { type: Object, default: () => ({}) } },
  setup(props) {
    return () => {
      const type = props.data?.type as string;
      const isEvent = type === 'Event';
      return h('div', { class: 'flex items-center gap-xs p-2 min-h-12' }, [
        h(isEvent ? BoltIcon : CalendarDaysIcon, { class: 'size-4 text-neutral-subtle shrink-0' }),
        h('span', { class: 'text-body-md text-neutral-base' }, type),
      ]);
    };
  },
}));

// ── Custom cell: Status toggle ────────────────────────────────────────────────
const StatusToggleCell = markRaw(defineComponent({
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
}));

// ── Column definitions ────────────────────────────────────────────────────────
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
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.lastRan,
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
      label: sp.data.lastEdited,
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
      label: sp.data.createdBy,
      size: 'default',
    }),
  },
];

// ── Saved views ───────────────────────────────────────────────────────────────
const savedViews = [
  { id: '1', label: 'Active Workflows',    isFavorite: true  },
  { id: '2', label: 'Event Triggers',      isFavorite: false },
  { id: '3', label: 'Scheduled Workflows', isFavorite: false },
];
const defaultViews = [
  { id: 'default-all', label: 'Default', editable: false, deletable: false },
];

// ── Dialog static data ────────────────────────────────────────────────────────
const recentDiEvents = [
  { id: 'user_suspended',   label: 'User Suspended',                    lastOccurred: '2023-10-01 10:00 AM' },
  { id: 'user_group_change',label: 'User group association change',      lastOccurred: '2023-10-01 10:00 AM' },
  { id: 'password_reset',   label: 'Password reset',                    lastOccurred: '2023-10-01 10:00 AM' },
  { id: '2fa_enabled',      label: 'Two-factor authentication enabled', lastOccurred: '2023-10-01 10:00 AM' },
];

const allEventsByType = [
  { id: 'user_suspended',   label: 'User Suspended',                    category: 'users',   description: 'A user account has been suspended.'                            },
  { id: 'user_group_change',label: 'User group association change',      category: 'users',   description: 'A previously suspended user account has been reactivated.'     },
  { id: 'password_reset',   label: 'Password reset',                    category: 'users',   description: 'A user has successfully changed their account password.'        },
  { id: '2fa_enabled',      label: 'Two-factor authentication enabled', category: 'users',   description: 'User has activated two-factor authentication for added security.'},
  { id: 'device_enrolled',  label: 'Device Enrolled',                   category: 'devices', description: 'A new device has been enrolled in the organization.'            },
  { id: 'device_removed',   label: 'Device Removed',                    category: 'devices', description: 'A device has been removed from the organization.'               },
  { id: 'ldap_sync',        label: 'LDAP Sync Completed',               category: 'ldap',    description: 'A directory sync from an LDAP source has completed.'            },
  { id: 'mdm_enrolled',     label: 'MDM Device Enrolled',               category: 'mdm',     description: 'A device was enrolled via MDM.'                                 },
  { id: 'saas_provisioned', label: 'SaaS User Provisioned',             category: 'saas',    description: 'A user was provisioned in a SaaS application.'                  },
];

// ── Workflow detail tabs ──────────────────────────────────────────────────────
const detailTabs = [
  { label: 'Overview',          value: 'overview'           },
  { label: 'Execution history', value: 'execution-history'  },
];

// ── Create Workflow stepper steps ─────────────────────────────────────────────
const createSteps: StepDefinition[] = [
  { value: '1', label: 'Select Workflow Type' },
  { value: '2', label: 'Trigger Details'       },
  { value: '3', label: 'Workflow Details'       },
];

// ── Component ─────────────────────────────────────────────────────────────────
const WorkflowFlows = defineComponent({
  name: 'WorkflowFlows',
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
    PvTextarea: Textarea,
    PvTabs: Tabs,
    PvTabList: TabList,
    PvTab: Tab,
    PvTabPanels: TabPanels,
    PvTabPanel: TabPanel,
    PvSelect: Select,
    PvSelectButton: SelectButton,
    PvIconField: IconField,
    PvInputIcon: InputIcon,
    PvTag: Tag,
    CircuitDropdown: Dropdown,
    CircuitStepper: Stepper,
    LinkText,
    CardButton,
    CollapsiblePanel,
    SeverityDialog,
    BoltIcon,
    XMarkIcon,
    PlusIcon,
    DocumentDuplicateIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    PlayIcon,
    PencilIcon,
    FolderOpenIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowsRightLeftIcon,
    ArrowPathIcon,
    ComputerDesktopIcon,
    EnvelopeIcon,
    ArrowTopRightOnSquareIcon,
    ArrowLongRightIcon,
    TrashIcon,
    TrashIconSolid,
  },
  props: {
    /** Start in detail view with a workflow (for Storybook demo) */
    startInDetailView: { type: Boolean, default: false },
    /** Start with one action step pre-added and config panel open */
    startWithStep: { type: Boolean, default: false },
  },
  setup(props) {
    const activeTab         = ref('overview');
    const selectedViewId    = ref('default-all');
    const selectedWorkflows = ref([]);

    const workflowData = ref<Array<Record<string, string>>>([]);

    // ── View routing: 'list' | 'detail' ──
    const activeView           = ref(props.startInDetailView ? 'detail' : 'list');
    const detailActiveTab      = ref('overview');
    const isWorkflowEnabled    = ref(true);
    const showTriggerInfo      = ref(true);
    const createdWorkflowName  = ref('');
    const createdWorkflowTrigger = ref('');
    const jsonResourceExpanded = ref(true);

    // ── Action Type dialog ──
    const showActionTypeDialog = ref(false);
    const actionTypeTab        = ref('flows');
    const actionSubTab         = ref('custom');
    const actionSubTabOptions  = [
      { label: 'Custom Actions',   value: 'custom' },
      { label: 'JumpCloud API',    value: 'api' },
    ];
    const apiActions = getApiActions({
      UserIcon,
      UsersIcon,
      ComputerDesktopIcon,
      CommandLineIcon,
      EnvelopeIcon,
      LockClosedIcon,
      KeyIcon,
    });
    const apiActionsByGroup = computed(() => {
      const map: Record<string, ApiAction[]> = {};
      for (const g of API_ACTION_GROUPS) map[g] = [];
      for (const a of apiActions) {
        if (map[a.group]) map[a.group].push(a);
      }
      return map;
    });
    const apiGroupCollapsed = ref<Record<string, boolean>>(
      Object.fromEntries(API_ACTION_GROUPS.map(g => [g, true])),
    );

    const selectedApiAction = ref<ApiAction | null>(null);
    const actionConfigValues = ref<Record<string, string>>({});
    const apiActionSearch = ref('');

    // Mock picker options for Select User / Select Device / Select Group (dropdown values)
    const mockPickerUsers = [
      { label: 'Jane Doe (jdoe@example.com)', value: '60b0c04a7e3d4b5c6d7e8f01' },
      { label: 'John Smith (jsmith@example.com)', value: '60b0c04a7e3d4b5c6d7e8f02' },
      { label: 'Alice Johnson (ajohnson@example.com)', value: '60b0c04a7e3d4b5c6d7e8f03' },
      { label: 'Bob Williams (bwilliams@example.com)', value: '60b0c04a7e3d4b5c6d7e8f04' },
    ];
    const mockPickerDevices = [
      { label: 'MacBook Pro - Jane', value: '5f1b2c3d4e5f6a7b8c9d0e01' },
      { label: 'Windows PC - John', value: '5f1b2c3d4e5f6a7b8c9d0e02' },
      { label: 'Ubuntu Server - prod-01', value: '5f1b2c3d4e5f6a7b8c9d0e03' },
    ];
    const mockPickerGroups = [
      { label: 'Engineering', value: 'grp-eng-001' },
      { label: 'Marketing', value: 'grp-mkt-001' },
      { label: 'Finance', value: 'grp-fin-001' },
      { label: 'HR', value: 'grp-hr-001' },
    ];
    const mockPickerCommands = [
      { label: 'Install Package', value: 'cmd-install-001' },
      { label: 'Run Script', value: 'cmd-script-001' },
      { label: 'Custom Command', value: 'cmd-custom-001' },
    ];
    const getPickerOptionsForField = (field: ActionField) => {
      const label = field.inputModeToggle?.selectLabel ?? '';
      if (label.includes('User') && !label.includes('Group')) return mockPickerUsers;
      if (label.includes('Device')) return mockPickerDevices;
      if (label.includes('Group')) return mockPickerGroups;
      if (label.includes('Select') && field.name === 'command_id') return mockPickerCommands;
      return mockPickerUsers; // fallback
    };

    const apiActionsList = computed(() => apiActions.flat());
    const filteredApiActions = computed(() => {
      const q = apiActionSearch.value.trim().toLowerCase();
      if (!q) return apiActionsList.value;
      return apiActionsList.value.filter(
        a => a.label.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
      );
    });

    interface WorkflowStep {
      id: string;
      action: ApiAction;
      config: Record<string, string>;
    }
    const workflowSteps = ref<WorkflowStep[]>([]);
    const selectedStepId = ref<string | null>(null);

    onMounted(() => {
      if (props.startWithStep && props.startInDetailView && apiActions.length > 0) {
        const action = apiActions[0];
        const config: Record<string, string> = {};
        for (const f of action.fields) {
          config[f.name] = f.defaultValue ?? '';
          if (f.inputModeToggle) config[`${f.name}_inputMode`] = 'select';
        }
        const newStep: WorkflowStep = { id: `step-${Date.now()}`, action, config };
        workflowSteps.value = [newStep];
        createdWorkflowName.value = 'Demo Workflow';
        createdWorkflowTrigger.value = 'User suspended';
        showTriggerInfo.value = false;
        selectedStepId.value = newStep.id;
        selectedApiAction.value = action;
        actionConfigValues.value = { ...config };
      }
    });

    const methodSeverity = (m: string) =>
      ({ GET: 'success', POST: 'info', PUT: 'secondary', DEL: 'danger' } as Record<string, string>)[m] ?? 'secondary';

    // ── Add dropdown ──
    const addOptions = [
      { label: 'New Workflow',  value: 'new',      icon: markRaw(PlusIcon)              },
      { label: 'Use template',  value: 'template', icon: markRaw(DocumentDuplicateIcon) },
    ];

    // ── Create Workflow dialog — 3-step ──
    const showCreateDialog = ref(false);
    const createStep       = ref('1');

    // Step 1
    const workflowType = ref('event');

    // Step 2 — main tab
    const triggerTab = ref('select-di-event');

    // Step 2 — Select DI Event tab
    const diEventSearch   = ref('');
    const selectedDiEvent = ref<{ id: string; label: string; lastOccurred: string } | null>(null);

    // Step 2 — Search Event by Type tab
    const byTypeCategoryTab   = ref('all');
    const byTypeSearch        = ref('');
    const selectedByTypeEvent = ref<{ id: string; label: string; category: string; description: string } | null>(null);

    // Step 3
    const workflowName        = ref('');
    const workflowDescription = ref('');

    // Clear tab selections when switching between step-2 tabs
    watch(triggerTab, () => {
      selectedDiEvent.value    = null;
      selectedByTypeEvent.value = null;
      diEventSearch.value      = '';
      byTypeSearch.value       = '';
    });

    // ── Computed ──
    const filteredRecentEvents = computed(() => {
      if (!diEventSearch.value.trim()) return recentDiEvents;
      return recentDiEvents.filter(e =>
        e.label.toLowerCase().includes(diEventSearch.value.toLowerCase()),
      );
    });

    const noEventMatch = computed(() =>
      diEventSearch.value.trim() !== '' && filteredRecentEvents.value.length === 0,
    );

    const filteredByTypeEvents = computed(() => {
      const cat = byTypeCategoryTab.value;
      let list = cat === 'all' ? allEventsByType : allEventsByType.filter(e => e.category === cat);
      if (byTypeSearch.value.trim()) {
        list = list.filter(e => e.label.toLowerCase().includes(byTypeSearch.value.toLowerCase()));
      }
      return list;
    });

    const activeSelectedEvent = computed(() =>
      selectedDiEvent.value || selectedByTypeEvent.value,
    );

    const canGoNext = computed(() => {
      if (createStep.value === '1') return true;
      if (createStep.value === '2') return !!activeSelectedEvent.value;
      if (createStep.value === '3') return !!workflowName.value.trim();
      return false;
    });

    // Auto-fill workflow name when reaching step 3
    watch(createStep, (newStep) => {
      if (newStep === '3' && !workflowName.value && activeSelectedEvent.value) {
        workflowName.value = activeSelectedEvent.value.label + ' Workflow';
      }
    });

    // ── Handlers ──
    const openCreateDialog = () => {
      createStep.value          = '1';
      workflowType.value        = 'event';
      triggerTab.value          = 'select-di-event';
      diEventSearch.value       = '';
      selectedDiEvent.value     = null;
      byTypeCategoryTab.value   = 'all';
      byTypeSearch.value        = '';
      selectedByTypeEvent.value = null;
      workflowName.value        = '';
      workflowDescription.value = '';
      showCreateDialog.value    = true;
    };

    const handleDone = () => {
      if (!workflowName.value.trim()) return;
      workflowData.value.unshift({
        name:        workflowName.value.trim(),
        description: '',
        type:        workflowType.value === 'event' ? 'Event' : workflowType.value === 'schedule' ? 'Schedule' : 'Manual',
        lastRan:     'Never',
        status:      'Enabled',
        lastEdited:  'Just now',
        createdBy:   'You',
      });
      // Store for detail view and navigate
      createdWorkflowName.value    = workflowName.value.trim();
      createdWorkflowTrigger.value = activeSelectedEvent.value?.label ?? '';
      isWorkflowEnabled.value      = true;
      detailActiveTab.value        = 'overview';
      showTriggerInfo.value        = true;
      jsonResourceExpanded.value   = true;
      showCreateDialog.value       = false;
      activeView.value             = 'detail';
    };

    const addCustomDiEvent = () => {
      const id = diEventSearch.value.trim();
      if (id) selectedDiEvent.value = { id, label: id, lastOccurred: '' };
    };

    const removeCustomDiEvent = () => {
      selectedDiEvent.value = null;
    };

    const handleAddSelect = (option: { value: string }) => {
      if (option.value === 'new') openCreateDialog();
    };

    /** Add action from modal — selection only; config happens in right drawer */
    const addActionFromModal = (action: ApiAction) => {
      const config: Record<string, string> = {};
      for (const f of action.fields) {
        config[f.name] = f.defaultValue ?? '';
        if (f.inputModeToggle) config[`${f.name}_inputMode`] = 'select';
      }
      const newStep: WorkflowStep = {
        id: `step-${Date.now()}`,
        action,
        config,
      };
      workflowSteps.value.push(newStep);
      showActionTypeDialog.value = false;
      openActionConfig(newStep);
    };

    const openActionConfig = (step: { id: string; action: ApiAction; config: Record<string, string> }) => {
      selectedStepId.value = step.id;
      showTriggerInfo.value = false;
      selectedApiAction.value = step.action;
      actionConfigValues.value = { ...step.config };
    };

    const showTriggerPanel = () => {
      showTriggerInfo.value = true;
      selectedStepId.value = null;
    };

    const closeActionConfig = () => {
      selectedStepId.value = null;
      selectedApiAction.value = null;
      showTriggerInfo.value = true;
    };

    const showDeleteStepDialog = ref(false);
    const stepToDelete = ref<WorkflowStep | null>(null);

    const openDeleteStepDialog = (step: WorkflowStep) => {
      stepToDelete.value = step;
      showDeleteStepDialog.value = true;
    };

    const confirmDeleteStep = () => {
      if (stepToDelete.value) {
        deleteStep(stepToDelete.value);
        stepToDelete.value = null;
        showDeleteStepDialog.value = false;
      }
    };

    const closeDeleteStepDialog = () => {
      showDeleteStepDialog.value = false;
      stepToDelete.value = null;
    };

    const deleteStep = (step: WorkflowStep) => {
      workflowSteps.value = workflowSteps.value.filter(s => s.id !== step.id);
      if (selectedStepId.value === step.id) {
        selectedStepId.value = null;
        selectedApiAction.value = null;
        showTriggerInfo.value = true;
      }
    };

    const selectedStep = computed(() =>
      selectedStepId.value
        ? workflowSteps.value.find(s => s.id === selectedStepId.value) ?? null
        : null,
    );

    /** Group action fields by paramIn for Path, Query, Request Body sections */
    const fieldsByParamIn = computed(() => {
      const action = selectedApiAction.value;
      if (!action) return { path: [], query: [], body: [] };
      const path: typeof action.fields = [];
      const query: typeof action.fields = [];
      const body: typeof action.fields = [];
      for (const f of action.fields) {
        const in_ = f.paramIn ?? 'body';
        if (in_ === 'path') path.push(f);
        else if (in_ === 'query') query.push(f);
        else body.push(f);
      }
      return { path, query, body };
    });

    watch(actionConfigValues, (val) => {
      if (selectedStepId.value && selectedStep.value) {
        selectedStep.value.config = { ...val };
      }
    }, { deep: true });

    const triggerTabOptions = [
      { label: 'Select DI Event',       value: 'select-di-event' },
      { label: 'Search Event by Type',  value: 'search-by-type'  },
    ];

    const deleteStepDialogContent = computed(() =>
      stepToDelete.value
        ? `The **${stepToDelete.value.action.label}** step will be removed from the workflow. Subsequent steps will not be affected.`
        : '',
    );

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
      addOptions,
      handleAddSelect,
      triggerTabOptions,
      // detail view
      activeView,
      detailTabs,
      detailActiveTab,
      isWorkflowEnabled,
      showTriggerInfo,
      createdWorkflowName,
      createdWorkflowTrigger,
      jsonResourceExpanded,
      showActionTypeDialog,
      actionTypeTab,
      actionSubTab,
      actionSubTabOptions,
      apiActionGroups: API_ACTION_GROUPS,
      filteredApiActions,
      apiGroupCollapsed,
      apiActionsByGroup,
      selectedApiAction,
      actionConfigValues,
      addActionFromModal,
      methodSeverity,
      workflowSteps,
      selectedStepId,
      openActionConfig,
      closeActionConfig,
      deleteStep,
      showTriggerPanel,
      fieldsByParamIn,
      getPickerOptionsForField,
      // dialog
      showCreateDialog,
      createStep,
      workflowType,
      triggerTab,
      diEventSearch,
      selectedDiEvent,
      byTypeCategoryTab,
      byTypeSearch,
      selectedByTypeEvent,
      workflowName,
      workflowDescription,
      filteredRecentEvents,
      noEventMatch,
      filteredByTypeEvents,
      activeSelectedEvent,
      canGoNext,
      createSteps,
      openCreateDialog,
      handleDone,
      addCustomDiEvent,
      removeCustomDiEvent,
      WorkflowIcon: markRaw(WorkflowIcon),
      // delete step dialog
      showDeleteStepDialog,
      stepToDelete,
      openDeleteStepDialog,
      confirmDeleteStep,
      closeDeleteStepDialog,
      deleteStepDialogContent,
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

      <!-- ── List view ─────────────────────────────────────────────────────── -->
      <div v-if="activeView === 'list'" class="flex-[1_1_0] flex flex-col min-w-0 w-full h-full self-stretch">
        <TopBar />

        <div class="flex-[1_1_0] flex flex-col min-h-0 h-full w-full">
          <PageHeader
            title="Workflows"
            :tabs="tabs"
            :activeTab="activeTab"
            @update:activeTab="activeTab = $event"
            class="shrink-0"
          />

          <!-- Overview tab -->
          <div v-if="activeTab === 'overview'" class="flex-[1_1_0] flex flex-col min-h-0 h-full w-full bg-neutral-surface">

            <!-- Toolbar -->
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

            <!-- Empty state -->
            <div
              v-if="workflowData.length === 0"
              class="flex-[1_1_0] flex flex-col items-center justify-center gap-lg bg-neutral-surface px-md"
            >
              <svg width="180" height="152" viewBox="0 0 180 152" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="28" y="44" width="124" height="90" rx="10" fill="var(--jc-color-neutral-base,#fff)" stroke="var(--jc-color-neutral-default-solid,#e2e8f0)" stroke-width="1.5"/>
                <rect x="20" y="36" width="124" height="90" rx="10" fill="var(--jc-color-neutral-base,#fff)" stroke="var(--jc-color-neutral-default-solid,#e2e8f0)" stroke-width="1.5"/>
                <rect x="12" y="28" width="124" height="90" rx="10" fill="var(--jc-color-neutral-base,#fff)" stroke="var(--jc-color-neutral-default-solid,#e2e8f0)" stroke-width="1.5"/>
                <rect x="28" y="48" width="64" height="8" rx="4" fill="var(--jc-color-neutral-ghost,#cbd5e1)"/>
                <rect x="28" y="64" width="92" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid,#e2e8f0)"/>
                <rect x="28" y="74" width="80" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid,#e2e8f0)"/>
                <rect x="28" y="84" width="86" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid,#e2e8f0)"/>
                <rect x="28" y="94" width="60" height="5" rx="2.5" fill="var(--jc-color-neutral-default-solid,#e2e8f0)"/>
                <circle cx="142" cy="40" r="24" fill="var(--jc-color-brand-primary-base,#0d9488)"/>
                <path d="M133 40h18M142 31v18" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>

              <div class="flex flex-col items-center gap-xs text-center">
                <p class="text-heading-3 text-neutral-base">No workflows yet</p>
                <p class="text-body-md text-neutral-subtle w-72">
                  Automate repetitive tasks and processes by creating your first workflow.
                </p>
              </div>

              <CircuitDropdown
                label="Create Workflow"
                :options="addOptions"
                menuWidth="180px"
                @select="handleAddSelect"
              />
            </div>

            <!-- Data table -->
            <div v-else class="flex-[1_1_0] flex flex-col min-h-0 h-full px-6">
              <CircuitDataTable
                :columns="workflowColumns"
                :data="workflowData"
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

          <!-- Stats tab -->
          <div v-if="activeTab === 'stats'" class="flex-[1_1_0] overflow-auto min-h-0 p-6 bg-neutral-surface">
            <div class="bg-neutral-base rounded-lg border border-neutral-default_solid p-8 text-center">
              <p class="text-body-lg text-neutral-subtle">Stats content coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Detail view ───────────────────────────────────────────────────── -->
      <div v-else-if="activeView === 'detail'" class="flex-[1_1_0] flex flex-col min-w-0 w-full h-full">

        <TopBar showBackButton backButtonLabel="Back" />

        <!-- Title + actions row -->
        <div class="flex items-center justify-between px-6 py-3 border-b border-neutral-default_solid bg-neutral-base shrink-0">
          <div class="flex items-center gap-sm min-w-0">
            <h1 class="text-heading-2 text-neutral-base truncate">{{ createdWorkflowName }}</h1>
            <PencilIcon class="size-4 text-neutral-subtle cursor-pointer hover:text-neutral-base shrink-0 transition-colors" />
          </div>
          <div class="flex items-center gap-sm shrink-0 ml-md">
            <ToggleSwitch v-model="isWorkflowEnabled" label="Enabled" />
            <PvButton severity="secondary" variant="outlined">
              <template #icon><PlayIcon class="size-4" /></template>
            </PvButton>
            <PvButton label="Cancel" severity="secondary" variant="outlined" @click="activeView = 'list'" />
            <PvButton label="Save" />
          </div>
        </div>

        <!-- Metadata bar -->
        <div class="flex items-center gap-md px-6 py-2 border-b border-neutral-default_solid bg-neutral-base shrink-0">
          <div class="flex items-center gap-xs">
            <BoltIcon class="size-4 text-icon-accent-purple-bold" />
            <span class="text-body-sm text-neutral-subtle">Event Trigger</span>
          </div>
          <span class="text-neutral-ghost">·</span>
          <span class="text-body-sm text-neutral-subtle">Last Ran: 2mins Ago</span>
          <span class="text-neutral-ghost">·</span>
          <span class="text-body-sm text-neutral-subtle">Created: Just now</span>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-lg px-6 bg-neutral-base border-b border-neutral-default_solid shrink-0">
          <button
            v-for="tab in detailTabs"
            :key="tab.value"
            class="py-3 text-body-sm font-medium border-b-2 transition-colors -mb-px"
            :class="detailActiveTab === tab.value
              ? 'text-brand-primary-base border-brand-primary-base'
              : 'text-neutral-subtle border-transparent hover:text-neutral-base'"
            @click="detailActiveTab = tab.value"
          >{{ tab.label }}</button>
        </div>

        <!-- Overview: canvas + right panel (grid ensures panel column is always visible) -->
        <div v-if="detailActiveTab === 'overview'" class="flex-1 grid min-h-0 overflow-hidden min-w-0" style="grid-template-columns: 1fr 400px;">

          <!-- Canvas with dot-grid background -->
          <div
            class="flex-1 min-w-0 overflow-auto bg-neutral-surface"
            style="background-image: radial-gradient(circle, var(--jc-color-neutral-ghost, #d1d5db) 1px, transparent 1px); background-size: 28px 28px;"
          >
            <div class="flex flex-col items-center py-10 px-6 min-h-full">

              <!-- Trigger node card -->
              <div
                class="bg-neutral-base rounded-lg border shadow-sm w-[340px] cursor-pointer transition-colors"
                :class="showTriggerInfo ? 'border-brand-primary-base' : 'border-neutral-default_solid hover:border-brand-primary-base'"
                @click="showTriggerPanel"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-accent-purple-soft shrink-0">
                    <BoltIcon class="size-4 text-icon-accent-purple-bold" />
                  </div>
                  <span class="text-body-md-semi-bold text-neutral-base">{{ createdWorkflowTrigger || 'User suspended' }}</span>
                </div>
                <div class="px-4 pb-4">
                  <PvButton label="View JSON" severity="secondary" variant="outlined" size="small" @click.stop="showTriggerPanel" />
                </div>
              </div>

              <!-- Dashed connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Workflow steps -->
              <template v-for="(step, idx) in workflowSteps" :key="step.id">
                <div
                  class="bg-neutral-base rounded-lg border shadow-sm w-[340px] cursor-pointer transition-colors flex items-center gap-sm group"
                  :class="selectedStepId === step.id ? 'border-brand-primary-base' : 'border-neutral-default_solid hover:border-brand-primary-base'"
                  @click="openActionConfig(step)"
                >
                  <component :is="step.action.icon" class="size-5 text-neutral-subtle shrink-0 ml-4" />
                  <div class="flex-1 min-w-0 py-4 pr-2">
                    <span class="text-body-md-semi-bold text-neutral-base">{{ step.action.label }}</span>
                    <p class="text-body-sm text-neutral-subtle truncate mt-px">{{ step.action.description }}</p>
                  </div>
                  <button
                    type="button"
                    class="shrink-0 p-2 mr-2 rounded-md text-danger-base hover:opacity-80 bg-neutral-ghost/30 hover:bg-neutral-ghost transition-colors"
                    aria-label="Delete step"
                    @click.stop="openDeleteStepDialog(step)"
                  >
                    <TrashIconSolid class="size-4 shrink-0 !text-danger-base" />
                  </button>
                </div>
                <!-- Connector -->
                <div class="flex flex-col items-center">
                  <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                  <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                  <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
                </div>
              </template>

              <!-- Add step button -->
              <PvButton severity="secondary" variant="outlined" rounded class="size-10" @click="showActionTypeDialog = true">
                <template #icon><PlusIcon class="size-5" /></template>
              </PvButton>

            </div>
          </div>

          <!-- Right panel: Trigger Info or Action Config (always show one) -->
          <div v-if="showTriggerInfo" class="w-[400px] min-w-[400px] shrink-0 border-l border-neutral-default_solid bg-neutral-base overflow-y-auto">

            <!-- Trigger Info panel header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-default_solid shrink-0">
              <div class="flex items-center gap-sm">
                <FolderOpenIcon class="size-4 text-neutral-subtle shrink-0" />
                <span class="text-body-md-semi-bold text-neutral-base">Trigger Info</span>
              </div>
              <PvButton severity="secondary" variant="text" size="small" @click="showTriggerPanel">
                <template #icon><XMarkIcon class="size-4" /></template>
              </PvButton>
            </div>

            <!-- Panel content -->
            <div class="p-4 flex flex-col gap-md">

              <!-- Event name -->
              <div class="flex flex-col gap-xs">
                <span class="text-body-sm text-neutral-subtle">Event name</span>
                <span class="text-body-md-semi-bold text-neutral-base">{{ createdWorkflowTrigger || 'User suspended' }}</span>
                <span class="text-body-sm text-neutral-subtle">Execute tailored or standard scripts seamlessly across macOS, Windows, and Linux platforms.</span>
              </div>

              <!-- JSON tree viewer -->
              <div class="flex flex-col gap-xs">
                <span class="text-body-sm-semi-bold text-neutral-base">JSON</span>
                <div class="rounded-md border border-neutral-default_solid bg-neutral-surface p-3 flex flex-col gap-xs" style="font-family: monospace; font-size: 11px;">

                  <div class="flex gap-sm">
                    <span class="text-neutral-subtle shrink-0">event_type:</span>
                    <span class="text-brand-primary-base">"user_suspended"</span>
                  </div>
                  <div class="flex gap-sm">
                    <span class="text-neutral-subtle shrink-0">event_time:</span>
                    <span class="text-brand-primary-base truncate">"2025-12-08T12:00:00.000Z"</span>
                  </div>

                  <!-- actor (collapsed) -->
                  <div class="flex items-center gap-xs text-neutral-subtle cursor-pointer hover:text-neutral-base">
                    <ChevronRightIcon class="size-3 shrink-0" />
                    <span>actor</span>
                    <span class="text-neutral-ghost ml-xs">3</span>
                  </div>

                  <!-- resource (expandable) -->
                  <div>
                    <div
                      class="flex items-center gap-xs text-neutral-subtle cursor-pointer hover:text-neutral-base"
                      @click="jsonResourceExpanded = !jsonResourceExpanded"
                    >
                      <ChevronDownIcon v-if="jsonResourceExpanded" class="size-3 shrink-0" />
                      <ChevronRightIcon v-else class="size-3 shrink-0" />
                      <span>resource</span>
                      <span class="text-neutral-ghost ml-xs">7</span>
                    </div>
                    <div v-if="jsonResourceExpanded" class="ml-4 flex flex-col gap-xs mt-xs">
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">id:</span><span class="text-brand-primary-base truncate">"60b0c04a7e3d4b5c6d7e8f01"</span></div>
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">type:</span><span class="text-brand-primary-base">"user"</span></div>
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">username:</span><span class="text-brand-primary-base">"jdoe"</span></div>
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">email:</span><span class="text-brand-primary-base truncate">"jane.doe@example.com"</span></div>
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">firstname:</span><span class="text-brand-primary-base">"Jane"</span></div>
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">lastname:</span><span class="text-brand-primary-base">"Doe"</span></div>
                      <div class="flex gap-sm"><span class="text-neutral-subtle shrink-0">state:</span><span class="text-brand-primary-base">"suspended"</span></div>
                    </div>
                  </div>

                  <!-- details (collapsed) -->
                  <div class="flex items-center gap-xs text-neutral-subtle cursor-pointer hover:text-neutral-base">
                    <ChevronRightIcon class="size-3 shrink-0" />
                    <span>details</span>
                    <span class="text-neutral-ghost ml-xs">2</span>
                  </div>

                  <!-- source (collapsed) -->
                  <div class="flex items-center gap-xs text-neutral-subtle cursor-pointer hover:text-neutral-base">
                    <ChevronRightIcon class="size-3 shrink-0" />
                    <span>source</span>
                    <span class="text-neutral-ghost ml-xs">1</span>
                  </div>

                  <div class="flex gap-sm">
                    <span class="text-neutral-subtle shrink-0">organization_id:</span>
                    <span class="text-brand-primary-base truncate">"5f1b2c3d4e5f6a7b8c9d0e1f"</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Action Config right drawer (configuration happens here, not in modal) -->
          <div v-else-if="selectedStepId && selectedApiAction" class="w-[400px] min-w-[400px] shrink-0 border-l border-neutral-default_solid bg-neutral-base overflow-y-auto flex flex-col">
            <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-default_solid shrink-0">
              <div class="flex items-center gap-sm">
                <FolderOpenIcon class="size-4 text-neutral-subtle shrink-0" />
                <span class="text-body-md-semi-bold text-neutral-base">{{ selectedApiAction.label }}</span>
              </div>
              <div class="flex items-center gap-xs">
                <PvButton severity="danger" variant="text" size="small" v-tooltip.top="'Delete step'" @click="selectedStep && openDeleteStepDialog(selectedStep)">
                  <template #icon><TrashIcon class="size-4 shrink-0 !text-danger-base" /></template>
                </PvButton>
                <PvButton severity="secondary" variant="text" size="small" @click="closeActionConfig">
                  <template #icon><XMarkIcon class="size-4" /></template>
                </PvButton>
              </div>
            </div>
            <div class="p-4 flex flex-col gap-md flex-1 overflow-auto">
              <p class="text-body-sm text-neutral-subtle">{{ selectedApiAction.description }}</p>

              <!-- Path Parameters — always show -->
              <div class="flex flex-col gap-sm">
                <span class="text-body-sm-semi-bold text-neutral-base">Path Parameters</span>
                <p v-if="fieldsByParamIn.path.length === 0" class="text-body-sm text-neutral-subtle">No path parameters for this action.</p>
                <template v-else>
                  <FormField
                    v-for="field in fieldsByParamIn.path"
                    :key="field.name"
                  :label="field.label"
                  :required="field.required"
                  :helpText="field.helpText"
                >
                  <template #default="{ inputId }">
                    <div v-if="field.inputModeToggle" class="flex flex-col gap-xs">
                      <PvSelectButton
                        v-model="actionConfigValues[field.name + '_inputMode']"
                        :options="[
                          { label: field.inputModeToggle.selectLabel, value: 'select' },
                          { label: field.inputModeToggle.manualLabel, value: 'manual' },
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        :allowEmpty="false"
                        class="w-fit"
                      />
                      <PvSelect
                        v-if="(actionConfigValues[field.name + '_inputMode'] ?? 'select') === 'select'"
                        :id="inputId"
                        v-model="actionConfigValues[field.name]"
                        :options="getPickerOptionsForField(field)"
                        optionLabel="label"
                        optionValue="value"
                        :placeholder="'Select...'"
                        class="w-fit min-w-[200px]"
                      />
                      <PvInputText
                        v-else
                        :id="inputId"
                        v-model="actionConfigValues[field.name]"
                        :placeholder="field.manualPlaceholder ?? field.placeholder ?? '$input.device.objectID'"
                        class="w-full"
                      />
                    </div>
                    <PvInputText
                      v-else
                      :id="inputId"
                      v-model="actionConfigValues[field.name]"
                      :placeholder="field.placeholder"
                      class="w-full"
                    />
                  </template>
                </FormField>
                </template>
              </div>

              <!-- Query Parameters — always show -->
              <div class="flex flex-col gap-sm">
                <span class="text-body-sm-semi-bold text-neutral-base">Query Parameters</span>
                <p v-if="fieldsByParamIn.query.length === 0" class="text-body-sm text-neutral-subtle">No query parameters.</p>
                <FormField
                  v-for="field in fieldsByParamIn.query"
                  :key="field.name"
                  :label="field.label"
                  :required="field.required"
                  :helpText="field.helpText"
                >
                  <template #default="{ inputId }">
                    <PvInputText
                      :id="inputId"
                      v-model="actionConfigValues[field.name]"
                      :placeholder="field.placeholder"
                      class="w-full"
                    />
                  </template>
                </FormField>
              </div>

              <!-- Request Body — always show with textarea for raw JSON -->
              <div class="flex flex-col gap-sm">
                <span class="text-body-sm-semi-bold text-neutral-base">Request Body</span>
                <FormField label="Request body (JSON)" helpText="Raw JSON for the request body. Leave empty for GET/DELETE or when no body is needed.">
                  <template #default="{ inputId }">
                    <PvTextarea
                      :id="inputId"
                      v-model="actionConfigValues['_requestBody']"
                      placeholder='{"key": "value"}'
                      rows="6"
                      class="w-full font-mono text-sm"
                    />
                  </template>
                </FormField>
                <FormField
                  v-for="field in fieldsByParamIn.body"
                  :key="field.name"
                  :label="field.label"
                  :required="field.required"
                  :helpText="field.helpText"
                >
                  <template #default="{ inputId }">
                    <!-- Select vs Manual toggle for fields that support it -->
                    <div v-if="field.inputModeToggle" class="flex flex-col gap-xs">
                      <PvSelectButton
                        v-model="actionConfigValues[field.name + '_inputMode']"
                        :options="[
                          { label: field.inputModeToggle.selectLabel, value: 'select' },
                          { label: field.inputModeToggle.manualLabel, value: 'manual' },
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        :allowEmpty="false"
                        class="w-fit"
                      />
                      <PvSelect
                        v-if="(actionConfigValues[field.name + '_inputMode'] ?? 'select') === 'select'"
                        :id="inputId"
                        v-model="actionConfigValues[field.name]"
                        :options="getPickerOptionsForField(field)"
                        optionLabel="label"
                        optionValue="value"
                        :placeholder="'Select ' + (field.inputModeToggle?.selectLabel?.replace('Select ', '') ?? '')"
                        class="w-fit min-w-[200px]"
                      />
                      <PvInputText
                        v-else
                        :id="inputId"
                        v-model="actionConfigValues[field.name]"
                        :placeholder="field.manualPlaceholder ?? field.placeholder ?? '$input.device.objectID'"
                        class="w-full"
                      />
                    </div>
                    <PvSelect
                      v-else-if="field.type === 'select'"
                      :id="inputId"
                      v-model="actionConfigValues[field.name]"
                      :options="field.options ?? []"
                      optionLabel="label"
                      optionValue="value"
                      :placeholder="field.placeholder"
                      class="w-full"
                    />
                    <PvTextarea
                      v-else-if="field.type === 'textarea'"
                      :id="inputId"
                      v-model="actionConfigValues[field.name]"
                      :placeholder="field.placeholder"
                      rows="3"
                      class="w-full"
                    />
                    <PvInputText
                      v-else
                      :id="inputId"
                      v-model="actionConfigValues[field.name]"
                      :placeholder="field.placeholder"
                      class="w-full"
                    />
                  </template>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Execution history placeholder -->
        <div v-else class="flex-1 overflow-auto p-6 bg-neutral-surface">
          <div class="bg-neutral-base rounded-lg border border-neutral-default_solid p-8 text-center">
            <p class="text-body-lg text-neutral-subtle">Execution history coming soon</p>
          </div>
        </div>

      </div>

      <!-- ══════════════════════════════════════════════════════════════════════
           Action Type dialog
           ══════════════════════════════════════════════════════════════════════ -->
      <PvDialog
        v-model:visible="showActionTypeDialog"
        :draggable="false"
        modal
        :style="{ width: '600px', height: '560px' }"
        class="flex flex-col [&_.p-dialog-content]:flex-1 [&_.p-dialog-content]:min-h-0 [&_.p-dialog-content]:overflow-hidden [&_.p-dialog-content]:flex [&_.p-dialog-content]:flex-col"
      >
        <template #header>
          <div class="flex items-center gap-sm">
            <FolderOpenIcon class="size-5 text-neutral-subtle shrink-0" />
            <span class="text-heading-3 text-neutral-base">Action Type</span>
          </div>
        </template>
        <template #closeicon><XMarkIcon class="size-5" /></template>

        <PvTabs v-model:value="actionTypeTab" class="flex flex-col flex-1 min-h-0 overflow-hidden">
          <PvTabList class="shrink-0">
            <PvTab value="flows">Flows</PvTab>
            <PvTab value="actions">Actions</PvTab>
          </PvTabList>

          <PvTabPanels class="flex-1 min-h-0 overflow-hidden flex flex-col">

            <!-- ── Flows tab ──────────────────────────────────────────────── -->
            <PvTabPanel value="flows" class="flex-1 min-h-0 overflow-auto">
              <div class="flex flex-col gap-sm pt-md">
                <p class="text-body-sm text-neutral-subtle">
                  Select your action from the list. If it's missing switch to 'Search Action' to add it manually.
                </p>

                <!-- If else -->
                <CollapsiblePanel header="If else" clickable>
                  <template #titleicon="iconProps">
                    <ArrowsRightLeftIcon :class="iconProps.class" />
                  </template>
                  <p class="text-body-sm text-neutral-subtle">
                    An if-else allows your workflow to make decisions based on conditions. If a specific condition is true, it executes a certain block of code; otherwise, it runs an alternative block.
                  </p>
                </CollapsiblePanel>

                <!-- Loops -->
                <CollapsiblePanel header="Loops" clickable>
                  <template #titleicon="iconProps">
                    <ArrowPathIcon :class="iconProps.class" />
                  </template>
                  <p class="text-body-sm text-neutral-subtle">
                    A for loop automates repetitive tasks by iterating over a set of items, allowing you to execute a block of code multiple times efficiently.
                  </p>
                </CollapsiblePanel>
              </div>
            </PvTabPanel>

            <!-- ── Actions tab: Custom Actions and JumpCloud API (flat lists, no tags) ── -->
            <PvTabPanel value="actions" class="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div class="flex flex-col gap-md pt-md flex-1 min-h-0 overflow-hidden">
                <p class="text-body-sm text-neutral-subtle shrink-0">
                  Select an action to add it to your workflow. Configure parameters in the right panel after adding.
                </p>
                <div class="shrink-0 border border-neutral-default_solid rounded-md p-xs w-fit">
                  <PvSelectButton
                    v-model="actionSubTab"
                    :options="actionSubTabOptions"
                    optionLabel="label"
                    optionValue="value"
                    :allowEmpty="false"
                    variant="outlined"
                  />
                </div>
                <PvIconField class="shrink-0">
                  <PvInputIcon><MagnifyingGlassIcon class="size-4" /></PvInputIcon>
                  <PvInputText v-model="apiActionSearch" placeholder="Search actions" class="w-full" />
                </PvIconField>
                <!-- Custom Actions: JumpCloud API actions from plan (flat list, no panels, no tags) -->
                <div v-if="actionSubTab === 'custom'" class="flex flex-col gap-sm flex-1 min-h-0 overflow-y-auto">
                  <CardButton
                    v-for="act in filteredApiActions"
                    :key="act.id"
                    :title="act.label"
                    :content="act.description"
                    class="text-left border border-neutral-default_solid rounded-md bg-neutral-surface hover:bg-neutral-ghost/50 cursor-pointer"
                    @click="addActionFromModal(act)"
                  >
                    <template #leading>
                      <component :is="act.icon" class="size-4 text-neutral-subtle shrink-0" />
                    </template>
                    <template #trailing>
                      <ChevronRightIcon class="size-4 text-neutral-subtle shrink-0" />
                    </template>
                  </CardButton>
                </div>
                <!-- JumpCloud API: same actions (flat list, no panels, no tags) -->
                <div v-else class="flex flex-col gap-sm flex-1 min-h-0 overflow-y-auto">
                  <div class="flex items-center gap-xs text-body-sm text-neutral-subtle mb-xs shrink-0">
                    <span>JumpCloud API docs</span>
                    <LinkText href="https://docs.jumpcloud.com" target="_blank">Learn more</LinkText>
                    <ArrowTopRightOnSquareIcon class="size-3.5 text-brand-primary-base shrink-0" />
                  </div>
                  <CardButton
                    v-for="act in filteredApiActions"
                    :key="act.id"
                    :title="act.label"
                    :content="act.description"
                    class="text-left border border-neutral-default_solid rounded-md bg-neutral-surface hover:bg-neutral-ghost/50 cursor-pointer"
                    @click="addActionFromModal(act)"
                  >
                    <template #leading>
                      <component :is="act.icon" class="size-4 text-neutral-subtle shrink-0" />
                    </template>
                    <template #trailing>
                      <ChevronRightIcon class="size-4 text-neutral-subtle shrink-0" />
                    </template>
                  </CardButton>
                </div>
              </div>
            </PvTabPanel>

          </PvTabPanels>
        </PvTabs>
      </PvDialog>

      <!-- ══════════════════════════════════════════════════════════════════════
           Create Workflow — Circuit DS Stepper inside Dialog
           ══════════════════════════════════════════════════════════════════════ -->
      <PvDialog
        v-model:visible="showCreateDialog"
        :draggable="false"
        modal
        header="Create Workflow"
        :style="{ width: '600px' }"
      >
        <template #closeicon><XMarkIcon class="size-5" /></template>

        <CircuitStepper
          :steps="createSteps"
          v-model:value="createStep"
          linear
          :nextDisabled="!canGoNext"
          saveLabel="Done"
          @cancel="showCreateDialog = false"
          @save="handleDone"
        >
          <!-- ── Step 1: Select Workflow Type ─────────────────────────────── -->
          <template #step-1>
            <RadioButtonGroup v-model="workflowType" class="flex-col gap-sm">

              <RadioButtonWithLabel value="manual">
                <template #label>
                  <span class="flex items-center gap-sm">
                    <WrenchScrewdriverIcon class="size-4 text-neutral-subtle shrink-0" />
                    Manual
                  </span>
                </template>
                <template #description>Run customized workflows based on manual input.</template>
              </RadioButtonWithLabel>

              <RadioButtonWithLabel value="event">
                <template #label>
                  <span class="flex items-center gap-sm">
                    <BoltIcon class="size-4 text-neutral-subtle shrink-0" />
                    Event
                  </span>
                </template>
                <template #description>Create workflows triggered by DI events.</template>
              </RadioButtonWithLabel>

              <RadioButtonWithLabel value="schedule">
                <template #label>
                  <span class="flex items-center gap-sm">
                    <ClockIcon class="size-4 text-neutral-subtle shrink-0" />
                    Schedule
                  </span>
                </template>
                <template #description>Schedule workflows to run automatically at specified times.</template>
              </RadioButtonWithLabel>

            </RadioButtonGroup>
          </template>

          <!-- ── Step 2: Trigger Details ──────────────────────────────────── -->
          <template #step-2>
            <div class="flex flex-col gap-md">

              <!-- SelectButton toggle -->
              <PvSelectButton
                v-model="triggerTab"
                :options="triggerTabOptions"
                optionLabel="label"
                optionValue="value"
                :allowEmpty="false"
              />

              <!-- ─ Select DI Event panel ─────────────────────────────────── -->
              <div v-if="triggerTab === 'select-di-event'" class="flex flex-col gap-md">

                <div class="flex flex-col gap-xs">
                  <p class="text-body-md-semi-bold text-neutral-base">Recent Events from Your Organization</p>
                  <p class="text-body-sm text-neutral-subtle">These are events generated in your organization in the last 60 days</p>
                </div>

                <div class="flex items-center gap-sm">
                  <PvIconField class="flex-1">
                    <PvInputIcon><MagnifyingGlassIcon class="size-4" /></PvInputIcon>
                    <PvInputText v-model="diEventSearch" placeholder="Search" class="w-full" />
                  </PvIconField>
                  <PvButton v-if="diEventSearch.trim() && !selectedDiEvent" size="small" @click="addCustomDiEvent">
                    <template #icon="iconProps"><PlusIcon :class="iconProps.class" /></template>
                    Add
                  </PvButton>
                </div>

                <div v-if="noEventMatch" class="flex flex-col gap-xs rounded-md border border-neutral-default_solid bg-neutral-surface p-md">
                  <p class="text-body-md-semi-bold text-neutral-base">No matching events found</p>
                  <p class="text-body-sm text-neutral-subtle">
                    You can continue with the event ID "<span class="font-mono">{{ diEventSearch }}</span>" as a manual entry.
                  </p>
                </div>

                <div v-else class="flex flex-col gap-xs max-h-52 overflow-y-auto">
                  <RadioButtonGroup v-model="selectedDiEvent" class="flex-col gap-xs">
                    <RadioButtonWithLabel v-for="event in filteredRecentEvents" :key="event.id" :value="event">
                      <template #label>{{ event.label }}</template>
                      <template #description>Last: {{ event.lastOccurred }}</template>
                    </RadioButtonWithLabel>
                  </RadioButtonGroup>
                </div>

                <div v-if="selectedDiEvent && !selectedDiEvent.lastOccurred"
                     class="flex items-center gap-sm px-sm py-xs rounded-md border border-brand-primary-base bg-brand-primary-ghost">
                  <BoltIcon class="size-4 text-brand-primary-base shrink-0" />
                  <span class="text-body-sm text-brand-primary-base flex-1">Event ID: {{ selectedDiEvent.label }}</span>
                  <PvButton severity="secondary" variant="text" size="small" @click="removeCustomDiEvent">
                    <template #icon><XMarkIcon class="size-3.5" /></template>
                  </PvButton>
                </div>

              </div>

              <!-- ─ Search Event by Type panel ───────────────────────────── -->
              <div v-else class="flex flex-col gap-md">

                <PvTabs v-model:value="byTypeCategoryTab">
                  <PvTabList>
                    <PvTab value="all">All</PvTab>
                    <PvTab value="users">Users</PvTab>
                    <PvTab value="devices">Devices</PvTab>
                    <PvTab value="ldap">LDAP</PvTab>
                    <PvTab value="mdm">MDM</PvTab>
                    <PvTab value="saas">SaaS Management</PvTab>
                  </PvTabList>
                </PvTabs>

                <PvIconField>
                  <PvInputIcon><MagnifyingGlassIcon class="size-4" /></PvInputIcon>
                  <PvInputText v-model="byTypeSearch" placeholder="Search" class="w-full" />
                </PvIconField>

                <div class="flex flex-col gap-xs max-h-52 overflow-y-auto">
                  <RadioButtonGroup v-model="selectedByTypeEvent" class="flex-col gap-xs">
                    <RadioButtonWithLabel v-for="event in filteredByTypeEvents" :key="event.id" :value="event">
                      <template #label>{{ event.label }}</template>
                      <template #description>{{ event.description }}</template>
                    </RadioButtonWithLabel>
                  </RadioButtonGroup>
                  <p v-if="filteredByTypeEvents.length === 0" class="text-body-md text-neutral-subtle text-center py-md">
                    No events found
                  </p>
                </div>

              </div>

            </div>
          </template>

          <!-- ── Step 3: Workflow Details ─────────────────────────────────── -->
          <template #step-3>
            <div class="flex flex-col gap-md">

              <FormField label="Trigger" required>
                <template #default="{ inputId }">
                  <PvInputText
                    :id="inputId"
                    :modelValue="activeSelectedEvent ? activeSelectedEvent.label : ''"
                    class="w-full"
                    readonly
                  />
                </template>
              </FormField>

              <FormField label="Workflow Name" required>
                <template #default="{ inputId }">
                  <PvInputText
                    :id="inputId"
                    v-model="workflowName"
                    placeholder="e.g. User Suspension Workflow"
                    class="w-full"
                  />
                  <p class="text-body-sm text-neutral-subtle mt-xs">Enter a descriptive name for this workflow</p>
                </template>
              </FormField>

              <FormField label="Description">
                <template #default="{ inputId }">
                  <PvTextarea
                    :id="inputId"
                    v-model="workflowDescription"
                    placeholder="Optional description…"
                    class="w-full"
                    :rows="4"
                  />
                </template>
              </FormField>

            </div>
          </template>

        </CircuitStepper>

      </PvDialog>

      <!-- Delete Step Severity Dialog -->
      <SeverityDialog
        v-model:visible="showDeleteStepDialog"
        variant="sev2"
        dialogTitle="Delete Step"
        messageTitle="Remove action from workflow"
        messageContent="This action step will be removed from the workflow. Subsequent steps will not be affected."
        :showMessageIcon="true"
        :dialogContent="deleteStepDialogContent"
        actionText="Delete"
        cancelText="Cancel"
        @action="confirmDeleteStep"
        @cancel="closeDeleteStepDialog"
      />
    </div>
  `,
});

const meta: Meta<typeof WorkflowFlows> = {
  title: 'Projects/Bala Playground/Pages/Workflow Flows',
  component: WorkflowFlows,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof WorkflowFlows>;

export const Default: Story = {};

/** Starts in detail view with one action step and config panel open — use to verify action node and delete icon. */
export const WithWorkflowAndStep: Story = {
  args: { startInDetailView: true, startWithStep: true },
};
