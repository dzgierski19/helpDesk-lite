import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { TicketListComponent } from '../components/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from '../components/ticket-details/ticket-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TicketListComponent, TicketDetailsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    SharedModule,
  ],
  exports: [TicketListComponent, TicketDetailsComponent],
})
export class TicketsModule {}
