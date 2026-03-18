import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent } from 'vue';
import {
  AppNavigation,
  PageHeader,
  ToggleSwitch,
  FormField,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
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
  ArrowsRightLeftIcon,
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
const WorkflowLoopsPage = defineComponent({
  name: 'WorkflowLoopsPage',
  components: {
    AppNavigation,
    PageHeader,
    ToggleSwitch,
    FormField,
    PvButton: Button,
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
    ArrowsRightLeftIcon,
    ComputerDesktopIcon,
    TrashIcon,
  },
  setup() {
    const activeTab = ref('overview');
    const isEnabled = ref(true);
    const selectedStep = ref<string | null>(null);

    // ── If-Else tabbed node state ──
    let nextBranchId = 3;
    let nextConditionId = 10;

    interface BranchCondition {
      id: number;
      variable: string;
      operator: string;
      value: string;
    }

    interface Branch {
      id: number;
      label: string;
      type: 'if' | 'else-if' | 'else';
      conditionLogic: 'AND' | 'OR';
      conditions: BranchCondition[];
      actions: Array<{ id: number; label: string; icon: string; iconBg: string }>;
    }

    const branches = ref<Branch[]>([
      {
        id: 1, label: 'If', type: 'if', conditionLogic: 'AND',
        conditions: [
          { id: 1, variable: 'user.id', operator: 'equals', value: 'admin' },
        ],
        actions: [
          { id: 1, label: 'Remove devices', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
        ],
      },
      { id: 2, label: 'Else', type: 'else', conditionLogic: 'AND', conditions: [], actions: [] },
    ]);

    const activeBranchId = ref(1);
    const editingBranchId = ref<number | null>(null);
    const editingLabel = ref('');

    const activeBranch = () => branches.value.find(b => b.id === activeBranchId.value);

    const addCondition = (branchId: number) => {
      const branch = branches.value.find(b => b.id === branchId);
      if (branch) {
        branch.conditions.push({ id: nextConditionId++, variable: '', operator: 'equals', value: '' });
      }
    };

    const removeCondition = (branchId: number, conditionIndex: number) => {
      const branch = branches.value.find(b => b.id === branchId);
      if (branch && branch.conditions.length > 1) {
        branch.conditions.splice(conditionIndex, 1);
      }
    };

    const addBranch = () => {
      const elseIndex = branches.value.findIndex(b => b.type === 'else');
      const newBranch: Branch = {
        id: nextBranchId++,
        label: `Else if ${branches.value.filter(b => b.type === 'else-if').length + 1}`,
        type: 'else-if',
        conditionLogic: 'AND',
        conditions: [{ id: nextConditionId++, variable: '', operator: 'equals', value: '' }],
        actions: [],
      };
      if (elseIndex >= 0) {
        branches.value.splice(elseIndex, 0, newBranch);
      } else {
        branches.value.push(newBranch);
      }
      activeBranchId.value = newBranch.id;
    };

    const removeBranch = (id: number) => {
      const branch = branches.value.find(b => b.id === id);
      if (!branch || branch.type === 'if' || branch.type === 'else') return;
      const idx = branches.value.findIndex(b => b.id === id);
      branches.value.splice(idx, 1);
      if (activeBranchId.value === id) {
        activeBranchId.value = branches.value[0].id;
      }
    };

    const startEditing = (id: number) => {
      const branch = branches.value.find(b => b.id === id);
      if (!branch || branch.type === 'if' || branch.type === 'else') return;
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

    const operatorOptions = [
      { label: 'Equals', value: 'equals' },
      { label: 'Not equals', value: 'not_equals' },
      { label: 'Contains', value: 'contains' },
      { label: 'Does not contain', value: 'not_contains' },
      { label: 'Greater than', value: 'greater_than' },
      { label: 'Less than', value: 'less_than' },
      { label: 'Is empty', value: 'is_empty' },
      { label: 'Is not empty', value: 'is_not_empty' },
    ];

    const conditionVariables = [
      { label: 'user.id', value: 'user.id' },
      { label: 'device.id', value: 'device.id' },
      { label: 'initiatedby.email', value: 'initiatedby.email' },
      { label: 'input.resource.id', value: 'input.resource.id' },
    ];

    const loopInputValue = ref('List user systems');
    const variableOptions = [
      { label: 'User suspended event', items: [
        { label: 'user.id', value: 'user.id' },
        { label: 'device id', value: 'device id' },
        { label: 'initiatedby.email', value: 'initiatedby.email' },
      ]},
      { label: 'Get Systems', items: [
        { label: 'List user systems', value: 'List user systems', description: 'Retrieves a list of systems linked to a user ID.' },
      ]},
    ];

    let nextActionId = 10;

    const actionCatalog = [
      { actionId: 'remove-devices', label: 'Remove devices', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
      { actionId: 'get-systems', label: 'Get Systems', icon: 'ComputerDesktopIcon', iconBg: 'bg-chart-violet-dark' },
      { actionId: 'send-email', label: 'Send email', icon: 'EnvelopeIcon', iconBg: 'bg-chart-branding-base' },
    ];

    const addActionToBranch = (branchId: number, actionId: string) => {
      const branch = branches.value.find(b => b.id === branchId);
      const meta = actionCatalog.find(a => a.actionId === actionId);
      if (branch && meta) {
        branch.actions.push({ id: nextActionId++, label: meta.label, icon: meta.icon, iconBg: meta.iconBg });
      }
    };

    const removeActionFromBranch = (branchId: number, actionIndex: number) => {
      const branch = branches.value.find(b => b.id === branchId);
      if (branch) branch.actions.splice(actionIndex, 1);
    };

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
      activeBranch,
      addBranch,
      removeBranch,
      startEditing,
      finishEditing,
      addCondition,
      removeCondition,
      operatorOptions,
      conditionVariables,
      loopInputValue,
      variableOptions,
      actionCatalog,
      addActionToBranch,
      removeActionFromBranch,
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
          title="Loop workflow with conditions"
          :tabs="pageTabs"
          :activeTab="activeTab"
          @update:activeTab="activeTab = $event"
        >
          <template #actions>
            <div class="flex items-center gap-sm">
              <ToggleSwitch v-model="isEnabled" label="Enabled" />
              <PvButton label="Cancel" severity="secondary" variant="outlined" />
              <PvButton severity="secondary" variant="outlined">
                <template #icon>
                  <PlayIcon class="size-5" />
                </template>
              </PvButton>
              <PvButton label="Save" />
            </div>
          </template>
        </PageHeader>

        <!-- Metadata bar -->
        <div class="flex items-center gap-md px-6 border-b border-neutral-default_solid bg-neutral-base shrink-0">
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

        <!-- Main content area -->
        <div v-if="activeTab === 'overview'" class="flex-1 flex min-h-0 overflow-hidden">
          <!-- Workflow canvas -->
          <div class="flex-1 overflow-auto bg-neutral-surface">
            <div class="flex flex-col items-center py-8 px-6 min-h-full">

              <!-- Trigger step card -->
              <div
                class="workflow-card w-[420px] rounded-lg border bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'trigger' ? 'border-2 border-brand-primary-base' : 'border-neutral-default_solid'"
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

              <!-- Loop step card -->
              <div
                class="workflow-card w-[420px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
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

              <!-- ═══ TABBED IF-ELSE NODE ═══ -->
              <div
                class="w-[520px] rounded-lg bg-neutral-base shadow-sm overflow-hidden cursor-pointer"
                :class="selectedStep === 'if-else' ? 'border-2 border-brand-primary-base' : 'border border-neutral-default_solid'"
                @click="selectedStep = 'if-else'"
              >
                <!-- Node header -->
                <div class="flex items-center gap-sm px-4 pt-4 pb-3">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                    <ArrowsRightLeftIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-body-md-semi-bold text-neutral-base">If Else</span>
                </div>

                <!-- Tab bar inside the node -->
                <div class="flex items-center border-b border-neutral-default_solid px-2 gap-0 overflow-x-auto">
                  <template v-for="branch in branches" :key="branch.id">
                    <div
                      class="flex items-center gap-1 px-3 py-2 cursor-pointer border-b-2 shrink-0 group"
                      :class="activeBranchId === branch.id
                        ? 'border-brand-primary-base text-brand-primary-base'
                        : 'border-transparent text-neutral-subtle hover:text-neutral-base'"
                      @click.stop="activeBranchId = branch.id"
                    >
                      <!-- Editable label -->
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
                        <span
                          class="text-body-sm"
                          @dblclick.stop="startEditing(branch.id)"
                        >{{ branch.label }}</span>
                      </template>

                      <!-- Remove button for else-if tabs -->
                      <XMarkIcon
                        v-if="branch.type === 'else-if'"
                        class="size-3 text-neutral-ghost opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-danger-base"
                        @click.stop="removeBranch(branch.id)"
                      />
                    </div>
                  </template>

                  <!-- Add tab button -->
                  <div
                    class="flex items-center justify-center size-6 shrink-0 ml-1 rounded cursor-pointer hover:bg-neutral-surface transition-colors"
                    @click.stop="addBranch()"
                  >
                    <PlusIcon class="size-3.5 text-neutral-subtle" />
                  </div>
                </div>

                <!-- Active branch preview -->
                <div class="px-4 py-3">
                  <template v-for="branch in branches" :key="'preview-' + branch.id">
                    <div v-if="branch.id === activeBranchId" class="flex flex-col gap-2">

                      <!-- Conditions summary -->
                      <template v-if="branch.type !== 'else'">
                        <div v-if="branch.conditions.length" class="flex flex-col gap-1">
                          <div
                            v-for="(cond, cIdx) in branch.conditions"
                            :key="cond.id"
                            class="flex flex-col gap-1"
                          >
                            <div class="flex items-center gap-xs flex-wrap">
                              <span v-if="cond.variable" class="text-body-sm text-neutral-base">
                                {{ cond.variable }} <span class="text-neutral-subtle">{{ cond.operator }}</span> {{ cond.value }}
                              </span>
                              <span v-else class="text-body-sm text-neutral-ghost">Not configured</span>
                            </div>
                            <div v-if="cIdx < branch.conditions.length - 1" class="flex items-center gap-xs">
                              <span class="text-body-xs px-1.5 py-0.5 rounded bg-neutral-surface border border-neutral-default_solid text-neutral-subtle font-medium">
                                {{ branch.conditionLogic }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span v-else class="text-body-sm text-neutral-ghost">No conditions</span>
                      </template>
                      <div v-else class="flex items-center gap-xs">
                        <span class="text-body-sm text-neutral-subtle">Default fallback path</span>
                      </div>

                      <!-- Divider -->
                      <div v-if="branch.actions.length || branch.type !== 'else'" class="border-t border-neutral-default_solid my-1"></div>

                      <!-- Actions list -->
                      <div v-if="branch.actions.length" class="flex flex-col gap-1">
                        <div
                          v-for="action in branch.actions"
                          :key="action.id"
                          class="flex items-center gap-xs"
                        >
                          <div class="flex items-center justify-center size-4 rounded shrink-0" :class="action.iconBg">
                            <component :is="action.icon" class="size-2.5 text-neutral-inverted-base" />
                          </div>
                          <span class="text-body-sm text-neutral-subtle truncate">{{ action.label }}</span>
                        </div>
                      </div>
                      <span v-else class="text-body-sm text-neutral-ghost">No actions</span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Connector to add button -->
              <div class="flex flex-col items-center">
                <div class="w-px h-6 border-l-2 border-dashed border-neutral-ghost"></div>
              </div>

              <!-- Add step button -->
              <PvButton severity="secondary" variant="outlined" rounded class="size-10">
                <template #icon>
                  <PlusIcon class="size-5" />
                </template>
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
                <template v-else-if="selectedStep === 'if-else'">
                  <div class="flex items-center justify-center size-6 rounded bg-chart-violet-dark">
                    <ArrowsRightLeftIcon class="size-4 text-neutral-inverted-base" />
                  </div>
                  <span class="text-heading-4 text-neutral-base">If Else</span>
                </template>
              </div>
              <PvButton severity="secondary" variant="text" size="small" @click="selectedStep = null">
                <template #icon>
                  <XMarkIcon class="size-5" />
                </template>
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
                        <div>
                          <div class="text-body-sm text-neutral-base">{{ slotProps.option.label }}</div>
                          <div v-if="slotProps.option.description" class="text-body-sm text-neutral-subtle">{{ slotProps.option.description }}</div>
                        </div>
                      </template>
                    </PvSelect>
                  </template>
                </FormField>
              </template>

              <!-- IF-ELSE panel — mirrors the node's tab bar -->
              <template v-else-if="selectedStep === 'if-else'">
                <!-- Sidebar tab bar matching the node -->
                <div class="flex items-center border-b border-neutral-default_solid -mx-4 px-2 gap-0 overflow-x-auto">
                  <template v-for="branch in branches" :key="'sidebar-tab-' + branch.id">
                    <div
                      class="flex items-center gap-1 px-3 py-2 cursor-pointer border-b-2 shrink-0 group"
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
                        <span class="text-body-sm" @dblclick.stop="startEditing(branch.id)">{{ branch.label }}</span>
                      </template>
                      <XMarkIcon
                        v-if="branch.type === 'else-if'"
                        class="size-3 text-neutral-ghost opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-danger-base"
                        @click.stop="removeBranch(branch.id)"
                      />
                    </div>
                  </template>
                  <div
                    class="flex items-center justify-center size-6 shrink-0 ml-1 rounded cursor-pointer hover:bg-neutral-surface transition-colors"
                    @click="addBranch()"
                  >
                    <PlusIcon class="size-3.5 text-neutral-subtle" />
                  </div>
                </div>

                <!-- Active branch config -->
                <template v-for="branch in branches" :key="'config-' + branch.id">
                  <div v-if="branch.id === activeBranchId" class="flex flex-col gap-md">

                    <!-- Conditions section (not shown for Else) -->
                    <template v-if="branch.type !== 'else'">
                      <div class="flex flex-col gap-sm">
                        <!-- Section header with AND/OR toggle -->
                        <div class="flex items-center justify-between">
                          <span class="text-body-sm-semi-bold text-neutral-base">Conditions</span>
                          <div v-if="branch.conditions.length > 1" class="flex items-center gap-xs rounded border border-neutral-default_solid overflow-hidden">
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

                        <!-- Condition rows -->
                        <div class="flex flex-col gap-sm">
                          <template v-for="(cond, cIdx) in branch.conditions" :key="cond.id">
                            <!-- AND/OR badge between rows -->
                            <div v-if="cIdx > 0" class="flex items-center gap-xs">
                              <div class="flex-1 h-px bg-neutral-default_solid"></div>
                              <span class="text-body-xs px-1.5 py-0.5 rounded border border-neutral-default_solid text-neutral-subtle font-medium bg-neutral-surface">
                                {{ branch.conditionLogic }}
                              </span>
                              <div class="flex-1 h-px bg-neutral-default_solid"></div>
                            </div>

                            <!-- Condition card -->
                            <div class="flex flex-col gap-xs p-3 rounded-md border border-neutral-default_solid bg-neutral-surface">
                              <div class="flex items-center justify-between mb-xs">
                                <span class="text-body-xs text-neutral-subtle font-medium">Condition {{ cIdx + 1 }}</span>
                                <PvButton
                                  v-if="branch.conditions.length > 1"
                                  severity="danger"
                                  variant="text"
                                  size="small"
                                  @click="removeCondition(branch.id, cIdx)"
                                >
                                  <template #icon>
                                    <TrashIcon class="size-3.5" />
                                  </template>
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

                        <!-- Add condition button -->
                        <button
                          class="flex items-center gap-xs px-3 py-2 rounded-md border border-dashed border-neutral-default_solid text-neutral-subtle hover:border-brand-primary-base hover:text-brand-primary-base hover:bg-brand-primary-ghost transition-colors w-full"
                          @click="addCondition(branch.id)"
                        >
                          <PlusIcon class="size-3.5 shrink-0" />
                          <span class="text-body-sm">Add condition</span>
                        </button>
                      </div>
                    </template>

                    <!-- Else description -->
                    <div v-if="branch.type === 'else'" class="px-3 py-3 rounded-md border border-neutral-default_solid bg-neutral-surface">
                      <span class="text-body-sm text-neutral-subtle">Default path — executes when no conditions match</span>
                    </div>

                    <!-- Branch actions -->
                    <div class="flex flex-col gap-sm">
                      <span class="text-body-sm-semi-bold text-neutral-base">Actions</span>

                      <!-- Added actions -->
                      <div
                        v-for="(action, aIdx) in branch.actions"
                        :key="action.id"
                        class="flex items-center gap-sm p-3 rounded-md border border-neutral-default_solid bg-neutral-surface"
                      >
                        <div class="flex items-center justify-center size-6 rounded shrink-0" :class="action.iconBg">
                          <component :is="action.icon" class="size-3.5 text-neutral-inverted-base" />
                        </div>
                        <span class="text-body-sm text-neutral-base flex-1 truncate">{{ action.label }}</span>
                        <PvButton severity="danger" variant="text" size="small" @click="removeActionFromBranch(branch.id, aIdx)">
                          <template #icon>
                            <TrashIcon class="size-3.5" />
                          </template>
                        </PvButton>
                      </div>

                      <!-- Action catalog — click to add -->
                      <div class="flex flex-col gap-xs">
                        <span class="text-body-xs text-neutral-subtle font-medium uppercase tracking-wide">Available actions</span>
                        <div
                          v-for="cat in actionCatalog"
                          :key="cat.actionId"
                          class="flex items-center gap-sm p-2 rounded-md border border-dashed border-neutral-default_solid cursor-pointer hover:border-brand-primary-base hover:bg-brand-primary-ghost transition-colors"
                          @click="addActionToBranch(branch.id, cat.actionId)"
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
              <p class="text-body-lg text-neutral-subtle">Execution history content coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
});

const meta: Meta<typeof WorkflowLoopsPage> = {
  title: 'Projects/Bala Playground/Pages/Workflow Loops',
  component: WorkflowLoopsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof WorkflowLoopsPage>;

export const Default: Story = {};
