import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketListComponent } from './ticket-list.component';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { UserRole } from '../../models/enums';
import { AuthUser } from '../../models/auth-user.model';

describe('TicketListComponent', () => {
  let fixture: ComponentFixture<TicketListComponent>;
  let component: TicketListComponent;
  let ticketService: jasmine.SpyObj<TicketService>;
  let authService: jasmine.SpyObj<AuthService>;
  let currentUserSubject: BehaviorSubject<AuthUser | null>;
  let uiService: jasmine.SpyObj<UiService>;
  let loadingSubject: BehaviorSubject<boolean>;

  const setupComponent = () => {
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(async () => {
    ticketService = jasmine.createSpyObj<TicketService>('TicketService', [
      'getTickets',
    ]);
    currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
    ]);
    (authService as any).currentUser$ = currentUserSubject.asObservable();
    authService.isAuthenticated.and.returnValue(true);
    loadingSubject = new BehaviorSubject<boolean>(false);
    uiService = jasmine.createSpyObj<UiService>(
      'UiService',
      ['showLoader', 'hideLoader', 'showSnackbar'],
      {
        loading$: loadingSubject,
      },
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [TicketListComponent],
      providers: [
        { provide: TicketService, useValue: ticketService },
        { provide: AuthService, useValue: authService },
        { provide: UiService, useValue: uiService },
      ],
    })
      .overrideComponent(TicketListComponent, { set: { template: '' } })
      .compileComponents();
  }));

  it('should set reporter columns for reporter role', () => {
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();
    currentUserSubject.next(createUser(UserRole.Reporter));
    fixture.detectChanges();

    expect(component.displayedColumns).toEqual([
      'id',
      'title',
      'status',
      'priority',
      'created_at',
    ]);
  });

  it('should set admin columns for admin role', () => {
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();
    currentUserSubject.next(createUser(UserRole.Admin));
    fixture.detectChanges();

    expect(component.displayedColumns).toEqual([
      'id',
      'title',
      'status',
      'priority',
      'assignee_id',
      'created_at',
      'actions',
    ]);
  });

  it('should call getTickets on init', () => {
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();
    currentUserSubject.next(createUser(UserRole.Reporter));
    fixture.detectChanges();

    expect(ticketService.getTickets).toHaveBeenCalledTimes(1);
  });

  it('should set userRole to Reporter when authService returns null', () => {
    authService.isAuthenticated.and.returnValue(false);
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();
    component.applyFilters();

    expect(ticketService.getTickets).toHaveBeenCalledTimes(1);
    expect(component.userRole).toBe(UserRole.Reporter);
  });

  function createUser(role: UserRole): AuthUser {
    return {
      id: 1,
      name: role,
      email: `${role}@test.com`,
      role,
    };
  }
});
