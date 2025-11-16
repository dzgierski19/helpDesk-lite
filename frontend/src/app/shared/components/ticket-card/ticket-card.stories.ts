import type { Meta, StoryObj } from '@storybook/angular';
import { TicketCardComponent } from './ticket-card.component';

const meta: Meta<TicketCardComponent> = {
  title: 'Shared/TicketCard',
  component: TicketCardComponent,
};

export default meta;

type Story = StoryObj<TicketCardComponent>;

export const Basic: Story = {
  args: {},
  // TODO: provide ticket data when component inputs are defined
};
