import type { Meta, StoryObj } from '@storybook/vue3';
import MustafaPlayground from './MustafaPlayground.vue';

const meta: Meta<typeof MustafaPlayground> = {
  title: "Projects/Mustafa's Playground/Device Card Experiment V4/Full Page",
  component: MustafaPlayground,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MustafaPlayground>;

export const Default: Story = {};
