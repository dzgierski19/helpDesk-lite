import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from '../models/ticket.model';
import { TicketStatus } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class TicketStatsService {
  private readonly _tickets$ = new BehaviorSubject<Ticket[]>([]);

  readonly totalTickets$: Observable<number> = this._tickets$.pipe(
    map((tickets) => tickets.length)
  );

  readonly newTicketsCount$: Observable<number> = this._tickets$.pipe(
    map((tickets) => tickets.filter((ticket) => ticket.status === TicketStatus.New).length)
  );

  readonly avgResponseTimeHours$: Observable<string> = this._tickets$.pipe(
    map((tickets) => {
      if (!tickets.length) {
        return '12h';
      }

      const totalDiffMs = tickets.reduce((acc, ticket) => {
        const createdAt = new Date(ticket.created_at).getTime();
        const updatedAt = new Date(ticket.updated_at).getTime();
        const diff = updatedAt - createdAt;
        if (isNaN(diff)) {
          return acc;
        }
        return acc + Math.max(diff, 0);
      }, 0);

      const avgMs = totalDiffMs / tickets.length;
      const avgHours = avgMs / (1000 * 60 * 60);
      if (Number.isNaN(avgHours) || !Number.isFinite(avgHours)) {
        return '12h';
      }

      return `${Math.round(avgHours)}h`;
    })
  );

  updateTickets(tickets: Ticket[]): void {
    this._tickets$.next(tickets);
  }
}
