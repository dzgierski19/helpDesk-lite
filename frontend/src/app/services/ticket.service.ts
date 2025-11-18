import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { TicketPriority, TicketStatus } from '../models/enums';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = '/api';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

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

    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, {
      params,
      headers: this.buildHeaders(),
    });
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`, {
      headers: this.buildHeaders(),
    });
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket, {
      headers: this.buildHeaders(),
    });
  }

  updateTicket(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, ticket, {
      headers: this.buildHeaders(),
    });
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tickets/${id}`, {
      headers: this.buildHeaders(),
    });
  }

  getTriageSuggestion(id: number): Observable<{
    suggested_status: TicketStatus;
    suggested_priority: TicketPriority;
    suggested_tags: string[];
  }> {
    return this.http.post<{
      suggested_status: TicketStatus;
      suggested_priority: TicketPriority;
      suggested_tags: string[];
    }>(`${this.apiUrl}/tickets/${id}/triage-suggest`, {}, {
      headers: this.buildHeaders(),
    });
  }

  getExternalUserInfo(): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${this.apiUrl}/external/user-info`, {
      headers: this.buildHeaders(),
    });
  }

  private buildHeaders(): HttpHeaders {
    const role = this.authService.getSnapshotUserRole();
    let headers = new HttpHeaders();

    if (role) {
      headers = headers.set('X-USER-ROLE', role);
    }

    return headers;
  }
}
