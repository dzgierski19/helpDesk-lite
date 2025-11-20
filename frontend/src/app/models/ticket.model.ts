import { TicketPriority, TicketStatus } from './enums';

export interface TicketStatusChange {
  id: number;
  ticket_id: number;
  old_status: TicketStatus;
  new_status: TicketStatus;
  changed_at: string;
}

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
  status_changes?: TicketStatusChange[];
}
