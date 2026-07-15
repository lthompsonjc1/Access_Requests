import type { Meta, StoryObj } from '@storybook/vue3';
import AddResourceRequestFlowPage from './AddResourceRequestFlowPage';

const meta: Meta<typeof AddResourceRequestFlowPage> = {
  title: 'Projects/Access Requests/Pages/Add Resource Request Flow',
  component: AddResourceRequestFlowPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AddResourceRequestFlowPage>;

export const Default: Story = {};
