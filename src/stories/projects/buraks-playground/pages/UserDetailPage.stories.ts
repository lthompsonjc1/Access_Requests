import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent } from 'vue';
import {
  AppNavigation,
  PageHeader,
  CollapsiblePanel,
  CheckboxWithLabel,
  FormField,
  DataTable as CircuitDataTable,
  DataTableToolbar,
  DataTableCellText,
  DataTableCellLink,
  DataTableCellStatus,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Menu from 'primevue/menu';
import Divider from 'primevue/divider';

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
  ClipboardDocumentCheckIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  BriefcaseIcon,
  IdentificationIcon,
  TagIcon,
  KeyIcon,
} from '@heroicons/vue/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';

import TopBar from '@/components/TopBar.vue';
import DetailsKeyValue from '@/components/DetailsKeyValue.vue';
import DetailPageLayout from '@/components/layout/page-layouts/DetailPageLayout.vue';
import ConfigPageLayout from '@/components/layout/page-layouts/ConfigPageLayout.vue';

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

// ─── Navigation Data ───

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
    label: 'Alerts',
    leftIcon: markRaw(BellIcon),
    count: 25,
  },
  {
    label: 'User Management',
    leftIcon: markRaw(UserGroupIcon),
    items: [
      { label: 'Users', leftIcon: markRaw(UserIcon) },
      { label: 'User Groups', leftIcon: markRaw(UsersIcon) },
      { separator: true },
      { label: 'Active Directories' },
      { label: 'Cloud Directories' },
      { label: 'HR Directories' },
      { label: 'Identity Providers' },
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
      { label: 'Patch Management' },
      { label: 'Policy Groups' },
      { label: 'Software Management' },
      { label: 'MDM' },
    ],
  },
  {
    label: 'Access',
    leftIcon: markRaw(AccessIcon),
    items: [
      { label: 'SSO Applications', leftIcon: markRaw(SsoIcon) },
      { label: 'Access Requests', leftIcon: markRaw(ClipboardDocumentCheckIcon) },
      { label: 'AI & SaaS Management', leftIcon: markRaw(SaasManagementIcon) },
      { label: 'Vault', leftIcon: markRaw(PasswordManagerIcon), isNew: true },
      { separator: true },
      { label: 'LDAP' },
      { label: 'RADIUS' },
    ],
  },
  {
    label: 'Workflows',
    leftIcon: markRaw(WorkflowIcon),
  },
  {
    label: 'Security',
    leftIcon: markRaw(ShieldCheckIcon),
    items: [
      { label: 'Conditional Access Policies' },
      { label: 'Conditional Lists' },
      { label: 'Certificate Authority', isNew: true },
      { label: 'MFA Configurations' },
      { label: 'Device Trust' },
      { label: 'Password Policies' },
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

// ─── Page Configuration ───

const tabs = [
  { label: 'Highlights', value: 'highlights' },
  { label: 'Details', value: 'details' },
  { label: 'User Groups', value: 'user-groups' },
  { label: 'Devices', value: 'devices' },
  { label: 'Directories', value: 'directories' },
];

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
];

// ─── Tab 1: Highlights — Mock Data ───

const highlightsDevicesData = [
  { id: 1, deviceName: "Burak Başcı's VM - name update", userType: '—' },
];

const highlightsDevicesColumns = [
  { field: 'deviceName', header: 'Device Name', sortable: true, component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.deviceName, href: '#' }) },
  { field: 'userType', header: 'User Type', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.userType }) },
];

const groupsList = ['All Users', 'Contractors', 'Employees'];
const applicationsList = ['RSA Test', 'SAML-Go', 'Hydra Auth Trampoline', 'Hydra 2', 'Log a Ticket'];

const assetsData = [
  { id: 1, name: "Burak Başcı's VM - name update", type: 'Desktop', status: 'IN USE', statusSeverity: 'info' },
  { id: 2, name: "Burak's Cables", type: 'Peripheral', status: 'LOST', statusSeverity: 'danger' },
  { id: 3, name: "Burak's Cool Headphones", type: 'Headset', status: '—', statusSeverity: null },
  { id: 4, name: "Burak's Magic Mouse", type: 'Peripheral', status: 'ORDERED', statusSeverity: 'warn' },
  { id: 5, name: "Burak's Monitor", type: 'Display', status: 'IN USE', statusSeverity: 'info' },
];

const assetsColumns = [
  { field: 'name', header: 'Name', sortable: true, width: '300px', component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name, href: '#' }) },
  { field: 'type', header: 'Type', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.type }) },
  { field: 'status', header: 'Status', component: markRaw(DataTableCellStatus), componentProps: (sp: { data: Record<string, unknown> }) => ({ type: 'Status', statusLabel: sp.data.status }) },
];

const directoryActivityData = [
  { id: 1, event: 'Last Known Location', resourceStatus: '—', timestamp: '—' },
  { id: 2, event: 'Last Password Change', resourceStatus: '—', timestamp: '—' },
  { id: 3, event: 'Last Status Change', resourceStatus: '—', timestamp: '—' },
  { id: 4, event: 'Last User Portal Authentication', resourceStatus: '—', timestamp: '—' },
];

const directoryActivityColumns = [
  { field: 'event', header: 'Event', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.event }) },
  { field: 'resourceStatus', header: 'Resource/Status', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.resourceStatus }) },
  { field: 'timestamp', header: 'Timestamp', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.timestamp }) },
];

// ─── Tab 3: User Groups — Mock Data ───

const userGroupsData = [
  { id: 1, group: 'Admin Sudo Granted', groupType: 'Group of Users', membershipControls: 'Static' },
  { id: 2, group: 'AFC Richmond Management', groupType: 'Group of Users', membershipControls: 'Static' },
  { id: 3, group: 'All Users', groupType: 'Group of Users', membershipControls: 'Static' },
  { id: 4, group: 'Approval Group (Access Requests)', groupType: 'Group of Users', membershipControls: 'Static' },
  { id: 5, group: 'asdf', groupType: 'Group of Users', membershipControls: 'Dynamic' },
  { id: 6, group: 'Atlassian for Tech Writing', groupType: 'Group of Users', membershipControls: 'Static' },
  { id: 7, group: 'Blogin', groupType: 'Group of Users', membershipControls: 'Static' },
  { id: 8, group: 'Contract Developers', groupType: 'Group of Users', membershipControls: 'Dynamic (Review Required)' },
  { id: 9, group: 'Contractors', groupType: 'Group of Users', membershipControls: 'Dynamic (Review Required)' },
  { id: 10, group: 'Crowdstrike', groupType: 'Group of Users', membershipControls: 'Static' },
];

const userGroupsColumns = [
  { field: 'group', header: 'Group', sortable: true, width: '300px', component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.group, description: sp.data.groupType, icon: markRaw(UsersIcon), href: '#' }) },
  { field: 'membershipControls', header: 'User Membership Controls', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.membershipControls }) },
];

// ─── Tab 4: Devices — Mock Data ───

const devicesData = [
  { id: 1, status: 'Inactive', deviceName: 'ubuntu-linux-22-04-02-desktop', os: 'Ubuntu 22.04.2 LTS (Jammy Jellyfish)', hasMdm: false, passwordSync: '', permissions: '', userType: '' },
  { id: 2, status: 'Inactive', deviceName: 'samobisanya-MacBook', os: 'macOS 15.0', hasMdm: true, passwordSync: '', permissions: '', userType: '' },
  { id: 3, status: 'Inactive', deviceName: 'Armistice-7.local', os: 'macOS 15.0', hasMdm: false, passwordSync: '', permissions: '', userType: '' },
  { id: 4, status: 'Inactive', deviceName: 'SERHATCAN9C80', os: 'Windows 11 Pro (26100.3194)', hasMdm: true, passwordSync: '', permissions: '', userType: '' },
  { id: 5, status: 'Inactive', deviceName: "Burak Başcı's VM - name update", os: 'Windows 11 Pro (22631.4169)', hasMdm: true, passwordSync: 'Yes', permissions: 'Global Administrator/Sudo', userType: 'Standard' },
  { id: 6, status: 'Inactive', deviceName: 'samobisanya-MacBook-Air', os: 'macOS 14.7', hasMdm: false, passwordSync: '', permissions: '', userType: '' },
  { id: 7, status: 'Inactive', deviceName: 'BARISERMUTBF361', os: 'Windows 11 Pro (26100.4946)', hasMdm: true, passwordSync: '', permissions: '', userType: '' },
  { id: 8, status: 'Inactive', deviceName: 'Locals-Virtual-Machine.local', os: 'macOS 14.5', hasMdm: true, passwordSync: '', permissions: '', userType: '' },
  { id: 9, status: 'Active', deviceName: 'Sergey iPadOS DMPYG1HDKD6L', os: 'iPadOS 26.0', hasMdm: false, passwordSync: '', permissions: '', userType: '' },
];

const devicesColumns = [
  { field: 'status', header: 'Status', component: markRaw(DataTableCellStatus), componentProps: (sp: { data: Record<string, unknown> }) => ({ type: 'Status', statusLabel: sp.data.status }) },
  { field: 'deviceName', header: 'Device Name', sortable: true, width: '240px', component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.deviceName, href: '#' }) },
  { field: 'os', header: 'OS', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.os }) },
  { field: 'passwordSync', header: 'Password Sync', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.passwordSync || '—' }) },
  { field: 'permissions', header: 'Permissions', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.permissions || '—' }) },
  { field: 'userType', header: 'User Type', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.userType || '—' }) },
];

// ─── Tab 5: Directories — Mock Data ───

const directoriesData = [
  { id: 1, type: 'AD', syncStatus: '—', name: 'DC=afcdemo1;DC=com', nameDescription: 'Active Directory Domain', tokenStatus: '', accessConfigurations: '' },
  { id: 2, type: 'AD', syncStatus: '—', name: 'DC=test.com;dc=com', nameDescription: 'Active Directory Domain', tokenStatus: '', accessConfigurations: '' },
  { id: 3, type: 'Google', syncStatus: '', name: 'AFCR', nameDescription: 'Google Workspace', tokenStatus: '', accessConfigurations: '' },
  { id: 4, type: 'LDAP', syncStatus: '', name: 'JumpCloud LDAP', nameDescription: '', tokenStatus: '', accessConfigurations: '' },
  { id: 5, type: 'M365', syncStatus: '—', name: 'JumpCloud AFC Microsoft', nameDescription: 'M365/Entra ID', tokenStatus: 'Token expired', accessConfigurations: '' },
];

const directoriesColumns = [
  { field: 'type', header: 'Type', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.type }) },
  { field: 'syncStatus', header: 'Sync Status', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.syncStatus || '—' }) },
  { field: 'name', header: 'Name', sortable: true, width: '280px', component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name, description: sp.data.nameDescription, href: '#' }) },
  { field: 'tokenStatus', header: 'Token Status', component: markRaw(DataTableCellStatus), componentProps: (sp: { data: Record<string, unknown> }) => ({ type: 'Status', statusLabel: sp.data.tokenStatus || '—' }) },
  { field: 'accessConfigurations', header: 'Access Configurations', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.accessConfigurations || '—' }) },
];

// ─── Component Definition ───

const UserDetailPage = defineComponent({
  name: 'UserDetailPage',
  components: {
    AppNavigation,
    PageHeader,
    CollapsiblePanel,
    CheckboxWithLabel,
    FormField,
    PvButton: Button,
    PvTag: Tag,
    PvSelect: Select,
    PvInputText: InputText,
    PvTextarea: Textarea,
    PvMenu: Menu,
    PvDivider: Divider,
    CircuitDataTable,
    DataTableToolbar,
    TopBar,
    DetailsKeyValue,
    DetailPageLayout,
    ConfigPageLayout,
    ChevronDownIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    ShieldExclamationIcon,
    BriefcaseIcon,
    IdentificationIcon,
    TagIcon,
    KeyIcon,
    CheckCircleIcon,
    XCircleIcon,
  },
  setup() {
    const activeTab = ref('highlights');
    const userStatus = ref('active');

    // Sidebar menu refs
    const passwordMenu = ref();
    const protectMenu = ref();
    const passwordMenuItems = [{ label: 'Force Change Password' }];
    const protectMenuItems = [{ label: 'Reset Protect MFA' }];

    // Details tab — collapsed state for toggleable panels
    const securityCollapsed = ref(true);
    const employmentCollapsed = ref(false);
    const personalCollapsed = ref(true);
    const customAttrsCollapsed = ref(true);
    const publicKeysCollapsed = ref(true);

    // Details tab form state
    const username = ref('burak.basci');
    const accountEmail = ref('burak.basci+afc@jumpcloud.com');
    const firstName = ref('Burak');
    const lastName = ref('Başcı');
    const displayName = ref('Burak Başcı');
    const employeeId = ref('EMP-001');
    const description = ref('');
    const personalEmail = ref('');
    const alternateEmail = ref('');
    const recoveryEmail = ref('');
    const enableUserPortal = ref(true);

    // Security settings
    const passwordAddress = ref('burak.basci+afc@jumpcloud.com');
    const encryptedEmailRole = ref('admin');
    const setPasswordOnLogin = ref(false);
    const allowPasswordReset = ref(true);
    const requireMfaAccount = ref(true);
    const requireMfaDevice = ref(false);
    const deviceAdminAll = ref(false);

    // Employment info
    const empId = ref('EMP-001');
    const jobTitle = ref('Staff Product Designer');
    const company = ref('JumpCloud');
    const manager = ref('');
    const department = ref('Design Team');
    const costCenter = ref('');
    const location = ref('');
    const startDate = ref('');
    const endDate = ref('');

    // Personal info
    const personalFirstName = ref('Burak');
    const personalEmailField = ref('');
    const mobilePhone = ref('');
    const homePhone = ref('');
    const city = ref('');
    const state = ref('');
    const country = ref('');
    const addressZip = ref('');
    const homeCountry = ref('');

    // Table selections
    const selectedUserGroups = ref([userGroupsData[2], userGroupsData[8]]);
    const selectedDevices = ref([devicesData[4]]);
    const selectedDirectories = ref([directoriesData[2], directoriesData[3]]);
    const showBoundGroups = ref(true);
    const showBoundDevices = ref(true);

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Manager', value: 'manager' },
    ];

    const countryOptions = [
      { label: 'United States', value: 'us' },
      { label: 'Turkey', value: 'tr' },
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Germany', value: 'de' },
    ];

    const managerOptions = [
      { label: 'None', value: '' },
      { label: 'John Smith', value: 'john.smith' },
      { label: 'Jane Doe', value: 'jane.doe' },
    ];

    return {
      menuItems,
      profileMenuItems,
      tabs,
      statusOptions,
      activeTab,
      userStatus,
      // Highlights
      highlightsDevicesData,
      highlightsDevicesColumns,
      groupsList,
      applicationsList,
      assetsData,
      assetsColumns,
      directoryActivityData,
      directoryActivityColumns,
      // Details form
      username,
      accountEmail,
      firstName,
      lastName,
      displayName,
      employeeId,
      description,
      personalEmail,
      alternateEmail,
      recoveryEmail,
      enableUserPortal,
      passwordAddress,
      encryptedEmailRole,
      setPasswordOnLogin,
      allowPasswordReset,
      requireMfaAccount,
      requireMfaDevice,
      deviceAdminAll,
      empId,
      jobTitle,
      company,
      manager,
      department,
      costCenter,
      location,
      startDate,
      endDate,
      personalFirstName,
      personalEmailField,
      mobilePhone,
      homePhone,
      city,
      state,
      country,
      addressZip,
      homeCountry,
      roleOptions,
      countryOptions,
      managerOptions,
      // User Groups
      userGroupsData,
      userGroupsColumns,
      selectedUserGroups,
      showBoundGroups,
      // Devices
      devicesData,
      devicesColumns,
      selectedDevices,
      showBoundDevices,
      // Directories
      directoriesData,
      directoriesColumns,
      selectedDirectories,
      // Sidebar menus
      passwordMenu,
      protectMenu,
      passwordMenuItems,
      protectMenuItems,
      // Details tab collapsed states
      securityCollapsed,
      employmentCollapsed,
      personalCollapsed,
      customAttrsCollapsed,
      publicKeysCollapsed,
      // Icons
      UserIcon: markRaw(UserIcon),
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="user management"
        :collapsible="true"
        :topNavToggle="true"
      />
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        <PageHeader
          title="Burak Başcı"
          :icon="UserIcon"
          subtitleText="burak.basci+afc@jumpcloud.com · Staff Product Designer · Design Team"
          :tabs="tabs"
          :activeTab="activeTab"
          @update:activeTab="activeTab = $event"
        >
          <template #actions>
            <PvSelect
              v-model="userStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-auto"
            >
              <template #value="slotProps">
                <div class="flex items-center gap-2">
                  <CheckCircleIcon v-if="slotProps.value === 'active'" class="size-5 text-feedback-success-base" />
                  <XCircleIcon v-else class="size-5 text-feedback-danger-base" />
                  <span>{{ slotProps.value === 'active' ? 'Active' : 'Suspended' }}</span>
                </div>
              </template>
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <CheckCircleIcon v-if="slotProps.option.value === 'active'" class="size-5 text-feedback-success-base" />
                  <XCircleIcon v-else class="size-5 text-feedback-danger-base" />
                  <span>{{ slotProps.option.label }}</span>
                </div>
              </template>
            </PvSelect>
          </template>
        </PageHeader>

        <div class="flex-1 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-auto bg-neutral-surface">

            <!-- ============ TAB: HIGHLIGHTS ============ -->
            <DetailPageLayout v-if="activeTab === 'highlights'" class="w-full! h-full!">
              <div class="flex flex-col gap-6">

                <CollapsiblePanel header="Devices (1)">
                  <template #actions>
                    <PvButton label="All Devices" variant="outlined" severity="secondary" size="small" />
                  </template>
                  <CircuitDataTable :columns="highlightsDevicesColumns" :data="highlightsDevicesData" size="small" :card="false" />
                </CollapsiblePanel>

                <div class="grid grid-cols-2 gap-6">
                  <CollapsiblePanel header="Groups (3)">
                    <template #actions>
                      <PvButton label="All Groups" variant="outlined" severity="secondary" size="small" />
                    </template>
                    <div class="flex flex-col gap-1">
                      <a v-for="group in groupsList" :key="group" class="text-body-md text-primary-base cursor-pointer hover:underline">{{ group }}</a>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Applications (8)">
                    <template #actions>
                      <PvButton label="All Applications" variant="outlined" severity="secondary" size="small" />
                    </template>
                    <div class="flex flex-col gap-1">
                      <a v-for="app in applicationsList" :key="app" class="text-body-md text-primary-base cursor-pointer hover:underline">{{ app }}</a>
                    </div>
                  </CollapsiblePanel>
                </div>

                <CollapsiblePanel header="SaaS Management">
                  <template #actions>
                    <PvButton label="All Accounts" variant="outlined" severity="secondary" size="small" />
                  </template>
                  <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">Discovered Accounts</dt>
                      <dd class="text-body-md text-neutral-base mt-1">318 Accounts</dd>
                    </div>
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">Apps in Use</dt>
                      <dd class="text-body-md text-neutral-base mt-1">82 Apps</dd>
                    </div>
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">Shared Accounts</dt>
                      <dd class="text-body-md text-neutral-base mt-1">0 Accounts</dd>
                    </div>
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">Licensed Apps</dt>
                      <dd class="text-body-md text-neutral-base mt-1">9 Apps</dd>
                    </div>
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">License Costs (Estimate)</dt>
                      <dd class="text-body-md text-neutral-base mt-1">38 USD · +1 See All</dd>
                    </div>
                  </div>
                </CollapsiblePanel>

                <CollapsiblePanel header="Assets Owned (16)">
                  <template #actions>
                    <PvButton label="View All" variant="outlined" severity="secondary" size="small" />
                  </template>
                  <CircuitDataTable :columns="assetsColumns" :data="assetsData" size="small" :card="false" />
                </CollapsiblePanel>

                <CollapsiblePanel header="Directory Activity">
                  <template #actions>
                    <PvButton label="Activity Log" variant="outlined" severity="secondary" size="small" />
                  </template>
                  <CircuitDataTable :columns="directoryActivityColumns" :data="directoryActivityData" size="small" :card="false" />
                </CollapsiblePanel>

              </div>

              <template #sidebar>
                <div class="flex flex-col gap-6">
                  <div class="flex flex-col gap-4">
                    <h3 class="text-heading-3 text-neutral-base">Security Status</h3>
                    <div class="flex flex-col gap-3">
                      <div class="flex items-center gap-2">
                        <span class="w-48 shrink-0 text-body-md-semi-bold text-neutral-base">Password</span>
                        <PvTag value="Active" severity="success" />
                        <PvButton variant="text" severity="secondary" size="small" @click="passwordMenu.toggle($event)">
                          <template #icon>
                            <ChevronDownIcon class="size-4" />
                          </template>
                        </PvButton>
                        <PvMenu ref="passwordMenu" :model="passwordMenuItems" :popup="true" />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-48 shrink-0 text-body-md-semi-bold text-neutral-base">JumpCloud Protect</span>
                        <PvTag value="Inactive" severity="danger" />
                        <PvButton variant="text" severity="secondary" size="small" @click="protectMenu.toggle($event)">
                          <template #icon>
                            <ChevronDownIcon class="size-4" />
                          </template>
                        </PvButton>
                        <PvMenu ref="protectMenu" :model="protectMenuItems" :popup="true" />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-48 shrink-0 text-body-md-semi-bold text-neutral-base">WebAuthn</span>
                        <PvTag value="Inactive" severity="danger" />
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-4">
                    <h3 class="text-heading-3 text-neutral-base">Password Policy</h3>
                    <div class="flex items-center gap-2">
                      <PvButton label="See Password Policy" severity="secondary" size="small" />
                      <PvButton label="Test policy →" variant="outlined" severity="secondary" size="small" />
                    </div>
                  </div>

                  <PvDivider />

                  <div class="flex flex-col gap-4">
                    <h3 class="text-heading-3 text-neutral-base">Identity Management</h3>
                    <div class="flex flex-col gap-3">
                      <DetailsKeyValue label="Password Address" value="burak.basci+afc@jumpcloud.com" />
                      <DetailsKeyValue label="Encrypted Email Role" value="Admin" />
                      <DetailsKeyValue label="Password Reset" value="Allowed" />
                      <DetailsKeyValue label="MFA (Account)" value="Required" />
                      <DetailsKeyValue label="MFA (Device)" value="Not required" />
                      <DetailsKeyValue label="Security Key" value="Not configured" />
                      <DetailsKeyValue label="Device Administrator" value="No" />
                    </div>
                  </div>

                  <PvDivider />

                  <div class="flex flex-col gap-4">
                    <h3 class="text-heading-3 text-neutral-base">Details</h3>
                    <div class="flex flex-col gap-3">
                      <DetailsKeyValue label="Email" value="burak.basci+afc@jumpcloud.com" />
                      <DetailsKeyValue label="Job Title" value="Staff Product Designer" />
                      <DetailsKeyValue label="Department" value="Design Team" />
                      <DetailsKeyValue label="Company" value="JumpCloud" />
                      <DetailsKeyValue label="Employee ID" value="EMP-001" />
                      <DetailsKeyValue label="Location" value="Istanbul, Turkey" />
                      <DetailsKeyValue label="Manager" :value="null" />
                    </div>
                  </div>
                </div>
              </template>
            </DetailPageLayout>

            <!-- ============ TAB: DETAILS ============ -->
            <ConfigPageLayout v-if="activeTab === 'details'" class="w-full! h-full!">
              <div class="flex flex-col gap-6">

                <CollapsiblePanel header="User Information">
                  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                    <FormField label="Username">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="username" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Account/Email">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="accountEmail" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="First Name">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="firstName" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Last Name">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="lastName" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Display Name">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="displayName" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Employee ID">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="employeeId" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Description" class="col-span-2">
                      <template #default="{ inputId }">
                        <PvTextarea :id="inputId" v-model="description" class="w-full" rows="3" />
                      </template>
                    </FormField>
                    <FormField label="Personal Email">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="personalEmail" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Alternate Email">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="alternateEmail" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Password Recovery Email" class="col-span-2" helpText="This is the email address used for password recovery. If not set, the account email will be used.">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="recoveryEmail" class="w-full" />
                      </template>
                    </FormField>
                  </div>
                  <div class="mt-4">
                    <CheckboxWithLabel v-model="enableUserPortal" :binary="true">
                      <template #label>Enable user portal for this user</template>
                    </CheckboxWithLabel>
                  </div>
                </CollapsiblePanel>

                <CollapsiblePanel v-model:collapsed="securityCollapsed" toggleable header="User Security Settings and Permissions">
                  <template #titleicon="iconProps">
                    <ShieldExclamationIcon :class="iconProps.class" />
                  </template>
                  <template #toggleicon="iconProps">
                    <ChevronRightIcon :class="iconProps.class" />
                  </template>
                  <div class="flex flex-col gap-6">
                    <p class="text-body-sm text-neutral-subtle">
                      Identity management account settings control how the user authenticates and what permissions they have across JumpCloud-managed resources.
                    </p>

                    <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                      <FormField label="Password Address" class="col-span-2">
                        <template #default="{ inputId }">
                          <PvInputText :id="inputId" v-model="passwordAddress" class="w-full" />
                        </template>
                      </FormField>
                      <FormField label="Encrypted Email Role">
                        <template #default="{ inputId }">
                          <PvSelect :id="inputId" v-model="encryptedEmailRole" :options="roleOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </template>
                      </FormField>
                    </div>

                    <div class="flex flex-col gap-3">
                      <h4 class="text-body-md-semi-bold text-neutral-base">Security Settings</h4>
                      <PvButton label="Reset Password" variant="outlined" severity="secondary" size="small" class="self-start" />
                      <CheckboxWithLabel v-model="setPasswordOnLogin" :binary="true">
                        <template #label>Set password and require change on next login</template>
                      </CheckboxWithLabel>
                      <CheckboxWithLabel v-model="allowPasswordReset" :binary="true">
                        <template #label>Allow user to reset their password</template>
                      </CheckboxWithLabel>
                    </div>

                    <div class="flex flex-col gap-3">
                      <h4 class="text-body-md-semi-bold text-neutral-base">Multi-factor Authentication</h4>
                      <CheckboxWithLabel v-model="requireMfaAccount" :binary="true">
                        <template #label>Require MFA on user's JumpCloud account</template>
                      </CheckboxWithLabel>
                      <CheckboxWithLabel v-model="requireMfaDevice" :binary="true">
                        <template #label>Require MFA on user's device login</template>
                        <template #description>When MFA is enabled, users who have set up TOTP or Push MFA will be prompted to authenticate on device login.</template>
                      </CheckboxWithLabel>
                    </div>

                    <div class="flex flex-col gap-3">
                      <h4 class="text-body-md-semi-bold text-neutral-base">Security Key (Optional)</h4>
                      <PvButton label="Add Key" severity="secondary" size="small" class="self-start" />
                    </div>

                    <div class="flex flex-col gap-3">
                      <h4 class="text-body-md-semi-bold text-neutral-base">Device Administrator</h4>
                      <CheckboxWithLabel v-model="deviceAdminAll" :binary="true">
                        <template #label>Device Administrator (All Devices)</template>
                        <template #description>Grants the user local administrator or sudo permissions on all bound devices.</template>
                      </CheckboxWithLabel>
                    </div>
                  </div>
                </CollapsiblePanel>

                <CollapsiblePanel v-model:collapsed="employmentCollapsed" toggleable header="Employment Information">
                  <template #titleicon="iconProps">
                    <BriefcaseIcon :class="iconProps.class" />
                  </template>
                  <template #toggleicon="iconProps">
                    <ChevronRightIcon :class="iconProps.class" />
                  </template>
                  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                    <FormField label="Employee ID">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="empId" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Job Title">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="jobTitle" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Company">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="company" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Manager">
                      <template #default="{ inputId }">
                        <PvSelect :id="inputId" v-model="manager" :options="managerOptions" optionLabel="label" optionValue="value" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Department">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="department" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Cost Center">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="costCenter" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Location">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="location" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Start Date">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="startDate" class="w-full" placeholder="YYYY-MM-DD" />
                      </template>
                    </FormField>
                    <FormField label="End Date">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="endDate" class="w-full" placeholder="YYYY-MM-DD" />
                      </template>
                    </FormField>
                  </div>
                  <p class="text-body-sm text-neutral-subtle mt-4">
                    Employment information is synced from your HR directory. Changes made here may be overwritten on the next sync.
                  </p>
                </CollapsiblePanel>

                <CollapsiblePanel v-model:collapsed="personalCollapsed" toggleable header="Personal Employee Information">
                  <template #titleicon="iconProps">
                    <IdentificationIcon :class="iconProps.class" />
                  </template>
                  <template #toggleicon="iconProps">
                    <ChevronRightIcon :class="iconProps.class" />
                  </template>
                  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                    <FormField label="First Name">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="personalFirstName" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Personal Email">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="personalEmailField" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Mobile Phone">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="mobilePhone" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Home Phone">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="homePhone" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="City">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="city" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="State">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="state" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Country">
                      <template #default="{ inputId }">
                        <PvSelect :id="inputId" v-model="country" :options="countryOptions" optionLabel="label" optionValue="value" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Address/Zip">
                      <template #default="{ inputId }">
                        <PvInputText :id="inputId" v-model="addressZip" class="w-full" />
                      </template>
                    </FormField>
                    <FormField label="Home Country" class="col-span-2">
                      <template #default="{ inputId }">
                        <PvSelect :id="inputId" v-model="homeCountry" :options="countryOptions" optionLabel="label" optionValue="value" class="w-full" />
                      </template>
                    </FormField>
                  </div>
                  <p class="text-body-sm text-neutral-subtle mt-4">
                    This data is used to store personal information for your records. Do not store sensitive personal data here.
                  </p>
                </CollapsiblePanel>

                <CollapsiblePanel v-model:collapsed="customAttrsCollapsed" toggleable header="Custom Attributes">
                  <template #titleicon="iconProps">
                    <TagIcon :class="iconProps.class" />
                  </template>
                  <template #toggleicon="iconProps">
                    <ChevronRightIcon :class="iconProps.class" />
                  </template>
                  <p class="text-body-sm text-neutral-subtle mb-4">
                    Use custom attributes to store additional information as key-value pairs on this user.
                  </p>
                  <PvButton label="Add Custom Attribute" severity="secondary" size="small" />
                </CollapsiblePanel>

                <CollapsiblePanel v-model:collapsed="publicKeysCollapsed" toggleable header="Public Keys">
                  <template #titleicon="iconProps">
                    <KeyIcon :class="iconProps.class" />
                  </template>
                  <template #toggleicon="iconProps">
                    <ChevronRightIcon :class="iconProps.class" />
                  </template>
                  <div class="bg-neutral-base rounded border border-neutral-default_solid p-3 mb-4">
                    <code class="text-body-sm text-neutral-base break-all">ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6+NFTO+kSk...</code>
                  </div>
                  <PvButton label="Add Public Key" severity="secondary" size="small" />
                </CollapsiblePanel>

              </div>
            </ConfigPageLayout>

            <!-- ============ TAB: USER GROUPS ============ -->
            <div v-if="activeTab === 'user-groups'" class="p-6 flex flex-col gap-4">
              <p class="text-body-md text-neutral-base">Burak Başcı is a member of the selected User Groups:</p>

              <div class="flex flex-col gap-0 -mt-4">
                <DataTableToolbar
                  searchPlaceholder="Search user groups..."
                  :showAddButton="false"
                  :showFilterButton="false"
                  :showRefreshButton="false"
                  :showColumnsButton="false"
                  :showDownloadButton="false"
                >
                  <template #saved-views>
                    <div class="flex items-center gap-4 px-2 py-1.5 text-body-md">
                      <CheckboxWithLabel v-model="showBoundGroups" :binary="true">
                        <template #label>show bound user groups (3)</template>
                      </CheckboxWithLabel>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <p class="text-body-md text-neutral-base whitespace-nowrap">
                        <span class="font-semibold">3 of 46</span> user groups bound
                      </p>
                    </div>
                  </template>
                </DataTableToolbar>

                <CircuitDataTable
                  :columns="userGroupsColumns"
                  :data="userGroupsData"
                  selectionMode="multiple"
                  :selection="selectedUserGroups"
                  @update:selection="selectedUserGroups = $event"
                />
              </div>
            </div>

            <!-- ============ TAB: DEVICES ============ -->
            <div v-if="activeTab === 'devices'" class="p-6 flex flex-col gap-4">
              <p class="text-body-md text-neutral-base">Burak Başcı has accounts on the selected devices:</p>

              <div class="flex flex-col gap-0 -mt-4">
                <DataTableToolbar
                  searchPlaceholder="Search devices..."
                  :showAddButton="false"
                  :showFilterButton="false"
                  :showRefreshButton="false"
                  :showColumnsButton="false"
                  :showDownloadButton="false"
                >
                  <template #saved-views>
                    <div class="flex items-center gap-4 px-2 py-1.5 text-body-md">
                      <CheckboxWithLabel v-model="showBoundDevices" :binary="true">
                        <template #label>show bound device (1)</template>
                      </CheckboxWithLabel>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <p class="text-body-md text-neutral-base whitespace-nowrap">
                        <span class="font-semibold">1 of 1</span> devices bound
                      </p>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <PvButton label="Run Users To Devices Report" variant="outlined" severity="secondary" size="small" />
                    </div>
                  </template>
                </DataTableToolbar>

                <CircuitDataTable
                  :columns="devicesColumns"
                  :data="devicesData"
                  selectionMode="multiple"
                  :selection="selectedDevices"
                  @update:selection="selectedDevices = $event"
                />
              </div>
            </div>

            <!-- ============ TAB: DIRECTORIES ============ -->
            <div v-if="activeTab === 'directories'" class="p-6 flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <p class="text-body-md text-neutral-base">Burak Başcı has the selected directories enabled:</p>
                <p class="text-body-md text-neutral-base whitespace-nowrap">
                  <span class="font-semibold">2 of 5</span> directories bound
                </p>
              </div>

              <CircuitDataTable
                :columns="directoriesColumns"
                :data="directoriesData"
                selectionMode="multiple"
                :selection="selectedDirectories"
                @update:selection="selectedDirectories = $event"
              />
            </div>

          </div>

          <!-- Footer -->
          <div class="shrink-0 flex items-center justify-end gap-3 px-6 py-3 border-t border-neutral-default_solid bg-neutral-base">
            <PvButton label="Cancel" severity="secondary" variant="text" />
            <PvButton label="Save User" />
          </div>
        </div>
      </div>
    </div>
  `,
});

// ─── Story Export ───

const meta: Meta<typeof UserDetailPage> = {
  title: "Projects/Burak's Playground/Pages/User Detail",
  component: UserDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof UserDetailPage>;

export const Default: Story = {};
