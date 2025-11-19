import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { AuthService } from './auth.service';
import { TicketStatus, UserRole } from '../models/enums';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getSnapshotUserRole']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    });

    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getTickets() should build correct params', () => {
    authService.getSnapshotUserRole.and.returnValue(UserRole.Admin);

    service.getTickets({ status: TicketStatus.New, tag: 'api' }).subscribe();

    const req = httpMock.expectOne((request) => request.url === '/api/tickets');

    expect(req.request.urlWithParams).toBe('/api/tickets?status=new&tag=api');

    req.flush([]);
  });
});
