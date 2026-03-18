import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent } from 'vue';
import {
  AppNavigation,
  PageHeader,
  ToggleSwitch,
  FormField,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
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
  PlayIcon,
  XMarkIcon,
  InformationCircleIcon,
  PlusIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  TrashIcon,
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

// ── Navigation items ──
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

const pageTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Execution history', value: 'execution-history' },
];

// ── Component ──
const WorkflowNodesAsCardsPage = defineComponent({
  name: 'WorkflowNodesAsCardsPage',
  components: {
    AppNavigation,
    PageHeader,
    ToggleSwitch,
    FormField,
    PvButton: Button,
    PvTag: Tag,
    PvInputText: InputText,
    PvSelect: Select,
    TopBar,
    BoltIcon,
    PlayIcon,
    XMarkIcon,
    InformationCircleIcon,
    PlusIcon,
    EnvelopeIcon,
    ArrowPathIcon,
    ComputerDesktopIcon,
    TrashIcon,
  },
  setup() {
    const activeTab = ref('overview');
    const isEnabled = ref(true);
    const selectedStep = ref<string | null>(null);

    // ── Branch / tab state ──
    let nextBranchId = 4;
    let nextConditionId = 20;
    let nextActionId = 20;

    interface BranchCondition {
      id: number;
      variable: string;
      operator: string;
      value: string;
    }

    interface BranchAction {
      id: number;
      label: string;
      icon: string;
      iconBg: string;
      params: Array<{ id: number; label: string; isCode: boolean }>;
    }

    interface Branch {
      id: number;
      label: string;
      conditionLogic: 'AND' | 'OR';
      conditions: BranchCondition[];
      actions: BranchAction[];
    }

    const branches = ref<Branch[]>([
      {
        id: 1,
        label: 'Mac',
        conditionLogic: 'AND',
        conditions: [
          { id: 1, variable: 'useragent.device', operator: 'Equals', value: 'Mac' },
        ],
        actions: [
          {
            id: 1,
            label: 'Remove Device',
            icon: 'ComputerDesktopIcon',
            iconBg: 'bg-chart-violet-dark',
            params: [
              { id: 1, label: 'user_id', isCode: false },
              { id: 2, label: 'input.resource.id', isCode: true },
            ],
          },
        ],
      },
      {
        id: 2,
        label: 'Windows',
        conditionLogic: 'AND',
        conditions: [
          { id: 2, variable: 'useragent.device', operator: 'Equals', value: 'Windows' },
        ],
        actions: [],
      },
      {
        id: 3,
        label: 'Other Devices',
        conditionLogic: 'AND',
        conditions: [],
        actions: [
          {
            id: 2,
            label: 'Send email',
            icon: 'EnvelopeIcon',
            iconBg: 'bg-chart-branding-base',
            params: [
              { id: 3, label: 'user@example.com', isCode: false },
            ],
          },
        ],
      },
    ]);

    const activeBranchId = ref(1);
    const editingBranchId = ref<number | null>(null);
    const editingLabel = ref('');

    const addBranch = () => {
      const newBranch: Branch = {
        id: nextBranchId++,
        label: `Branch ${branches.value.length + 1}`,
        conditionLogic: 'AND',
        conditions: [{ id: nextConditionId++, variable: '', operator: 'Equals', value: '' }],
        actions: [],
      };
      branches.value.push(newBranch);
      activeBranchId.value = newBranch.id;
    };

    const removeBranch = (id: number) => {
      if (branches.value.length <= 1) return;
      const idx = branches.value.findIndex(b => b.id === id);
      branches.value.splice(idx, 1);
      if (activeBranchId.value === id) {
        activeBranchId.value = branches.value[0].id;
      }
    };

    const startEditing = (id: number) => {
      const branch = branches.value.find(b => b.id === id);
      if (!branch) return;
      editingBranchId.value = id;
      editingLabel.value = branch.label;
    };

    const finishEditing = () => {
      if (editingBranchId.value !== null && editingLabel.value.trim()) {
        const branch = branches.value.find(b => b.id === editingBranchId.value);
        if (branch) branch.label = editingLabel.value.trim();
      }
      editingBranchId.value = null;
      editingLabel.value = '';
    };

    const addCondition = (branchId: number) => {
      const branch = branches.value.find(b => b.id === branchId);
      if (branch) {
        branch.conditions.push({ id: nextConditionId++, variable: '', operator: 'Equals', value: '' });
      }
    };

    const removeCondition = (branchId: number, idx: number) => {
      const branch = branches.value.find(b => b.id === branchId);
      if (branch && branch.conditions.length > 1) branch.conditions.splice(idx, 1);
    };

    const operatorOptions = [
      { label: 'Equals', value: 'Equals' },
      { label: 'Not equals', value: 'Not equals' },
      { label: 'Contains', value: 'Contains' },
      { label: 'Does not contain', value: 'Does not contain' },
      { label: 'Is empty', value: 'Is empty' },
      { label: 'Is not empty', value: 'Is not empty' },
    ];

    const conditionVariables = [
      { label: 'useragent.device', value: 'useragent.device' },
      { label: 'user.id', value: 'user.id' },
      { label: 'device.id', value: 'device.id' },
      { label: 'initiatedby.email', value: 'initiatedby.email' },
      { label: 'input.resource.id', value: 'input.resource.id' },
    ];

    const actionCatalog = [
      { actionId: 'remove-device', label: 'Remove Device', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
      { actionId: 'get-systems', label: 'Get Systems', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
      { actionId: 'send-email', label: 'Send email', icon: 'EnvelopeIcon', iconBg: 'bg-chart-branding-base' },
      { actionId: 'sync-ldap', label: 'Sync LDAP', icon: 'ArrowPathIcon', iconBg: 'bg-chart-aster-dark' },
    ];

    const addAction = (branchId: number, actionId: string) => {
      const branch = branches.value.find(b => b.id === branchId);
      const meta = actionCatalog.find(a => a.actionId === actionId);
      if (branch && meta) {
        branch.actions.push({
          id: nextActionId++,
          label: meta.label,
          icon: meta.icon,
          iconBg: meta.iconBg,
          params: [],
        });
      }
    };

    const removeAction = (branchId: number, actionIdx: number) => {
      const branch = branches.value.find(b => b.id === branchId);
      if (branch) branch.actions.splice(actionIdx, 1);
    };

    // Trigger sidebar state
    const loopInputValue = ref('List user systems');
    const variableOptions = [
      {
        label: 'User suspended event',
        items: [
          { label: 'user.id', value: 'user.id' },
          { label: 'initiatedby.email', value: 'initiatedby.email' },
        ],
      },
      {
        label: 'Get Systems',
        items: [
          { label: 'List user systems', value: 'List user systems' },
        ],
      },
    ];

    return {
      menuItems,
      profileMenuItems,
      pageTabs,
      activeTab,
      isEnabled,
      selectedStep,
      branches,
      activeBranchId,
      editingBranchId,
      editingLabel,
      addBranch,
      removeBranch,
      startEditing,
      finishEditing,
      addCondition,
      removeCondition,
      addAction,
      removeAction,
      operatorOptions,
      conditionVariables,
      actionCatalog,
      loopInputValue,
      variableOptions,
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
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar showBackButton backButtonLabel="Back" />

        <PageHeader
          title="Workflow nodes as cards"
          :tabs="pageTabs"
          :activeTab="activeTab"
          @update:activeTab="activeTab = $event"
        >
          <template #actions>
            <div class="flex items-center gap-sm">
              <ToggleSwitch v-model="isEnabled" label="Enabled" />
              <PvButton label="Cancel" severity="secondary" variant="outlined" />
              <PvButton severity="secondary" variant="outlined">
                <template #icon><PlayIcon class="size-5" /></template>
              </PvButton>
              <PvButton label="Save" />
            </div>
          </template>
        </PageHeader>

        <!-- Metadata bar -->
        <div class="flex items-center px-6 border-b border-neutral-default_solid bg-neutral-base shrink-0">
          <div class="flex items-center gap-sm py-2">
            <div class="flex items-center gap-xs">
              <BoltIcon class="size-4 text-neutral-subtle" />
              <span class="text-body-sm text-neutral-subtle">Event Trigger</span>
            </div>
            <span class="text-neutral-ghost">·</span>
            <span class="text-body-sm text-neutral-subtle">Last Ran: 5mins Ago</span>
            <span class="text-neutral-ghost">·</span>
            <span class="text-body-sm text-neutral-subtle">Created: 1d ago</span>
          </div>
        </div>

        <!-- Overview tab -->
        <div v-if="activeTab === 'overview'" class="flex-1 flex min-h-0 overflow-hidden">

          <!-- ── Workflow canvas ── -->
          <div class="flex-1 overflow-auto bg-neutral-surface">
            <div class="flex flex-col items-center py-8 px-6 min-h-full">

              <!-- Trigger card -->
              <div
                class="w-[420px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'trigger' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'trigger'"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-warning-light">
                    <BoltIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-body-md-semi-bold text-neutral-base">User suspended</span>
                </div>
                <div class="px-4 pb-4 flex flex-col gap-1">
                  <span class="text-body-sm text-neutral-subtle">user_id</span>
                  <span class="text-body-sm text-neutral-subtle">input.resource.id</span>
                </div>
              </div>

              <!-- Connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Loop card -->
              <div
                class="w-[420px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'loop' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'loop'"
              >
                <div class="flex items-center gap-sm px-4 pt-4 pb-2">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                    <ArrowPathIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-body-md-semi-bold text-neutral-base">Loop</span>
                </div>
                <div class="px-4 pb-4 flex flex-col gap-1">
                  <span class="text-body-sm text-neutral-subtle">Count</span>
                  <span class="text-body-sm text-neutral-subtle">{{ loopInputValue }}</span>
                </div>
              </div>

              <!-- Connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
                <div class="size-1.5 rounded-full bg-neutral-ghost"></div>
                <div class="w-px h-2 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- ═══ FLOWS NODE (card-based) ═══ -->
              <div
                class="w-[480px] rounded-xl bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'flows' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'flows'"
              >
                <!-- Node header -->
                <div class="flex items-center gap-sm px-4 pt-4 pb-3 border-b border-neutral-default_solid">
                  <div class="flex items-center justify-center size-7 rounded-md bg-neutral-surface border border-neutral-default_solid">
                    <component :is="WorkflowIcon" class="size-4 text-brand-primary-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base">Flows</span>
                </div>

                <!-- Branch tabs -->
                <div class="flex items-center border-b border-neutral-default_solid px-3 overflow-x-auto gap-0">
                  <template v-for="branch in branches" :key="branch.id">
                    <div
                      class="flex items-center gap-1 px-3 py-2.5 cursor-pointer border-b-2 shrink-0 group transition-colors"
                      :class="activeBranchId === branch.id
                        ? 'border-brand-primary-base text-brand-primary-base'
                        : 'border-transparent text-neutral-subtle hover:text-neutral-base'"
                      @click.stop="activeBranchId = branch.id"
                    >
                      <template v-if="editingBranchId === branch.id">
                        <input
                          class="text-body-sm bg-transparent border-b border-brand-primary-base outline-none w-[80px] text-neutral-base"
                          :value="editingLabel"
                          @input="editingLabel = $event.target.value"
                          @blur="finishEditing()"
                          @keydown.enter="finishEditing()"
                          @click.stop
                        />
                      </template>
                      <template v-else>
                        <span class="text-body-sm font-medium" @dblclick.stop="startEditing(branch.id)">
                          {{ branch.label }}
                        </span>
                      </template>
                      <XMarkIcon
                        v-if="branches.length > 1"
                        class="size-3 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity cursor-pointer text-neutral-subtle hover:text-danger-base"
                        @click.stop="removeBranch(branch.id)"
                      />
                    </div>
                  </template>

                  <!-- Add tab -->
                  <button
                    class="flex items-center justify-center size-7 ml-1 rounded cursor-pointer hover:bg-neutral-surface transition-colors shrink-0 text-neutral-subtle hover:text-neutral-base"
                    @click.stop="addBranch()"
                  >
                    <PlusIcon class="size-3.5" />
                  </button>
                </div>

                <!-- Active branch content — card stack -->
                <div class="p-4 flex flex-col gap-3">
                  <template v-for="branch in branches" :key="'content-' + branch.id">
                    <div v-if="branch.id === activeBranchId" class="flex flex-col gap-3">

                      <!-- Conditions card -->
                      <div v-if="branch.conditions.length" class="rounded-lg border border-neutral-default_solid bg-neutral-base p-4 flex flex-col gap-3">
                        <span class="text-body-md-semi-bold text-neutral-base">Conditions</span>
                        <div class="flex flex-col gap-2">
                          <template v-for="(cond, cIdx) in branch.conditions" :key="cond.id">
                            <div v-if="cIdx > 0" class="flex items-center gap-xs">
                              <div class="flex-1 h-px bg-neutral-default_solid"></div>
                              <span class="text-body-xs px-1.5 py-0.5 rounded border border-neutral-default_solid text-neutral-subtle font-medium bg-neutral-surface">
                                {{ branch.conditionLogic }}
                              </span>
                              <div class="flex-1 h-px bg-neutral-default_solid"></div>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                              <span class="text-body-sm text-neutral-base">{{ cond.variable || '—' }}</span>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-md border border-neutral-default_solid bg-neutral-surface text-body-sm text-neutral-subtle font-medium">
                                {{ cond.operator }}
                              </span>
                              <span class="text-body-sm text-neutral-base">{{ cond.value || '—' }}</span>
                            </div>
                          </template>
                        </div>
                      </div>

                      <!-- Empty conditions placeholder -->
                      <div v-else class="rounded-lg border border-dashed border-neutral-default_solid p-4 text-center">
                        <span class="text-body-sm text-neutral-ghost">No conditions — runs for all cases</span>
                      </div>

                      <!-- Action cards -->
                      <template v-for="action in branch.actions" :key="action.id">
                        <div class="rounded-lg border border-neutral-default_solid bg-neutral-base p-4 flex flex-col gap-2">
                          <div class="flex items-center gap-sm">
                            <div class="flex items-center justify-center size-5 rounded shrink-0" :class="action.iconBg">
                              <component :is="action.icon" class="size-3 text-neutral-inverted-base" />
                            </div>
                            <span class="text-body-md-semi-bold text-neutral-base">{{ action.label }}</span>
                          </div>
                          <div v-if="action.params.length" class="flex flex-col gap-1 pl-1">
                            <div v-for="param in action.params" :key="param.id">
                              <span v-if="param.isCode" class="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-surface border border-neutral-default_solid text-body-sm text-neutral-subtle font-mono">
                                {{ param.label }}
                              </span>
                              <span v-else class="text-body-sm text-neutral-subtle">{{ param.label }}</span>
                            </div>
                          </div>
                        </div>
                      </template>

                      <!-- Add card button -->
                      <button
                        class="flex items-center justify-center size-8 rounded-full border border-neutral-default_solid bg-neutral-base text-neutral-subtle hover:border-brand-primary-base hover:text-brand-primary-base hover:bg-brand-primary-ghost transition-colors self-center shadow-sm"
                        @click.stop="selectedStep = 'flows'"
                      >
                        <PlusIcon class="size-4" />
                      </button>

                    </div>
                  </template>
                </div>
              </div>

              <!-- Connector -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Add step button -->
              <PvButton severity="secondary" variant="outlined" rounded class="size-10">
                <template #icon><PlusIcon class="size-5" /></template>
              </PvButton>

              <div class="h-8"></div>
            </div>
          </div>

          <!-- ═══ RIGHT SIDEBAR ═══ -->
          <div v-if="selectedStep" class="w-[380px] shrink-0 border-l border-neutral-default_solid bg-neutral-base overflow-y-auto">

            <!-- Sidebar header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-default_solid">
              <div class="flex items-center gap-sm">
                <template v-if="selectedStep === 'trigger'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-warning-light">
                    <BoltIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base">User suspended</span>
                </template>
                <template v-else-if="selectedStep === 'loop'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                    <ArrowPathIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base">Loop</span>
                </template>
                <template v-else-if="selectedStep === 'flows'">
                  <div class="flex items-center justify-center size-6 rounded-md bg-neutral-surface border border-neutral-default_solid">
                    <component :is="WorkflowIcon" class="size-4 text-brand-primary-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base">Flows</span>
                </template>
              </div>
              <PvButton severity="secondary" variant="text" size="small" @click="selectedStep = null">
                <template #icon><XMarkIcon class="size-5" /></template>
              </PvButton>
            </div>

            <!-- Sidebar content -->
            <div class="p-4 flex flex-col gap-md">

              <!-- TRIGGER panel -->
              <template v-if="selectedStep === 'trigger'">
                <FormField label="Event type" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <PvInputText :id="inputId" modelValue="User suspended" class="w-full" readonly />
                  </template>
                </FormField>
                <div class="flex flex-col gap-2">
                  <span class="text-body-sm-semi-bold text-neutral-base">Trigger variables</span>
                  <div class="flex flex-col gap-1 px-3 py-2 rounded-md border border-neutral-default_solid bg-neutral-surface">
                    <span class="text-body-sm text-neutral-subtle">user_id</span>
                    <span class="text-body-sm text-neutral-subtle">input.resource.id</span>
                  </div>
                </div>
              </template>

              <!-- LOOP panel -->
              <template v-else-if="selectedStep === 'loop'">
                <FormField label="Enter input value" required>
                  <template #labelicon>
                    <InformationCircleIcon class="size-4 text-neutral-subtle" />
                  </template>
                  <template #default="{ inputId }">
                    <PvSelect
                      :id="inputId"
                      v-model="loopInputValue"
                      :options="variableOptions"
                      optionLabel="label"
                      optionValue="value"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      placeholder="Select a variable"
                      class="w-full"
                    >
                      <template #optiongroup="slotProps">
                        <span class="text-body-sm-semi-bold text-neutral-subtle">{{ slotProps.option.label }}</span>
                      </template>
                      <template #option="slotProps">
                        <span class="text-body-sm text-neutral-base">{{ slotProps.option.label }}</span>
                      </template>
                    </PvSelect>
                  </template>
                </FormField>
              </template>

              <!-- FLOWS panel -->
              <template v-else-if="selectedStep === 'flows'">

                <!-- Sidebar branch tabs -->
                <div class="flex items-center border-b border-neutral-default_solid -mx-4 px-3 overflow-x-auto gap-0">
                  <template v-for="branch in branches" :key="'sb-tab-' + branch.id">
                    <div
                      class="flex items-center gap-1 px-3 py-2.5 cursor-pointer border-b-2 shrink-0 group transition-colors"
                      :class="activeBranchId === branch.id
                        ? 'border-brand-primary-base text-brand-primary-base'
                        : 'border-transparent text-neutral-subtle hover:text-neutral-base'"
                      @click="activeBranchId = branch.id"
                    >
                      <template v-if="editingBranchId === branch.id">
                        <input
                          class="text-body-sm bg-transparent border-b border-brand-primary-base outline-none w-[80px] text-neutral-base"
                          :value="editingLabel"
                          @input="editingLabel = $event.target.value"
                          @blur="finishEditing()"
                          @keydown.enter="finishEditing()"
                          @click.stop
                        />
                      </template>
                      <template v-else>
                        <span class="text-body-sm font-medium" @dblclick="startEditing(branch.id)">{{ branch.label }}</span>
                      </template>
                      <XMarkIcon
                        v-if="branches.length > 1"
                        class="size-3 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity cursor-pointer text-neutral-subtle hover:text-danger-base"
                        @click.stop="removeBranch(branch.id)"
                      />
                    </div>
                  </template>
                  <button
                    class="flex items-center justify-center size-7 ml-1 rounded cursor-pointer hover:bg-neutral-surface transition-colors shrink-0 text-neutral-subtle hover:text-neutral-base"
                    @click="addBranch()"
                  >
                    <PlusIcon class="size-3.5" />
                  </button>
                </div>

                <!-- Active branch config -->
                <template v-for="branch in branches" :key="'sb-config-' + branch.id">
                  <div v-if="branch.id === activeBranchId" class="flex flex-col gap-md">

                    <!-- ── Conditions section ── -->
                    <div class="flex flex-col gap-sm">
                      <div class="flex items-center justify-between">
                        <span class="text-body-sm-semi-bold text-neutral-base">Conditions</span>
                        <div v-if="branch.conditions.length > 1" class="flex items-center rounded border border-neutral-default_solid overflow-hidden">
                          <button
                            class="px-2 py-0.5 text-body-xs font-medium transition-colors"
                            :class="branch.conditionLogic === 'AND' ? 'bg-brand-primary-base text-neutral-inverted-base' : 'bg-neutral-base text-neutral-subtle hover:bg-neutral-surface'"
                            @click="branch.conditionLogic = 'AND'"
                          >AND</button>
                          <button
                            class="px-2 py-0.5 text-body-xs font-medium transition-colors"
                            :class="branch.conditionLogic === 'OR' ? 'bg-brand-primary-base text-neutral-inverted-base' : 'bg-neutral-base text-neutral-subtle hover:bg-neutral-surface'"
                            @click="branch.conditionLogic = 'OR'"
                          >OR</button>
                        </div>
                      </div>

                      <div class="flex flex-col gap-sm">
                        <template v-for="(cond, cIdx) in branch.conditions" :key="cond.id">
                          <!-- AND/OR divider -->
                          <div v-if="cIdx > 0" class="flex items-center gap-xs">
                            <div class="flex-1 h-px bg-neutral-default_solid"></div>
                            <span class="text-body-xs px-1.5 py-0.5 rounded border border-neutral-default_solid text-neutral-subtle font-medium bg-neutral-surface">
                              {{ branch.conditionLogic }}
                            </span>
                            <div class="flex-1 h-px bg-neutral-default_solid"></div>
                          </div>

                          <!-- Condition card -->
                          <div class="flex flex-col gap-xs p-3 rounded-md border border-neutral-default_solid bg-neutral-surface">
                            <div class="flex items-center justify-between">
                              <span class="text-body-xs text-neutral-subtle font-medium">Condition {{ cIdx + 1 }}</span>
                              <PvButton
                                v-if="branch.conditions.length > 1"
                                severity="danger"
                                variant="text"
                                size="small"
                                @click="removeCondition(branch.id, cIdx)"
                              >
                                <template #icon><TrashIcon class="size-3.5" /></template>
                              </PvButton>
                            </div>
                            <PvSelect
                              v-model="cond.variable"
                              :options="conditionVariables"
                              optionLabel="label"
                              optionValue="value"
                              placeholder="Select variable"
                              class="w-full"
                            />
                            <PvSelect
                              v-model="cond.operator"
                              :options="operatorOptions"
                              optionLabel="label"
                              optionValue="value"
                              placeholder="Select operator"
                              class="w-full"
                            />
                            <PvInputText
                              v-model="cond.value"
                              placeholder="Enter value"
                              class="w-full"
                            />
                          </div>
                        </template>
                      </div>

                      <button
                        class="flex items-center gap-xs px-3 py-2 rounded-md border border-dashed border-neutral-default_solid text-neutral-subtle hover:border-brand-primary-base hover:text-brand-primary-base hover:bg-brand-primary-ghost transition-colors w-full"
                        @click="addCondition(branch.id)"
                      >
                        <PlusIcon class="size-3.5 shrink-0" />
                        <span class="text-body-sm">Add condition</span>
                      </button>
                    </div>

                    <!-- ── Actions section ── -->
                    <div class="flex flex-col gap-sm">
                      <span class="text-body-sm-semi-bold text-neutral-base">Actions</span>

                      <!-- Added action cards -->
                      <div
                        v-for="(action, aIdx) in branch.actions"
                        :key="action.id"
                        class="flex items-center gap-sm p-3 rounded-md border border-neutral-default_solid bg-neutral-surface"
                      >
                        <div class="flex items-center justify-center size-6 rounded shrink-0" :class="action.iconBg">
                          <component :is="action.icon" class="size-3.5 text-neutral-inverted-base" />
                        </div>
                        <span class="text-body-sm text-neutral-base flex-1 truncate">{{ action.label }}</span>
                        <PvButton severity="danger" variant="text" size="small" @click="removeAction(branch.id, aIdx)">
                          <template #icon><TrashIcon class="size-3.5" /></template>
                        </PvButton>
                      </div>

                      <!-- Action catalog -->
                      <div class="flex flex-col gap-xs">
                        <span class="text-body-xs text-neutral-subtle font-medium uppercase tracking-wide">Available actions</span>
                        <div
                          v-for="cat in actionCatalog"
                          :key="cat.actionId"
                          class="flex items-center gap-sm p-2 rounded-md border border-dashed border-neutral-default_solid cursor-pointer hover:border-brand-primary-base hover:bg-brand-primary-ghost transition-colors"
                          @click="addAction(branch.id, cat.actionId)"
                        >
                          <div class="flex items-center justify-center size-5 rounded shrink-0" :class="cat.iconBg">
                            <component :is="cat.icon" class="size-3 text-neutral-inverted-base" />
                          </div>
                          <span class="text-body-sm text-neutral-subtle">{{ cat.label }}</span>
                          <PlusIcon class="size-3.5 text-neutral-ghost ml-auto" />
                        </div>
                      </div>
                    </div>

                  </div>
                </template>
              </template>

            </div>
          </div>
        </div>

        <!-- Execution history tab -->
        <div v-if="activeTab === 'execution-history'" class="flex-1 overflow-auto bg-neutral-surface">
          <div class="p-6">
            <div class="bg-neutral-base rounded-lg border border-neutral-default_solid p-8 text-center">
              <p class="text-body-md text-neutral-subtle">Execution history content coming soon</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
});

const meta: Meta<typeof WorkflowNodesAsCardsPage> = {
  title: 'Projects/Bala Playground/Pages/Workflow Nodes As Cards',
  component: WorkflowNodesAsCardsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof WorkflowNodesAsCardsPage>;

export const Default: Story = {};
