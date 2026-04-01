import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, markRaw, defineComponent } from 'vue';
import {
  AppNavigation,
  PageHeader,
  CollapsiblePanel,
  MessageNotification,
  SeverityDialog,
} from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

import {
  ClipboardDocumentCheckIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline';

import TopBar from '@/components/TopBar.vue';
import DetailPageLayout from '@/components/layout/page-layouts/DetailPageLayout.vue';
import DetailsKeyValue from '@/components/DetailsKeyValue.vue';
import { menuItems, profileMenuItems } from '../shared/navigation';

// ─── Mock Data ───

const accessRequest = {
  id: 1,
  requestor: 'Sarah Chen',
  requestorEmail: 'sarah.chen@acme.com',
  resource: 'Salesforce',
  resourceType: 'SSO Application',
  requestedAt: 'Mar 8, 2026 at 2:34 PM',
  status: 'Pending' as const,
  justification: 'I need access to Salesforce for pipeline management and client outreach as part of my new role on the Sales team.',
  approver: null as string | null,
  decidedAt: null as string | null,
  denialReason: null as string | null,
};

// ─── Component ───

const AccessRequestDetailPage = defineComponent({
  name: 'AccessRequestDetailPage',
  components: {
    AppNavigation,
    PageHeader,
    CollapsiblePanel,
    MessageNotification,
    SeverityDialog,
    TopBar,
    DetailPageLayout,
    DetailsKeyValue,
    PvButton: Button,
    PvTag: Tag,
    ClipboardDocumentCheckIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    UserIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
  },
  setup() {
    const request = ref({ ...accessRequest });
    const detailsCollapsed = ref(false);
    const showDenyDialog = ref(false);
    const isDenying = ref(false);

    function handleApprove() {
      request.value.status = 'Approved';
      request.value.approver = 'Admin User';
      request.value.decidedAt = 'Mar 9, 2026';
    }

    function handleDeny() {
      showDenyDialog.value = true;
    }

    /** Async deny: must use `actionHandler` so the dialog stays open until `close()` runs (see SeverityDialog). */
    function handleDenyConfirm(close: () => void) {
      isDenying.value = true;
      setTimeout(() => {
        request.value.status = 'Denied';
        request.value.approver = 'Admin User';
        request.value.decidedAt = 'Mar 9, 2026';
        request.value.denialReason = 'Access request denied by administrator.';
        isDenying.value = false;
        close();
      }, 500);
      return false;
    }

    return {
      request,
      detailsCollapsed,
      showDenyDialog,
      isDenying,
      handleApprove,
      handleDeny,
      handleDenyConfirm,
      menuItems,
      profileMenuItems,
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
      <div class="flex-1 flex flex-col min-w-0 overflow-auto">
        <TopBar showBackButton backButtonLabel="Access Requests" @back="() => {}" />
        <PageHeader
          :title="'Request: ' + request.resource + ' — ' + request.requestor"
          :subtitleText="'Access Request · ' + request.resourceType"
        >
          <template #icon>
            <ClipboardDocumentCheckIcon class="size-7" />
          </template>
          <template #actions>
            <template v-if="request.status === 'Pending'">
              <PvButton
                label="Deny"
                severity="danger"
                variant="outlined"
                @click="handleDeny"
              >
                <template #icon>
                  <XCircleIcon class="size-5" />
                </template>
              </PvButton>
              <PvButton
                label="Approve"
                @click="handleApprove"
              >
                <template #icon>
                  <CheckCircleIcon class="size-5" />
                </template>
              </PvButton>
            </template>
            <PvTag
              v-else
              :severity="request.status === 'Approved' ? 'success' : 'danger'"
              class="!normal-case"
            >
              <template #icon>
                <CheckCircleIcon v-if="request.status === 'Approved'" class="size-4" />
                <XCircleIcon v-else class="size-4" />
              </template>
              {{ request.status }}
            </PvTag>
          </template>
        </PageHeader>

        <DetailPageLayout class="w-full! flex-1! min-h-0!">
          <div class="flex flex-col gap-6">
            <MessageNotification
              v-if="request.status === 'Pending'"
              severity="info"
              title="Pending approval"
              detail="This access request is awaiting your decision. Review the details below and approve or deny."
            />

            <CollapsiblePanel
              v-model:collapsed="detailsCollapsed"
              toggleable
              header="Request Details"
            >
              <template #titleicon="iconProps">
                <DocumentTextIcon :class="iconProps.class" />
              </template>
              <template #toggleicon="iconProps">
                <ChevronRightIcon :class="iconProps.class" />
              </template>
              <div class="flex flex-col gap-4">
                <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                  <DetailsKeyValue label="Requestor" :value="request.requestor" />
                  <DetailsKeyValue label="Requestor Email" :value="request.requestorEmail" />
                  <DetailsKeyValue label="Resource" :value="request.resource" />
                  <DetailsKeyValue label="Resource Type" :value="request.resourceType" />
                  <DetailsKeyValue label="Requested At" :value="request.requestedAt" />
                  <DetailsKeyValue label="Status">
                    <PvTag
                      :severity="request.status === 'Approved' ? 'success' : request.status === 'Denied' ? 'danger' : 'warn'"
                      class="!normal-case"
                    >
                      <template #icon>
                        <CheckCircleIcon v-if="request.status === 'Approved'" class="size-4" />
                        <XCircleIcon v-else-if="request.status === 'Denied'" class="size-4" />
                        <ClockIcon v-else class="size-4" />
                      </template>
                      {{ request.status }}
                    </PvTag>
                  </DetailsKeyValue>
                  <DetailsKeyValue
                    v-if="request.approver"
                    label="Approver"
                    :value="request.approver"
                  />
                  <DetailsKeyValue
                    v-if="request.decidedAt"
                    label="Decided At"
                    :value="request.decidedAt"
                  />
                  <DetailsKeyValue
                    v-if="request.denialReason"
                    label="Denial Reason"
                    :value="request.denialReason"
                    class="col-span-2"
                  />
                </div>
                <div v-if="request.justification" class="pt-2">
                  <p class="text-body-md-semi-bold text-neutral-base mb-1">Justification</p>
                  <p class="text-body-md text-neutral-subtle">{{ request.justification }}</p>
                </div>
              </div>
            </CollapsiblePanel>
          </div>

          <template #sidebar>
            <div class="flex flex-col gap-4">
              <p class="text-body-md-semi-bold text-neutral-base">Quick info</p>
              <DetailsKeyValue label="Request ID" value="#AR-001" />
              <DetailsKeyValue label="Resource" :value="request.resource" />
              <DetailsKeyValue label="Requested" :value="request.requestedAt" />
            </div>
          </template>
        </DetailPageLayout>
      </div>

      <SeverityDialog
        v-model:visible="showDenyDialog"
        dialog-title="Deny Access Request"
        variant="sev2"
        message-title="Access will be denied"
        message-content="The requestor will be notified that their request was denied."
        :show-message-icon="true"
        dialog-content="Please confirm you want to **deny** this access request."
        action-text="Deny Request"
        cancel-text="Cancel"
        :is-loading="isDenying"
        :action-handler="handleDenyConfirm"
        @cancel="showDenyDialog = false"
      />
    </div>
  `,
});

// ─── Story ───

const meta: Meta<typeof AccessRequestDetailPage> = {
  title: 'Projects/Access Requests/Pages/Access Request Detail',
  component: AccessRequestDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccessRequestDetailPage>;

export const Default: Story = {};
