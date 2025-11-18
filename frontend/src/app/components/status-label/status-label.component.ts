import { Component, Input } from '@angular/core';
import { TicketStatus } from '../../models/enums';

@Component({
  selector: 'app-status-label',
  templateUrl: './status-label.component.html',
  styleUrls: ['./status-label.component.scss'],
})
export class StatusLabelComponent {
  @Input() status: TicketStatus | null = null;

  get statusClass(): string {
    return this.status ? `status-${this.status}` : 'status-new';
  }
}
