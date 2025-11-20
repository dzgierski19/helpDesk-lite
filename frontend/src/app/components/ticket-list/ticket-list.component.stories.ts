import { CommonModule } from '@angular/common';
import { type Meta, type StoryObj } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, NEVER, Observable, of } from 'rxjs';

import { TicketListComponent } from './ticket-list.component';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { StatusLabelComponent } from '../status-label/status-label.component';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { AuthUser } from '../../models/auth-user.model';

const baseDeclarations = [TicketListComponent, TicketCardComponent, PriorityBadgeComponent, StatusLabelComponent];
const baseImports = [
  CommonModule,
  ReactiveFormsModule,
  RouterTestingModule,
  NoopAnimationsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatProgressBarModule,
  MatTableModule,
  MatIconModule,
  MatCardModule,
];

interface TicketListStoryConfig {
  tickets: Ticket[];
  userRole: UserRole;
  loading?: boolean;
  persistLoader?: boolean;
  streamMode?: 'static' | 'pending';
}

const createModuleMetadata = (config: TicketListStoryConfig) => ({
  declarations: [...baseDeclarations],
  imports: [...baseImports],
  providers: [
    {
      provide: TicketService,
      useValue: createTicketService(config.tickets, config.streamMode),
    },
    {
      provide: AuthService,
      useValue: createAuthService(config.userRole),
    },
    {
      provide: UiService,
      useValue: createUiService(config.loading ?? false, config.persistLoader ?? false),
    },
  ],
});

const createTicketService = (tickets: Ticket[], mode: TicketListStoryConfig['streamMode']) => {
  const response$: Observable<Ticket[]> = mode === 'pending' ? NEVER : of(tickets);
  return {
    getTickets: () => response$,
  } as Pick<TicketService, 'getTickets'>;
};

const createAuthService = (role: UserRole) => {
  const user: AuthUser = {
    id: 1,
    name: 'Story User',
    email: 'story@example.com',
    role,
  };
  const currentUser$ = new BehaviorSubject<AuthUser | null>(user);

  return {
    currentUser$: currentUser$.asObservable(),
    isAuthenticated$: new BehaviorSubject<boolean>(true),
    isAuthenticated: () => true,
    getSnapshotUser: () => user,
  } as Pick<AuthService, 'currentUser$' | 'isAuthenticated$' | 'isAuthenticated' | 'getSnapshotUser'>;
};

const createUiService = (initialLoading: boolean, persist: boolean) => {
  const loading$ = new BehaviorSubject<boolean>(initialLoading);
  return {
    loading$,
    showLoader: () => loading$.next(true),
    hideLoader: () => {
      if (!persist) {
        loading$.next(false);
      }
    },
    showSnackbar: () => {},
  } as Pick<UiService, 'loading$' | 'showLoader' | 'hideLoader' | 'showSnackbar'>;
};

const sampleTickets: Ticket[] = [
  {
    id: 101,
    title: 'Checkout button not responding',
    description: 'Users on Safari cannot complete purchases due to a disabled button state.',
    priority: TicketPriority.High,
    status: TicketStatus.InProgress,
    assignee_id: 5,
    creator_id: 22,
    tags: ['checkout', 'safari'],
    created_at: '2024-05-01T10:00:00.000Z',
    updated_at: '2024-05-05T10:00:00.000Z',
  },
  {
    id: 118,
    title: 'Password reset emails delayed',
    description: 'SMTP queue spikes slow down delivery for reset emails.',
    priority: TicketPriority.Medium,
    status: TicketStatus.New,
    assignee_id: null,
    creator_id: 45,
    tags: ['email', 'reset'],
    created_at: '2024-05-04T08:45:00.000Z',
    updated_at: '2024-05-04T08:45:00.000Z',
  },
  {
    id: 124,
    title: 'Analytics dashboard chart misaligned',
    description: 'Legends overlap on screens smaller than 1280px.',
    priority: TicketPriority.Low,
    status: TicketStatus.Resolved,
    assignee_id: 14,
    creator_id: 33,
    tags: ['ui', 'analytics'],
    created_at: '2024-04-25T12:10:00.000Z',
    updated_at: '2024-05-03T09:15:00.000Z',
  },
];

const meta: Meta<TicketListComponent> = {
  title: 'Containers/TicketList',
  component: TicketListComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<TicketListComponent>;

export const Default: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      tickets: sampleTickets,
      userRole: UserRole.Agent,
    }),
  }),
};

export const Loading: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      tickets: [],
      userRole: UserRole.Agent,
      loading: true,
      persistLoader: true,
      streamMode: 'pending',
    }),
  }),
};

export const Empty: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      tickets: [],
      userRole: UserRole.Reporter,
    }),
  }),
};

export const WithFilters: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      tickets: sampleTickets.filter((ticket) => ticket.priority === TicketPriority.High),
      userRole: UserRole.Admin,
    }),
    onComponentInstance: (instance: TicketListComponent) => {
      instance.filterForm.patchValue({
        status: TicketStatus.InProgress,
        priority: TicketPriority.High,
        tag: 'checkout',
      });
      instance.applyFilters();
    },
  }),
};
