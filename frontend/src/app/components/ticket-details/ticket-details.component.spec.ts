import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetailsComponent } from './ticket-details.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { UiService } from '../../services/ui.service';

describe('TicketDetailsComponent', () => {
  let component: TicketDetailsComponent;
  let fixture: ComponentFixture<TicketDetailsComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let roleSubject: BehaviorSubject<UserRole | null>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let uiServiceMock: jasmine.SpyObj<UiService>;

  beforeEach(async () => {
    ticketService = jasmine.createSpyObj('TicketService', [
      'getTicket',
      'getExternalUserInfo',
      'getTriageSuggestion',
      'updateTicket',
    ]);
    ticketService.getTicket.and.returnValue(of({} as Ticket));
    ticketService.getExternalUserInfo.and.returnValue(of({ name: 'External' }));

    roleSubject = new BehaviorSubject<UserRole | null>(UserRole.Agent);
    authServiceMock = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['login', 'logout', 'getCurrentUserRole', 'getSnapshotUserRole'],
      { currentUserRole$: roleSubject.asObservable() }
    );
    authServiceMock.getCurrentUserRole.and.returnValue(roleSubject.asObservable());
    authServiceMock.getSnapshotUserRole.and.callFake(() => roleSubject.value);
    uiServiceMock = jasmine.createSpyObj<UiService>('UiService', [
      'showLoader',
      'hideLoader',
      'showSnackbar',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TicketDetailsComponent],
      providers: [
        { provide: TicketService, useValue: ticketService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: UiService, useValue: uiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('loadTriageSuggestion() should fetch suggestion and set property', () => {
    const suggestion = {
      suggested_status: TicketStatus.Resolved,
      suggested_priority: TicketPriority.High,
      suggested_tags: ['api', 'urgent'],
    };
    ticketService.getTriageSuggestion.and.returnValue(of(suggestion));
    roleSubject.next(UserRole.Agent);

    component.loadTriageSuggestion(1);

    expect(ticketService.getTriageSuggestion).toHaveBeenCalledWith(1);
    expect(component.triageSuggestion).toEqual(suggestion);
  });

  it('acceptTriageSuggestion() should call updateTicket with correct data', () => {
    const suggestion = {
      suggested_status: TicketStatus.InProgress,
      suggested_priority: TicketPriority.Medium,
      suggested_tags: ['backend'],
    };
    ticketService.updateTicket.and.returnValue(of({} as Ticket));
    ticketService.getTicket.calls.reset();
    component.triageSuggestion = suggestion;
    roleSubject.next(UserRole.Admin);

    component.acceptTriageSuggestion(1);

    expect(ticketService.updateTicket).toHaveBeenCalledWith(1, {
      status: suggestion.suggested_status,
      priority: suggestion.suggested_priority,
      tags: suggestion.suggested_tags,
    });
    expect(ticketService.getTicket).toHaveBeenCalledWith(1);
  });
});
