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

  get statusLabel(): string {
    if (!this.status) {
      return '';
    }

    return this.status
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
