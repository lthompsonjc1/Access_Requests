<script setup lang="ts">
import { computed, markRaw, reactive, ref } from 'vue';
import { AppNavigation, PageHeader } from '@jumpcloud/circuit/components';
import { SparklesIcon } from '@heroicons/vue/24/outline';
import TopBar from '@/components/TopBar.vue';
import Agent0ServersView from '../features/agent0/servers/Agent0ServersView.vue';
import Agent0ActivityView from '../features/agent0/activity/Agent0ActivityView.vue';
import ServerDialogPhase01 from '../features/agent0/servers/ServerDialogPhase01.vue';
import {
  useActivityFilters,
  useServerFilters,
} from '../features/agent0/shared/composables';
import { prefixFromServerSlug } from '../features/agent0/shared/prefixFromName';
import type { Phase01ServerFormState, Server, ServerFormState } from '../features/agent0/shared/types';
import {
  menuItems,
  profileMenuItems,
  serversData,
  userGroupsData,
  profileUserGroups,
  authStyleOptions,
  phase01AuthStyleOptions,
  phase01MainTabs,
  activityLogData,
} from '../features/agent0/shared/data';
import {
  getServerColumns,
  activityLogColumns,
} from '../features/agent0/shared/columns';

const sparklesIcon = markRaw(SparklesIcon);
const activeTab = ref('servers');

/** Stub for Agent0ServersView legacy detail dialog (unused in Phase 01) */
const serversViewFormStub = reactive<ServerFormState>({
  targetId: '',
  name: '',
  url: '',
  authStyle: 'OAuth',
  authConfig: '',
});

const selectedServer = ref<Server | null>(null);
const selectedServers = ref<Server[]>([]);
const showServerDialog = ref(false);

const phase01ServerForm = reactive<Phase01ServerFormState>({
  prefix: '',
  name: '',
  url: '',
  authStyle: 'OAuth',
  apiDocumentationUrl: '',
});

const showPhase01Dialog = ref(false);
const phase01DialogMode = ref<'add' | 'edit'>('add');
const editingServerForDialog = ref<Server | null>(null);

const activityFilters = useActivityFilters(activityLogData);
const { filteredActivityData, handleActivitySearch } = activityFilters;

const serverFilters = useServerFilters(serversData);

const serverColumns = computed(() => getServerColumns([], userGroupsData, profileUserGroups));

function handleTabChange(tab: string) {
  activeTab.value = tab;
}

/** Map table connection type to Phase 01 auth control (SSE and unknown → OAuth) */
function normalizePhase01AuthStyle(connectionType: string): string {
  if (connectionType === 'API Token') return 'API Token';
  if (connectionType === 'OAuth') return 'OAuth';
  return 'OAuth';
}

function openAddServer() {
  phase01DialogMode.value = 'add';
  editingServerForDialog.value = null;
  phase01ServerForm.prefix = '';
  phase01ServerForm.name = '';
  phase01ServerForm.url = '';
  phase01ServerForm.authStyle = 'OAuth';
  phase01ServerForm.apiDocumentationUrl = '';
  showPhase01Dialog.value = true;
}

function openEditServer(server: Server) {
  phase01DialogMode.value = 'edit';
  editingServerForDialog.value = server;
  phase01ServerForm.name = server.name;
  phase01ServerForm.url = server.url;
  phase01ServerForm.authStyle = normalizePhase01AuthStyle(server.connectionType);
  phase01ServerForm.prefix = prefixFromServerSlug(server.slug);
  phase01ServerForm.apiDocumentationUrl = '';
  showPhase01Dialog.value = true;
}

function handleServerRowClick(event: { data: Server }) {
  openEditServer(event.data);
}

function closePhase01Dialog() {
  showPhase01Dialog.value = false;
  editingServerForDialog.value = null;
}

const phase01EditHeaderTitle = computed(() =>
  editingServerForDialog.value?.name ?? 'Edit server',
);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <AppNavigation
      :menuItems="menuItems"
      :profileMenuItems="profileMenuItems"
      activeItem="settings"
      :collapsible="true"
      :topNavToggle="true"
    />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <TopBar />

      <PageHeader
        title="AI Connector"
        :icon="sparklesIcon"
        :tabs="phase01MainTabs"
        :activeTab="activeTab"
        @update:activeTab="handleTabChange"
      />

      <Agent0ServersView
          v-if="activeTab === 'servers'"
          :filteredServersData="serverFilters.filteredData.value"
          :serverColumns="serverColumns"
          :selectedServers="selectedServers"
          :selectedServer="selectedServer"
          :showServerDialog="showServerDialog"
          :authStyleOptions="authStyleOptions"
          :serverForm="serversViewFormStub"
          :showFilterDialog="serverFilters.showFilterDialog.value"
          :draftConnectionTypes="serverFilters.draftConnectionTypes.value"
          :draftStatus="serverFilters.draftStatus.value"
          :connectionTypeOptions="serverFilters.connectionTypeOptions"
          :statusOptions="serverFilters.statusOptions"
          :activeFilterChips="serverFilters.activeFilterChips.value"
          :activeFilterCount="serverFilters.activeFilterCount.value"
          @update:selectedServers="selectedServers = $event"
          @update:showServerDialog="showServerDialog = $event"
          @row-click="handleServerRowClick"
          @add-server="openAddServer"
          @close-detail="showServerDialog = false"
          @save-detail="showServerDialog = false"
          @search="serverFilters.handleSearch"
          @openFilterDialog="serverFilters.openFilterDialog"
          @applyFilters="serverFilters.applyFilters"
          @cancelFilterDialog="serverFilters.cancelFilterDialog"
          @clearDraftFilters="serverFilters.clearDraftFilters"
          @clearAllFilters="serverFilters.clearAllFilters"
          @removeFilterChip="serverFilters.removeFilterChip"
          @update:draftConnectionTypes="serverFilters.draftConnectionTypes.value = $event"
          @update:draftStatus="serverFilters.draftStatus.value = $event"
        />

      <Agent0ActivityView
        v-if="activeTab === 'activity'"
        :activityLogColumns="activityLogColumns"
        :filteredActivityData="filteredActivityData"
        :showFilterDialog="activityFilters.showFilterDialog.value"
        :draftUsers="activityFilters.draftUsers.value"
        :draftEventTypes="activityFilters.draftEventTypes.value"
        :draftServers="activityFilters.draftServers.value"
        :draftStatus="activityFilters.draftStatus.value"
        :userOptions="activityFilters.userOptions"
        :eventTypeOptions="activityFilters.eventTypeOptions"
        :serverOptions="activityFilters.serverOptions"
        :statusOptions="activityFilters.statusOptions"
        :activeFilterChips="activityFilters.activeFilterChips.value"
        :activeFilterCount="activityFilters.activeFilterCount.value"
        @search="handleActivitySearch"
        @openFilterDialog="activityFilters.openFilterDialog"
        @applyFilters="activityFilters.applyFilters"
        @cancelFilterDialog="activityFilters.cancelFilterDialog"
        @clearDraftFilters="activityFilters.clearDraftFilters"
        @clearAllFilters="activityFilters.clearAllFilters"
        @removeFilterChip="activityFilters.removeFilterChip"
        @update:draftUsers="activityFilters.draftUsers.value = $event"
        @update:draftEventTypes="activityFilters.draftEventTypes.value = $event"
        @update:draftServers="activityFilters.draftServers.value = $event"
        @update:draftStatus="activityFilters.draftStatus.value = $event"
      />

      <ServerDialogPhase01
        v-model:visible="showPhase01Dialog"
        :mode="phase01DialogMode"
        :edit-header-title="phase01EditHeaderTitle"
        :editing-server-slug="editingServerForDialog?.slug"
        :editing-server-name="editingServerForDialog?.name"
        :server-form="phase01ServerForm"
        :auth-style-options="phase01AuthStyleOptions"
        @cancel="closePhase01Dialog"
        @create="closePhase01Dialog"
        @save="closePhase01Dialog"
      />
    </div>
  </div>
</template>
