import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PriorityBadgeComponent } from '../components/priority-badge/priority-badge.component';
import { StatusLabelComponent } from '../components/status-label/status-label.component';
import { TicketCardComponent } from '../components/ticket-card/ticket-card.component';
import { LoaderComponent } from '../components/loader/loader.component';

@NgModule({
  declarations: [PriorityBadgeComponent, StatusLabelComponent, TicketCardComponent, LoaderComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  exports: [PriorityBadgeComponent, StatusLabelComponent, TicketCardComponent, LoaderComponent],
})
export class SharedModule {}
