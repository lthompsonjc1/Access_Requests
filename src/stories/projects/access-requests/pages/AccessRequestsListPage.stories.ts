import type { Meta, StoryObj } from '@storybook/vue3';
import AccessRequestsListPage from './AccessRequestsListPage';

const meta: Meta<typeof AccessRequestsListPage> = {
  title: 'Projects/Access Requests/Pages/Access Requests List',
  component: AccessRequestsListPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AccessRequestsListPage>;

export const Default: Story = {};

export const DelegatedApprovalsTab: Story = {
  args: {
    initialRequestQueueSubTab: 'delegated',
  },
};

export const ApprovalFlowsTab: Story = {
  args: {
    initialMainTab: 'approval-flows',
  },
};

export const ActiveSessionsTimedAccess: Story = {
  args: {
    initialMainTab: 'active-sessions',
    initialActiveSessionsSubTab: 'timed-access',
  },
};
