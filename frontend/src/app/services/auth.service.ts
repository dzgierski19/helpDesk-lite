import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'userRole';
  private readonly currentUserRoleSubject = new BehaviorSubject<UserRole | null>(null);
  readonly currentUserRole$: Observable<UserRole | null> = this.currentUserRoleSubject.asObservable();

  constructor() {
    const storedRole = this.loadRoleFromStorage();
    if (storedRole) {
      this.currentUserRoleSubject.next(storedRole);
    }
  }

  login(role: UserRole): void {
    this.currentUserRoleSubject.next(role);
    this.persistRole(role);
  }

  logout(): void {
    this.currentUserRoleSubject.next(null);
    this.clearRole();
  }

  getCurrentUserRole(): Observable<UserRole | null> {
    return this.currentUserRole$;
  }

  getSnapshotUserRole(): UserRole | null {
    return this.currentUserRoleSubject.value;
  }

  private loadRoleFromStorage(): UserRole | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? (stored as UserRole) : null;
  }

  private persistRole(role: UserRole): void {
    localStorage.setItem(this.storageKey, role);
  }

  private clearRole(): void {
    localStorage.removeItem(this.storageKey);
  }
}
