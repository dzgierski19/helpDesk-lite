import { ActivatedRouteSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

describe('RoleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getSnapshotUser']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
  });

  const executeGuard = (route: Partial<ActivatedRouteSnapshot>) =>
    TestBed.runInInjectionContext(() => RoleGuard(route as ActivatedRouteSnapshot, {} as any));

  it('should allow activation when user role is in the allowed list', () => {
    authService.getSnapshotUser.and.returnValue({ id: 1, name: 'Admin', email: 'admin@test.com', role: UserRole.Admin });
    const route = { data: { roles: [UserRole.Admin, UserRole.Agent] } };

    const result = executeGuard(route);

    expect(result).toBeTrue();
  });

  it('should deny activation when user role is not in the allowed list', () => {
    authService.getSnapshotUser.and.returnValue({ id: 2, name: 'Reporter', email: 'reporter@test.com', role: UserRole.Reporter });
    const route = { data: { roles: [UserRole.Admin, UserRole.Agent] } };

    const result = executeGuard(route);

    expect(result).toBeFalse();
  });
});
