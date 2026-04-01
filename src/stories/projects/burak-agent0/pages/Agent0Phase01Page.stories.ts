import type { Meta, StoryObj } from '@storybook/vue3';
import Agent0Phase01Page from './Agent0Phase01Page.vue';

const meta: Meta<typeof Agent0Phase01Page> = {
  title: 'Projects/Burak - AI Connector/Full Demo',
  component: Agent0Phase01Page,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Agent0Phase01Page>;

export const Phase01: Story = {
  name: 'Phase 01',
};
