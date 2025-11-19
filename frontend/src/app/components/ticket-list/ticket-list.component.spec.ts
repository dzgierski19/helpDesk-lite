import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TicketListComponent } from './ticket-list.component';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/enums';

describe('TicketListComponent', () => {
  let fixture: ComponentFixture<TicketListComponent>;
  let component: TicketListComponent;
  let ticketService: jasmine.SpyObj<TicketService>;
  let authService: jasmine.SpyObj<AuthService>;

  const setupComponent = () => {
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(async () => {
    ticketService = jasmine.createSpyObj<TicketService>('TicketService', ['getTickets']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getSnapshotUserRole']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TicketListComponent],
      providers: [
        { provide: TicketService, useValue: ticketService },
        { provide: AuthService, useValue: authService },
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
