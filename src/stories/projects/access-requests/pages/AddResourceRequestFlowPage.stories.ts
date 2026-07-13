import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, defineComponent, ref } from 'vue';
import {
  AppNavigation,
  CheckboxWithLabel,
  FormField,
  PageHeader,
  RadioButtonWithLabel,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Textarea from 'primevue/textarea';
import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/vue/24/solid';

import ConfigPageLayout from '@/components/layout/page-layouts/ConfigPageLayout.vue';
import PageSection from '@/components/PageSection.vue';
import SettingCardItem from '@/components/setting-card/SettingCardItem.vue';
import TopBar from '@/components/TopBar.vue';
import {
  ACCESS_REQUESTS_LIST_STORY_PATH,
  menuItems,
  navigateToStorybookStory,
  profileMenuItems,
} from '../shared/navigation';

/** Matches Access request settings surface cards */
const settingCardClass = 'w-full rounded-lg bg-neutral-surface shadow-e100';
const settingCardBodyClass = 'flex flex-col gap-md p-4';

type ApproverType =
  | 'administrator'
  | 'requesters-manager'
  | 'resource-owner'
  | 'user-group';

interface ApproverStep {
  id: string;
  type: ApproverType;
  /** Used when type is user-group */
  userGroupId: string | null;
  /** Used when type is resource-owner */
  resourceOwnerId: string | null;
}

let approverStepSeq = 1;
function createApproverStep(
  type: ApproverType = 'administrator',
  userGroupId: string | null = null,
  resourceOwnerId: string | null = null,
): ApproverStep {
  return { id: `approver-${approverStepSeq++}`, type, userGroupId, resourceOwnerId };
}

/** Mock catalog of logos already stored for SSO applications in the org */
const storedSsoLogos = [
  { id: 'salesforce', name: 'Salesforce', initials: 'SF', color: '#00A1E0' },
  { id: 'slack', name: 'Slack', initials: 'SL', color: '#4A154B' },
  { id: 'github', name: 'GitHub', initials: 'GH', color: '#24292F' },
  { id: 'jira', name: 'Jira', initials: 'JI', color: '#0052CC' },
  { id: 'confluence', name: 'Confluence', initials: 'CF', color: '#172B4D' },
  { id: 'zoom', name: 'Zoom', initials: 'ZM', color: '#2D8CFF' },
  { id: 'datadog', name: 'Datadog', initials: 'DD', color: '#632CA6' },
  { id: 'notion', name: 'Notion', initials: 'NO', color: '#000000' },
  { id: 'okta', name: 'Okta', initials: 'OK', color: '#007DC1' },
  { id: 'dropbox', name: 'Dropbox', initials: 'DB', color: '#0061FF' },
  { id: 'office365', name: 'Office 365', initials: 'O365', color: '#D83B01' },
  { id: 'google', name: 'Google Workspace', initials: 'GW', color: '#4285F4' },
];

const colorOptions = [
  { id: 'blue', label: 'Blue', value: '#1B4F72' },
  { id: 'teal', label: 'Teal', value: '#0E8A7D' },
  { id: 'green', label: 'Green', value: '#1E8449' },
  { id: 'lime', label: 'Lime', value: '#7D9A0C' },
  { id: 'orange', label: 'Orange', value: '#D35400' },
  { id: 'coral', label: 'Coral', value: '#E74C3C' },
  { id: 'red', label: 'Red', value: '#C0392B' },
  { id: 'pink', label: 'Pink', value: '#C2185B' },
  { id: 'purple', label: 'Purple', value: '#6C3483' },
  { id: 'indigo', label: 'Indigo', value: '#2E4053' },
  { id: 'slate', label: 'Slate', value: '#566573' },
  { id: 'gray', label: 'Gray', value: '#7F8C8D' },
];

const userGroupOptions = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Sales', value: 'sales' },
  { label: 'Design', value: 'design' },
  { label: 'Finance', value: 'finance' },
  { label: 'Security', value: 'security' },
];

const resourceOwnerOptions = [
  { label: 'Sarah Chen', value: 'sarah-chen' },
  { label: 'Marcus Webb', value: 'marcus-webb' },
  { label: 'Elena Vasquez', value: 'elena-vasquez' },
  { label: 'Priya Narayan', value: 'priya-narayan' },
];

const approverTypeOptions: { label: string; value: ApproverType }[] = [
  { label: 'Administrator', value: 'administrator' },
  { label: "Requester's manager", value: 'requesters-manager' },
  { label: 'Resource owner', value: 'resource-owner' },
  { label: 'User group', value: 'user-group' },
];

const approverRequirementOptions = [
  { label: 'At least one approver type', value: 'at-least-one' },
  { label: 'All approver types', value: 'all' },
  { label: 'All approver types, sequentially', value: 'all-sequential' },
];

const timeToLiveOptions = [
  { label: '5 days', value: '5-days' },
  { label: '10 days', value: '10-days' },
  { label: '30 days', value: '30-days' },
  { label: '60 days', value: '60-days' },
  { label: '90 days', value: '90-days' },
  { label: 'Custom duration', value: 'custom' },
];

const presetTtlOptions = timeToLiveOptions.filter((option) => option.value !== 'custom');

const ttlConfigurationOptions = [
  { label: 'Define durations for users to choose', value: 'user-choice' },
  { label: 'Set a fixed duration', value: 'fixed' },
];

const displayOptionChoices = [
  { label: 'Logo', value: 'logo' },
  { label: 'Color indicator', value: 'color' },
];

const AddResourceRequestFlowPage = defineComponent({
  name: 'AddResourceRequestFlowPage',
  components: {
    AppNavigation,
    PageHeader,
    TopBar,
    ConfigPageLayout,
    PageSection,
    SettingCardItem,
    FormField,
    Select,
    SelectButton,
    RadioButtonWithLabel,
    CheckboxWithLabel,
    Button,
    Dialog,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    Textarea,
    CheckCircleSolidIcon,
    CheckIcon,
    ClipboardDocumentCheckIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon,
  },
  setup() {
    const approvalFlowEnabled = ref(true);
    const flowName = ref('');
    const flowDescription = ref('');
    const displayOption = ref<'logo' | 'color'>('color');
    const selectedColorId = ref('blue');
    const selectedLogoId = ref<string | null>(null);
    const draftLogoId = ref<string | null>(null);
    const showSelectLogoModal = ref(false);
    const logoSearch = ref('');
    const userGroupAssignment = ref<string | null>(null);
    const visibleToGroups = ref<string[]>([]);
    const enableTimedAccess = ref(false);
    const ttlConfiguration = ref<'user-choice' | 'fixed'>('user-choice');
    const selectedTtlOptions = ref<string[]>([]);
    const selectedFixedTtl = ref<string | null>(null);
    const customDurationDays = ref('');
    const customDurationHours = ref('');
    const customDurationMinutes = ref('');
    const approvalType = ref<'automatic' | 'manual'>('manual');
    const approverSteps = ref<ApproverStep[]>([createApproverStep('administrator')]);
    const approverRequirement = ref<'at-least-one' | 'all' | 'all-sequential'>('all');
    const allowSlackApprovals = ref(false);

    const selectedColor = computed(
      () => colorOptions.find((c) => c.id === selectedColorId.value) ?? colorOptions[0],
    );

    const selectedLogo = computed(
      () => storedSsoLogos.find((logo) => logo.id === selectedLogoId.value) ?? null,
    );

    const filteredSsoLogos = computed(() => {
      const query = logoSearch.value.trim().toLowerCase();
      if (!query) return storedSsoLogos;
      return storedSsoLogos.filter((logo) => logo.name.toLowerCase().includes(query));
    });

    /** Admin-only flows use a single Administrator step; non-admin steps unlock multi-step configuration */
    const isNonAdminApproverFlow = computed(() =>
      approverSteps.value.some((step) => step.type !== 'administrator'),
    );

    const unusedApproverTypes = computed(() => {
      const used = new Set(approverSteps.value.map((step) => step.type));
      return approverTypeOptions.filter((option) => {
        if (used.has(option.value)) return false;
        // Administrator is never an addable step in non-admin / multi-approver flows
        if (option.value === 'administrator' && isNonAdminApproverFlow.value) return false;
        return true;
      });
    });

    const canAddApproverStep = computed(
      () =>
        approvalType.value === 'manual' &&
        isNonAdminApproverFlow.value &&
        unusedApproverTypes.value.length > 0,
    );

    const isCustomTtlSelected = computed(() =>
      ttlConfiguration.value === 'user-choice'
        ? selectedTtlOptions.value.includes('custom')
        : selectedFixedTtl.value === 'custom',
    );

    const isCustomDurationValid = computed(() => {
      const parsePart = (value: string) => {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      };
      return (
        parsePart(customDurationDays.value) +
          parsePart(customDurationHours.value) +
          parsePart(customDurationMinutes.value) >
        0
      );
    });

    const showCustomDurationError = computed(
      () => isCustomTtlSelected.value && !isCustomDurationValid.value,
    );

    const canSave = computed(() => {
      if (
        flowName.value.trim().length === 0 ||
        !userGroupAssignment.value ||
        visibleToGroups.value.length === 0 ||
        (displayOption.value === 'logo' ? !selectedLogoId.value : !selectedColorId.value)
      ) {
        return false;
      }

      if (enableTimedAccess.value) {
        if (ttlConfiguration.value === 'user-choice' && selectedTtlOptions.value.length === 0) {
          return false;
        }
        if (ttlConfiguration.value === 'fixed' && !selectedFixedTtl.value) {
          return false;
        }
        if (showCustomDurationError.value) {
          return false;
        }
      }

      if (approvalType.value !== 'manual') return true;

      return approverSteps.value.every((step) => {
        if (step.type === 'user-group') return !!step.userGroupId;
        if (step.type === 'resource-owner') return !!step.resourceOwnerId;
        return true;
      });
    });

    const canApplyLogo = computed(() => !!draftLogoId.value);

    function openSelectLogoModal() {
      draftLogoId.value = selectedLogoId.value;
      logoSearch.value = '';
      showSelectLogoModal.value = true;
    }

    function closeSelectLogoModal() {
      showSelectLogoModal.value = false;
    }

    function applySelectedLogo() {
      if (!draftLogoId.value) return;
      selectedLogoId.value = draftLogoId.value;
      showSelectLogoModal.value = false;
    }

    /**
     * Drop Administrator steps once any non-admin type is present.
     * Admin-only flows are a single Administrator row; multi-approver flows exclude Admin.
     */
    function normalizeApproverSteps() {
      const hasNonAdmin = approverSteps.value.some((step) => step.type !== 'administrator');
      if (!hasNonAdmin) return;

      const withoutAdmin = approverSteps.value.filter((step) => step.type !== 'administrator');
      if (withoutAdmin.length === approverSteps.value.length) return;

      approverSteps.value =
        withoutAdmin.length > 0 ? withoutAdmin : [createApproverStep('requesters-manager')];
    }

    /** Each approver type once; Administrator only when no non-admin sibling exists (or sole row reverting to admin-only) */
    function availableApproverTypesForStep(stepId: string) {
      const usedElsewhere = new Set(
        approverSteps.value.filter((step) => step.id !== stepId).map((step) => step.type),
      );
      const otherHasNonAdmin = approverSteps.value.some(
        (step) => step.id !== stepId && step.type !== 'administrator',
      );
      const isSoleStep = approverSteps.value.length === 1;

      return approverTypeOptions.filter((option) => {
        if (usedElsewhere.has(option.value)) return false;
        if (option.value === 'administrator') {
          // Allow Administrator only to convert a sole non-admin row back to admin-only
          if (otherHasNonAdmin) return false;
          if (!isSoleStep) return false;
        }
        return true;
      });
    }

    function updateApproverStepType(stepId: string, type: ApproverType) {
      const usedElsewhere = approverSteps.value.some(
        (step) => step.id !== stepId && step.type === type,
      );
      if (usedElsewhere) return;

      const otherHasNonAdmin = approverSteps.value.some(
        (step) => step.id !== stepId && step.type !== 'administrator',
      );
      if (type === 'administrator' && otherHasNonAdmin) return;

      approverSteps.value = approverSteps.value.map((step) => {
        if (step.id !== stepId) return step;
        return {
          ...step,
          type,
          userGroupId: type === 'user-group' ? step.userGroupId : null,
          resourceOwnerId: type === 'resource-owner' ? step.resourceOwnerId : null,
        };
      });

      normalizeApproverSteps();
    }

    function updateApproverStepGroup(stepId: string, userGroupId: string | null) {
      approverSteps.value = approverSteps.value.map((step) =>
        step.id === stepId ? { ...step, userGroupId } : step,
      );
    }

    function updateApproverStepOwner(stepId: string, resourceOwnerId: string | null) {
      approverSteps.value = approverSteps.value.map((step) =>
        step.id === stepId ? { ...step, resourceOwnerId } : step,
      );
    }

    function addApproverStep() {
      if (!canAddApproverStep.value) return;
      const nextType = unusedApproverTypes.value[0]?.value;
      if (!nextType) return;
      approverSteps.value = [...approverSteps.value, createApproverStep(nextType)];
    }

    function removeApproverStep(stepId: string) {
      if (approverSteps.value.length <= 1) return;
      approverSteps.value = approverSteps.value.filter((step) => step.id !== stepId);
    }

    function approverFieldLabel(type: ApproverType): string {
      if (type === 'administrator') {
        return 'Settings > Administrators > Administrator with Billing & Administrator';
      }
      if (type === 'requesters-manager') {
        return 'User > Employment Info > Manager Attribute';
      }
      return '';
    }

    function handleTtlConfigurationChange(value: 'user-choice' | 'fixed') {
      ttlConfiguration.value = value;
      if (value === 'fixed') {
        selectedFixedTtl.value = selectedTtlOptions.value[0] ?? null;
        selectedTtlOptions.value = [];
      } else {
        selectedTtlOptions.value = selectedFixedTtl.value ? [selectedFixedTtl.value] : [];
        selectedFixedTtl.value = null;
      }
    }

    function navigateToList() {
      navigateToStorybookStory(ACCESS_REQUESTS_LIST_STORY_PATH);
    }

    function handleSave() {
      if (!canSave.value) return;
      navigateToList();
    }

    return {
      menuItems,
      profileMenuItems,
      settingCardClass,
      settingCardBodyClass,
      colorOptions,
      userGroupOptions,
      resourceOwnerOptions,
      approverTypeOptions,
      approverRequirementOptions,
      timeToLiveOptions,
      presetTtlOptions,
      ttlConfigurationOptions,
      displayOptionChoices,
      approvalFlowEnabled,
      flowName,
      flowDescription,
      displayOption,
      selectedColorId,
      selectedColor,
      selectedLogoId,
      selectedLogo,
      draftLogoId,
      showSelectLogoModal,
      logoSearch,
      filteredSsoLogos,
      userGroupAssignment,
      visibleToGroups,
      enableTimedAccess,
      ttlConfiguration,
      selectedTtlOptions,
      selectedFixedTtl,
      customDurationDays,
      customDurationHours,
      customDurationMinutes,
      showCustomDurationError,
      handleTtlConfigurationChange,
      approvalType,
      approverSteps,
      approverRequirement,
      isNonAdminApproverFlow,
      canAddApproverStep,
      allowSlackApprovals,
      canSave,
      canApplyLogo,
      openSelectLogoModal,
      closeSelectLogoModal,
      applySelectedLogo,
      availableApproverTypesForStep,
      updateApproverStepType,
      updateApproverStepGroup,
      updateApproverStepOwner,
      addApproverStep,
      removeApproverStep,
      approverFieldLabel,
      navigateToList,
      handleSave,
    };
  },
  template: `
    <div class="flex h-screen w-screen overflow-hidden">
      <AppNavigation
        class="shrink-0"
        title="JumpCloud"
        :menu-items="menuItems"
        :profile-menu-items="profileMenuItems"
        initial-active-label="Access Requests"
      />
      <div class="main flex h-full min-h-0 min-w-0 w-full flex-[1_1_0] flex-col self-stretch overflow-hidden">
        <TopBar />
        <div class="flex min-h-0 h-full w-full min-w-0 flex-[1_1_0] flex-col overflow-hidden">
          <PageHeader class="shrink-0" title="Add resource request flow">
            <template #icon>
              <ClipboardDocumentCheckIcon class="size-7" />
            </template>
          </PageHeader>

          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-neutral-surface">
            <ConfigPageLayout class="w-full! h-full!" maxWidth="1024">
              <div class="flex flex-col gap-8 pb-xl">
                <div :class="settingCardClass">
                  <SettingCardItem
                    v-model:toggle-value="approvalFlowEnabled"
                    title="Approval flow enabled"
                    :has-bottom-border="false"
                  >
                    <template #description>
                      <span class="text-body-sm text-neutral-muted">
                        When enabled, this approval flow runs for matching access requests.
                      </span>
                    </template>
                  </SettingCardItem>
                </div>

                <section class="flex flex-col gap-4">
                  <PageSection title="Display details">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Name and appearance shown in the admin list and user portal.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="[settingCardClass, settingCardBodyClass]">
                    <FormField label="Name" required>
                      <template #default="{ inputId }">
                        <InputText
                          :id="inputId"
                          v-model="flowName"
                          class="w-full"
                          placeholder="Example: Salesforce - Admin"
                        />
                      </template>
                    </FormField>

                    <FormField label="Description">
                      <template #default="{ inputId }">
                        <Textarea
                          :id="inputId"
                          v-model="flowDescription"
                          class="w-full"
                          rows="3"
                          placeholder="Example: Admin access to Salesforce"
                        />
                      </template>
                    </FormField>

                    <FormField label="Display option" required>
                      <template #default>
                        <div class="flex flex-wrap items-start gap-lg">
                          <SelectButton
                            v-model="displayOption"
                            :options="displayOptionChoices"
                            option-label="label"
                            option-value="value"
                            :allow-empty="false"
                          />

                          <div
                            v-if="displayOption === 'color'"
                            class="flex flex-wrap items-start gap-md"
                          >
                            <div class="grid grid-cols-4 gap-sm">
                              <button
                                v-for="color in colorOptions"
                                :key="color.id"
                                type="button"
                                class="relative size-8 rounded-full border-2 transition-shadow"
                                :class="
                                  selectedColorId === color.id
                                    ? 'border-neutral-base shadow-e100'
                                    : 'border-transparent'
                                "
                                :style="{ backgroundColor: color.value }"
                                :aria-label="'Select ' + color.label"
                                :aria-pressed="selectedColorId === color.id"
                                @click="selectedColorId = color.id"
                              >
                                <CheckIcon
                                  v-if="selectedColorId === color.id"
                                  class="absolute inset-0 m-auto size-4 text-white"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                            <div
                              class="size-16 shrink-0 rounded-full border border-neutral-default_solid"
                              :style="{ backgroundColor: selectedColor.value }"
                              aria-hidden="true"
                            />
                          </div>

                          <div
                            v-else
                            class="flex flex-wrap items-center gap-md"
                          >
                            <div
                              class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-default_solid bg-neutral-base"
                            >
                              <div
                                v-if="selectedLogo"
                                class="flex size-full items-center justify-center text-body-sm-bold text-white"
                                :style="{ backgroundColor: selectedLogo.color }"
                              >
                                {{ selectedLogo.initials }}
                              </div>
                              <PhotoIcon
                                v-else
                                class="size-7 text-neutral-subtle"
                                aria-hidden="true"
                              />
                            </div>
                            <Button
                              :label="selectedLogo ? 'Change logo' : 'Select a logo'"
                              severity="secondary"
                              variant="outlined"
                              @click="openSelectLogoModal"
                            />
                          </div>
                        </div>
                        <p
                          v-if="displayOption === 'color'"
                          class="mt-sm flex items-center gap-xs text-body-sm text-success-base"
                        >
                          <CheckCircleSolidIcon class="size-4 shrink-0" aria-hidden="true" />
                          <span>Color selected: {{ selectedColor.label }}</span>
                        </p>
                        <p
                          v-else-if="selectedLogo"
                          class="mt-sm flex items-center gap-xs text-body-sm text-success-base"
                        >
                          <CheckCircleSolidIcon class="size-4 shrink-0" aria-hidden="true" />
                          <span>Logo selected: {{ selectedLogo.name }}</span>
                        </p>
                      </template>
                    </FormField>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Access and visibility">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Choose which group receives access and who can request this flow.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="[settingCardClass, settingCardBodyClass]">
                    <FormField
                      label="User group assignment"
                      required
                      label-tooltip="User group that receives access when this flow is approved."
                    >
                      <template #default="{ inputId }">
                        <Select
                          :id="inputId"
                          v-model="userGroupAssignment"
                          :options="userGroupOptions"
                          option-label="label"
                          option-value="value"
                          placeholder="Search or select"
                          filter
                          filter-placeholder="Search"
                          show-clear
                          class="w-full!"
                        >
                          <template #filtericon>
                            <MagnifyingGlassIcon />
                          </template>
                        </Select>
                      </template>
                    </FormField>

                    <FormField
                      label="Visible to"
                      required
                      label-tooltip="User groups that can see and request this flow in the user portal."
                    >
                      <template #default="{ inputId }">
                        <MultiSelect
                          :id="inputId"
                          v-model="visibleToGroups"
                          :options="userGroupOptions"
                          option-label="label"
                          option-value="value"
                          placeholder="Search user groups"
                          filter
                          display="chip"
                          :max-selected-labels="2"
                          class="w-full"
                        />
                      </template>
                    </FormField>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Timed access">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Limit how long approved access remains active before it expires.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="settingCardClass">
                    <SettingCardItem
                      v-model:toggle-value="enableTimedAccess"
                      title="Enable time-based access"
                      :has-bottom-border="false"
                    >
                      <template #description>
                        <span class="text-body-sm text-neutral-muted">
                          When enabled, approved access expires after the configured duration.
                        </span>
                      </template>
                    </SettingCardItem>

                    <div
                      v-if="enableTimedAccess"
                      class="flex flex-col gap-md px-4 pb-4"
                    >
                      <FormField
                        label="Time to live configuration"
                        label-tooltip="Choose whether requesters pick from allowed durations or receive a single fixed duration."
                      >
                        <template #default="{ inputId }">
                          <Select
                            :id="inputId"
                            :model-value="ttlConfiguration"
                            :options="ttlConfigurationOptions"
                            option-label="label"
                            option-value="value"
                            class="w-full!"
                            @update:model-value="handleTtlConfigurationChange"
                          />
                        </template>
                      </FormField>

                      <FormField
                        label="Time to live"
                        required
                        :help-text="
                          showCustomDurationError ? 'Duration must be greater than 0' : undefined
                        "
                        :help-text-severity="showCustomDurationError ? 'error' : 'default'"
                      >
                        <template #default>
                          <div
                            v-if="ttlConfiguration === 'user-choice'"
                            class="flex flex-col gap-sm"
                          >
                            <CheckboxWithLabel
                              v-for="option in presetTtlOptions"
                              :key="option.value"
                              v-model="selectedTtlOptions"
                              :value="option.value"
                              name="ttl-user-choice"
                            >
                              <template #label>
                                <span class="text-body-md text-neutral-base">{{ option.label }}</span>
                              </template>
                            </CheckboxWithLabel>
                            <div class="flex flex-col gap-sm">
                              <CheckboxWithLabel
                                v-model="selectedTtlOptions"
                                value="custom"
                                name="ttl-user-choice"
                              >
                                <template #label>
                                  <span class="text-body-md text-neutral-base">Custom duration</span>
                                </template>
                              </CheckboxWithLabel>
                              <div
                                v-if="selectedTtlOptions.includes('custom')"
                                class="ml-lg flex flex-wrap items-center gap-md"
                              >
                                <div class="flex items-center gap-sm">
                                  <InputText
                                    v-model="customDurationDays"
                                    class="w-14!"
                                    inputmode="numeric"
                                    aria-label="Custom duration days"
                                  />
                                  <span class="text-body-md text-neutral-base">days</span>
                                </div>
                                <div class="flex items-center gap-sm">
                                  <InputText
                                    v-model="customDurationHours"
                                    class="w-14!"
                                    inputmode="numeric"
                                    aria-label="Custom duration hours"
                                  />
                                  <span class="text-body-md text-neutral-base">hours</span>
                                </div>
                                <div class="flex items-center gap-sm">
                                  <InputText
                                    v-model="customDurationMinutes"
                                    class="w-14!"
                                    inputmode="numeric"
                                    aria-label="Custom duration minutes"
                                  />
                                  <span class="text-body-md text-neutral-base">minutes</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="flex flex-col gap-sm">
                            <RadioButtonWithLabel
                              v-for="option in presetTtlOptions"
                              :key="option.value"
                              v-model="selectedFixedTtl"
                              :value="option.value"
                              name="ttl-fixed"
                            >
                              <template #label>
                                <span class="text-body-md text-neutral-base">{{ option.label }}</span>
                              </template>
                            </RadioButtonWithLabel>
                            <div class="flex flex-col gap-sm">
                              <RadioButtonWithLabel
                                v-model="selectedFixedTtl"
                                value="custom"
                                name="ttl-fixed"
                              >
                                <template #label>
                                  <span class="text-body-md text-neutral-base">Custom duration</span>
                                </template>
                              </RadioButtonWithLabel>
                              <div
                                v-if="selectedFixedTtl === 'custom'"
                                class="ml-lg flex flex-wrap items-center gap-md"
                              >
                                <div class="flex items-center gap-sm">
                                  <InputText
                                    v-model="customDurationDays"
                                    class="w-14!"
                                    inputmode="numeric"
                                    aria-label="Custom duration days"
                                  />
                                  <span class="text-body-md text-neutral-base">days</span>
                                </div>
                                <div class="flex items-center gap-sm">
                                  <InputText
                                    v-model="customDurationHours"
                                    class="w-14!"
                                    inputmode="numeric"
                                    aria-label="Custom duration hours"
                                  />
                                  <span class="text-body-md text-neutral-base">hours</span>
                                </div>
                                <div class="flex items-center gap-sm">
                                  <InputText
                                    v-model="customDurationMinutes"
                                    class="w-14!"
                                    inputmode="numeric"
                                    aria-label="Custom duration minutes"
                                  />
                                  <span class="text-body-md text-neutral-base">minutes</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </FormField>
                    </div>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Approval">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Decide how requests are approved and whether approvers can act in Slack.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="[settingCardClass, settingCardBodyClass]">
                    <FormField label="Approval type" required>
                      <template #default>
                        <div class="flex flex-col gap-sm">
                          <RadioButtonWithLabel
                            v-model="approvalType"
                            value="automatic"
                            name="approval-type"
                          >
                            <template #label>Automatic</template>
                          </RadioButtonWithLabel>
                          <RadioButtonWithLabel
                            v-model="approvalType"
                            value="manual"
                            name="approval-type"
                          >
                            <template #label>Manual</template>
                          </RadioButtonWithLabel>
                        </div>
                      </template>
                    </FormField>

                    <div v-if="approvalType === 'manual'" class="flex flex-col gap-md">
                      <p class="text-body-sm text-neutral-muted">
                        <span v-if="isNonAdminApproverFlow">
                          Non-admin approver flow — each approver type can be used once. Administrator is only available for admin-only flows.
                        </span>
                        <span v-else>
                          Admin-only flow — requests are approved by administrators. Choose a non-admin type to configure delegated steps.
                        </span>
                      </p>

                      <div
                        v-for="step in approverSteps"
                        :key="step.id"
                        class="flex items-end gap-sm"
                      >
                        <FormField class="min-w-0 flex-1" label="Approver type">
                          <template #default="{ inputId }">
                            <Select
                              :id="inputId"
                              :model-value="step.type"
                              :options="availableApproverTypesForStep(step.id)"
                              option-label="label"
                              option-value="value"
                              class="w-full!"
                              @update:model-value="updateApproverStepType(step.id, $event)"
                            />
                          </template>
                        </FormField>

                        <FormField
                          v-if="step.type === 'administrator' || step.type === 'requesters-manager'"
                          class="min-w-0 flex-1"
                          label="Approver"
                        >
                          <template #default="{ inputId }">
                            <InputText
                              :id="inputId"
                              class="w-full"
                              disabled
                              :model-value="approverFieldLabel(step.type)"
                            />
                          </template>
                        </FormField>

                        <FormField
                          v-else-if="step.type === 'resource-owner'"
                          class="min-w-0 flex-1"
                          label="Approver"
                          required
                        >
                          <template #default="{ inputId }">
                            <Select
                              :id="inputId"
                              :model-value="step.resourceOwnerId"
                              :options="resourceOwnerOptions"
                              option-label="label"
                              option-value="value"
                              placeholder="Search or select"
                              filter
                              filter-placeholder="Search"
                              show-clear
                              class="w-full!"
                              @update:model-value="updateApproverStepOwner(step.id, $event)"
                            >
                              <template #filtericon>
                                <MagnifyingGlassIcon />
                              </template>
                            </Select>
                          </template>
                        </FormField>

                        <FormField
                          v-else
                          class="min-w-0 flex-1"
                          label="Approver"
                          required
                        >
                          <template #default="{ inputId }">
                            <Select
                              :id="inputId"
                              :model-value="step.userGroupId"
                              :options="userGroupOptions"
                              option-label="label"
                              option-value="value"
                              placeholder="Search or select"
                              filter
                              filter-placeholder="Search"
                              show-clear
                              class="w-full!"
                              @update:model-value="updateApproverStepGroup(step.id, $event)"
                            >
                              <template #filtericon>
                                <MagnifyingGlassIcon />
                              </template>
                            </Select>
                          </template>
                        </FormField>

                        <div class="mb-1 flex shrink-0 items-center gap-xs">
                          <Button
                            v-if="approverSteps.length > 1"
                            severity="secondary"
                            variant="text"
                            rounded
                            aria-label="Remove approver step"
                            @click="removeApproverStep(step.id)"
                          >
                            <template #icon="iconProps">
                              <TrashIcon :class="iconProps?.class" aria-hidden="true" />
                            </template>
                          </Button>
                          <Button
                            v-if="canAddApproverStep"
                            severity="secondary"
                            variant="text"
                            rounded
                            aria-label="Add approver step"
                            @click="addApproverStep"
                          >
                            <template #icon="iconProps">
                              <PlusIcon :class="iconProps?.class" aria-hidden="true" />
                            </template>
                          </Button>
                        </div>
                      </div>

                      <FormField
                        v-if="isNonAdminApproverFlow && approverSteps.length > 1"
                        label="Approver requirement"
                      >
                        <template #default>
                          <div class="flex flex-col gap-sm">
                            <RadioButtonWithLabel
                              v-for="option in approverRequirementOptions"
                              :key="option.value"
                              v-model="approverRequirement"
                              :value="option.value"
                              name="approver-requirement"
                            >
                              <template #label>{{ option.label }}</template>
                            </RadioButtonWithLabel>
                          </div>
                        </template>
                      </FormField>
                    </div>
                  </div>

                  <div :class="settingCardClass">
                    <SettingCardItem
                      v-model:toggle-value="allowSlackApprovals"
                      title="Allow Slack approvals"
                      :has-bottom-border="false"
                    >
                      <template #description>
                        <span class="text-body-sm text-neutral-muted">
                          Let approvers approve or decline requests from Slack.
                        </span>
                      </template>
                    </SettingCardItem>
                  </div>
                </section>
              </div>
            </ConfigPageLayout>
          </div>

          <div
            class="flex shrink-0 items-center justify-end gap-sm border-t border-neutral-default_solid bg-neutral-base px-6 py-3"
          >
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="navigateToList"
            />
            <Button
              label="Save"
              :disabled="!canSave"
              @click="handleSave"
            />
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="showSelectLogoModal"
        :draggable="false"
        modal
        header="Select logo"
        :style="{ width: '640px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <FormField label="Search logos">
            <template #default="{ inputId }">
              <IconField>
                <InputIcon>
                  <MagnifyingGlassIcon />
                </InputIcon>
                <InputText
                  :id="inputId"
                  v-model="logoSearch"
                  class="w-full"
                  placeholder="Search SSO logos"
                />
              </IconField>
            </template>
          </FormField>

          <div
            v-if="filteredSsoLogos.length === 0"
            class="py-8 text-center text-body-md text-neutral-subtle"
          >
            No logos match your search.
          </div>
          <div
            v-else
            class="grid max-h-80 grid-cols-3 gap-sm overflow-y-auto sm:grid-cols-4"
          >
            <button
              v-for="logo in filteredSsoLogos"
              :key="logo.id"
              type="button"
              class="flex flex-col items-center gap-sm rounded-md border p-md transition-colors"
              :class="
                draftLogoId === logo.id
                  ? 'border-info-base bg-info-surface'
                  : 'border-neutral-default_solid bg-neutral-base hover:bg-neutral-surface'
              "
              :aria-pressed="draftLogoId === logo.id"
              @click="draftLogoId = logo.id"
            >
              <div
                class="relative flex size-14 items-center justify-center rounded-md text-body-sm-bold text-white"
                :style="{ backgroundColor: logo.color }"
              >
                {{ logo.initials }}
                <CheckCircleSolidIcon
                  v-if="draftLogoId === logo.id"
                  class="absolute -right-1 -top-1 size-5 text-info-base"
                  aria-hidden="true"
                />
              </div>
              <span class="line-clamp-2 text-center text-body-sm text-neutral-base">{{ logo.name }}</span>
            </button>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeSelectLogoModal"
            />
            <Button
              label="Apply"
              :disabled="!canApplyLogo"
              @click="applySelectedLogo"
            />
          </div>
        </template>
      </Dialog>
    </div>
  `,
});

const meta: Meta<typeof AddResourceRequestFlowPage> = {
  title: 'Projects/Access Requests/Pages/Add Resource Request Flow',
  component: AddResourceRequestFlowPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AddResourceRequestFlowPage>;

export const Default: Story = {};
