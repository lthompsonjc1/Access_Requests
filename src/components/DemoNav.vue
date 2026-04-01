<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue';
import { AppNavigation, FormField } from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
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
  XMarkIcon,
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

export interface DemoNavProps {
  activeItem?: string;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}

const props = withDefaults(defineProps<DemoNavProps>(), {
  activeItem: 'home',
  userName: 'Demo User',
  userEmail: 'demo@jumpcloud.com',
  userInitials: 'DU',
});

const emit = defineEmits<{
  (e: 'navigate', label: string): void;
  (e: 'settings-saved', settings: { dataMode: string; apiKey: string }): void;
}>();

const STORAGE_KEYS = {
  dataMode: 'demoNav.dataMode',
  apiKey: 'demoNav.apiKey',
} as const;

const DATA_MODE_OPTIONS = ['Mock Data', 'Live Data'];

const showSettingsDialog = ref(false);
const dataMode = ref('Mock Data');
const apiKey = ref('');

function hydrateFromStorage() {
  const savedMode = localStorage.getItem(STORAGE_KEYS.dataMode);
  dataMode.value = savedMode === 'Live Data' ? 'Live Data' : 'Mock Data';
  apiKey.value = localStorage.getItem(STORAGE_KEYS.apiKey) ?? '';
}

onMounted(hydrateFromStorage);

function openDemoSettings() {
  hydrateFromStorage();
  showSettingsDialog.value = true;
}

function cancelDemoSettings() {
  hydrateFromStorage();
  showSettingsDialog.value = false;
}

function saveDemoSettings() {
  localStorage.setItem(STORAGE_KEYS.dataMode, dataMode.value);
  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey.value);
  showSettingsDialog.value = false;
  emit('settings-saved', { dataMode: dataMode.value, apiKey: apiKey.value });
}

type ProcessedNavItem = {
  item?: { label?: string };
  items?: unknown[];
};

function onNavClick(processedItem: ProcessedNavItem) {
  if (Array.isArray(processedItem?.items) && processedItem.items.length > 0) return;
  const label = processedItem?.item?.label;
  if (label === 'Demo Settings') {
    openDemoSettings();
  } else if (label) {
    emit('navigate', label);
  }
}

const menuItems = [
  { label: 'Get Started', leftIcon: markRaw(RocketLaunchIcon) },
  { label: 'Home', leftIcon: markRaw(HomeIcon) },
  { label: 'Alerts', leftIcon: markRaw(BellIcon), count: 25 },
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
  { label: 'Workflows', leftIcon: markRaw(WorkflowIcon) },
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
  { label: 'Settings', leftIcon: markRaw(Cog6ToothIcon) },
];

const profileMenuItems = [
  {
    label: props.userName,
    itemType: 'profile_compact',
    initials: props.userInitials,
    name: props.userName,
    items: [
      {
        label: props.userName,
        itemType: 'profile_large',
        name: props.userName,
        email: props.userEmail,
        initials: props.userInitials,
      },
      { separator: true },
      {
        label: 'Logout',
        itemType: 'normal',
        rightIcon: markRaw(ArrowRightStartOnRectangleIcon),
      },
      { separator: true },
      { label: 'Change Password', itemType: 'normal' },
      {
        label: 'Launch User Portal',
        itemType: 'normal',
        rightIcon: markRaw(ArrowTopRightOnSquareIcon),
      },
      { separator: true },
      { label: 'Billing', itemType: 'normal' },
      { label: 'My API Key', itemType: 'normal' },
      { separator: true },
      {
        label: 'Demo Settings',
        itemType: 'normal',
        leftIcon: markRaw(Cog6ToothIcon),
      },
    ],
  },
];
</script>

<template>
  <AppNavigation
    :menu-items="menuItems"
    :profile-menu-items="profileMenuItems"
    :active-item="activeItem"
    collapsible
    top-nav-toggle
    @click="onNavClick"
  />

  <Dialog
    v-model:visible="showSettingsDialog"
    :draggable="false"
    modal
    header="Demo Settings"
    :style="{ width: '480px' }"
  >
    <template #closeicon><XMarkIcon class="w-5 h-5" /></template>
    <div class="flex flex-col gap-md">
      <FormField label="Data Source">
        <template #default="{ inputId }">
          <SelectButton
            :id="inputId"
            v-model="dataMode"
            :options="DATA_MODE_OPTIONS"
            :allow-empty="false"
          />
        </template>
      </FormField>
      <FormField label="API Key">
        <template #default="{ inputId }">
          <InputText :id="inputId" v-model="apiKey" class="w-full" :disabled="dataMode === 'Mock Data'" :placeholder="dataMode === 'Mock Data' ? 'Not needed for mock data' : 'Enter your JumpCloud API key'" />
        </template>
      </FormField>
    </div>
    <template #footer>
      <div class="flex items-center flex-1 min-w-0" />
      <div class="flex gap-sm shrink-0">
        <Button label="Cancel" severity="secondary" variant="text" @click="cancelDemoSettings" />
        <Button label="Save" @click="saveDemoSettings" />
      </div>
    </template>
  </Dialog>
</template>
