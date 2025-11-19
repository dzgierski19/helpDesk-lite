import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { TicketStatus } from '../models/enums';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService],
    });

    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.removeItem('useMockData');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getTickets() should build correct params', () => {
    service.getTickets({ status: TicketStatus.New, tag: 'api' }).subscribe();

    const req = httpMock.expectOne((request) => request.url === '/api/tickets');

    expect(req.request.urlWithParams).toBe('/api/tickets?status=new&tag=api');

    req.flush([]);
  });
});
