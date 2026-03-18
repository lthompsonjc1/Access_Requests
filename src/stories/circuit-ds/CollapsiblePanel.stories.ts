import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { CollapsiblePanel } from '@jumpcloud/circuit/components';
import Button from 'primevue/button';
import {
  FolderIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  ArrowLongRightIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/vue/24/outline';

const meta: Meta<typeof CollapsiblePanel> = {
  title: 'Circuit DS/Components/CollapsiblePanel',
  component: CollapsiblePanel,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CollapsiblePanel>;

// ── Reusable slot placeholder (matches the Figma "Slot" placeholder) ──────────
const SLOT_PLACEHOLDER_DEFAULT = `
  <div class="flex items-center justify-center h-36 rounded-md bg-neutral-surface">
    <div class="flex items-center gap-sm text-neutral-ghost">
      <ArrowsRightLeftIcon class="size-4" />
      <span style="font-family:monospace" class="text-body-md">Slot</span>
    </div>
  </div>
`;

const SLOT_PLACEHOLDER_DASHED = `
  <div class="flex items-center justify-center h-36 rounded-md border border-dashed border-neutral-default_solid">
    <div class="flex items-center gap-sm text-neutral-ghost">
      <ArrowsRightLeftIcon class="size-4" />
      <span style="font-family:monospace" class="text-body-md">Slot</span>
    </div>
  </div>
`;

// ── Figma Showcase — all three variants from the design ───────────────────────
/**
 * All three panel variants shown together, exactly matching the Figma design:
 * 1. **Default** – always-visible content, action buttons in header
 * 2. **Expandable Collapsed** – chevron-right, content hidden
 * 3. **Expandable Expanded** – chevron-down, content revealed with dashed slot
 */
export const FigmaShowcase: Story = {
  render: () => ({
    components: { CollapsiblePanel, Button, EllipsisHorizontalIcon, ArrowsRightLeftIcon, ChevronRightIcon },
    setup() {
      const collapsed = ref(true);
      const expanded  = ref(false);
      return { collapsed, expanded };
    },
    template: `
      <div class="flex flex-col gap-md p-lg bg-neutral-surface min-h-screen">

        <!-- ── 1. Default (non-toggleable) ────────────────────────────────── -->
        <CollapsiblePanel header="Panel Header">
          <template #actions>
            <Button label="Button Label" size="small" severity="secondary" variant="outlined" />
            <Button size="small" severity="secondary" variant="outlined" aria-label="More options">
              <template #icon><EllipsisHorizontalIcon class="size-4" /></template>
            </Button>
          </template>

          ${SLOT_PLACEHOLDER_DEFAULT}
        </CollapsiblePanel>

        <!-- ── 2. Expandable — collapsed state (chevron-right) ─────────────── -->
        <CollapsiblePanel
          header="Panel Header"
          toggleable
          v-model:collapsed="collapsed"
        >
          <template #toggleicon="iconProps">
            <ChevronRightIcon :class="iconProps.class" />
          </template>
          <template #actions>
            <Button label="Button Label" size="small" severity="secondary" variant="outlined" />
            <Button size="small" severity="secondary" variant="outlined" aria-label="More options">
              <template #icon><EllipsisHorizontalIcon class="size-4" /></template>
            </Button>
          </template>

          ${SLOT_PLACEHOLDER_DASHED}
        </CollapsiblePanel>

        <!-- ── 3. Expandable — expanded state (chevron rotates down) ────────── -->
        <CollapsiblePanel
          header="Panel Header"
          toggleable
          v-model:collapsed="expanded"
        >
          <template #toggleicon="iconProps">
            <ChevronRightIcon :class="iconProps.class" />
          </template>
          <template #actions>
            <Button label="Button Label" size="small" severity="secondary" variant="outlined" />
            <Button size="small" severity="secondary" variant="outlined" aria-label="More options">
              <template #icon><EllipsisHorizontalIcon class="size-4" /></template>
            </Button>
          </template>

          ${SLOT_PLACEHOLDER_DASHED}
        </CollapsiblePanel>

      </div>
    `,
  }),
};

// ── Individual variant stories ────────────────────────────────────────────────

/** Default panel — content always visible, no toggle. */
export const Default: Story = {
  render: (args) => ({
    components: { CollapsiblePanel, Button, EllipsisHorizontalIcon, ArrowsRightLeftIcon },
    setup() { return { args }; },
    template: `
      <div class="p-lg bg-neutral-surface">
        <CollapsiblePanel header="Panel Header" v-bind="args">
          <template #actions>
            <Button label="Button Label" size="small" severity="secondary" variant="outlined" />
            <Button size="small" severity="secondary" variant="outlined" aria-label="More options">
              <template #icon><EllipsisHorizontalIcon class="size-4" /></template>
            </Button>
          </template>
          <div class="flex items-center justify-center h-36 rounded-md bg-neutral-surface">
            <div class="flex items-center gap-sm text-neutral-ghost">
              <ArrowsRightLeftIcon class="size-4" />
              <span style="font-family:monospace" class="text-body-md">Slot</span>
            </div>
          </div>
        </CollapsiblePanel>
      </div>
    `,
  }),
  args: {},
};

/** Expandable panel starting in the **collapsed** state (chevron points right). */
export const ExpandableCollapsed: Story = {
  render: (args) => ({
    components: { CollapsiblePanel, Button, EllipsisHorizontalIcon, ArrowsRightLeftIcon, ChevronRightIcon },
    setup() {
      const collapsed = ref(true);
      return { args, collapsed };
    },
    template: `
      <div class="p-lg bg-neutral-surface">
        <CollapsiblePanel
          header="Panel Header"
          toggleable
          v-model:collapsed="collapsed"
          v-bind="args"
        >
          <template #toggleicon="iconProps">
            <ChevronRightIcon :class="iconProps.class" />
          </template>
          <template #actions>
            <Button label="Button Label" size="small" severity="secondary" variant="outlined" />
            <Button size="small" severity="secondary" variant="outlined" aria-label="More options">
              <template #icon><EllipsisHorizontalIcon class="size-4" /></template>
            </Button>
          </template>
          <div class="flex items-center justify-center h-36 rounded-md border border-dashed border-neutral-default_solid">
            <div class="flex items-center gap-sm text-neutral-ghost">
              <ArrowsRightLeftIcon class="size-4" />
              <span style="font-family:monospace" class="text-body-md">Slot</span>
            </div>
          </div>
        </CollapsiblePanel>
      </div>
    `,
  }),
  args: {},
};

/** Expandable panel starting in the **expanded** state (chevron points down). */
export const ExpandableExpanded: Story = {
  render: (args) => ({
    components: { CollapsiblePanel, Button, EllipsisHorizontalIcon, ArrowsRightLeftIcon, ChevronRightIcon },
    setup() {
      const collapsed = ref(false);
      return { args, collapsed };
    },
    template: `
      <div class="p-lg bg-neutral-surface">
        <CollapsiblePanel
          header="Panel Header"
          toggleable
          v-model:collapsed="collapsed"
          v-bind="args"
        >
          <template #toggleicon="iconProps">
            <ChevronRightIcon :class="iconProps.class" />
          </template>
          <template #actions>
            <Button label="Button Label" size="small" severity="secondary" variant="outlined" />
            <Button size="small" severity="secondary" variant="outlined" aria-label="More options">
              <template #icon><EllipsisHorizontalIcon class="size-4" /></template>
            </Button>
          </template>
          <div class="flex items-center justify-center h-36 rounded-md border border-dashed border-neutral-default_solid">
            <div class="flex items-center gap-sm text-neutral-ghost">
              <ArrowsRightLeftIcon class="size-4" />
              <span style="font-family:monospace" class="text-body-md">Slot</span>
            </div>
          </div>
        </CollapsiblePanel>
      </div>
    `,
  }),
  args: {},
};

/** Panel with a title icon and real content. */
export const WithTitleIcon: Story = {
  render: (args) => ({
    components: { CollapsiblePanel, FolderIcon },
    setup() { return { args }; },
    template: `
      <CollapsiblePanel header="Documents" v-bind="args">
        <template #titleicon="iconProps">
          <FolderIcon :class="iconProps.class" />
        </template>
        <p class="text-body-md text-neutral-base">
          Panel with a folder icon in the title area.
        </p>
      </CollapsiblePanel>
    `,
  }),
  args: {},
};

/** Entire panel is clickable — hover styles apply to the whole card. */
export const Clickable: Story = {
  render: (args) => ({
    components: { CollapsiblePanel, ArrowLongRightIcon },
    setup() {
      const onPanelClick = () => console.log('Panel clicked');
      return { args, onPanelClick };
    },
    template: `
      <CollapsiblePanel
        clickable
        header="Clickable Panel"
        @click="onPanelClick"
        v-bind="args"
      >
        <template #actions>
          <ArrowLongRightIcon class="size-5 text-neutral-subtle" />
        </template>
        <p class="text-body-md text-neutral-base">
          The entire panel is clickable — hover to see the state change.
        </p>
      </CollapsiblePanel>
    `,
  }),
  args: {},
};

/** Header text that wraps to multiple lines. */
export const LongHeader: Story = {
  render: (args) => ({
    components: { CollapsiblePanel },
    setup() { return { args }; },
    template: `
      <CollapsiblePanel
        header="This is a very long panel header that will overflow onto the next line when the container width is constrained"
        v-bind="args"
      >
        <p class="text-body-md text-neutral-base">
          Panel content with a long header that wraps to multiple lines.
        </p>
      </CollapsiblePanel>
    `,
  }),
  args: {},
};
