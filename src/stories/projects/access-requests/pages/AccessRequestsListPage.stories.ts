import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, computed, markRaw, defineComponent } from 'vue';
import {
  AppNavigation,
  PageHeader,
  DataTable,
  DataTableToolbar,
  DataTableCellLink,
  DataTableCellText,
  DataTableCellButton,
  FilterModal,
  LinkText,
} from '@jumpcloud/circuit/components';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { ArrowTopRightOnSquareIcon, ClipboardDocumentCheckIcon, Cog6ToothIcon, EllipsisHorizontalIcon, EllipsisVerticalIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

import DetailsKeyValue from '@/components/DetailsKeyValue.vue';
import TopBar from '@/components/TopBar.vue';
import { menuItems, profileMenuItems } from '../shared/navigation';

// ─── Types ───

interface AccessRequest {
  id: number;
  received: string;
  type: string;
  name: string;
  requester: string;
  department: string;
  approvalType: string;
  status: 'Error' | 'Missing Data' | 'Pending' | 'Approved' | 'Denied' | 'Expired';
  /** Expanded view fields */
  approvalTitle: string;
  manager: string;
  duration: string;
  reasonForRequest: string;
  approver: string;
  approvalProgressStatus: string;
  /** Missing Data expanded view */
  approvalFlowDescription?: string;
  approvalSteps?: Array<{
    type: 'actionRequired' | 'pending' | 'approved';
    approver: string;
    status: string;
    actionLink?: { label: string; href: string };
  }>;
}

// ─── Mock Data (matches image) ───

const accessRequestsData: AccessRequest[] = [
  { id: 1, received: 'January 27, 2026 at 9:11 AM', type: 'Resource', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: '3', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 2, received: 'January 19, 2026 at 10:11 AM', type: 'Resource', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Design project', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 3, received: 'January 12, 2026 at 10:31 AM', type: 'Resource', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'UX research', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 4, received: 'December 18, 2025 at 6:38 AM', type: 'Resource', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Prototyping', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 5, received: 'December 18, 2025 at 6:36 AM', type: 'Resource', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Error', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Collaboration', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 6, received: 'December 15, 2025 at 2:14 PM', type: 'Resource', name: 'Onboarding Resources for new employees', requester: 'Julian Upton', department: 'Product', approvalType: 'Manual', status: 'Missing Data', approvalTitle: 'Onboarding Resources for new employees', manager: 'Not Provided', duration: '30 Days', reasonForRequest: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval', approvalFlowDescription: 'Approval Flow description goes here. Truncate longer descriptions. Let\'s try a max width 800px. Include show more link', approvalSteps: [{ type: 'actionRequired', approver: 'Manager Missing', status: 'Action Required', actionLink: { label: 'Add in users', href: '#' } }, { type: 'pending', approver: 'Johnny Cage', status: 'Pending Required Approval' }] },
  { id: 7, received: 'December 10, 2025 at 11:22 AM', type: 'Resource', name: 'Figma for UX', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Approved', approvalTitle: 'Time Limited Access to Figma', manager: 'Sarah Chen', duration: '5 Days', reasonForRequest: 'Design sprint', approver: 'Lorie Thompson', approvalProgressStatus: 'Approved' },
  { id: 8, received: 'December 5, 2025 at 9:00 AM', type: 'Resource', name: 'Jira', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Pending', approvalTitle: 'Jira Project Access', manager: 'Sarah Chen', duration: '90 Days', reasonForRequest: 'Project management', approver: 'Lorie Thompson', approvalProgressStatus: 'Pending Required Approval' },
  { id: 9, received: 'November 28, 2025 at 3:45 PM', type: 'Resource', name: 'Confluence', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Denied', approvalTitle: 'Confluence Space Access', manager: 'Sarah Chen', duration: '30 Days', reasonForRequest: 'Documentation', approver: 'Lorie Thompson', approvalProgressStatus: 'Denied' },
  { id: 10, received: 'November 15, 2025 at 10:00 AM', type: 'Resource', name: 'GitHub', requester: 'Urvashi Requester', department: 'Product', approvalType: 'Manual', status: 'Expired', approvalTitle: 'GitHub Repository Access', manager: 'Sarah Chen', duration: '60 Days', reasonForRequest: 'Code review', approver: 'Lorie Thompson', approvalProgressStatus: 'Expired' },
];

// ─── Status Cell ───

const statusTokenMapping: Record<string, { label: string; severity: string }> = {
  Error: { label: 'ERROR', severity: 'danger' },
  'Missing Data': { label: 'MISSING DATA', severity: 'danger' },
  Pending: { label: 'PENDING', severity: 'warn' },
  Approved: { label: 'APPROVED', severity: 'success' },
  Denied: { label: 'DENIED', severity: 'secondary' },
  Expired: { label: 'EXPIRED', severity: 'secondary' },
};

// ─── Status Cell (DataTableCellToken hardcodes green for Status type; use Tag with mapping) ───

const StatusCell = defineComponent({
  name: 'StatusCell',
  components: { Tag },
  props: {
    statusLabel: { type: String, required: true },
    tokenMapping: { type: Object as () => Record<string, { label: string; severity: string }>, required: true },
  },
  setup(props) {
    const config = computed(
      () => props.tokenMapping[props.statusLabel] ?? { label: props.statusLabel, severity: 'secondary' },
    );
    return { config };
  },
  template: `
    <div class="flex items-center p-2 min-h-12">
      <Tag :value="config.label" :severity="config.severity" class="shrink-0" />
    </div>
  `,
});

// ─── Column Definitions (order matches image) ───

const columns = [
  {
    field: 'received',
    header: 'Received',
    sortable: true,
    width: '200px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.received as string,
    }),
  },
  {
    field: 'type',
    header: 'Type',
    sortable: true,
    width: '120px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.type as string,
    }),
  },
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    width: '180px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.name as string,
    }),
  },
  {
    field: 'requester',
    header: 'Requester',
    sortable: true,
    width: '180px',
    component: markRaw(DataTableCellLink),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.requester as string,
      href: '#',
    }),
  },
  {
    field: 'department',
    header: 'Department',
    sortable: true,
    width: '130px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.department as string,
    }),
  },
  {
    field: 'approvalType',
    header: 'Approval Type',
    sortable: true,
    width: '140px',
    component: markRaw(DataTableCellText),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      label: sp.data.approvalType as string,
    }),
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    width: '120px',
    component: markRaw(StatusCell),
    componentProps: (sp: { data: Record<string, unknown> }) => ({
      statusLabel: sp.data.status as string,
      tokenMapping: statusTokenMapping,
    }),
  },
  {
    field: 'actions',
    header: '',
    width: '60px',
    component: markRaw(DataTableCellButton),
    componentProps: () => ({
      type: 'Button Group',
      iconButtons: [{ icon: markRaw(EllipsisVerticalIcon) }],
      maxVisibleIconButtons: 1,
      size: 'default',
    }),
  },
];

// ─── Filter Config ───

const basicFilters = [
  {
    id: 'requester',
    label: 'Requester',
    type: 'text' as const,
    placeholder: 'Search requester...',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'singleSelect' as const,
    options: [
      { label: 'Error', value: 'Error' },
      { label: 'Missing Data', value: 'Missing Data' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Denied', value: 'Denied' },
      { label: 'Expired', value: 'Expired' },
    ],
  },
];

// ─── Main tabs and sub-tabs ───

const mainTabs = [
  { label: 'Request Queue (5)', value: 'request-queue' },
  { label: 'Approval Flows (25)', value: 'approval-flows' },
];

const subTabOptions = [
  { label: 'Administrator', value: 'administrator' },
  { label: 'Others', value: 'others' },
];

// ─── Export options ───

const exportOptions = [
  { id: 'csv', label: 'Export as CSV' },
  { id: 'xlsx', label: 'Export as Excel' },
];

// ─── Initial active filters (matches image) ───

const initialFilters = [
  { key: 'Status', operator: 'is', value: 'Error', id: 'filter-1' },
  { key: 'Status', operator: 'is', value: 'Pending', id: 'filter-2' },
];

// ─── Component ───

const AccessRequestsListPage = defineComponent({
  name: 'AccessRequestsListPage',
  components: {
    AppNavigation,
    PageHeader,
    CircuitDataTable: DataTable,
    DataTableToolbar,
    FilterModal,
    TopBar,
    SelectButton,
    Button,
    DetailsKeyValue,
    LinkText,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    Cog6ToothIcon,
    EllipsisHorizontalIcon,
    ExclamationTriangleIcon,
  },
  setup() {
    const requests = ref<AccessRequest[]>([...accessRequestsData]);
    const showFilterModal = ref(false);
    const appliedFilters = ref(initialFilters);
    const activeMainTab = ref('request-queue');
    const activeSubTab = ref('administrator');

    const currentPageData = computed(() => requests.value);
    const totalRecords = computed(() => requests.value.length);

    function handleSearch(_query: string) {
      // Placeholder for search
    }

    function handleFilter() {
      showFilterModal.value = true;
    }

    function handleRefresh() {
      // Placeholder for actual refresh logic
    }

    function handleExportSelect(option: { id: string }) {
      if (option.id === 'csv') {
        // Placeholder for CSV export
      } else if (option.id === 'xlsx') {
        // Placeholder for Excel export
      }
    }

    function handleFilterApply(filters: { key: string; operator: string; value: string }[]) {
      appliedFilters.value = filters;
      showFilterModal.value = false;
    }

    function handleFilterClearAll() {
      appliedFilters.value = [];
      showFilterModal.value = false;
    }

    function handleFilterRemove(filter: { id?: string | number; key: string }) {
      appliedFilters.value = appliedFilters.value.filter(
        (f) => (filter.id ? f.id !== filter.id : f.key !== filter.key),
      );
    }

    function handleRowClick() {
      // Placeholder for row click navigation to detail
    }

    return {
      menuItems,
      profileMenuItems,
      columns,
      currentPageData,
      totalRecords,
      showFilterModal,
      basicFilters,
      appliedFilters,
      mainTabs,
      subTabOptions,
      activeMainTab,
      activeSubTab,
      exportOptions,
      handleSearch,
      handleFilter,
      handleFilterApply,
      handleFilterClearAll,
      handleFilterRemove,
      handleRefresh,
      handleExportSelect,
      handleRowClick,
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
        <TopBar />
        <PageHeader
          title="Access Requests"
          :tabs="mainTabs"
          :activeTab="activeMainTab"
          @update:activeTab="activeMainTab = $event"
        >
          <template #icon>
            <ClipboardDocumentCheckIcon class="size-7" />
          </template>
          <template #actions>
            <Button label="Settings" severity="secondary" variant="outlined">
              <template #icon>
                <Cog6ToothIcon class="size-5" />
              </template>
            </Button>
          </template>
        </PageHeader>

        <div v-if="activeMainTab === 'request-queue'" class="flex flex-col h-full relative flex-1 min-h-0 px-6 pb-6">
          <!-- Sub-tabs: Administrator / Others (matches Device Detail pattern) -->
          <div class="flex items-center justify-between mb-4 pt-6">
            <SelectButton
              v-model="activeSubTab"
              :options="subTabOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <!-- DataTableToolbar (outside DataTable - Circuit DataTable does not support #toolbar slot) -->
          <div class="shrink-0 pb-4">
            <DataTableToolbar
              search-placeholder="Search access requests..."
              :show-add-button="false"
              :show-filter-button="true"
              :show-refresh-button="true"
              :show-columns-button="true"
              :show-download-button="true"
              :active-filters="appliedFilters"
              :export-options="exportOptions"
              @filter-remove="handleFilterRemove"
              @clear-all="handleFilterClearAll"
              @search="handleSearch"
              @filter="handleFilter"
              @refresh="handleRefresh"
              @export-select="handleExportSelect"
            />
          </div>

          <CircuitDataTable
            class="w-fit"
            :data="currentPageData"
            :columns="columns"
            :paginator="true"
            :rows="50"
            :total-records="totalRecords"
            :rows-per-page-options="[
              { label: '10 Items per page', value: 10 },
              { label: '20 Items per page', value: 20 },
              { label: '50 Items per page', value: 50 },
            ]"
            :show-rows-per-page-options="true"
            :show-page-report="true"
            :card="true"
            size="default"
            :expander="true"
            scrollable
            scroll-height="flex"
            data-key="id"
            @row-click="handleRowClick"
            :pt="{
              root: { style: 'flex: 1 1 0; min-height: 0; height: 100%;' },
              tableContainer: { style: 'flex: 1 1 0; min-height: 0; height: 100%;' },
            }"
            :ptOptions="{ mergeSections: true, mergeProps: true }"
          >
            <template #expansion="{ data }">
              <div class="flex flex-col gap-4 p-4 bg-neutral-surface">
                <!-- Missing Data: Approval Flow Description Box -->
                <div
                  v-if="data.status === 'Missing Data' && data.approvalFlowDescription"
                  class="flex items-start gap-3 rounded-lg border border-info-base/30 bg-feedback-info-surface p-4 max-w-[800px]"
                >
                  <div class="size-8 shrink-0 rounded flex items-center justify-center bg-info-base/20 border border-info-base/30">
                    <span class="text-body-sm font-bold text-info-base">{{ data.name?.charAt(0) || 'B' }}</span>
                  </div>
                  <div class="flex flex-col gap-1 min-w-0">
                    <span class="text-body-md text-neutral-base line-clamp-2">{{ data.approvalFlowDescription }}</span>
                    <LinkText label="Show More" href="#" class="text-body-md shrink-0" />
                  </div>
                </div>

                <!-- Header: App icon + Title (skip for Missing Data when we have approval flow box) -->
                <div v-if="data.status !== 'Missing Data' || !data.approvalFlowDescription" class="flex items-center gap-3">
                  <div class="size-8 shrink-0 rounded flex items-center justify-center bg-info-surface border border-info-base/20">
                    <span class="text-body-sm font-bold text-info-base">{{ data.name?.charAt(0) || '?' }}</span>
                  </div>
                  <span class="text-heading-4 text-neutral-base">{{ data.approvalTitle }}</span>
                </div>

                <!-- Request Details (2-column grid) -->
                <div class="grid grid-cols-2 gap-x-6 gap-y-3">
                  <DetailsKeyValue label="Requester">
                    <LinkText :label="data.requester" href="#" class="text-body-md" />
                  </DetailsKeyValue>
                  <DetailsKeyValue label="Manager">
                    <span
                      v-if="data.manager === 'Not Provided' || !data.manager"
                      class="text-body-md text-error-base"
                    >{{ data.manager || 'Not Provided' }}</span>
                    <LinkText v-else :label="data.manager" href="#" class="text-body-md" />
                  </DetailsKeyValue>
                  <DetailsKeyValue v-if="data.status !== 'Missing Data'" label="Duration" :value="data.duration" />
                  <DetailsKeyValue label="Reason for Request" :value="data.reasonForRequest" />
                </div>

                <!-- Approval Progress: Multi-step for Missing Data, single for others -->
                <div class="flex flex-col gap-3">
                  <span class="text-body-md-semi-bold text-neutral-base">Approval Progress</span>
                  <template v-if="data.status === 'Missing Data' && data.approvalSteps?.length">
                    <div
                      v-for="(step, idx) in data.approvalSteps"
                      :key="idx"
                      class="flex items-start gap-3"
                    >
                      <div
                        class="flex shrink-0 items-center justify-center rounded-full border-2 size-6"
                        :class="step.type === 'actionRequired'
                          ? 'border-error-base bg-error-base'
                          : step.type === 'approved'
                            ? 'border-success-base bg-success-base'
                            : 'border-warning-base bg-transparent'"
                      >
                        <ExclamationTriangleIcon
                          v-if="step.type === 'actionRequired'"
                          class="size-4 text-neutral-ghost"
                          aria-hidden="true"
                        />
                        <EllipsisHorizontalIcon
                          v-else-if="step.type === 'pending'"
                          class="size-4 text-warning-base"
                          aria-hidden="true"
                        />
                        <CheckCircleIcon
                          v-else-if="step.type === 'approved'"
                          class="size-4 text-neutral-ghost"
                          aria-hidden="true"
                        />
                      </div>
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span
                          class="text-body-md"
                          :class="step.type === 'actionRequired' ? 'text-error-base' : 'text-neutral-base'"
                        >{{ step.approver }}</span>
                        <span v-if="step.actionLink" class="flex items-center gap-1">
                          <LinkText :label="step.actionLink.label" :href="step.actionLink.href" class="text-body-md" />
                          <ArrowTopRightOnSquareIcon class="size-4 text-info-base shrink-0" />
                        </span>
                        <span class="text-body-sm text-neutral-subtle">{{ step.status }}</span>
                      </div>
                    </div>
                  </template>
                  <div v-else class="flex items-start gap-3">
                    <div
                      class="flex shrink-0 items-center justify-center rounded-full border-2"
                      :class="data.approvalProgressStatus === 'Approved'
                        ? 'size-6 border-success-base bg-success-base'
                        : 'size-6 border-warning-base bg-transparent'"
                    >
                      <CheckCircleIcon
                        v-if="data.approvalProgressStatus === 'Approved'"
                        class="size-4 text-neutral-ghost"
                        aria-hidden="true"
                      />
                      <EllipsisHorizontalIcon
                        v-else
                        class="size-4 text-warning-base"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="text-body-md text-neutral-base">{{ data.approver }}</span>
                      <span class="text-body-sm text-neutral-subtle">{{ data.approvalProgressStatus }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons (for Pending and Missing Data) -->
                <div v-if="data.status === 'Pending' || data.status === 'Missing Data'" class="flex gap-sm pt-2">
                  <Button label="Deny Access" severity="danger" variant="outlined" />
                  <Button label="Grant Access" />
                </div>
              </div>
            </template>

            <template #empty>
              <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                <span class="text-body-md">No requests match your filters</span>
                <span class="text-body-sm mt-1">Try adjusting your search or filter criteria</span>
              </div>
            </template>

            <template #initialEmpty>
              <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
                <span class="text-body-md">No access requests yet</span>
                <span class="text-body-sm mt-1">Create your first request to get started</span>
              </div>
            </template>
          </CircuitDataTable>

          <FilterModal
            v-model:visible="showFilterModal"
            :basic-filters="basicFilters"
            :applied-filters="appliedFilters"
            @apply="handleFilterApply"
            @clear-all="handleFilterClearAll"
          />
        </div>

        <div v-if="activeMainTab === 'approval-flows'" class="flex-1 flex flex-col min-h-0 px-6 py-6">
          <div class="flex flex-col items-center justify-center py-16 text-neutral-subtle">
            <span class="text-body-md">Approval Flows</span>
            <span class="text-body-sm mt-1">Configure approval workflows for access requests</span>
          </div>
        </div>
      </div>
    </div>
  `,
});

// ─── Story ───

const meta: Meta<typeof AccessRequestsListPage> = {
  title: 'Projects/Access Requests/Pages/Access Requests List',
  component: AccessRequestsListPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccessRequestsListPage>;

export const Default: Story = {};
