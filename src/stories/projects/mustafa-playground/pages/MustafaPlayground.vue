<script setup lang="ts">
import { computed } from 'vue';
import { PageHeader } from '@jumpcloud/circuit/components';
import Tag from 'primevue/tag';
import TopBar from '@/components/TopBar.vue';
import DemoNav from '@/components/DemoNav.vue';
import DeviceCard from '../components/DeviceCard.vue';
import { useDemoSettings } from '@/composables/useDemoSettings';
import { useDevices } from '@/composables/useDevices';

const { isLive, reload } = useDemoSettings();
const { devices, loading, error } = useDevices();

const sourceLabel = computed(() => isLive.value ? 'Live API' : 'Mock Data');
const sourceSeverity = computed(() => isLive.value ? 'success' : 'info');
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <DemoNav
      active-item="devices"
      user-name="Mustafa Akin"
      user-email="mustafa@jumpcloud.com"
      user-initials="MA"
      @settings-saved="reload"
    />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <TopBar />
      <PageHeader title="Devices" subtitle="Manage your fleet">
        <template #actions>
          <Tag :value="sourceLabel" :severity="sourceSeverity" />
        </template>
      </PageHeader>

      <div class="flex-1 overflow-y-auto p-lg">
        <div v-if="loading" class="text-body-md text-neutral-subtle">Loading devices...</div>
        <div v-else-if="error" class="text-body-md text-danger-base">{{ error }}</div>
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-md">
          <DeviceCard v-for="d in devices" :key="d.serial" :device="d" />
        </div>
      </div>
    </div>
  </div>
</template>
