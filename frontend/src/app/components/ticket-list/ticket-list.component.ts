import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  createForm: FormGroup;
  showCreateForm = false;
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
    private readonly route: ActivatedRoute,
  ) {
    this.filterForm = this.fb.group({
      status: [null],
      priority: [null],
      tag: [''],
    });

    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      priority: [TicketPriority.Medium, Validators.required],
      status: [TicketStatus.New, Validators.required],
      assignee_id: [null],
      tags: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.showCreateForm = params.get('create') === '1';
      });

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

  toggleCreateForm(): void {
    this.setCreateFormVisibility(!this.showCreateForm);
  }

  submitCreateForm(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const { title, description, priority, status, assignee_id, tags } = this.createForm.value;
    const payload: Partial<Ticket> = {
      title,
      description,
      priority,
      status,
      assignee_id,
      tags: this.parseTags(tags),
    };

    this.uiService.showLoader();
    this.ticketService
      .createTicket(payload)
      .pipe(finalize(() => this.uiService.hideLoader()))
      .subscribe({
        next: () => {
          this.uiService.showSnackbar('Ticket created successfully.');
          this.createForm.reset({
            title: '',
            description: '',
            priority: TicketPriority.Medium,
            status: TicketStatus.New,
            assignee_id: null,
            tags: '',
          });
          this.setCreateFormVisibility(false);
          this.applyFilters();
        },
        error: () => {
          this.uiService.showSnackbar('Unable to create ticket.');
        },
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

  private parseTags(tagsValue: string | string[]): string[] {
    if (Array.isArray(tagsValue)) {
      return tagsValue;
    }

    return (tagsValue ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  private setCreateFormVisibility(shouldOpen: boolean): void {
    this.showCreateForm = shouldOpen;
    this.updateCreateFormQueryParam(shouldOpen);
  }

  private updateCreateFormQueryParam(shouldOpen: boolean): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { create: shouldOpen ? '1' : null },
      queryParamsHandling: 'merge',
    });
  }
}
