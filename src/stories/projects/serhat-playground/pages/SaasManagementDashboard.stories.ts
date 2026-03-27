import type { Meta, StoryObj } from '@storybook/vue3';
import { markRaw, defineComponent } from 'vue';
import { AppNavigation, CollapsiblePanel, PageHeader } from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

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
  ArrowUpIcon,
  ArrowDownIcon,
  ShieldExclamationIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon,
  GlobeAltIcon,
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
} from '@jumpcloud/icons';

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
    items: [{ label: 'Reports' }],
  },
  { label: 'Alert', leftIcon: markRaw(BellIcon), count: 23, isNew: true },
];

const profileMenuItems = [
  {
    label: 'Serhat Can',
    itemType: 'profile_compact',
    initials: 'SC',
    name: 'Serhat Can',
    items: [
      { label: 'Admin IT', itemType: 'profile_large', name: 'Admin IT', email: 'admin_it@company.com', initials: 'AT' },
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

const SaasManagementDashboard = defineComponent({
  name: 'SaasManagementDashboard',
  components: {
    AppNavigation,
    PageHeader,
    CollapsiblePanel,
    PvButton: Button,
    PvTag: Tag,
    TopBar,
    ArrowUpIcon,
    ArrowDownIcon,
    ShieldExclamationIcon,
    EllipsisHorizontalIcon,
    ArrowPathIcon,
    GlobeAltIcon,
  },
  setup() {
    const topApps = [
      { name: 'Slack', users: 1284, licenses: 1500, spend: '$18,900', trend: 12, category: 'Collaboration' },
      { name: 'Google Workspace', users: 1743, licenses: 2000, spend: '$34,200', trend: 5, category: 'Productivity' },
      { name: 'Salesforce', users: 423, licenses: 500, spend: '$63,450', trend: -3, category: 'CRM' },
      { name: 'Zoom', users: 1102, licenses: 1500, spend: '$16,530', trend: 8, category: 'Communication' },
      { name: 'Jira', users: 634, licenses: 800, spend: '$12,680', trend: 15, category: 'Project Mgmt' },
    ];

    const shadowItApps = [
      { name: 'ChatGPT', users: 342, risk: 'High', firstSeen: 'Jan 12, 2026', category: 'AI' },
      { name: 'Notion', users: 156, risk: 'Medium', firstSeen: 'Dec 5, 2025', category: 'Productivity' },
      { name: 'Canva', users: 89, risk: 'Low', firstSeen: 'Nov 18, 2025', category: 'Design' },
      { name: 'Airtable', users: 67, risk: 'Medium', firstSeen: 'Feb 1, 2026', category: 'Database' },
      { name: 'Miro', users: 43, risk: 'Low', firstSeen: 'Jan 28, 2026', category: 'Collaboration' },
    ];

    const unusedLicenses = [
      { app: 'Salesforce', unused: 77, total: 500, monthlyCost: '$11,550', lastActive: '30+ days' },
      { app: 'Zoom', unused: 398, total: 1500, monthlyCost: '$5,970', lastActive: '60+ days' },
      { app: 'Jira', unused: 166, total: 800, monthlyCost: '$3,320', lastActive: '45+ days' },
      { app: 'Slack', unused: 216, total: 1500, monthlyCost: '$3,240', lastActive: '30+ days' },
    ];

    const renewals = [
      { app: 'Salesforce', date: 'Mar 15, 2026', cost: '$63,450/yr', daysLeft: 25, urgent: true },
      { app: 'Zoom', date: 'Apr 1, 2026', cost: '$16,530/yr', daysLeft: 42, urgent: false },
      { app: 'Jira', date: 'Apr 22, 2026', cost: '$12,680/yr', daysLeft: 63, urgent: false },
    ];

    return {
      topApps,
      shadowItApps,
      unusedLicenses,
      renewals,
      menuItems,
      profileMenuItems,
      SaasManagementIcon: markRaw(SaasManagementIcon),
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="access"
        :collapsible="true"
      />
      <div class="flex-1 flex flex-col min-w-0 overflow-auto">
        <TopBar />

        <PageHeader title="SaaS Management" :icon="SaasManagementIcon" class="shrink-0">
          <template #actions>
            <PvButton label="Discover Apps" severity="secondary" variant="outlined">
              <template #icon><GlobeAltIcon class="size-5" /></template>
            </PvButton>
            <PvButton label="Sync Now" severity="primary">
              <template #icon><ArrowPathIcon class="size-5" /></template>
            </PvButton>
          </template>
        </PageHeader>

        <div class="flex-1 overflow-auto bg-neutral-surface p-6">
          <div class="grid grid-cols-4 gap-4">

            <!-- ── Row 1: Stats ─────────────────────────────────────────── -->

            <CollapsiblePanel header="Total SaaS Apps">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-baseline gap-2">
                  <span class="text-[32px] font-semibold leading-8 text-neutral-base">148</span>
                  <span class="text-body-md text-neutral-subtle">Apps</span>
                </div>
                <div class="flex items-center gap-1">
                  <ArrowUpIcon class="w-4 h-4 text-success-base" />
                  <span class="text-body-sm text-neutral-subtle"><span class="text-body-sm-bold text-success-base">12</span> new this month</span>
                </div>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel header="Monthly Spend">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-baseline gap-2">
                  <span class="text-[32px] font-semibold leading-8 text-neutral-base">$167K</span>
                </div>
                <div class="flex items-center gap-1">
                  <ArrowUpIcon class="w-4 h-4 text-error-base" />
                  <span class="text-body-sm text-neutral-subtle"><span class="text-body-sm-bold text-error-base">8%</span> vs last month</span>
                </div>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel header="Unused Licenses">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-baseline gap-2">
                  <span class="text-[32px] font-semibold leading-8 text-warning-base">918</span>
                  <span class="text-body-md text-neutral-subtle">Licenses</span>
                </div>
                <span class="text-body-sm text-warning-base">$25,910/mo wasted</span>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel header="Shadow IT">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-baseline gap-2">
                  <span class="text-[32px] font-semibold leading-8 text-error-base">37</span>
                  <span class="text-body-md text-neutral-subtle">Unapproved apps</span>
                </div>
                <div class="flex items-center gap-1">
                  <ArrowUpIcon class="w-4 h-4 text-error-base" />
                  <span class="text-body-sm text-neutral-subtle"><span class="text-body-sm-bold text-error-base">5</span> new this week</span>
                </div>
              </div>
            </CollapsiblePanel>

            <!-- ── Row 2: Shadow IT + Top Apps ──────────────────────────── -->

            <CollapsiblePanel header="Shadow IT Detected" class="col-span-2">
              <template #actions>
                <PvButton label="Review All" severity="secondary" variant="outlined" size="small" />
              </template>
              <div class="flex flex-col divide-y divide-neutral-default_solid border-t border-neutral-default_solid">
                <div v-for="app in shadowItApps" :key="app.name" class="flex items-center justify-between py-3">
                  <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2">
                      <span class="text-body-md-bold text-neutral-base">{{ app.name }}</span>
                      <PvTag :value="app.category" severity="secondary" />
                    </div>
                    <span class="text-body-xs text-neutral-subtle">{{ app.users }} users &middot; First seen {{ app.firstSeen }}</span>
                  </div>
                  <PvTag
                    :value="app.risk + ' Risk'"
                    :severity="app.risk === 'High' ? 'danger' : app.risk === 'Medium' ? 'warn' : 'secondary'"
                  />
                </div>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel header="Top Apps by Usage" class="col-span-2">
              <template #actions>
                <PvButton label="View All" severity="secondary" variant="outlined" size="small" />
              </template>
              <div class="flex flex-col divide-y divide-neutral-default_solid border-t border-neutral-default_solid">
                <div v-for="app in topApps" :key="app.name" class="flex items-center gap-3 py-3">
                  <span class="text-body-md-bold text-neutral-base w-36 shrink-0">{{ app.name }}</span>
                  <div class="flex-1 h-1.5 bg-neutral-surface rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :class="app.users / app.licenses > 0.9 ? 'bg-error-base' : app.users / app.licenses > 0.7 ? 'bg-warning-base' : 'bg-success-base'"
                      :style="{ width: Math.round((app.users / app.licenses) * 100) + '%' }"
                    ></div>
                  </div>
                  <span class="text-body-sm text-neutral-subtle w-28 text-right shrink-0">{{ app.users }}/{{ app.licenses }} licenses</span>
                  <div class="flex items-center gap-0.5 w-12 shrink-0 justify-end">
                    <ArrowUpIcon v-if="app.trend > 0" class="w-3.5 h-3.5 text-success-base" />
                    <ArrowDownIcon v-else class="w-3.5 h-3.5 text-error-base" />
                    <span class="text-body-sm" :class="app.trend > 0 ? 'text-success-base' : 'text-error-base'">{{ Math.abs(app.trend) }}%</span>
                  </div>
                </div>
              </div>
            </CollapsiblePanel>

            <!-- ── Row 3: License Optimization + Renewals ───────────────── -->

            <CollapsiblePanel header="License Optimization" class="col-span-2">
              <template #actions>
                <PvButton label="Optimize All" severity="secondary" variant="outlined" size="small" />
              </template>
              <div class="flex flex-col">
                <span class="text-body-sm text-warning-base mb-3"><span class="text-body-sm-bold">$25,910</span> potential monthly savings</span>
                <div class="flex flex-col divide-y divide-neutral-default_solid border-t border-neutral-default_solid">
                  <div v-for="license in unusedLicenses" :key="license.app" class="flex items-center justify-between py-3">
                    <div class="flex flex-col gap-0.5">
                      <span class="text-body-md-bold text-neutral-base">{{ license.app }}</span>
                      <span class="text-body-xs text-neutral-subtle">{{ license.unused }} / {{ license.total }} unused &middot; Inactive {{ license.lastActive }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-body-sm-bold text-warning-base">{{ license.monthlyCost }}/mo</span>
                      <PvButton label="Reclaim" severity="secondary" variant="outlined" size="small" />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel header="Upcoming Renewals" class="col-span-2">
              <template #actions>
                <PvButton label="All Renewals" severity="secondary" variant="outlined" size="small" />
              </template>
              <div class="flex flex-col">
                <span class="text-body-sm text-neutral-subtle mb-3"><span class="text-body-sm-bold text-neutral-base">{{ renewals.length }}</span> renewals in next 90 days</span>
                <div class="flex flex-col divide-y divide-neutral-default_solid border-t border-neutral-default_solid">
                  <div v-for="renewal in renewals" :key="renewal.app" class="flex items-center justify-between py-3">
                    <div class="flex flex-col gap-0.5">
                      <div class="flex items-center gap-2">
                        <span class="text-body-md-bold text-neutral-base">{{ renewal.app }}</span>
                        <PvTag v-if="renewal.urgent" value="Urgent" severity="danger" />
                      </div>
                      <span class="text-body-xs text-neutral-subtle">{{ renewal.date }} &middot; {{ renewal.cost }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-body-sm" :class="renewal.daysLeft <= 30 ? 'text-error-base' : 'text-neutral-subtle'">{{ renewal.daysLeft }}d left</span>
                      <PvButton label="Review" severity="secondary" variant="outlined" size="small" />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsiblePanel>

          </div>
        </div>
      </div>
    </div>
  `,
});

const meta: Meta<typeof SaasManagementDashboard> = {
  title: "Projects/Serhat's Playground/Pages/SaaS Management",
  component: SaasManagementDashboard,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SaasManagementDashboard>;

export const Default: Story = {};
