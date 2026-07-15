import { computed, defineComponent, ref } from 'vue';
import {
  AppNavigation,
  CheckboxWithLabel,
  FormField,
  PageHeader,
  RadioButtonWithLabel,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline';

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

const settingCardClass = 'w-full rounded-lg bg-neutral-surface shadow-e100';
const settingCardBodyClass = 'flex flex-col gap-md p-4';

const userGroupOptions = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Sales', value: 'sales' },
  { label: 'Design', value: 'design' },
  { label: 'Finance', value: 'finance' },
  { label: 'Security', value: 'security' },
];

const sessionDurationOptions = [
  { label: '1 Hour', value: '1-hour' },
  { label: '4 Hours', value: '4-hours' },
  { label: '8 Hours', value: '8-hours' },
  { label: 'Custom duration', value: 'custom' },
];

const approverTypeOptions = [{ label: 'Administrator', value: 'administrator' }];

const AddDeviceAdminFlowPage = defineComponent({
  name: 'AddDeviceAdminFlowPage',
  components: {
    AppNavigation,
    PageHeader,
    TopBar,
    ConfigPageLayout,
    PageSection,
    SettingCardItem,
    FormField,
    Select,
    RadioButtonWithLabel,
    CheckboxWithLabel,
    Button,
    InputText,
    MultiSelect,
    Textarea,
    ClipboardDocumentCheckIcon,
  },
  setup() {
    const approvalFlowEnabled = ref(true);
    const flowName = ref('');
    const flowDescription = ref('');
    const selectedSessionDurations = ref<string[]>([]);
    const customDurationHours = ref('');
    const visibleToGroups = ref<string[]>([]);
    const approvalType = ref<'automatic' | 'manual'>('manual');
    const approverType = ref<'administrator'>('administrator');

    const isCustomDurationSelected = computed(() =>
      selectedSessionDurations.value.includes('custom'),
    );

    const isCustomDurationValid = computed(() => {
      if (!isCustomDurationSelected.value) return true;
      const parsed = Number.parseInt(customDurationHours.value, 10);
      return Number.isFinite(parsed) && parsed > 0;
    });

    const showCustomDurationError = computed(
      () => isCustomDurationSelected.value && !isCustomDurationValid.value,
    );

    const canSave = computed(() => {
      if (flowName.value.trim().length === 0) return false;
      if (visibleToGroups.value.length === 0) return false;
      if (selectedSessionDurations.value.length === 0) return false;
      if (showCustomDurationError.value) return false;
      return true;
    });

    function approverFieldLabel(): string {
      return 'Settings > Administrators > Administrator with Billing & Administrator';
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
      approvalFlowEnabled,
      flowName,
      flowDescription,
      selectedSessionDurations,
      customDurationHours,
      visibleToGroups,
      approvalType,
      approverType,
      userGroupOptions,
      sessionDurationOptions,
      approverTypeOptions,
      showCustomDurationError,
      canSave,
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
          <PageHeader class="shrink-0" title="Add device admin flow">
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
                        Name and description shown in the admin list and user portal.
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
                          placeholder="Example: Device Admin"
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
                          placeholder="Example: Temporary device admin access for engineering"
                        />
                      </template>
                    </FormField>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Session options">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Permission level and session durations available to requesters.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="[settingCardClass, settingCardBodyClass]">
                    <FormField
                      label="Permission levels"
                      label-tooltip="Elevated permission type granted when a session is approved."
                    >
                      <template #default>
                        <p class="text-body-md text-neutral-base">Administrator / Sudo</p>
                      </template>
                    </FormField>

                    <FormField
                      label="Session durations"
                      required
                      label-tooltip="Durations requesters can choose when submitting a device admin request."
                      :help-text="
                        showCustomDurationError ? 'Duration must be greater than 0' : undefined
                      "
                      :help-text-severity="showCustomDurationError ? 'error' : 'default'"
                    >
                      <template #default>
                        <div class="flex flex-col gap-sm">
                          <CheckboxWithLabel
                            v-for="option in sessionDurationOptions.filter((o) => o.value !== 'custom')"
                            :key="option.value"
                            v-model="selectedSessionDurations"
                            :value="option.value"
                            name="session-duration"
                          >
                            <template #label>
                              <span class="text-body-md text-neutral-base">{{ option.label }}</span>
                            </template>
                          </CheckboxWithLabel>
                          <div class="flex flex-col gap-sm">
                            <CheckboxWithLabel
                              v-model="selectedSessionDurations"
                              value="custom"
                              name="session-duration"
                            >
                              <template #label>
                                <span class="text-body-md text-neutral-base">Custom duration</span>
                              </template>
                            </CheckboxWithLabel>
                            <div
                              v-if="selectedSessionDurations.includes('custom')"
                              class="ml-lg flex flex-wrap items-center gap-md"
                            >
                              <div class="flex items-center gap-sm">
                                <InputText
                                  v-model="customDurationHours"
                                  class="w-14!"
                                  inputmode="numeric"
                                  aria-label="Custom duration hours"
                                />
                                <span class="text-body-md text-neutral-base">hours</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </FormField>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="User portal visibility">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Choose which user groups can see and request this flow.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="[settingCardClass, settingCardBodyClass]">
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
                  <PageSection title="Approval flow">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Decide how device admin requests are approved.
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

                    <div
                      v-if="approvalType === 'manual'"
                      class="grid grid-cols-1 gap-md md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
                    >
                      <FormField label="Approver type">
                        <template #default="{ inputId }">
                          <Select
                            :id="inputId"
                            v-model="approverType"
                            :options="approverTypeOptions"
                            option-label="label"
                            option-value="value"
                            class="w-full!"
                          />
                        </template>
                      </FormField>

                      <FormField label="Approver">
                        <template #default="{ inputId }">
                          <InputText
                            :id="inputId"
                            class="w-full"
                            disabled
                            :model-value="approverFieldLabel()"
                          />
                        </template>
                      </FormField>
                    </div>
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
    </div>
  `,
});

export default AddDeviceAdminFlowPage;
export { AddDeviceAdminFlowPage };
