import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PriorityBadgeComponent } from '../components/priority-badge/priority-badge.component';
import { StatusLabelComponent } from '../components/status-label/status-label.component';
import { TicketCardComponent } from '../components/ticket-card/ticket-card.component';

@NgModule({
  declarations: [PriorityBadgeComponent, StatusLabelComponent, TicketCardComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule],
  exports: [PriorityBadgeComponent, StatusLabelComponent, TicketCardComponent],
})
export class SharedModule {}
