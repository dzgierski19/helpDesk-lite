import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { TicketPriority, TicketStatus } from '../models/enums';
import { MOCK_EXTERNAL_USER, MOCK_TICKETS, MOCK_TRIAGE_SUGGESTION } from './mock-ticket-data';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = '/api';
  private readonly mockTickets = [...MOCK_TICKETS];

  constructor(private readonly http: HttpClient) {}

  getTickets(filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignee_id?: number;
    tag?: string;
  }): Observable<Ticket[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.priority) {
        params = params.set('priority', filters.priority);
      }
      if (typeof filters.assignee_id === 'number') {
        params = params.set('assignee_id', filters.assignee_id.toString());
      }
      if (filters.tag) {
        params = params.set('tag', filters.tag);
      }
    }

    if (this.useMockApi()) {
      return of(this.mockTickets);
    }

    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, { params });
  }

  getTicket(id: number): Observable<Ticket> {
    if (this.useMockApi()) {
      const ticket = this.mockTickets.find((t) => t.id === id);
      return of(ticket as Ticket);
    }

    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    if (this.useMockApi()) {
      const nextId = Math.max(...this.mockTickets.map((t) => t.id)) + 1;
      const newTicket: Ticket = {
        id: nextId,
        title: ticket.title ?? 'New ticket',
        description: ticket.description ?? '',
        priority: (ticket.priority as TicketPriority) ?? TicketPriority.Low,
        status: (ticket.status as TicketStatus) ?? TicketStatus.New,
        assignee_id: ticket.assignee_id ?? null,
        creator_id: ticket.creator_id ?? 1,
        tags: ticket.tags ?? [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.mockTickets.push(newTicket);
      return of(newTicket);
    }

    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket);
  }

  updateTicket(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
    if (this.useMockApi()) {
      const idx = this.mockTickets.findIndex((t) => t.id === id);
      if (idx !== -1) {
        this.mockTickets[idx] = {
          ...this.mockTickets[idx],
          ...ticket,
          updated_at: new Date().toISOString(),
        } as Ticket;
        return of(this.mockTickets[idx]);
      }
      return of(ticket as Ticket);
    }

    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    if (this.useMockApi()) {
      const idx = this.mockTickets.findIndex((t) => t.id === id);
      if (idx !== -1) {
        this.mockTickets.splice(idx, 1);
      }
      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/tickets/${id}`);
  }

  getTriageSuggestion(id: number): Observable<{
    suggested_status: TicketStatus;
    suggested_priority: TicketPriority;
    suggested_tags: string[];
  }> {
    if (this.useMockApi()) {
      return of(MOCK_TRIAGE_SUGGESTION);
    }

    return this.http.post<{
      suggested_status: TicketStatus;
      suggested_priority: TicketPriority;
      suggested_tags: string[];
    }>(`${this.apiUrl}/tickets/${id}/triage-suggest`, {});
  }

  getExternalUserInfo(): Observable<{ name: string }> {
    if (this.useMockApi()) {
      return of(MOCK_EXTERNAL_USER);
    }

    return this.http.get<{ name: string }>(`${this.apiUrl}/external/user-info`);
  }

  private useMockApi(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('useMockData') === 'true';
  }
}
