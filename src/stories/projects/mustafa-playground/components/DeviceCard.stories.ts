import type { Meta, StoryObj } from '@storybook/vue3';
import DeviceCard from './DeviceCard.vue';

const meta: Meta<typeof DeviceCard> = {
  title: "Projects/Mustafa's Playground/Device Card Experiment V4/Device Card",
  component: DeviceCard,
  parameters: { layout: 'padded' },
  decorators: [() => ({ template: '<div style="max-width:800px"><story /></div>' })],
};

export default meta;
type Story = StoryObj<typeof DeviceCard>;

export const MacBookHealthy: Story = {
  args: {
    device: {
      hostname: 'sarah-macbook-pro.local',
      os: 'macOS 15.4',
      serial: 'C02G7KZAMD6R',
      lastContact: '2 minutes ago',
      agent: '2.57.0',
      mdm: true,
      compliant: true,
      user: 'sarah.chen@jumpcloud.com',
    },
  },
};

export const LinuxNonCompliant: Story = {
  args: {
    device: {
      hostname: 'dev-ubuntu-01',
      os: 'Ubuntu 24.04',
      serial: 'SN-LNX-DEV-001',
      lastContact: '3 hours ago',
      agent: '2.56.1',
      mdm: false,
      compliant: false,
      user: 'ops-team@jumpcloud.com',
    },
  },
};

export const WindowsMDM: Story = {
  args: {
    device: {
      hostname: 'DESKTOP-FINANCE01',
      os: 'Windows 11 Pro',
      serial: 'PF3N9KHT-WIN',
      lastContact: '15 minutes ago',
      agent: '2.57.0',
      mdm: true,
      compliant: false,
      user: 'Finance Team PC',
    },
  },
};

export const StaleOffboarded: Story = {
  args: {
    device: {
      hostname: 'old-macbook-air.local',
      os: 'macOS 13.6',
      serial: 'C02X1234ABCD',
      lastContact: '14 days ago',
      agent: '2.50.0',
      mdm: false,
      compliant: false,
      user: 'former-employee@jumpcloud.com',
    },
  },
};
