<script setup lang="ts">
import { computed } from 'vue';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { ComputerDesktopIcon } from '@heroicons/vue/24/outline';

import type { Device } from '@/types/device';

const props = defineProps<{ device: Device }>();

const isMac = computed(() => props.device.os.toLowerCase().includes('mac'));
</script>

<template>
  <div class="border border-neutral-default_solid rounded-lg overflow-hidden">
    <div class="p-md bg-neutral-surface">
      <div class="flex items-center gap-sm">
        <ComputerDesktopIcon class="w-5 h-5 text-neutral-subtle shrink-0" />
        <span class="text-body-md font-medium text-neutral-base">{{ device.hostname }}</span>
      </div>
      <div class="flex gap-xs mt-xs flex-wrap">
        <Tag :value="device.os" severity="info" />
        <Tag :value="device.mdm ? 'MDM' : 'No MDM'" :severity="device.mdm ? 'success' : 'warn'" />
        <Tag :value="device.compliant ? 'Compliant' : 'Non-Compliant'" :severity="device.compliant ? 'success' : 'danger'" />
      </div>
    </div>

    <div class="p-md border-t border-neutral-default_solid">
      <div class="grid grid-cols-2 gap-md text-body-md">
        <div>
          <span class="text-neutral-subtle">User</span>
          <p class="text-neutral-base font-medium">{{ device.user }}</p>
        </div>
        <div>
          <span class="text-neutral-subtle">Last Contact</span>
          <p class="text-neutral-base font-medium">{{ device.lastContact }}</p>
        </div>
        <div>
          <span class="text-neutral-subtle">Agent</span>
          <p class="text-neutral-base font-medium">{{ device.agent }}</p>
        </div>
        <div>
          <span class="text-neutral-subtle">Serial</span>
          <p class="text-neutral-base font-medium">{{ device.serial }}</p>
        </div>
      </div>

      <div class="flex gap-sm mt-md pt-md border-t border-neutral-default_solid flex-wrap">
        <Button label="View Details" size="small" />
        <Button label="Lock" size="small" severity="secondary" variant="outlined" />
        <Button label="Restart Agent" size="small" severity="secondary" variant="outlined" />
        <Button v-if="isMac" label="Wipe Device" size="small" severity="danger" variant="outlined" />
      </div>
    </div>
  </div>
</template>
