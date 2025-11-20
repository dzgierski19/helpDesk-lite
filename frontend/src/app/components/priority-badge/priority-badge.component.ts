import { Component, Input } from '@angular/core';
import { TicketPriority } from '../../models/enums';

@Component({
  selector: 'app-priority-badge',
  templateUrl: './priority-badge.component.html',
  styleUrls: ['./priority-badge.component.scss'],
})
export class PriorityBadgeComponent {
  @Input() priority: TicketPriority | null = null;

  get priorityClass(): string {
    return this.priority ? `priority-${this.priority}` : 'priority-low';
  }

  get priorityLabel(): string {
    if (!this.priority) {
      return '';
    }

    return this.priority.charAt(0).toUpperCase() + this.priority.slice(1);
  }
}
