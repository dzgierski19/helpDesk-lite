import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TicketCardComponent } from './ticket-card.component';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { StatusLabelComponent } from '../status-label/status-label.component';

const meta: Meta<TicketCardComponent> = {
  component: TicketCardComponent,
  title: 'Components/TicketCard',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [TicketCardComponent, PriorityBadgeComponent, StatusLabelComponent],
      imports: [CommonModule, MatCardModule, MatButtonModule],
    }),
  ],
  argTypes: {
    ticket: {
      control: 'object',
      description:
        'Ticket data containing title, description, priority, status, assignee, creator and creation date information.',
    },
    userRole: {
      control: { type: 'radio' },
      options: [UserRole.Reporter, UserRole.Agent, UserRole.Admin],
    },
    viewDetails: {
      action: 'viewDetails',
    },
  },
};

export default meta;
type Story = StoryObj<TicketCardComponent>;

const baseTicket: Ticket = {
  id: 1042,
  title: 'Login form throws 500 error',
  description: 'Users are unable to log in using the new authentication flow. Error 500 returned from /auth endpoint.',
  priority: TicketPriority.Medium,
  status: TicketStatus.New,
  assignee_id: null,
  creator_id: 27,
  tags: ['auth', 'bug'],
  created_at: '2024-05-10T11:30:00.000Z',
  updated_at: '2024-05-10T11:30:00.000Z',
};

export const ReporterView: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 1042,
      assignee_id: null,
    },
    userRole: UserRole.Reporter,
  },
};

export const AgentViewAssigned: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 2044,
      title: 'Customer cannot upload attachments',
      status: TicketStatus.InProgress,
      assignee_id: 18,
    },
    userRole: UserRole.Agent,
  },
};

export const LongDescription: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 4099,
      title: 'Reporting dashboard slow when filtering by date',
      description:
        'When selecting a large date range the reporting dashboard takes more than 30 seconds to respond causing timeouts. '.repeat(
          5,
        ),
      priority: TicketPriority.Low,
      status: TicketStatus.New,
    },
    userRole: UserRole.Reporter,
  },
};

export const AdminHighPriority: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 3055,
      title: 'Production outage in EU region',
      description:
        'Multiple customers report downtime in the EU region. API requests consistently fail with 502 errors.',
      priority: TicketPriority.High,
      status: TicketStatus.InProgress,
      assignee_id: 3,
    },
    userRole: UserRole.Admin,
  },
};
