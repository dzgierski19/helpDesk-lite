import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TicketListComponent } from '../components/ticket-list/ticket-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TicketListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
  ],
  exports: [TicketListComponent],
})
export class TicketsModule {}
