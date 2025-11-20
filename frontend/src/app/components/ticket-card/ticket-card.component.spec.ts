import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TicketCardComponent } from './ticket-card.component';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';

@Component({ selector: 'app-priority-badge', template: '' })
class PriorityBadgeComponentStub {
  @Input() priority!: TicketPriority;
}

@Component({ selector: 'app-status-label', template: '' })
class StatusLabelComponentStub {
  @Input() status!: TicketStatus;
}

describe('TicketCardComponent', () => {
  let component: TicketCardComponent;
  let fixture: ComponentFixture<TicketCardComponent>;

  const baseTicket: Ticket = {
    id: 42,
    title: 'Test Ticket',
    description: 'Short description',
    priority: TicketPriority.High,
    status: TicketStatus.New,
    assignee_id: 1,
    creator_id: 10,
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule, MatIconModule],
      declarations: [TicketCardComponent, PriorityBadgeComponentStub, StatusLabelComponentStub],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCardComponent);
    component = fixture.componentInstance;
  });

  it('should emit viewDetails with ticket id on viewDetails click', () => {
    component.ticket = { ...baseTicket };
    spyOn(component.viewDetails, 'emit');

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');

    expect(component.viewDetails.emit).toHaveBeenCalledWith(baseTicket.id);
  });

  it('should truncate long descriptions', () => {
    const longDescription = 'A'.repeat(150);
    component.ticket = { ...baseTicket, description: longDescription };
    component.userRole = UserRole.Admin;

    fixture.detectChanges();

    const truncated = component.truncatedDescription;
    expect(truncated.length).toBeLessThan(longDescription.length);
    expect(truncated.endsWith('...')).toBeTrue();
  });
});
