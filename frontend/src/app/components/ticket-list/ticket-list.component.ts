import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, EMPTY, Subject, of } from 'rxjs';
import { finalize, catchError, takeUntil, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { AuthUser } from '../../models/auth-user.model';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { TicketStatsService } from '../../services/ticket-stats.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit, OnDestroy {
  tickets$: Observable<Ticket[]> = of([]);
  displayedColumns: string[] = [];
  userRole: UserRole = UserRole.Reporter;
  filterForm: FormGroup;
  readonly statusOptions = Object.values(TicketStatus);
  readonly priorityOptions = Object.values(TicketPriority);
  readonly isLoading$ = this.uiService.loading$;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly uiService: UiService,
    private readonly router: Router,
    private readonly ticketStatsService: TicketStatsService,
  ) {
    this.filterForm = this.fb.group({
      status: [null],
      priority: [null],
      tag: [''],
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((user): user is AuthUser => !!user),
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
        takeUntil(this.destroy$),
      )
      .subscribe((user) => {
        this.userRole = user.role;
        this.updateDisplayedColumns();
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    const hasStatus = !!status;
    const hasPriority = !!priority;
    const trimmedTag = (tag ?? '').trim();
    const hasTag = trimmedTag.length > 0;

    if (hasStatus) {
      filters.status = status;
    }

    if (hasPriority) {
      filters.priority = priority;
    }

    if (hasTag) {
      filters.tag = trimmedTag;
    }

    const hasActiveFilters = hasStatus || hasPriority || hasTag;

    this.uiService.showLoader();
    this.tickets$ = this.ticketService.getTickets(filters).pipe(
      tap((tickets) => {
        if (!hasActiveFilters) {
          this.ticketStatsService.updateTickets(tickets);
        }
      }),
      catchError(() => {
        this.uiService.showSnackbar('Unable to load tickets.');
        return EMPTY;
      }),
      finalize(() => this.uiService.hideLoader()),
    );
  }

  private updateDisplayedColumns(): void {
    if (this.userRole === UserRole.Admin || this.userRole === UserRole.Agent) {
      this.displayedColumns = ['id', 'title', 'status', 'priority', 'assignee_id', 'created_at', 'actions'];
      return;
    }

    this.displayedColumns = ['id', 'title', 'status', 'priority', 'created_at'];
  }
}
