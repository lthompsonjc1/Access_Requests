import type { Meta, StoryObj } from '@storybook/vue3';
import AddDeviceAdminFlowPage from './AddDeviceAdminFlowPage';

const meta: Meta<typeof AddDeviceAdminFlowPage> = {
  title: 'Projects/Access Requests/Pages/Add Device Admin Flow',
  component: AddDeviceAdminFlowPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AddDeviceAdminFlowPage>;

export const Default: Story = {};
