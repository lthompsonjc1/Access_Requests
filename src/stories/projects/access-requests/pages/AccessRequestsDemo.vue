<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue';
import {
  setAccessRequestsDemoNavigateHandler,
  type AccessRequestsDemoView,
} from '../shared/navigation';
import AccessRequestsListPage from './AccessRequestsListPage';
import AccessRequestSettingsPage from './AccessRequestSettingsPage';
import AddResourceRequestFlowPage from './AddResourceRequestFlowPage';

const activeView = ref<AccessRequestsDemoView>('list');

const viewComponents: Record<AccessRequestsDemoView, Component> = {
  list: AccessRequestsListPage,
  settings: AccessRequestSettingsPage,
  'add-resource-flow': AddResourceRequestFlowPage,
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
