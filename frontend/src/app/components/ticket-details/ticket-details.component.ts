import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

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

  readonly UserRole = UserRole;
  readonly TicketPriority = TicketPriority;
  readonly TicketStatus = TicketStatus;

  private ticketId: number | null = null;
  private currentUserRole: UserRole | null = null;
  private roleSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.ticketId = idParam ? Number(idParam) : null;

    this.refreshTicket();
    this.externalUserInfo$ = this.ticketService.getExternalUserInfo();
    this.currentUserRole$ = this.authService.currentUserRole$;
    this.roleSubscription = this.authService.currentUserRole$.subscribe((role) => {
      this.currentUserRole = role;
    });
  }

  ngOnDestroy(): void {
    this.roleSubscription?.unsubscribe();
  }

  loadTriageSuggestion(ticketId: number): void {
    if (!this.canManageTriage()) {
      return;
    }

    this.ticketService.getTriageSuggestion(ticketId).subscribe((suggestion) => {
      this.triageSuggestion = suggestion;
    });
  }

  acceptTriageSuggestion(ticketId: number): void {
    if (!this.triageSuggestion || !this.canManageTriage()) {
      return;
    }

    this.ticketService
      .updateTicket(ticketId, {
        status: this.triageSuggestion.suggested_status,
        priority: this.triageSuggestion.suggested_priority,
        tags: this.triageSuggestion.suggested_tags,
      })
      .subscribe(() => {
        this.triageSuggestion = null;
        this.refreshTicket();
      });
  }

  rejectTriageSuggestion(): void {
    this.triageSuggestion = null;
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  private refreshTicket(): void {
    if (this.ticketId !== null) {
      this.ticket$ = this.ticketService.getTicket(this.ticketId);
    } else {
      this.ticket$ = of(undefined);
    }
  }

  private canManageTriage(): boolean {
    return (
      this.currentUserRole === UserRole.Agent || this.currentUserRole === UserRole.Admin
    );
  }
}
