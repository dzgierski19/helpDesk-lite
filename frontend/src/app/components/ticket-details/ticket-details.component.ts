import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, finalize, map, takeUntil, tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { AuthUser } from '../../models/auth-user.model';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit, OnDestroy {
  ticket$: Observable<Ticket | undefined> = of(undefined);
  externalUserInfo$: Observable<{ name: string } | undefined> = of(undefined);
  currentUserRole$: Observable<UserRole | null> = of(null);
  triageSuggestion: {
    suggested_status: TicketStatus;
    suggested_priority: TicketPriority;
    suggested_tags: string[];
  } | null = null;
  ticketFound = true;

  readonly UserRole = UserRole;
  readonly TicketPriority = TicketPriority;
  readonly TicketStatus = TicketStatus;
  readonly progressActions: Array<{ status: TicketStatus; label: string; icon: string }> = [
    {
      status: TicketStatus.InProgress,
      label: 'Mark in progress',
      icon: 'play_circle',
    },
    {
      status: TicketStatus.Resolved,
      label: 'Resolve ticket',
      icon: 'task_alt',
    },
  ];

  private ticketId: number | null = null;
  private currentUserRole: UserRole | null = null;
  private readonly destroy$ = new Subject<void>();
  statusUpdateInFlight: TicketStatus | null = null;
  assignInFlight = false;
  currentUser: AuthUser | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly uiService: UiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.ticketId = idParam ? Number(idParam) : null;
    this.currentUserRole$ = this.authService.currentUser$.pipe(map((user) => user?.role ?? null));

    this.authService.currentUser$
      .pipe(
        filter((user): user is AuthUser => !!user),
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
        takeUntil(this.destroy$),
      )
      .subscribe((user) => {
        this.currentUserRole = user.role;
        this.currentUser = user;
        this.refreshTicket();
        this.externalUserInfo$ = this.ticketService.getExternalUserInfo();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTriageSuggestion(ticketId: number): void {
    if (!this.canManageTriage()) {
      return;
    }

    this.uiService.showLoader();
    this.ticketService
      .getTriageSuggestion(ticketId)
      .pipe(finalize(() => this.uiService.hideLoader()))
      .subscribe({
        next: (suggestion) => {
          this.triageSuggestion = suggestion;
          this.uiService.showSnackbar('Triage suggestion ready.');
        },
        error: () => {
          this.uiService.showSnackbar('Failed to load triage suggestion.');
        },
      });
  }

  acceptTriageSuggestion(ticketId: number): void {
    if (!this.triageSuggestion || !this.canManageTriage()) {
      return;
    }

    this.uiService.showLoader();
    this.ticketService
      .updateTicket(ticketId, {
        status: this.triageSuggestion.suggested_status,
        priority: this.triageSuggestion.suggested_priority,
        tags: this.triageSuggestion.suggested_tags,
      })
      .pipe(finalize(() => this.uiService.hideLoader()))
      .subscribe({
        next: () => {
          this.triageSuggestion = null;
          this.refreshTicket();
          this.uiService.showSnackbar('Triage suggestion accepted!');
        },
        error: () => {
          this.uiService.showSnackbar('Failed to accept triage suggestion.');
        },
      });
  }

  rejectTriageSuggestion(): void {
    this.uiService.showLoader();
    this.triageSuggestion = null;
    this.uiService.hideLoader();
    this.uiService.showSnackbar('Triage suggestion rejected.');
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  canUpdateTicket(): boolean {
    return this.currentUserRole === UserRole.Agent || this.currentUserRole === UserRole.Admin;
  }

  toggleAssignee(ticketId: number, currentAssignee: number | null): void {
    if (!this.canUpdateTicket() || !this.currentUser || this.assignInFlight) {
      return;
    }

    const newAssigneeId = currentAssignee === this.currentUser.id ? null : this.currentUser.id;
    const actionLabel = newAssigneeId ? 'assigned' : 'unassigned';

    this.assignInFlight = true;
    this.ticketService
      .updateTicket(ticketId, { assignee_id: newAssigneeId })
      .pipe(
        finalize(() => {
          this.assignInFlight = false;
        }),
      )
      .subscribe({
        next: () => {
          this.uiService.showSnackbar(`Ticket ${actionLabel}.`);
          this.refreshTicket();
        },
        error: () => {
          this.uiService.showSnackbar('Unable to update assignee.');
        },
      });
  }

  updateTicketStatus(ticketId: number, status: TicketStatus): void {
    if (!this.canUpdateTicket() || this.statusUpdateInFlight === status) {
      return;
    }

    this.statusUpdateInFlight = status;
    this.ticketService
      .updateTicket(ticketId, { status })
      .pipe(
        finalize(() => {
          this.statusUpdateInFlight = null;
        }),
      )
      .subscribe({
        next: () => {
          this.uiService.showSnackbar('Ticket status updated.');
          this.refreshTicket();
        },
        error: () => {
          this.uiService.showSnackbar('Unable to update ticket status.');
        },
      });
  }

  copyDescription(description: string | null | undefined): void {
    const value = description?.trim();
    if (!value) {
      this.uiService.showSnackbar('Nothing to copy.');
      return;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(value)
        .then(() => this.uiService.showSnackbar('Description copied.'))
        .catch(() => this.uiService.showSnackbar('Copy failed.'));
      return;
    }

    // Fallback if Clipboard API unavailable
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.uiService.showSnackbar('Description copied.');
    } catch {
      this.uiService.showSnackbar('Copy failed.');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  private refreshTicket(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    if (this.ticketId !== null) {
      this.ticketFound = true;
      this.uiService.showLoader();
      this.ticket$ = this.ticketService.getTicket(this.ticketId).pipe(
        tap(() => {
          this.ticketFound = true;
        }),
        catchError((error) => {
          if (error?.status === 404) {
            this.ticketFound = false;
          } else {
            this.uiService.showSnackbar('Unable to load ticket details.');
          }
          return of(undefined);
        }),
        finalize(() => this.uiService.hideLoader()),
      );
    } else {
      this.ticketFound = false;
      this.ticket$ = of(undefined);
    }
  }

  private canManageTriage(): boolean {
    return (
      this.currentUserRole === UserRole.Agent || this.currentUserRole === UserRole.Admin
    );
  }

}
