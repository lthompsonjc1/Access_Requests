import type { Meta, StoryObj } from '@storybook/vue3';
import { markRaw, onMounted, ref } from 'vue';
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

const DEMO_NAV_STORAGE = {
  dataMode: 'demoNav.dataMode',
  apiKey: 'demoNav.apiKey',
} as const;

const DATA_MODE_OPTIONS = ['Mock Data', 'Live Data'] as const;

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
    label: 'Burak',
    itemType: 'profile_compact',
    initials: 'B',
    name: 'Burak',
    items: [
      {
        label: 'Burak',
        itemType: 'profile_large',
        name: 'Burak',
        email: 'burak.basci+afc@jumpcloud.com',
        initials: 'B',
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

const meta: Meta<typeof AppNavigation> = {
  title: 'Circuit DS/Custom Components/DemoNav',
  component: AppNavigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    () => ({
      template: '<div class="h-screen flex"><story /></div>',
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof AppNavigation>;

type ProcessedNavItem = {
  item?: { label?: string };
  items?: unknown[];
};

function renderDemoNavWithSettingsDialog() {
  return (args: Record<string, unknown>) => ({
    components: {
      AppNavigation,
      Button,
      Dialog,
      FormField,
      InputText,
      SelectButton,
      XMarkIcon,
    },
    setup() {
      const showSettingsDialog = ref(false);
      const dataMode = ref<string>('Mock Data');
      const apiKey = ref('');

      function hydrateFromStorage() {
        const savedMode = localStorage.getItem(DEMO_NAV_STORAGE.dataMode);
        dataMode.value = savedMode === 'Live Data' ? 'Live Data' : 'Mock Data';
        apiKey.value = localStorage.getItem(DEMO_NAV_STORAGE.apiKey) ?? '';
      }

      onMounted(() => {
        hydrateFromStorage();
      });

      function openDemoSettings() {
        hydrateFromStorage();
        showSettingsDialog.value = true;
      }

      function cancelDemoSettings() {
        hydrateFromStorage();
        showSettingsDialog.value = false;
      }

      function saveDemoSettings() {
        localStorage.setItem(DEMO_NAV_STORAGE.dataMode, dataMode.value);
        localStorage.setItem(DEMO_NAV_STORAGE.apiKey, apiKey.value);
        showSettingsDialog.value = false;
      }

      function onNavClick(processedItem: ProcessedNavItem) {
        const subItems = processedItem?.items;
        if (Array.isArray(subItems) && subItems.length > 0) return;
        if (processedItem?.item?.label === 'Demo Settings') {
          openDemoSettings();
        }
      }

      return {
        args,
        dataModeOptions: [...DATA_MODE_OPTIONS],
        showSettingsDialog,
        dataMode,
        apiKey,
        onNavClick,
        cancelDemoSettings,
        saveDemoSettings,
      };
    },
    template: `
      <div class="h-full flex">
        <AppNavigation v-bind="args" @click="onNavClick" />
        <Dialog
          v-model:visible="showSettingsDialog"
          :draggable="false"
          modal
          header="Demo Settings"
          :style="{ width: '480px' }"
        >
          <template #closeicon><XMarkIcon /></template>
          <div class="flex flex-col gap-md">
            <FormField label="Data Source">
              <template #default="{ inputId }">
                <SelectButton
                  :id="inputId"
                  v-model="dataMode"
                  :options="dataModeOptions"
                  :allowEmpty="false"
                />
              </template>
            </FormField>
            <FormField label="API Key">
              <template #default="{ inputId }">
                <InputText :id="inputId" v-model="apiKey" class="w-full" />
              </template>
            </FormField>
          </div>
          <template #footer>
            <div class="flex items-center flex-1 min-w-0"></div>
            <div class="flex gap-sm shrink-0">
              <Button label="Cancel" severity="secondary" variant="text" @click="cancelDemoSettings" />
              <Button label="Save" @click="saveDemoSettings" />
            </div>
          </template>
        </Dialog>
      </div>
    `,
  });
}

export const Default: Story = {
  render: renderDemoNavWithSettingsDialog(),
  args: {
    menuItems,
    profileMenuItems,
    activeItem: 'home',
    collapsible: true,
    topNavToggle: true,
  },
};

export const Collapsible: Story = {
  render: renderDemoNavWithSettingsDialog(),
  args: {
    menuItems,
    profileMenuItems,
    activeItem: 'home',
    collapsible: true,
  },
};
