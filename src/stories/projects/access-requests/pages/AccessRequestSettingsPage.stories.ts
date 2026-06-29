import type { Meta, StoryObj } from '@storybook/vue3';
import { defineComponent, ref, watch } from 'vue';
import {
  AppNavigation,
  PageHeader,
  ToggleSwitch,
  CheckboxWithLabel,
  FormField,
  LinkText,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

import TopBar from '@/components/TopBar.vue';
import {
  ACCESS_REQUESTS_LIST_STORY_PATH,
  menuItems,
  navigateToStorybookStory,
  profileMenuItems,
} from '../shared/navigation';
import {
  WEBHOOK_ACCESS_EVENT_DEFINITIONS,
  createDefaultSettingsWebhookChannels,
  isWebhookChannelSelectAllChecked,
  isWebhookChannelSelectAllIndeterminate,
  setAllWebhookChannelEvents,
  webhookChannelEventsTagLabel,
} from '../shared/webhookChannelSettings';

const AccessRequestSettingsPage = defineComponent({
  name: 'AccessRequestSettingsPage',
  components: {
    AppNavigation,
    PageHeader,
    TopBar,
    ToggleSwitch,
    Checkbox,
    CheckboxWithLabel,
    FormField,
    LinkText,
    Button,
    Dialog,
    Divider,
    IconField,
    InputIcon,
    InputText,
    Tag,
    ArrowTopRightOnSquareIcon,
    ClipboardDocumentCheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    XMarkIcon,
  },
  setup() {
    const accessRequestsOn = ref(true);
    const notifyViaEmail = ref(true);
    const notifyRequestReceived = ref(true);
    const notifyApprovalDenial = ref(true);
    const exposeApprovalProgress = ref(true);
    const settingsWebhookChannels = ref(createDefaultSettingsWebhookChannels());
    const showSelectChannelModal = ref(false);
    const selectChannelSearch = ref('');
    const selectChannelSelectedCount = ref(0);
    const showRemoveWebhookChannelDialog = ref(false);
    const webhookChannelIdPendingRemoval = ref<string | null>(null);

    function removeSettingsWebhookChannel(id: string) {
      settingsWebhookChannels.value = settingsWebhookChannels.value.filter((c) => c.id !== id);
    }

    function openRemoveWebhookChannelDialog(id: string) {
      webhookChannelIdPendingRemoval.value = id;
      showRemoveWebhookChannelDialog.value = true;
    }

    function closeRemoveWebhookChannelDialog() {
      showRemoveWebhookChannelDialog.value = false;
    }

    function confirmRemoveWebhookChannel() {
      const id = webhookChannelIdPendingRemoval.value;
      if (id) removeSettingsWebhookChannel(id);
      showRemoveWebhookChannelDialog.value = false;
    }

    watch(showRemoveWebhookChannelDialog, (open) => {
      if (!open) webhookChannelIdPendingRemoval.value = null;
    });

    function openSelectChannelModal() {
      showSelectChannelModal.value = true;
    }

    function closeSelectChannelModal() {
      showSelectChannelModal.value = false;
      selectChannelSearch.value = '';
    }

    function handleSelectChannelAdd() {
      showSelectChannelModal.value = false;
      selectChannelSearch.value = '';
    }

    function navigateToList() {
      navigateToStorybookStory(ACCESS_REQUESTS_LIST_STORY_PATH);
    }

    return {
      menuItems,
      profileMenuItems,
      accessRequestsOn,
      notifyViaEmail,
      notifyRequestReceived,
      notifyApprovalDenial,
      exposeApprovalProgress,
      settingsWebhookChannels,
      webhookAccessEvents: WEBHOOK_ACCESS_EVENT_DEFINITIONS,
      webhookChannelEventsTagLabel,
      isWebhookChannelSelectAllChecked,
      isWebhookChannelSelectAllIndeterminate,
      setAllWebhookChannelEvents,
      openRemoveWebhookChannelDialog,
      closeRemoveWebhookChannelDialog,
      confirmRemoveWebhookChannel,
      showRemoveWebhookChannelDialog,
      showSelectChannelModal,
      selectChannelSearch,
      selectChannelSelectedCount,
      openSelectChannelModal,
      closeSelectChannelModal,
      handleSelectChannelAdd,
      navigateToList,
    };
  },
  template: `
    <div class="flex h-screen overflow-hidden">
      <AppNavigation
        :menuItems="menuItems"
        :profileMenuItems="profileMenuItems"
        activeItem="access"
        :collapsible="true"
        :topNavToggle="true"
      />
      <div class="main flex h-full min-h-0 min-w-0 w-full flex-[1_1_0] flex-col self-stretch overflow-hidden">
        <TopBar />
        <div class="flex min-h-0 h-full w-full min-w-0 flex-[1_1_0] flex-col overflow-hidden">
          <PageHeader class="shrink-0" title="Access Requests">
            <template #icon>
              <ClipboardDocumentCheckIcon class="size-7" />
            </template>
          </PageHeader>

          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-neutral-surface">
            <div class="flex w-full min-w-0 flex-col gap-6 px-6 py-6">
              <div
                class="flex max-w-[1024px] flex-col gap-6 rounded-lg border border-neutral-default_solid bg-neutral-base p-md"
              >
                <div class="flex flex-col gap-2">
                  <h2 class="text-heading-3 text-neutral-base">Access Request Settings</h2>
                  <p class="text-body-md text-neutral-base">
                    Configure Resource Access settings for your organization.
                    <span class="inline-flex items-center gap-0.5 align-middle">
                      <LinkText label="Learn More" href="#" class="text-body-md" />
                      <ArrowTopRightOnSquareIcon class="size-4 shrink-0 text-info-base" aria-hidden="true" />
                    </span>
                  </p>
                </div>

                <Divider />

                <div class="flex items-start gap-md">
                  <ToggleSwitch v-model="accessRequestsOn" aria-label="Access requests enabled" />
                  <div class="flex min-w-0 flex-col gap-1">
                    <span class="text-body-md-semi-bold text-neutral-base">Access Requests On</span>
                    <p class="text-body-sm text-neutral-subtle">
                      Enabling this feature will allow end users to request access to resources from their user portal.
                    </p>
                  </div>
                </div>

                <Divider />

                <div class="flex flex-col gap-4">
                  <h3 class="text-heading-4 text-neutral-base">Notifications</h3>
                  <div class="flex flex-col gap-3">
                    <span class="text-body-md text-neutral-base">Receive Access Request Notifications via:</span>
                    <CheckboxWithLabel v-model="notifyViaEmail" :binary="true">
                      <template #label>Email</template>
                    </CheckboxWithLabel>
                  </div>
                  <div class="flex flex-col gap-3">
                    <span class="text-body-md text-neutral-base">
                      Send end user notification emails for the following events:
                    </span>
                    <CheckboxWithLabel v-model="notifyRequestReceived" :binary="true">
                      <template #label>Request Received Confirmation</template>
                    </CheckboxWithLabel>
                    <CheckboxWithLabel v-model="notifyApprovalDenial" :binary="true">
                      <template #label>Request Approval/Denial</template>
                    </CheckboxWithLabel>
                  </div>
                </div>

                <Divider />

                <div class="flex flex-col gap-3">
                  <h3 class="text-heading-4 text-neutral-base">Approver Progress Indicator</h3>
                  <CheckboxWithLabel v-model="exposeApprovalProgress" :binary="true">
                    <template #label>
                      <span class="inline-flex items-center gap-sm">
                        <span>Expose the Approval Progress to end users</span>
                        <InformationCircleIcon
                          v-tooltip.top="'When enabled, end users can see approval status in their portal.'"
                          class="size-4 shrink-0 text-neutral-subtle"
                          aria-hidden="true"
                        />
                      </span>
                    </template>
                  </CheckboxWithLabel>
                </div>

                <Divider />

                <div class="flex flex-col gap-4">
                  <h3 class="text-heading-4 text-neutral-base">Webhook Notifications</h3>
                  <p class="text-body-md text-neutral-base">
                    Receive Access Request event notifications using your already configured webhook channels.
                    <span class="inline-flex items-center gap-0.5 align-middle">
                      <LinkText label="Learn More" href="#" class="text-body-md" />
                      <ArrowTopRightOnSquareIcon class="size-4 shrink-0 text-info-base" aria-hidden="true" />
                    </span>
                  </p>
                  <Button
                    label="Select Channel"
                    severity="secondary"
                    variant="outlined"
                    class="w-fit shrink-0 self-start"
                    @click="openSelectChannelModal"
                  />

                  <div class="flex flex-col gap-sm">
                    <span class="text-body-md-semi-bold text-neutral-base">Webhook Channel</span>
                    <div
                      v-for="ch in settingsWebhookChannels"
                      :key="ch.id"
                      class="flex flex-col overflow-hidden rounded-lg border border-neutral-default_solid"
                    >
                      <div class="flex min-w-0 items-center gap-sm bg-neutral-surface px-md py-sm">
                        <button
                          type="button"
                          class="flex shrink-0 rounded p-1 text-neutral-subtle transition-colors hover:bg-neutral-surface_raised hover:text-neutral-base"
                          :aria-expanded="ch.expanded"
                          :aria-label="ch.expanded ? 'Collapse ' + ch.name : 'Expand ' + ch.name"
                          @click="ch.expanded = !ch.expanded"
                        >
                          <ChevronUpIcon v-if="ch.expanded" class="size-4" aria-hidden="true" />
                          <ChevronDownIcon v-else class="size-4" aria-hidden="true" />
                        </button>
                        <span class="min-w-0 flex-1 truncate text-body-md text-neutral-base">{{ ch.name }}</span>
                        <Tag
                          :value="webhookChannelEventsTagLabel(ch.eventSelection)"
                          severity="secondary"
                          class="shrink-0"
                        />
                        <Button
                          severity="secondary"
                          variant="text"
                          size="small"
                          :aria-label="'Remove ' + ch.name"
                          @click="openRemoveWebhookChannelDialog(ch.id)"
                        >
                          <template #icon>
                            <TrashIcon class="size-4" />
                          </template>
                        </Button>
                      </div>
                      <div
                        v-if="ch.expanded"
                        class="flex flex-col gap-md border-t border-neutral-default_solid px-md py-md"
                      >
                        <div class="flex items-start gap-sm">
                          <Checkbox
                            :binary="true"
                            :inputId="'webhook-select-all-' + ch.id"
                            :modelValue="isWebhookChannelSelectAllChecked(ch)"
                            :indeterminate="isWebhookChannelSelectAllIndeterminate(ch)"
                            @update:modelValue="setAllWebhookChannelEvents(ch, $event)"
                          />
                          <label
                            class="cursor-pointer text-body-md text-neutral-base pt-0.5"
                            :for="'webhook-select-all-' + ch.id"
                          >
                            Select All
                          </label>
                        </div>
                        <div class="flex flex-col gap-md border-l border-neutral-default_solid pl-md ml-sm">
                          <CheckboxWithLabel
                            v-for="ev in webhookAccessEvents"
                            :key="ev.id"
                            v-model="ch.eventSelection[ev.id]"
                            :binary="true"
                            :inputId="'webhook-ev-' + ch.id + '-' + ev.id"
                          >
                            <template #label>
                              <span class="text-body-md-semi-bold text-neutral-base">{{ ev.key }}</span>
                            </template>
                            <template #description>
                              <span class="text-body-sm text-neutral-subtle">{{ ev.description }}</span>
                            </template>
                          </CheckboxWithLabel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex shrink-0 items-center justify-end gap-sm border-t border-neutral-default_solid bg-neutral-base px-6 py-3"
          >
            <Button label="Cancel" severity="secondary" variant="outlined" @click="navigateToList" />
            <Button label="Save" severity="secondary" disabled />
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="showSelectChannelModal"
        :draggable="false"
        modal
        header="Select Channel"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <span class="text-body-md text-neutral-base">
            Select Webhook Channels ({{ selectChannelSelectedCount }})
          </span>
          <FormField label="Search channels">
            <template #default="{ inputId }">
              <IconField>
                <InputIcon>
                  <MagnifyingGlassIcon />
                </InputIcon>
                <InputText
                  :id="inputId"
                  v-model="selectChannelSearch"
                  placeholder="Search channels..."
                  class="w-full"
                />
              </IconField>
            </template>
          </FormField>
          <div
            class="flex min-h-60 flex-col rounded-md border border-neutral-default_solid bg-neutral-base"
          />
        </div>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeSelectChannelModal"
            />
            <Button
              label="Add"
              :disabled="selectChannelSelectedCount === 0"
              @click="handleSelectChannelAdd"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showRemoveWebhookChannelDialog"
        :draggable="false"
        modal
        header="Remove Webhook Channel"
        :style="{ width: '480px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <p class="text-body-md text-neutral-subtle">
          Removing this webhook channel from Access Requests will end notifications for all selected events.
        </p>
        <template #footer>
          <div class="flex items-center flex-1 min-w-0" />
          <div class="flex gap-sm shrink-0">
            <Button
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="closeRemoveWebhookChannelDialog"
            />
            <Button label="Remove" severity="danger" variant="outlined" @click="confirmRemoveWebhookChannel" />
          </div>
        </template>
      </Dialog>
    </div>
  `,
});

const meta: Meta<typeof AccessRequestSettingsPage> = {
  title: 'Projects/Access Requests/Pages/Access Request Settings',
  component: AccessRequestSettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccessRequestSettingsPage>;

export const Default: Story = {};
