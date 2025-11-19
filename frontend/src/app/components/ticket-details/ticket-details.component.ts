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

  private ticketId: number | null = null;
  private currentUserRole: UserRole | null = null;
  private readonly destroy$ = new Subject<void>();

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
