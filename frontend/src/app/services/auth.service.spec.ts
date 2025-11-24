import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UserRole } from '../models/enums';
import { AuthUser } from '../models/auth-user.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: Record<string, string>;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;
  let removeItemSpy: jasmine.Spy;
  const tokenKey = 'helpdeskAuthToken';
  const mockUser: AuthUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.Admin,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    store = {};
    getItemSpy = spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    });
    setItemSpy = spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    removeItemSpy = spyOn(window.localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login, persist the token, and load the user profile', () => {
    service.login({ email: 'admin@example.com', password: 'password' }).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser$.value).toEqual(mockUser);
      expect(service.isAuthenticated$.value).toBeTrue();
    });

    const loginReq = httpMock.expectOne(`${environment.apiUrl}/login`);
    loginReq.flush({ token: 'token-123' });
    expect(setItemSpy).toHaveBeenCalledWith(tokenKey, 'token-123');

    const userReq = httpMock.expectOne(`${environment.apiUrl}/user`);
    userReq.flush(mockUser);
  });

  it('should clear session on logout', () => {
    store[tokenKey] = 'token-123';
    service.currentUser$.next(mockUser);
    service.isAuthenticated$.next(true);

    service.logout().subscribe();

    const logoutReq = httpMock.expectOne(`${environment.apiUrl}/logout`);
    logoutReq.flush({});

    expect(removeItemSpy).toHaveBeenCalledWith(tokenKey);
    expect(service.currentUser$.value).toBeNull();
    expect(service.isAuthenticated$.value).toBeFalse();
  });

  it('init() should fetch the user when a token exists', () => {
    store[tokenKey] = 'token-123';

    service.init().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const userReq = httpMock.expectOne(`${environment.apiUrl}/user`);
    userReq.flush(mockUser);

    expect(service.currentUser$.value).toEqual(mockUser);
    expect(service.isAuthenticated$.value).toBeTrue();
  });

  it('init() should clear the session when fetching the user fails', () => {
    store[tokenKey] = 'token-123';

    service.init().subscribe((user) => {
      expect(user).toBeNull();
    });

    const userReq = httpMock.expectOne(`${environment.apiUrl}/user`);
    userReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(removeItemSpy).toHaveBeenCalledWith(tokenKey);
    expect(service.currentUser$.value).toBeNull();
    expect(service.isAuthenticated$.value).toBeFalse();
  });
});
