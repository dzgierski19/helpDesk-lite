import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getSnapshotUserRole']);
    router = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  const executeGuard = () => TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));

  it('should allow activation when user is logged in', () => {
    authService.getSnapshotUserRole.and.returnValue(UserRole.Admin);

    const result = executeGuard();

    expect(result).toBeTrue();
  });

  it('should deny activation and redirect to /login when user is not logged in', () => {
    authService.getSnapshotUserRole.and.returnValue(null);
    const urlTree = {} as UrlTree;
    router.parseUrl.and.returnValue(urlTree);

    const result = executeGuard();

    expect(router.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(urlTree);
  });
});
