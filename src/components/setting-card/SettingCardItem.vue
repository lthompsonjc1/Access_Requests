<script setup lang="ts">
import { computed } from 'vue';
import { ToggleSwitch } from '@jumpcloud/circuit/components';
import { CogIcon } from '@heroicons/vue/24/outline';

interface Props {
  hasBottomBorder?: boolean;
  hasIcon?: boolean;
  hasDescription?: boolean;
  hasActionSlot?: boolean;
  hasToggle?: boolean;
  hasTag?: boolean;
  title: string;
  toggleValue?: boolean;
}

interface Emits {
  (e: 'update:toggleValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  hasBottomBorder: true,
  hasIcon: false,
  hasDescription: true,
  hasActionSlot: false,
  hasToggle: true,
  hasTag: false,
  toggleValue: false,
});

const emit = defineEmits<Emits>();

const toggleModel = computed({
  get: () => props.toggleValue,
  set: (value) => emit('update:toggleValue', value),
});
</script>

<template>
  <div class="relative p-4">
    <div class="flex items-start gap-3">
      <div class="flex items-start gap-md flex-wrap flex-1">
        <div class="min-w-72 flex flex-1 gap-3 py-1.5">
          <slot v-if="hasIcon" name="icon">
            <CogIcon class="size-5 shrink-0 text-neutral-base" />
          </slot>

          <div class="flex flex-col gap-1.5 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-body-md-bold text-neutral-base">{{ title }}</span>

              <div v-if="hasTag">
                <slot name="tag" />
              </div>
            </div>

            <div
              v-if="hasDescription"
              class="flex flex-col gap-1"
            >
              <slot name="description">
                <span class="text-body-sm text-neutral-muted">
                  This is the description.
                </span>
              </slot>
            </div>
          </div>
        </div>

        <div v-if="hasActionSlot" class="shrink-0 flex min-h-8 items-center justify-end">
          <slot name="action" />
        </div>
      </div>

      <div v-if="hasToggle" class="shrink-0 flex items-start py-1.5">
        <ToggleSwitch v-model="toggleModel" />
      </div>
    </div>

    <div
      v-if="hasBottomBorder"
      class="absolute bottom-0 left-4 right-4 h-px border-t border-neutral-default_solid"
    />
  </div>
</template>
