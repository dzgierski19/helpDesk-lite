import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

describe('RoleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getSnapshotUserRole']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
  });

  const runGuard = (roles: UserRole[]) =>
    TestBed.runInInjectionContext(() => RoleGuard({ data: { roles } } as any, {} as any));

  it('should allow when role is permitted', () => {
    authService.getSnapshotUserRole.and.returnValue(UserRole.Agent);
    const result = runGuard([UserRole.Agent, UserRole.Admin]);
    expect(result).toBeTrue();
  });

  it('should deny when no role or not permitted', () => {
    authService.getSnapshotUserRole.and.returnValue(null);
    let result = runGuard([UserRole.Admin]);
    expect(result).toBeFalse();

    authService.getSnapshotUserRole.and.returnValue(UserRole.Reporter);
    result = runGuard([UserRole.Admin]);
    expect(result).toBeFalse();
  });
});
