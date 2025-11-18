import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { UserRole } from '../../models/enums';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
  tickets$!: Observable<Ticket[]>;
  displayedColumns: string[] = [];

  constructor(
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const role = this.authService.getSnapshotUserRole();

    if (role === UserRole.Admin || role === UserRole.Agent) {
      this.displayedColumns = ['id', 'title', 'status', 'priority', 'assignee_id', 'created_at', 'actions'];
    } else {
      this.displayedColumns = ['id', 'title', 'status', 'priority', 'created_at'];
    }

    this.tickets$ = this.ticketService.getTickets();
  }

  viewTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }
}
