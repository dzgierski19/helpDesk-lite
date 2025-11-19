import type { Meta, StoryObj } from '@storybook/angular';
import { PriorityBadgeComponent } from './priority-badge.component';
import { TicketPriority } from '../../models/enums';

const meta: Meta<PriorityBadgeComponent> = {
  component: PriorityBadgeComponent,
  title: 'Components/PriorityBadge',
  tags: ['autodocs'],
  argTypes: {
    priority: {
      control: { type: 'select' },
      options: [
        TicketPriority.Low,
        TicketPriority.Medium,
        TicketPriority.High,
      ],
    },
  },
};

export default meta;
type Story = StoryObj<PriorityBadgeComponent>;

export const Low: Story = {
  args: {
    priority: TicketPriority.Low,
  },
};

export const Medium: Story = {
  args: {
    priority: TicketPriority.Medium,
  },
};

export const High: Story = {
  args: {
    priority: TicketPriority.High,
  },
};
