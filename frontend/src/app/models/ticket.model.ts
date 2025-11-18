import { TicketPriority, TicketStatus } from './enums';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee_id: number | null;
  creator_id: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}
