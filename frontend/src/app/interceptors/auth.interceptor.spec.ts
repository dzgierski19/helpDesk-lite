import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getSnapshotUserRole']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add X-USER-ROLE header when role exists', () => {
    authService.getSnapshotUserRole.and.returnValue(UserRole.Agent);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('X-USER-ROLE')).toBeTrue();
    expect(req.request.headers.get('X-USER-ROLE')).toBe(UserRole.Agent);
    req.flush({});
  });

  it('should NOT add X-USER-ROLE header when role is null', () => {
    authService.getSnapshotUserRole.and.returnValue(null);

    httpClient.get('/test-no-role').subscribe();

    const req = httpMock.expectOne('/test-no-role');
    expect(req.request.headers.has('X-USER-ROLE')).toBeFalse();
    req.flush({});
  });
});
