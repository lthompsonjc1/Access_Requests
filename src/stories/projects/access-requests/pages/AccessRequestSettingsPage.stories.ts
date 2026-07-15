import type { Meta, StoryObj } from '@storybook/vue3';
import AccessRequestSettingsPage from './AccessRequestSettingsPage';

const meta: Meta<typeof AccessRequestSettingsPage> = {
  title: 'Projects/Access Requests/Pages/Access Request Settings',
  component: AccessRequestSettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccessRequestSettingsPage>;

export const Default: Story = {};
