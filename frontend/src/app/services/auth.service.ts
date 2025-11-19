import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthUser } from '../models/auth-user.model';
import { UserRole } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api';
  private readonly tokenStorageKey = 'helpdeskAuthToken';

  readonly currentUser$ = new BehaviorSubject<AuthUser | null>(null);
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(this.hasStoredToken());

  constructor(private readonly http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthUser> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      switchMap((response) => {
        this.persistToken(response.token);
        return this.fetchCurrentUser();
      }),
      tap((user) => {
        this.currentUser$.next(user);
        this.isAuthenticated$.next(true);
      }),
      catchError((error) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    const token = this.getAuthToken();

    if (!token) {
      this.clearSession();
      return of(void 0);
    }

    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      finalize(() => this.clearSession())
    );
  }

  init(): Observable<AuthUser | null> {
    if (!this.getAuthToken()) {
      this.clearSession();
      return of(null);
    }

    return this.fetchCurrentUser().pipe(
      tap((user) => {
        this.currentUser$.next(user);
        this.isAuthenticated$.next(true);
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticated$.value || !!this.getAuthToken();
  }

  getSnapshotUser(): AuthUser | null {
    return this.currentUser$.value;
  }

  getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.tokenStorageKey);
  }
  getSnapshotUserRole(): UserRole | null {
    return this.currentUser$.value?.role ?? null;
  }

  private fetchCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/user`);
  }

  private persistToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(this.tokenStorageKey, token);
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenStorageKey);
    }
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  private hasStoredToken(): boolean {
    return !!this.getAuthToken();
  }
}
