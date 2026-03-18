import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent, h, computed } from 'vue';
import {
  AppNavigation,
  PageHeader,
  DataTable,
  DataTableToolbar,
  DataTableCellText,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Menu from 'primevue/menu';
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
  LockClosedIcon,
  ArrowPathIcon,
  ListBulletIcon,
  Squares2X2Icon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
} from '@heroicons/vue/24/outline';

import {
  DeviceManagementIcon,
  AccessIcon,
  DeviceListsIcon,
  DeviceGroupsIcon,
  SsoIcon,
  SaasManagementIcon,
  PasswordManagerIcon,
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
    count: 1,
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
    label: 'Settings',
    leftIcon: markRaw(Cog6ToothIcon),
    items: [
      { label: 'Organization' },
      { label: 'Connectors' },
    ],
  },
  {
    label: 'Alert',
    leftIcon: markRaw(BellIcon),
    count: 23,
    isNew: true,
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

// ── Connector data ──
interface Connector {
  id: number;
  name: string;
  description: string;
  iconType: 'lock' | 'sync';
  usedBy: string;
  type: string;
  status: 'Enabled' | 'Disabled';
}

const allConnectors: Connector[] = [
  {
    id: 1,
    name: 'Salesforce Integration',
    description: 'Customer data synchronization',
    iconType: 'lock',
    usedBy: 'SaaS Management',
    type: 'Token',
    status: 'Enabled',
  },
  {
    id: 2,
    name: 'ServiceNow Connector',
    description: 'Incident management integration',
    iconType: 'sync',
    usedBy: 'Workflows',
    type: 'Token',
    status: 'Disabled',
  },
  {
    id: 3,
    name: 'Okta SCIM Provisioning',
    description: 'User provisioning via SCIM protocol',
    iconType: 'lock',
    usedBy: 'SCIM',
    type: 'Token',
    status: 'Enabled',
  },
  {
    id: 4,
    name: 'Workday HRIS',
    description: 'Employee data synchronization from Workday',
    iconType: 'sync',
    usedBy: 'HRIS',
    type: 'Basic Auth',
    status: 'Enabled',
  },
];

// ── Custom cell components ──
const ConnectorNameCell = markRaw(defineComponent({
  name: 'ConnectorNameCell',
  props: {
    data: { type: Object as () => Connector, default: () => ({}) },
  },
  setup(props) {
    return () => {
      const isLock = props.data.iconType === 'lock';
      return h('div', { class: 'flex flex-col justify-center px-2 py-3 min-h-12' }, [
        h('div', { class: 'flex items-center gap-1.5' }, [
          h(
            'a',
            { href: '#', class: 'text-body-md text-link-base font-semibold hover:underline' },
            props.data.name,
          ),
          h(isLock ? LockClosedIcon : ArrowPathIcon, {
            class: 'w-4 h-4 text-neutral-subtle shrink-0',
          }),
        ]),
        h('span', { class: 'text-body-sm text-neutral-subtle mt-0.5' }, props.data.description),
      ]);
    };
  },
}));

const UsedByCell = markRaw(defineComponent({
  name: 'UsedByCell',
  props: {
    data: { type: Object as () => Connector, default: () => ({}) },
  },
  setup(props) {
    const severityMap: Record<string, string> = {
      'SaaS Management': 'info',
      'Workflows': 'success',
      'SCIM': 'secondary',
      'HRIS': 'success',
    };
    return () =>
      h('div', { class: 'flex items-center px-2 py-3 min-h-12' }, [
        h(Tag, {
          value: props.data.usedBy,
          severity: severityMap[props.data.usedBy] ?? 'secondary',
        }),
      ]);
  },
}));

const StatusCell = markRaw(defineComponent({
  name: 'StatusCell',
  props: {
    data: { type: Object as () => Connector, default: () => ({}) },
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex items-center px-2 py-3 min-h-12' }, [
        h(Tag, {
          value: props.data.status,
          severity: props.data.status === 'Enabled' ? 'success' : 'warn',
        }),
      ]);
  },
}));

const ActionsCell = markRaw(defineComponent({
  name: 'ActionsCell',
  setup() {
    const menu = ref<InstanceType<typeof Menu> | null>(null);
    const menuItems = [
      {
        label: 'Edit',
        icon: markRaw(PencilIcon),
        command: () => {},
      },
      {
        label: 'Disable',
        icon: markRaw(NoSymbolIcon),
        command: () => {},
      },
      { separator: true },
      {
        label: 'Delete',
        icon: markRaw(TrashIcon),
        command: () => {},
      },
    ];
    return () =>
      h('div', { class: 'flex items-center justify-end px-2 py-3 min-h-12' }, [
        h(
          Button,
          {
            severity: 'secondary',
            variant: 'text',
            rounded: true,
            'aria-label': 'Actions',
            onClick: (event: MouseEvent) => menu.value?.toggle(event),
          },
          {
            icon: () => h(EllipsisVerticalIcon, { class: 'w-5 h-5' }),
          },
        ),
        h(Menu, {
          ref: (el) => { menu.value = el as InstanceType<typeof Menu>; },
          model: menuItems,
          popup: true,
        }),
      ]);
  },
}));

// ── Column definitions ──
const connectorColumns = [
  {
    field: 'name',
    header: 'Connector Name',
    sortable: true,
    width: '320px',
    component: ConnectorNameCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'usedBy',
    header: 'Used By',
    sortable: true,
    width: '200px',
    component: UsedByCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'type',
    header: 'Type',
    sortable: true,
    width: '160px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.type,
      size: 'default',
    }),
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    width: '160px',
    component: StatusCell,
    componentProps: (sp: { data: Record<string, unknown> }) => ({ data: sp.data }),
  },
  {
    field: 'actions',
    header: '',
    width: '72px',
    component: ActionsCell,
    componentProps: () => ({}),
  },
];

// ── Settings-level tabs (used in PageHeader) ──
const settingsTabs = [
  { label: 'Organization Profile', value: 'org-profile' },
  { label: 'Connectors', value: 'connectors' },
  { label: 'Notification Channels', value: 'notification-channels' },
  { label: 'Security', value: 'security' },
  { label: 'Customize Email', value: 'customize-email' },
];

// ── Category filter tab values ──
const categoryTabs = [
  { label: 'All', value: 'all' },
  { label: 'Workflows', value: 'Workflows' },
  { label: 'SaaS Management', value: 'SaaS Management' },
  { label: 'SCIM', value: 'SCIM' },
  { label: 'HRIS', value: 'HRIS' },
];

// ── Component ──
const ApiConnectorsPage = defineComponent({
  name: 'ApiConnectorsPage',
  components: {
    AppNavigation,
    PageHeader,
    DataTableToolbar,
    CircuitDataTable: DataTable,
    TopBar,
    PvButton: Button,
    PvTabs: Tabs,
    PvTabList: TabList,
    PvTab: Tab,
    ListBulletIcon,
    Squares2X2Icon,
  },
  setup() {
    const activeSettingsTab = ref('connectors');
    const categoryFilter = ref('all');
    const viewMode = ref<'list' | 'grid'>('list');
    const selectedConnectors = ref<Connector[]>([]);

    const filteredConnectors = computed(() => {
      if (categoryFilter.value === 'all') return allConnectors;
      return allConnectors.filter((c) => c.usedBy === categoryFilter.value);
    });

    return {
      menuItems,
      profileMenuItems,
      connectorColumns,
      settingsTabs,
      categoryTabs,
      activeSettingsTab,
      categoryFilter,
      viewMode,
      selectedConnectors,
      filteredConnectors,
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="settings"
        :collapsible="true"
      />

      <div class="flex-[1_1_0] flex flex-col min-w-0 w-full h-full self-stretch">
        <TopBar />

        <div class="flex-[1_1_0] flex flex-col min-h-0 h-full w-full bg-neutral-surface">

          <!-- Page header with title and settings-level tabs -->
          <PageHeader
            title="API Connectors"
            :tabs="settingsTabs"
            v-model:activeTab="activeSettingsTab"
            class="shrink-0"
          />

          <!-- Connectors tab content -->
          <div
            v-if="activeSettingsTab === 'connectors'"
            class="flex-[1_1_0] flex flex-col min-h-0 bg-neutral-surface"
          >
            <!-- Add / Search / View-toggle toolbar -->
            <div class="shrink-0 bg-neutral-base">
              <DataTableToolbar
                searchPlaceholder="Search"
                :showAddButton="true"
                addButtonLabel="Add"
                :showFilterButton="false"
                :showRefreshButton="false"
                :showColumnsButton="false"
                :showDownloadButton="false"
                @add="() => {}"
              >
                <template #saved-views>
                  <div class="flex items-center gap-1">
                    <PvButton
                      severity="secondary"
                      :variant="viewMode === 'list' ? 'outlined' : 'text'"
                      rounded
                      aria-label="List view"
                      @click="viewMode = 'list'"
                    >
                      <template #icon>
                        <ListBulletIcon class="w-5 h-5" />
                      </template>
                    </PvButton>
                    <PvButton
                      severity="secondary"
                      :variant="viewMode === 'grid' ? 'outlined' : 'text'"
                      rounded
                      aria-label="Grid view"
                      @click="viewMode = 'grid'"
                    >
                      <template #icon>
                        <Squares2X2Icon class="w-5 h-5" />
                      </template>
                    </PvButton>
                  </div>
                </template>
              </DataTableToolbar>
            </div>

            <!-- Category filter tabs (All / Workflows / SaaS Management / …) -->
            <PvTabs
              :value="categoryFilter"
              @update:value="categoryFilter = $event"
              class="shrink-0 bg-neutral-base"
            >
              <PvTabList withPadding>
                <PvTab
                  v-for="tab in categoryTabs"
                  :key="tab.value"
                  :value="tab.value"
                >{{ tab.label }}</PvTab>
              </PvTabList>
            </PvTabs>

            <!-- Table -->
            <div class="flex-[1_1_0] flex flex-col min-h-0 px-6 py-4">
              <CircuitDataTable
                :columns="connectorColumns"
                :data="filteredConnectors"
                :selection="selectedConnectors"
                @update:selection="selectedConnectors = $event"
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

          <!-- Other tabs placeholder -->
          <div
            v-if="activeSettingsTab !== 'connectors'"
            class="flex-[1_1_0] flex items-center justify-center"
          >
            <p class="text-body-lg text-neutral-subtle">
              {{ activeSettingsTab.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }} content coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
});

const meta: Meta<typeof ApiConnectorsPage> = {
  title: 'Projects/Settings/Pages/API Connectors',
  component: ApiConnectorsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ApiConnectorsPage>;

export const Default: Story = {};
