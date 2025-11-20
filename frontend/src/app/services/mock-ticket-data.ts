import { Ticket } from '../models/ticket.model';
import { TicketPriority, TicketStatus } from '../models/enums';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 1,
    title: 'API gateway timeout',
    description: 'Customers are reporting intermittent timeouts when calling the public API.',
    priority: TicketPriority.High,
    status: TicketStatus.InProgress,
    assignee_id: 2,
    creator_id: 5,
    tags: ['api', 'gateway'],
    created_at: '2024-05-10T08:00:00.000Z',
    updated_at: '2024-05-10T09:00:00.000Z',
    status_changes: [
      {
        id: 1,
        ticket_id: 1,
        old_status: TicketStatus.New,
        new_status: TicketStatus.InProgress,
        changed_at: '2024-05-10T09:00:00.000Z',
      },
    ],
  },
  {
    id: 2,
    title: 'Unable to upload attachments',
    description: 'Attachment upload fails with 500 error for large files.',
    priority: TicketPriority.Medium,
    status: TicketStatus.New,
    assignee_id: null,
    creator_id: 3,
    tags: ['attachments'],
    created_at: '2024-05-11T12:30:00.000Z',
    updated_at: '2024-05-11T12:30:00.000Z',
    status_changes: [],
  },
  {
    id: 3,
    title: 'Dashboard slow on mobile',
    description: 'Sales dashboard takes more than 30 seconds to load on mobile browsers.',
    priority: TicketPriority.Low,
    status: TicketStatus.Resolved,
    assignee_id: 4,
    creator_id: 6,
    tags: ['dashboard', 'mobile'],
    created_at: '2024-05-09T10:15:00.000Z',
    updated_at: '2024-05-09T11:00:00.000Z',
    status_changes: [
      {
        id: 2,
        ticket_id: 3,
        old_status: TicketStatus.InProgress,
        new_status: TicketStatus.Resolved,
        changed_at: '2024-05-09T11:00:00.000Z',
      },
    ],
  },
];

export const MOCK_TRIAGE_SUGGESTION = {
  suggested_status: TicketStatus.InProgress,
  suggested_priority: TicketPriority.High,
  suggested_tags: ['triage', 'auto'],
};

export const MOCK_EXTERNAL_USER = {
  name: 'Mock External User',
};
