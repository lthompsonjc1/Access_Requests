import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent, computed } from 'vue';
import {
  AppNavigation,
  PageHeader,
  CollapsiblePanel,
  ToggleSwitch,
  CheckboxWithLabel,
  MessageNotification,
  ExportDropdown,
  DataTable as CircuitDataTable,
  DataTableToolbar,
  DataTableCellText,
  DataTableCellLink,
  DataTableCellStatus,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import SelectButton from 'primevue/selectbutton';

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
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';

import TopBar from '@/components/TopBar.vue';
import DetailsKeyValue from '@/components/DetailsKeyValue.vue';
import DetailPageLayout from '@/components/layout/page-layouts/DetailPageLayout.vue';

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

const tabs = [
  { label: 'Highlights', value: 'highlights' },
  { label: 'Insights', value: 'insights' },
  { label: 'Users', value: 'users' },
  { label: 'Device Groups', value: 'device-groups' },
  { label: 'MDM', value: 'mdm' },
  { label: 'Policies', value: 'policies' },
  { label: 'Policy Results', value: 'policy-results' },
  { label: 'Commands', value: 'commands' },
];

const insightsSubTabOptions = [
  { label: 'Summary', value: 'summary' },
  { label: 'System And Hardware', value: 'system-hardware' },
  { label: 'Operating System', value: 'operating-system' },
  { label: 'Software', value: 'software' },
  { label: 'Network', value: 'network' },
];

const dropdownItems = [
  { label: 'Lock Device', value: 'lock' },
  { label: 'Restart Device', value: 'restart' },
  { label: 'Shut Down', value: 'shutdown' },
  { label: 'Delete Device', value: 'delete' },
];

const deviceSidebarInfo = [
  { label: 'Device Name', value: 'AdmWin10Pro' },
  { label: 'Agent Status', value: 'Inactive' },
  { label: 'Last Contact', value: 'Sep 12, 2025 @ 08:51am' },
  { label: 'Restart Schedule', value: null },
  { label: 'Last Scheduled Restart', value: null },
  { label: 'Next Scheduled Restart', value: null },
  { label: 'JumpCloud System ID', value: '67e451c240bafb2cfab743e2' },
  { label: 'Private IP Address', value: '192.168.1.13' },
  { label: 'Vendor Model', value: 'Dell Inc.' },
  { label: 'Model', value: 'Precision 3580' },
  { label: 'OS', value: 'Windows 10 Pro (19045.5679)' },
  { label: 'Serial Number', value: '4F6HJS3' },
  { label: 'CPU', value: '13th Gen Intel(R) Core(TM) i5-1335U' },
  { label: 'Memory', value: '16 GB' },
  { label: 'Created', value: 'Mar 26, 2025 @ 10:13pm' },
];

const deviceActivityData = [
  { event: 'Authentication with Elevated Privileges', resourceStatus: '—', timestamp: '—' },
  { event: 'Device Group Change', resourceStatus: '—', timestamp: '—' },
  { event: 'Last Agent Report Time', resourceStatus: 'Agent v2.67.0', timestamp: 'Sep 12, 2025 @ 08:51:07:00' },
  { event: 'Last New User Assigned', resourceStatus: '—', timestamp: '—' },
  { event: 'Last User Login', resourceStatus: '—', timestamp: '—' },
  { event: 'Restart Schedule', resourceStatus: '—', timestamp: '—' },
  { event: 'Restart Scheduled By', resourceStatus: '—', timestamp: '—' },
  { event: 'User Admin Granted', resourceStatus: '—', timestamp: '—' },
  { event: 'User Admin Revoked', resourceStatus: '—', timestamp: '—' },
];

const usersData = [
  {
    id: 1,
    userState: 'ACTIVE',
    name: 'Srivastava, Abhin...',
    username: 'Abhinav.Srivastava',
    passwordStatus: 'Pending',
    passwordStatusSeverity: 'warn',
    passwordSync: 'Yes',
    mfaTotp: 'NOT ENROLLED',
    permissions: 'No Elevated Permissions',
    userType: 'Standard',
  },
  {
    id: 2,
    userState: 'ACTIVE',
    name: 'Test',
    username: 'Baladharshan',
    passwordStatus: 'Active',
    passwordStatusSeverity: 'success',
    passwordSync: 'Yes',
    mfaTotp: 'ENROLLED',
    permissions: 'No Elevated Permissions',
    userType: 'Standard',
  },
];

const deviceGroupsData = [
  { id: 1, group: 'All Devices', groupType: 'Group of Devices', numDevices: 18, membershipControls: 'Static', defaultGroup: '' },
  { id: 2, group: 'Release Name', groupType: 'Group of Devices', numDevices: 18, membershipControls: 'Dynamic', defaultGroup: '' },
  { id: 3, group: 'Windows 10', groupType: 'Group of Devices', numDevices: 18, membershipControls: 'Dynamic', defaultGroup: '' },
];

const localDeviceAccounts = [
  { username: 'Administrator', managedBy: 'Unknown', permissions: 'Admin', lastLogin: 'No Logins' },
  { username: 'dell', managedBy: 'Unknown', permissions: 'Admin', lastLogin: '09-12-2025 at 08:24am' },
];

const bitlockerData = [
  { drive: 'C:', encryptionStatus: 'Encrypted (Suspended)', encryptionMethod: 'XTS_AES_128' },
];

const certificatesData = [
  { name: '2B36B015-FAFF-44BD-9E0C-47C39119522C1E6C3BCF84C8D4013083C025008', expirationDate: '03-26-2026' },
  { name: '2B36B015-FAFF-44BD-9E0C-47C39119522C1E6C3BCF84C8D4013083C025008', expirationDate: '03-26-2026' },
  { name: '2B36B015-FAFF-44BD-9E0C-47C39119522C1E6C3BCF84C8D4013083C025008', expirationDate: '03-26-2026' },
  { name: '4F6HJS3', expirationDate: '04-23-2026' },
  { name: 'AAA Certificate Services', expirationDate: '01-01-2029' },
  { name: 'AAA Certificate Services', expirationDate: '01-01-2029' },
  { name: 'AAA Certificate Services', expirationDate: '01-01-2029' },
];

const logicalDrivesData = [
  { device: 'C:', storage: '474.05 GB', storageAvailable: '364.96 GB (77%)' },
];

const chromeExtensions = [
  { name: 'Chrome Web Store Payments', version: '1.0.0.6' },
  { name: 'Edge relevant text changes', version: '1.2.1' },
  { name: 'Google Docs Offline', version: '1.96.1' },
  { name: 'Google Docs Offline', version: '1.95.1' },
];

const ieExtensions = [
  { name: '—', registryPath: 'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects\\{1FD49718-1D00-4B19-AF5F-070AF6D5D54C}', version: '—' },
  { name: '—', registryPath: 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects\\{1FD49718-1D00-4B19-AF5F-070AF6D5D54C}', version: '—' },
  { name: 'Microsoft Url Search Hook', registryPath: 'HKEY_USERS\\S-1-5-21-4048846621-1693297072-2218440644-1004\\SOFTWARE\\Microsoft\\Internet Explorer\\URLSearchHooks\\{CFBFAE00-17A6-11D0-99CB-00C04FD64497}', version: '11.0.19041.5563' },
  { name: 'Microsoft Url Search Hook', registryPath: 'HKEY_USERS\\S-1-6-20\\SOFTWARE\\Microsoft\\Internet Explorer\\URLSearchHooks\\{CFBFAE00-17A6-', version: '11.0.19041.5653' },
];

const programsData = [
  { name: '—', version: '—', installDate: '—' },
  { name: '—', version: '1.3.195.69', installDate: '—' },
  { name: '—', version: '—', installDate: '—' },
  { name: '—', version: '—', installDate: '—' },
  { name: '—', version: '—', installDate: '—' },
  { name: '—', version: '—', installDate: '—' },
  { name: '—', version: '—', installDate: '—' },
  { name: 'Dell Command | Update for Windows 10', version: '4.3.0', installDate: '05-11-2023' },
  { name: 'Dell ControlVault Host Components Installer', version: '5.15.10.14', installDate: '04-16-2025' },
];

const interfaceAddresses = [
  { iface: '1', address: '127.0.0.1' },
  { iface: '1', address: '::1' },
  { iface: '10', address: '169.254.120.94' },
  { iface: '10', address: 'fe80::146:3c8a:681c:4701' },
  { iface: '14', address: '192.168.1.13' },
  { iface: '14', address: 'fe80::714b:235c:5bd3:b632' },
  { iface: '18', address: 'fe80::cfb7:1916:3443:43aa' },
  { iface: '18', address: '169.254.243.137' },
];

const interfaceDetails = [
  { iface: '1', macAddress: '—', connectionStatus: '—', bandwidth: '—' },
  { iface: '10', macAddress: '08:9d:f4:e0:53:d9', connectionStatus: '7', bandwidth: '—' },
  { iface: '12', macAddress: '0a:9d:f4:e0:53:d5', connectionStatus: '0', bandwidth: '—' },
  { iface: '14', macAddress: '08:9d:f4:e0:53:d5', connectionStatus: '2', bandwidth: '—' },
  { iface: '18', macAddress: 'ac:1a:3d:a2:3c:55', connectionStatus: '7', bandwidth: '—' },
  { iface: '6', macAddress: '08:9d:f4:e0:53:d6', connectionStatus: '0', bandwidth: '—' },
];

const commandsData = [
  { id: 1, name: 'Bootstrap Status', command: '#!/bin/bash profiles status -type bootstraptoken profiles validate -type' },
];

const deviceActivityColumns = [
  { field: 'event', header: 'Event', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.event }) },
  { field: 'resourceStatus', header: 'Resource/Status', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.resourceStatus }) },
  { field: 'timestamp', header: 'Timestamp', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.timestamp }) },
];

const localDeviceAccountsColumns = [
  { field: 'username', header: 'Username', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.username }) },
  { field: 'managedBy', header: 'Managed by', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.managedBy }) },
  { field: 'permissions', header: 'Permissions', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.permissions }) },
  { field: 'lastLogin', header: 'Last Login', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.lastLogin }) },
];

const bitlockerColumns = [
  { field: 'drive', header: 'Drive', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.drive }) },
  { field: 'encryptionStatus', header: 'Encryption Status', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.encryptionStatus }) },
  { field: 'encryptionMethod', header: 'Encryption Method', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.encryptionMethod }) },
];

const certificatesColumns = [
  { field: 'name', header: 'Name', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name }) },
  { field: 'expirationDate', header: 'Expiration Date', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.expirationDate }) },
];

const logicalDrivesColumns = [
  { field: 'device', header: 'Device', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.device }) },
  { field: 'storage', header: 'Storage', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.storage }) },
  { field: 'storageAvailable', header: 'Storage Available', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.storageAvailable }) },
];

const chromeExtensionsColumns = [
  { field: 'name', header: 'Name', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name }) },
  { field: 'version', header: 'Version', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.version }) },
];

const ieExtensionsColumns = [
  { field: 'name', header: 'Name', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name }) },
  { field: 'registryPath', header: 'Registry Path', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.registryPath }) },
  { field: 'version', header: 'Version', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.version }) },
];

const programsColumns = [
  { field: 'name', header: 'Name', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name }) },
  { field: 'version', header: 'Version', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.version }) },
  { field: 'installDate', header: 'Install Date', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.installDate }) },
];

const interfaceAddressesColumns = [
  { field: 'iface', header: 'Interface', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.iface }) },
  { field: 'address', header: 'Address', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.address }) },
];

const interfaceDetailsColumns = [
  { field: 'iface', header: 'Interface', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.iface }) },
  { field: 'macAddress', header: 'MAC Address', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.macAddress }) },
  { field: 'connectionStatus', header: 'Connection Status', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.connectionStatus }) },
  { field: 'bandwidth', header: 'Bandwidth (MB/S)', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.bandwidth }) },
];

const usersColumns = [
  { field: 'userState', header: 'User State', sortable: true, component: markRaw(DataTableCellStatus), componentProps: (sp: { data: Record<string, unknown> }) => ({ type: 'Status', statusLabel: sp.data.userState }) },
  { field: 'name', header: 'Name', sortable: true, width: '200px', component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name, description: sp.data.username, href: '#' }) },
  { field: 'passwordStatus', header: 'Password Status', sortable: true, component: markRaw(DataTableCellStatus), componentProps: (sp: { data: Record<string, unknown> }) => ({ type: 'Status', statusLabel: sp.data.passwordStatus }) },
  { field: 'passwordSync', header: 'Password Sync', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.passwordSync }) },
  { field: 'mfaTotp', header: 'MFA:TOTP', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.mfaTotp }) },
  { field: 'permissions', header: 'Permissions', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.permissions }) },
  { field: 'userType', header: 'User Type', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.userType }) },
];

const deviceGroupsColumns = [
  { field: 'group', header: 'Group', sortable: true, width: '240px', component: markRaw(DataTableCellLink), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.group, description: sp.data.groupType, icon: markRaw(ComputerDesktopIcon), href: '#' }) },
  { field: 'numDevices', header: 'Number of Devices', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.numDevices }) },
  { field: 'membershipControls', header: 'Device Membership Controls', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.membershipControls }) },
  { field: 'defaultGroup', header: 'Default Group', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.defaultGroup || '—' }) },
];

const policiesColumns = [
  { field: 'policy', header: 'Policy', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.policy }) },
];

const policyResultsColumns = [
  { field: 'status', header: 'Status', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.status }) },
  { field: 'policy', header: 'Policy', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.policy }) },
  { field: 'details', header: 'Details', component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.details }) },
];

const commandsColumns = [
  { field: 'name', header: 'Name', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.name }) },
  { field: 'command', header: 'Command', sortable: true, component: markRaw(DataTableCellText), componentProps: (sp: { data: Record<string, unknown> }) => ({ label: sp.data.command }) },
  { field: 'action', header: '', component: markRaw(DataTableCellLink), componentProps: () => ({ label: 'Run Command', href: '#' }) },
];

const insightsSidebarSections: Record<string, string[]> = {
  summary: ['Device Usage', 'Local Device Accounts', 'Hardware', 'Device Info', 'Network'],
  'system-hardware': ['Bitlocker Info', 'Certificates', 'Disk Info', 'Logical Drives', 'Patches', 'Scheduled Tasks', 'Secure Boot', 'Services', 'Shared Resources', 'Startup Items', 'System Info', 'TPM Info'],
  'operating-system': ['Kernel'],
  software: ['Chrome Extensions', 'Internet Explorer Extensions', 'Programs'],
  network: ['ETC Hosts', 'Interface Addresses', 'Interface Details'],
};

const DevicesPage = defineComponent({
  name: 'DevicesPage',
  components: {
    AppNavigation,
    PageHeader,
    CollapsiblePanel,
    ToggleSwitch,
    PvButton: Button,
    PvTag: Tag,
    PvSelectButton: SelectButton,
    MessageNotification,
    CheckboxWithLabel,
    CircuitDataTable,
    DataTableToolbar,
    TopBar,
    DetailsKeyValue,
    DetailPageLayout,
    ExportDropdown,
    MagnifyingGlassIcon,
  },
  setup() {
    const activeTab = ref('highlights');
    const insightsSubTab = ref('summary');

    const systemInsights = ref(true);
    const mfaLogin = ref(false);
    const showBoundUsers = ref(true);
    const showBoundGroups = ref(true);
    const showBoundPolicies = ref(true);
    const showBoundCommands = ref(true);
    const showWarning = ref(true);

    const exportOptions = [
      { id: 'csv', label: 'Export as CSV' },
      { id: 'json', label: 'Export as JSON' },
    ];

    const selectedUsers = ref([...usersData]);
    const selectedGroups = ref([...deviceGroupsData]);
    const selectedPolicies = ref([] as typeof deviceGroupsData);
    const selectedCommands = ref([...commandsData]);

    const currentSidebarSections = computed(() => {
      return insightsSidebarSections[insightsSubTab.value] || [];
    });

    return {
      menuItems,
      profileMenuItems,
      tabs,
      dropdownItems,
      activeTab,
      insightsSubTab,
      insightsSubTabOptions,
      exportOptions,
      systemInsights,
      mfaLogin,
      showBoundUsers,
      showBoundGroups,
      showBoundPolicies,
      showBoundCommands,
      showWarning,
      selectedUsers,
      selectedGroups,
      selectedPolicies,
      selectedCommands,
      deviceSidebarInfo,
      deviceActivityData,
      deviceActivityColumns,
      usersData,
      usersColumns,
      deviceGroupsData,
      deviceGroupsColumns,
      localDeviceAccounts,
      localDeviceAccountsColumns,
      bitlockerData,
      bitlockerColumns,
      certificatesData,
      certificatesColumns,
      logicalDrivesData,
      logicalDrivesColumns,
      chromeExtensions,
      chromeExtensionsColumns,
      ieExtensions,
      ieExtensionsColumns,
      programsData,
      programsColumns,
      interfaceAddresses,
      interfaceAddressesColumns,
      interfaceDetails,
      interfaceDetailsColumns,
      commandsData,
      commandsColumns,
      policiesColumns,
      policyResultsColumns,
      currentSidebarSections,
      DeviceListsIcon: markRaw(DeviceListsIcon),
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="device management"
        :collapsible="true"
        :topNavToggle="true"
      />
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        <PageHeader
          title="AdmWin10Pro"
          :icon="DeviceListsIcon"
          subtitleText="Primary User: Unassigned  ·  Serial Number: 4F6HJS3  ·  OS: Windows 10 Pro (19045.5679)"
          :tabs="tabs"
          :activeTab="activeTab"
          :dropdownItems="dropdownItems"
          @update:activeTab="activeTab = $event"
        />

        <div class="flex-1 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-auto bg-neutral-surface">

            <!-- ============ TAB: HIGHLIGHTS ============ -->
            <DetailPageLayout v-if="activeTab === 'highlights'" class="w-full! h-full!">
              <div class="flex flex-col gap-6">

                <CollapsiblePanel header="Device Configuration">
                  <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                      <ToggleSwitch v-model="systemInsights" />
                      <div>
                        <p class="text-body-md text-neutral-base">System Insights Enabled</p>
                        <p class="text-body-sm text-neutral-subtle mt-1">JumpCloud will capture additional information from the system for enhanced reporting. Available for 64-bit systems only.</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <ToggleSwitch v-model="mfaLogin" />
                      <div>
                        <p class="text-body-md text-neutral-base">MFA Login Disabled</p>
                        <p class="text-body-sm text-neutral-subtle mt-1">When MFA is enabled on a device, users who have set up TOTP or Push MFA will be prompted to authenticate their identity on their device upon login.</p>
                      </div>
                    </div>
                  </div>
                </CollapsiblePanel>

                <CollapsiblePanel header="Users (4)">
                  <div class="grid grid-cols-2 gap-6">
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-body-md-semi-bold text-neutral-base">Bound</span>
                        <PvTag value="2" severity="info" rounded />
                      </div>
                      <div class="flex flex-col gap-1">
                        <a class="text-body-md text-primary-base cursor-pointer hover:underline">Baladharshan</a>
                        <a class="text-body-md text-primary-base cursor-pointer hover:underline">Abhinav.Srivastava</a>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-body-md-semi-bold text-neutral-base">Unmanaged</span>
                        <PvTag value="2" severity="info" rounded />
                      </div>
                      <div class="flex flex-col gap-1">
                        <span class="text-body-md text-neutral-base">dell</span>
                        <span class="text-body-md text-neutral-base">Administrator</span>
                      </div>
                    </div>
                  </div>
                </CollapsiblePanel>

                <div class="grid grid-cols-2 gap-6">
                  <CollapsiblePanel header="Groups (3)">
                    <template #actions>
                      <PvButton label="All Groups" variant="outlined" severity="secondary" size="small" />
                    </template>
                    <div class="flex flex-col gap-1">
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">All Devices</a>
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">Windows 10</a>
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">Release Name</a>
                    </div>
                  </CollapsiblePanel>
                  <CollapsiblePanel header="Policies (23)">
                    <template #actions>
                      <PvButton label="All Policies Results" variant="outlined" severity="secondary" size="small" />
                    </template>
                    <div class="flex flex-col gap-1">
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">JC Standard Security - Lock Screen - Apple</a>
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">JC Standard Security - App Store Restrictions</a>
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">JC Standard Security - Require Passcode for User-Enrolled Devices</a>
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">JC Standard Security - FileVault 2</a>
                      <a class="text-body-md text-primary-base cursor-pointer hover:underline">JC Standard Security - System Preferences Control</a>
                    </div>
                  </CollapsiblePanel>
                </div>

                <CollapsiblePanel header="Asset Information">
                  <template #actions>
                    <PvButton label="Go to Asset Detail" variant="outlined" severity="secondary" size="small" />
                  </template>
                  <div class="grid grid-cols-2 gap-y-3 gap-x-8">
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">Asset Status</dt>
                      <dd class="mt-1"><PvTag value="MAINTENANCE" severity="warn" /></dd>
                    </div>
                    <div>
                      <dt class="text-body-sm text-neutral-subtle">Deployed Date</dt>
                      <dd class="text-body-sm text-neutral-base mt-1">Mar 26, 2025 @ 10:13pm</dd>
                    </div>
                  </div>
                </CollapsiblePanel>

                <CollapsiblePanel header="Device Activity">
                  <template #actions>
                    <PvButton label="Activity Log" variant="outlined" severity="secondary" size="small" />
                  </template>
                  <CircuitDataTable :columns="deviceActivityColumns" :data="deviceActivityData" size="small" :card="false" />
                </CollapsiblePanel>
              </div>

              <template #sidebar>
                <div class="flex flex-col gap-3">
                  <DetailsKeyValue
                    v-for="item in deviceSidebarInfo"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </div>
              </template>
            </DetailPageLayout>

            <!-- ============ TAB: INSIGHTS ============ -->
            <DetailPageLayout v-if="activeTab === 'insights'" class="w-full! h-full!">
              <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between">
                  <PvSelectButton
                    v-model="insightsSubTab"
                    :options="insightsSubTabOptions"
                    optionLabel="label"
                    optionValue="value"
                  />
                  <ExportDropdown :options="exportOptions" />
                </div>

                <template v-if="insightsSubTab === 'summary'">
                  <CollapsiblePanel header="Device Usage">
                    <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Status</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Inactive, System Not Reporting</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Last Contact</dt>
                        <dd class="text-body-md text-neutral-base mt-1">5 months ago</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Uptime</dt>
                        <dd class="text-body-md text-neutral-ghost mt-1">—</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Memory</dt>
                        <dd class="text-body-md text-neutral-base mt-1">16 GB</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Storage Available</dt>
                        <dd class="text-body-md text-neutral-base mt-1">364.96 GB (77%)</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Disk Encrypted</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Encrypted (Suspended)</dd>
                      </div>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Local Device Accounts">
                    <CircuitDataTable :columns="localDeviceAccountsColumns" :data="localDeviceAccounts" size="small" :card="false" />
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Hardware">
                    <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">OS</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Microsoft Windows 10 Pro</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">OS Version</dt>
                        <dd class="text-body-md text-neutral-base mt-1">10 (19045.5679)</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">OS Build Version</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Unknown</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Architecture</dt>
                        <dd class="text-body-md text-neutral-base mt-1">x86_64</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Vendor</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Dell Inc.</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Model</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Precision 3580</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Serial Number</dt>
                        <dd class="text-body-md text-neutral-base mt-1">4F6HJS3</dd>
                      </div>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Device Info">
                    <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">JumpCloud Instance ID</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Unknown</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">JumpCloud System ID</dt>
                        <dd class="text-body-md text-neutral-base mt-1">67e451c240bafb2cfab743e2</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">JC Agent Version</dt>
                        <dd class="text-body-md text-neutral-base mt-1">2.67.0</dd>
                      </div>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Network">
                    <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Hostname</dt>
                        <dd class="text-body-md text-neutral-base mt-1">AdmWin10Pro</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Primary Adapter IP</dt>
                        <dd class="text-body-md text-neutral-base mt-1">192.168.1.13</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Remote IP</dt>
                        <dd class="text-body-md text-neutral-base mt-1">122.173.183.100</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">10 MAC Address</dt>
                        <dd class="text-body-md text-neutral-base mt-1">08:9d:f4:e0:53:d9</dd>
                      </div>
                    </div>
                  </CollapsiblePanel>
                </template>

                <template v-if="insightsSubTab === 'system-hardware'">
                  <CollapsiblePanel header="Bitlocker Info">
                    <CircuitDataTable :columns="bitlockerColumns" :data="bitlockerData" size="small" :card="false" />
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Certificates">
                    <CircuitDataTable :columns="certificatesColumns" :data="certificatesData" :paginator="true" :rows="10" size="small" :card="false" />
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Disk Info">
                    <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Partitions</dt>
                        <dd class="text-body-md text-neutral-base mt-1">4</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Disk Index</dt>
                        <dd class="text-body-md text-neutral-base mt-1">0</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Type</dt>
                        <dd class="text-body-md text-neutral-base mt-1">SCSI</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Id</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">\\\\.\\PHYSICALDRIVE0</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Pnp Device Id</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">SCSI\\DISK&amp;VEN_NVME&amp;PROD_MICRON_2450_N...</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Disk Size</dt>
                        <dd class="text-body-md text-neutral-base mt-1">476.94 GB</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Manufacturer</dt>
                        <dd class="text-body-md text-neutral-base mt-1">(Standard disk drives)</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Hardware Model</dt>
                        <dd class="text-body-md text-neutral-base mt-1">NVMe Micron 2450 NVMe 512GB</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Name</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">\\\\.\\PHYSICALDRIVE0</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Serial</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">0000_0000_0001_00A0_7523_3E91_FBD7...</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Description</dt>
                        <dd class="text-body-md text-neutral-base mt-1">Disk drive</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">System Id</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">67e451c240bafb2cfab743e2</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Collection Time</dt>
                        <dd class="text-body-md text-neutral-base mt-1">03-26-2025 at 10:14pm</dd>
                      </div>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Logical Drives">
                    <CircuitDataTable :columns="logicalDrivesColumns" :data="logicalDrivesData" size="small" :card="false" />
                  </CollapsiblePanel>
                </template>

                <template v-if="insightsSubTab === 'operating-system'">
                  <CollapsiblePanel header="Kernel">
                    <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Version</dt>
                        <dd class="text-body-md text-neutral-base mt-1">10.0.19041.5678</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Arguments</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">NOEXECUTE=OPTIN FVEBOOT=2125824 NOVGA</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Path</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">C:\\Windows\\System32\\ntoskrnl.exe</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Device</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">\\\\?\\Volume{3b794db-f3f9-4981-91dd-f1e15768d8c4}\\</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">System Id</dt>
                        <dd class="text-body-md text-neutral-base mt-1 break-all">67e451c240bafb2cfab743e2</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Collection Time</dt>
                        <dd class="text-body-md text-neutral-base mt-1">03-26-2025 at 10:13pm</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">OS System Family</dt>
                        <dd class="text-body-md text-neutral-ghost mt-1">—</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">OS Marketing Name</dt>
                        <dd class="text-body-md text-neutral-ghost mt-1">—</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">OS Build Version</dt>
                        <dd class="text-body-md text-neutral-ghost mt-1">—</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Supplemental Build Version</dt>
                        <dd class="text-body-md text-neutral-ghost mt-1">—</dd>
                      </div>
                      <div>
                        <dt class="text-body-sm text-neutral-subtle">Supplemental Build Extra Version</dt>
                        <dd class="text-body-md text-neutral-ghost mt-1">—</dd>
                      </div>
                    </div>
                  </CollapsiblePanel>
                </template>

                <template v-if="insightsSubTab === 'software'">
                  <CollapsiblePanel header="Chrome Extensions">
                    <CircuitDataTable :columns="chromeExtensionsColumns" :data="chromeExtensions" size="small" :card="false" />
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Internet Explorer Extensions">
                    <CircuitDataTable :columns="ieExtensionsColumns" :data="ieExtensions" size="small" :card="false" />
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Programs">
                    <CircuitDataTable :columns="programsColumns" :data="programsData" :paginator="true" :rows="10" size="small" :card="false" />
                  </CollapsiblePanel>
                </template>

                <template v-if="insightsSubTab === 'network'">
                  <CollapsiblePanel header="ETC Hosts">
                    <div class="flex flex-col items-center justify-center py-8 text-neutral-subtle">
                      <MagnifyingGlassIcon class="size-12 mb-2 text-neutral-ghost" />
                      <p class="text-body-md">No results found.</p>
                    </div>
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Interface Addresses">
                    <CircuitDataTable :columns="interfaceAddressesColumns" :data="interfaceAddresses" :paginator="true" :rows="10" size="small" :card="false" />
                  </CollapsiblePanel>

                  <CollapsiblePanel header="Interface Details">
                    <CircuitDataTable :columns="interfaceDetailsColumns" :data="interfaceDetails" size="small" :card="false" />
                  </CollapsiblePanel>
                </template>
              </div>

              <template #sidebar>
                <nav class="flex flex-col gap-0.5">
                  <a
                    v-for="(section, idx) in currentSidebarSections"
                    :key="section"
                    :class="[
                      'px-3 py-1.5 rounded cursor-pointer',
                      idx === 0 ? 'text-body-md-semi-bold text-neutral-base' : 'text-body-md text-neutral-subtle hover:text-neutral-base'
                    ]"
                  >
                    {{ section }}
                  </a>
                </nav>
              </template>
            </DetailPageLayout>

            <!-- ============ TAB: USERS ============ -->
            <div v-if="activeTab === 'users'" class="p-6 flex flex-col gap-4">
              <MessageNotification v-if="showWarning" severity="warn" :closable="true" title="No Primary User is assigned to this device." @close="showWarning = false" />

              <div class="flex flex-col gap-0 -mt-4">
                <DataTableToolbar
                  searchPlaceholder="Search users..."
                  :showAddButton="false"
                  :showFilterButton="false"
                  :showRefreshButton="false"
                  :showColumnsButton="false"
                  :showDownloadButton="false"
                >
                  <template #saved-views>
                    <div class="flex items-center gap-4 px-2 py-1.5 text-body-md">
                      <CheckboxWithLabel v-model="showBoundUsers" :binary="true">
                        <template #label>Show bound device users</template>
                      </CheckboxWithLabel>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <p class="text-body-md text-neutral-base whitespace-nowrap">
                        <span class="font-semibold">2 of 90</span> users bound
                      </p>
                    </div>
                  </template>
                </DataTableToolbar>

                <CircuitDataTable
                  :columns="usersColumns"
                  :data="usersData"
                  selectionMode="multiple"
                  :selection="selectedUsers"
                  @update:selection="selectedUsers = $event"
                />
              </div>
            </div>

            <!-- ============ TAB: DEVICE GROUPS ============ -->
            <div v-if="activeTab === 'device-groups'" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-0 -mt-4">
                <DataTableToolbar
                  searchPlaceholder="Search device groups..."
                  :showAddButton="false"
                  :showFilterButton="false"
                  :showRefreshButton="false"
                  :showColumnsButton="false"
                  :showDownloadButton="false"
                >
                  <template #saved-views>
                    <div class="flex items-center gap-4 px-2 py-1.5 text-body-md">
                      <CheckboxWithLabel v-model="showBoundGroups" :binary="true">
                        <template #label>Show bound device groups</template>
                      </CheckboxWithLabel>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <p class="text-body-md text-neutral-base whitespace-nowrap">
                        <span class="font-semibold">3 of 35</span> device groups bound
                      </p>
                    </div>
                  </template>
                </DataTableToolbar>

                <CircuitDataTable
                  :columns="deviceGroupsColumns"
                  :data="deviceGroupsData"
                  selectionMode="multiple"
                  :selection="selectedGroups"
                  @update:selection="selectedGroups = $event"
                />
              </div>
            </div>

            <!-- ============ TAB: MDM ============ -->
            <div v-if="activeTab === 'mdm'" class="p-6">
              <CollapsiblePanel header="MDM Enrollment Info">
                <div class="grid grid-cols-3 gap-y-4 gap-x-8">
                  <div>
                    <dt class="text-body-sm text-neutral-subtle">MDM Enrolled</dt>
                    <dd class="text-body-md text-neutral-base mt-1">yes</dd>
                  </div>
                  <div>
                    <dt class="text-body-sm text-neutral-subtle">Provider ID</dt>
                    <dd class="text-body-md text-neutral-base mt-1">JumpCloudMDM</dd>
                  </div>
                  <div>
                    <dt class="text-body-sm text-neutral-subtle">Enrolled By</dt>
                    <dd class="text-body-md text-neutral-base mt-1">sushree.m@jumpcloud.com</dd>
                  </div>
                </div>
              </CollapsiblePanel>
            </div>

            <!-- ============ TAB: POLICIES ============ -->
            <div v-if="activeTab === 'policies'" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-0 -mt-4">
                <DataTableToolbar
                  searchPlaceholder="Search policies..."
                  :showAddButton="false"
                  :showFilterButton="false"
                  :showRefreshButton="false"
                  :showColumnsButton="false"
                  :showDownloadButton="false"
                >
                  <template #saved-views>
                    <div class="flex items-center gap-4 px-2 py-1.5 text-body-md">
                      <CheckboxWithLabel v-model="showBoundPolicies" :binary="true">
                        <template #label>Show bound device policies</template>
                      </CheckboxWithLabel>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <p class="text-body-md text-neutral-base whitespace-nowrap">
                        <span class="font-semibold">0 of 33</span> device policies bound
                      </p>
                    </div>
                  </template>
                </DataTableToolbar>

                <CircuitDataTable
                  :columns="policiesColumns"
                  :data="[]"
                  selectionMode="multiple"
                  :selection="selectedPolicies"
                  @update:selection="selectedPolicies = $event"
                />
              </div>
            </div>

            <!-- ============ TAB: POLICY RESULTS ============ -->
            <div v-if="activeTab === 'policy-results'" class="p-6">
              <CircuitDataTable :columns="policyResultsColumns" :data="[]" />
            </div>

            <!-- ============ TAB: COMMANDS ============ -->
            <div v-if="activeTab === 'commands'" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-0 -mt-4">
                <DataTableToolbar
                  searchPlaceholder="Search commands..."
                  :showAddButton="false"
                  :showFilterButton="false"
                  :showRefreshButton="false"
                  :showColumnsButton="false"
                  :showDownloadButton="false"
                >
                  <template #saved-views>
                    <div class="flex items-center gap-4 px-2 py-1.5 text-body-md">
                      <CheckboxWithLabel v-model="showBoundCommands" :binary="true">
                        <template #label>Show bound commands</template>
                      </CheckboxWithLabel>
                      <div class="border-l border-neutral-default_solid h-5 shrink-0" />
                      <p class="text-body-md text-neutral-base whitespace-nowrap">
                        <span class="font-semibold">1 of 21</span> commands bound
                      </p>
                    </div>
                  </template>
                </DataTableToolbar>

                <CircuitDataTable
                  :columns="commandsColumns"
                  :data="commandsData"
                  selectionMode="multiple"
                  :selection="selectedCommands"
                  @update:selection="selectedCommands = $event"
                />
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="shrink-0 flex items-center justify-end gap-3 px-6 py-3 border-t border-neutral-default_solid bg-neutral-base">
            <PvButton label="Cancel" severity="secondary" variant="text" />
            <PvButton label="Save Device" />
          </div>
        </div>
      </div>
    </div>
  `,
});

const meta: Meta<typeof DevicesPage> = {
  title: "Projects/Burak's Playground/Pages/Devices",
  component: DevicesPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DevicesPage>;

export const Default: Story = {};
