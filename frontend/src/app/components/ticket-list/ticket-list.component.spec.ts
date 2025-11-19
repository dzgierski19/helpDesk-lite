import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketListComponent } from './ticket-list.component';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { UserRole } from '../../models/enums';

describe('TicketListComponent', () => {
  let fixture: ComponentFixture<TicketListComponent>;
  let component: TicketListComponent;
  let ticketService: jasmine.SpyObj<TicketService>;
  let authService: jasmine.SpyObj<AuthService>;
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
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'getSnapshotUserRole',
    ]);
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
    authService.getSnapshotUserRole.and.returnValue(UserRole.Reporter);
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();

    expect(component.displayedColumns).toEqual([
      'id',
      'title',
      'status',
      'priority',
      'created_at',
    ]);
  });

  it('should set admin columns for admin role', () => {
    authService.getSnapshotUserRole.and.returnValue(UserRole.Admin);
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();

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
    authService.getSnapshotUserRole.and.returnValue(UserRole.Reporter);
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();

    expect(ticketService.getTickets).toHaveBeenCalled();
  });

  it('should set userRole to Reporter when authService returns null', () => {
    authService.getSnapshotUserRole.and.returnValue(null);
    ticketService.getTickets.and.returnValue(of([]));

    setupComponent();

    expect(component.userRole).toBe(UserRole.Reporter);
  });
});
