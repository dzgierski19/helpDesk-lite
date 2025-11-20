import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TicketStatsService } from './services/ticket-stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  readonly currentUser$ = this.authService.currentUser$;
  readonly liveTickets$ = this.ticketStatsService.totalTickets$;
  readonly awaitingTriage$ = this.ticketStatsService.newTicketsCount$;
  readonly avgResponseTime$ = this.ticketStatsService.avgResponseTimeHours$;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly ticketStatsService: TicketStatsService,
  ) {}

  ngOnInit(): void {
    this.authService.init().subscribe({
      error: () => {
        // swallow init errors; guard will handle redirect
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
