import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TicketStatsService } from './services/ticket-stats.service';
import { filter } from 'rxjs/operators';

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
  isLoginRoute = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly ticketStatsService: TicketStatsService,
  ) {}

  ngOnInit(): void {
    this.updateRouteState(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateRouteState(event.urlAfterRedirects));

    this.authService.init().subscribe({
      error: () => {
        // swallow init errors; guard will handle redirect
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  openNewTicket(): void {
    this.router.navigate(['/tickets'], {
      queryParams: { create: '1' },
      queryParamsHandling: 'merge',
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }

  private updateRouteState(url: string): void {
    this.isLoginRoute = url.startsWith('/login');
  }
}
