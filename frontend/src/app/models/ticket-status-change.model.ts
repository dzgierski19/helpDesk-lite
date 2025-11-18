import { TicketStatus } from './enums';

export interface TicketStatusChange {
  id: number;
  ticket_id: number;
  old_status: TicketStatus;
  new_status: TicketStatus;
  changed_at: string;
}
