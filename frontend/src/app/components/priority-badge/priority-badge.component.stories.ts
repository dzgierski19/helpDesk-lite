import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { PriorityBadgeComponent } from './priority-badge.component';
import { TicketPriority } from '../../models/enums';

const meta: Meta<PriorityBadgeComponent> = {
  component: PriorityBadgeComponent,
  title: 'Components/PriorityBadge',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [PriorityBadgeComponent],
      imports: [CommonModule],
    }),
  ],
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
  parameters: {
    layout: 'centered',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="sb-aurora-panel">
        <app-priority-badge [priority]="priority"></app-priority-badge>
      </div>
    `,
  }),
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
