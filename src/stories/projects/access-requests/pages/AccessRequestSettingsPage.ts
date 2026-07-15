import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import {
  AppNavigation,
  PageHeader,
  CheckboxWithLabel,
  FormField,
  LinkText,
  RadioButtonWithLabel,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

import ConfigPageLayout from '@/components/layout/page-layouts/ConfigPageLayout.vue';
import PageSection from '@/components/PageSection.vue';
import SettingCardItem from '@/components/setting-card/SettingCardItem.vue';
import TopBar from '@/components/TopBar.vue';
import {
  getDefaultRequestQueueSubTab,
  loadDefaultRequestQueueSubTab,
  persistDefaultRequestQueueSubTab,
  type RequestQueueSubTab,
} from '../shared/accessRequestPreferences';
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

const requestQueueSubTabOptions: { label: string; value: RequestQueueSubTab }[] = [
  { label: 'Administrator', value: 'administrator' },
  { label: 'Others', value: 'delegated' },
];

const settingCardClass = 'w-full rounded-lg bg-neutral-surface shadow-e100';

/** Webhook channels available to add (excludes channels already configured on the page) */
const availableWebhookChannelOptions = [
  { id: 'avail-1', name: 'Security Alerts Webhook' },
  { id: 'avail-2', name: 'IT Ops Notifications' },
  { id: 'avail-3', name: 'Production Events' },
];

const AccessRequestSettingsPage = defineComponent({
  name: 'AccessRequestSettingsPage',
  components: {
    AppNavigation,
    PageHeader,
    TopBar,
    ConfigPageLayout,
    PageSection,
    SettingCardItem,
    Checkbox,
    CheckboxWithLabel,
    FormField,
    LinkText,
    RadioButtonWithLabel,
    Button,
    Dialog,
    IconField,
    InputIcon,
    InputText,
    Tag,
    ArrowTopRightOnSquareIcon,
    ClipboardDocumentCheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    XMarkIcon,
  },
  setup() {
    const accessRequestsOn = ref(false);
    const defaultRequestQueueSubTab = ref<RequestQueueSubTab>(getDefaultRequestQueueSubTab());
    const notifyViaEmail = ref(true);
    const notifyRequestReceived = ref(true);
    const notifyApprovalDenial = ref(true);
    const exposeApprovalProgress = ref(true);
    const settingsWebhookChannels = ref(createDefaultSettingsWebhookChannels());
    const showSelectChannelModal = ref(false);
    const selectChannelSearch = ref('');
    const selectChannelSelectedIds = ref<string[]>([]);
    const showRemoveWebhookChannelDialog = ref(false);
    const webhookChannelIdPendingRemoval = ref<string | null>(null);

    const selectableWebhookChannels = computed(() =>
      availableWebhookChannelOptions.filter(
        (option) => !settingsWebhookChannels.value.some((configured) => configured.name === option.name),
      ),
    );

    const filteredSelectableWebhookChannels = computed(() => {
      const query = selectChannelSearch.value.trim().toLowerCase();
      if (!query) return selectableWebhookChannels.value;
      return selectableWebhookChannels.value.filter((channel) =>
        channel.name.toLowerCase().includes(query),
      );
    });

    const selectChannelSelectedCount = computed(() => selectChannelSelectedIds.value.length);

    const selectChannelEmptyMessage = computed(() => {
      if (selectableWebhookChannels.value.length === 0) {
        return 'No webhook channels available to add.';
      }
      if (selectChannelSearch.value.trim()) {
        return 'No channels match your search.';
      }
      return '';
    });

    function isSelectChannelOptionSelected(id: string) {
      return selectChannelSelectedIds.value.includes(id);
    }

    function toggleSelectChannelOption(id: string, selected: boolean) {
      if (selected) {
        if (!selectChannelSelectedIds.value.includes(id)) {
          selectChannelSelectedIds.value = [...selectChannelSelectedIds.value, id];
        }
        return;
      }
      selectChannelSelectedIds.value = selectChannelSelectedIds.value.filter((value) => value !== id);
    }

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
      selectChannelSelectedIds.value = [];
      selectChannelSearch.value = '';
      showSelectChannelModal.value = true;
    }

    function closeSelectChannelModal() {
      showSelectChannelModal.value = false;
      selectChannelSearch.value = '';
      selectChannelSelectedIds.value = [];
    }

    function handleSelectChannelAdd() {
      showSelectChannelModal.value = false;
      selectChannelSearch.value = '';
      selectChannelSelectedIds.value = [];
    }

    function navigateToList() {
      navigateToStorybookStory(ACCESS_REQUESTS_LIST_STORY_PATH);
    }

    onMounted(() => {
      void loadDefaultRequestQueueSubTab().then((value) => {
        defaultRequestQueueSubTab.value = value;
      });
    });

    async function handleSave() {
      try {
        await persistDefaultRequestQueueSubTab(defaultRequestQueueSubTab.value);
      } catch (error) {
        console.warn('Failed to save default request queue sub tab', error);
      }
      navigateToList();
    }

    return {
      menuItems,
      profileMenuItems,
      settingCardClass,
      accessRequestsOn,
      defaultRequestQueueSubTab,
      requestQueueSubTabOptions,
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
      filteredSelectableWebhookChannels,
      selectChannelEmptyMessage,
      isSelectChannelOptionSelected,
      toggleSelectChannelOption,
      openSelectChannelModal,
      closeSelectChannelModal,
      handleSelectChannelAdd,
      navigateToList,
      handleSave,
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
          <PageHeader class="shrink-0" title="Access requests">
            <template #icon>
              <ClipboardDocumentCheckIcon class="size-7" />
            </template>
          </PageHeader>

          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-neutral-surface">
            <ConfigPageLayout class="w-full! h-full!" maxWidth="1024">
              <div class="flex flex-col gap-8 pb-xl">
                <section class="flex flex-col gap-4">
                  <PageSection title="Access request settings">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Configure resource access settings for your organization.
                        <LinkText
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          :showIcon="false"
                          customClass="text-body-sm-link inline-flex items-center gap-1"
                        >
                          Learn more
                          <ArrowTopRightOnSquareIcon class="size-4 shrink-0 text-current" aria-hidden="true" />
                        </LinkText>
                      </span>
                    </template>
                  </PageSection>

                  <div :class="settingCardClass">
                    <SettingCardItem
                      v-model:toggle-value="accessRequestsOn"
                      title="Access requests on"
                      :has-bottom-border="false"
                    >
                      <template #description>
                        <span class="text-body-sm text-neutral-muted">
                          Enabling this feature will allow end users to request access to resources from their user portal.
                        </span>
                      </template>
                    </SettingCardItem>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Request queue">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Choose the default tab you land on when opening the request queue.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="[settingCardClass, 'flex flex-col gap-md p-4']">
                    <FormField label="Default sub tab" required>
                      <template #default>
                        <div class="flex flex-col gap-sm">
                          <RadioButtonWithLabel
                            v-for="option in requestQueueSubTabOptions"
                            :key="option.value"
                            v-model="defaultRequestQueueSubTab"
                            :value="option.value"
                            name="default-request-queue-sub-tab"
                          >
                            <template #label>
                              <span class="text-body-md text-neutral-base">{{ option.label }}</span>
                            </template>
                          </RadioButtonWithLabel>
                        </div>
                      </template>
                    </FormField>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Approver progress indicator">
                    <template #actions><span /></template>
                  </PageSection>

                  <div :class="settingCardClass">
                    <SettingCardItem
                      v-model:toggle-value="exposeApprovalProgress"
                      title="Expose the approval progress to end users"
                      :has-bottom-border="false"
                    >
                      <template #description>
                        <span class="text-body-sm text-neutral-muted">
                          When enabled, end users can see approval status in their portal.
                        </span>
                      </template>
                    </SettingCardItem>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Notifications">
                    <template #actions><span /></template>
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Configure admin and end user email notifications for access request events.
                      </span>
                    </template>
                  </PageSection>

                  <div :class="settingCardClass">
                    <SettingCardItem
                      v-model:toggle-value="notifyViaEmail"
                      title="Email"
                      :has-bottom-border="notifyViaEmail"
                    >
                      <template #description>
                        <span class="text-body-sm text-neutral-muted">
                          Receive access request notifications via email.
                        </span>
                      </template>
                    </SettingCardItem>

                    <div
                      v-if="notifyViaEmail"
                      class="flex flex-col gap-4 px-4 pb-4 pt-2"
                    >
                      <h4 class="text-body-md-bold text-neutral-base">
                        Send end user notification emails for the following events:
                      </h4>
                      <div class="flex flex-col gap-3">
                        <CheckboxWithLabel v-model="notifyRequestReceived" :binary="true">
                          <template #label>
                            <span class="text-body-md text-neutral-base">Request received confirmation</span>
                          </template>
                        </CheckboxWithLabel>
                        <CheckboxWithLabel v-model="notifyApprovalDenial" :binary="true">
                          <template #label>
                            <span class="text-body-md text-neutral-base">Request approval/decline</span>
                          </template>
                        </CheckboxWithLabel>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="flex flex-col gap-4">
                  <PageSection title="Webhook notifications">
                    <template #subtitle>
                      <span class="text-body-sm text-neutral-muted">
                        Receive access request event notifications using your already configured webhook channels.
                        <LinkText
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          :showIcon="false"
                          customClass="text-body-sm-link inline-flex items-center gap-1"
                        >
                          Learn more
                          <ArrowTopRightOnSquareIcon class="size-4 shrink-0 text-current" aria-hidden="true" />
                        </LinkText>
                      </span>
                    </template>
                    <template #actions>
                      <Button
                        label="Select channel"
                        severity="secondary"
                        variant="outlined"
                        @click="openSelectChannelModal"
                      />
                    </template>
                  </PageSection>

                  <div class="flex flex-col gap-sm">
                    <span class="text-body-md-semi-bold text-neutral-base">Webhook channel</span>
                    <div
                      v-for="ch in settingsWebhookChannels"
                      :key="ch.id"
                      class="flex flex-col overflow-hidden rounded-lg border border-neutral-default_solid bg-neutral-base shadow-e100"
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
                            Select all
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
                </section>
              </div>
            </ConfigPageLayout>
          </div>

          <div
            class="flex shrink-0 items-center justify-end gap-sm border-t border-neutral-default_solid bg-neutral-base px-6 py-3"
          >
            <Button label="Cancel" severity="secondary" variant="outlined" @click="navigateToList" />
            <Button label="Save" @click="handleSave" />
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="showSelectChannelModal"
        :draggable="false"
        modal
        header="Select channel"
        :style="{ width: '560px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <div class="flex flex-col gap-md">
          <span class="text-body-md text-neutral-base">
            Select webhook channels ({{ selectChannelSelectedCount }})
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
            v-if="filteredSelectableWebhookChannels.length"
            class="flex max-h-60 flex-col gap-3 overflow-y-auto rounded-md border border-neutral-default_solid bg-neutral-base p-3"
          >
            <CheckboxWithLabel
              v-for="channel in filteredSelectableWebhookChannels"
              :key="channel.id"
              :modelValue="isSelectChannelOptionSelected(channel.id)"
              :binary="true"
              :inputId="'select-channel-' + channel.id"
              @update:modelValue="toggleSelectChannelOption(channel.id, $event)"
            >
              <template #label>
                <span class="text-body-md text-neutral-base">{{ channel.name }}</span>
              </template>
            </CheckboxWithLabel>
          </div>
          <p
            v-else-if="selectChannelEmptyMessage"
            class="text-body-sm text-neutral-subtle"
          >
            {{ selectChannelEmptyMessage }}
          </p>
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
        header="Remove webhook channel"
        :style="{ width: '480px' }"
      >
        <template #closeicon><XMarkIcon /></template>
        <p class="text-body-md text-neutral-subtle">
          Removing this webhook channel from Access requests will end notifications for all selected events.
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

export default AccessRequestSettingsPage;
export { AccessRequestSettingsPage };
