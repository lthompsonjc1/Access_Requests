<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue';
import {
  setAccessRequestsDemoNavigateHandler,
  type AccessRequestsDemoView,
} from '../shared/navigation';
import AccessRequestsListPage from './AccessRequestsListPage';
import AccessRequestSettingsPage from './AccessRequestSettingsPage';
import AddResourceRequestFlowPage from './AddResourceRequestFlowPage';
import AddDeviceAdminFlowPage from './AddDeviceAdminFlowPage';

const activeView = ref<AccessRequestsDemoView>('list');

const viewComponents: Record<AccessRequestsDemoView, Component> = {
  list: AccessRequestsListPage,
  settings: AccessRequestSettingsPage,
  'add-resource-flow': AddResourceRequestFlowPage,
  'add-device-admin-flow': AddDeviceAdminFlowPage,
};

onMounted(() => {
  setAccessRequestsDemoNavigateHandler((view) => {
    activeView.value = view;
  });
});

onBeforeUnmount(() => {
  setAccessRequestsDemoNavigateHandler(null);
});
</script>

<template>
  <component :is="viewComponents[activeView]" />
</template>
