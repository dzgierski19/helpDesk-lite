import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import { UserRole } from '../../models/enums';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss'],
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Input() userRole: UserRole = UserRole.Reporter;

  @Output() viewDetails = new EventEmitter<number>();

  private readonly descriptionLimit = 100;

  get truncatedDescription(): string {
    if (!this.ticket?.description) {
      return '';
    }

    const trimmed = this.ticket.description.trim();
    return trimmed.length > this.descriptionLimit ? `${trimmed.slice(0, this.descriptionLimit)}...` : trimmed;
  }

  get showAssignee(): boolean {
    return this.userRole === UserRole.Admin || this.userRole === UserRole.Agent;
  }

  onViewDetails(): void {
    if (!this.ticket) {
      return;
    }

    this.viewDetails.emit(this.ticket.id);
  }
}
