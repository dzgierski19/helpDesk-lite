import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
  tickets$!: Observable<Ticket[]>;
  displayedColumns: string[] = [];
  userRole: UserRole = UserRole.Reporter;
  filterForm: FormGroup;
  readonly statusOptions = Object.values(TicketStatus);
  readonly priorityOptions = Object.values(TicketPriority);
  readonly isLoading$ = this.uiService.loading$;

  constructor(
    private readonly fb: FormBuilder,
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly uiService: UiService,
    private readonly router: Router,
  ) {
    this.filterForm = this.fb.group({
      status: [null],
      priority: [null],
      tag: [''],
    });
  }

  ngOnInit(): void {
    const role = this.authService.getSnapshotUserRole();
    this.userRole = role ?? UserRole.Reporter;

    if (role === UserRole.Admin || role === UserRole.Agent) {
      this.displayedColumns = ['id', 'title', 'status', 'priority', 'assignee_id', 'created_at', 'actions'];
    } else {
      this.displayedColumns = ['id', 'title', 'status', 'priority', 'created_at'];
    }

    this.applyFilters();
  }

  viewTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }

  applyFilters(): void {
    const { status, priority, tag } = this.filterForm.value as {
      status: TicketStatus | null;
      priority: TicketPriority | null;
      tag: string | null;
    };

    const filters: {
      status?: TicketStatus;
      priority?: TicketPriority;
      tag?: string;
    } = {};

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    const trimmedTag = (tag ?? '').trim();
    if (trimmedTag) {
      filters.tag = trimmedTag;
    }

    this.uiService.showLoader();
    this.tickets$ = this.ticketService.getTickets(filters).pipe(
      catchError(() => {
        this.uiService.showSnackbar('Unable to load tickets.');
        return EMPTY;
      }),
      finalize(() => this.uiService.hideLoader()),
    );
  }
}
