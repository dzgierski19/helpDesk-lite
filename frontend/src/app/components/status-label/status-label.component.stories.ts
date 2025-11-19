import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { StatusLabelComponent } from './status-label.component';
import { TicketStatus } from '../../models/enums';

const meta: Meta<StatusLabelComponent> = {
  component: StatusLabelComponent,
  title: 'Components/StatusLabel',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [StatusLabelComponent],
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: [
        TicketStatus.New,
        TicketStatus.InProgress,
        TicketStatus.Resolved,
      ],
    },
  },
};

export default meta;
type Story = StoryObj<StatusLabelComponent>;

export const New: Story = {
  args: {
    status: TicketStatus.New,
  },
};

export const InProgress: Story = {
  args: {
    status: TicketStatus.InProgress,
  },
};

export const Resolved: Story = {
  args: {
    status: TicketStatus.Resolved,
  },
};
