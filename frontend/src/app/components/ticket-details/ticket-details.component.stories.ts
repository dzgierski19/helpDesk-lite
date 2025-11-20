import { CommonModule } from '@angular/common';
import { type Meta, type StoryObj } from '@storybook/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, NEVER, Observable, of, throwError } from 'rxjs';

import { TicketDetailsComponent } from './ticket-details.component';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { StatusLabelComponent } from '../status-label/status-label.component';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { Ticket } from '../../models/ticket.model';
import { TicketPriority, TicketStatus, UserRole } from '../../models/enums';
import { AuthUser } from '../../models/auth-user.model';

interface TicketDetailsStoryConfig {
  ticket$: Observable<Ticket>;
  userRole: UserRole;
  routeId: number;
  externalUser?: { name: string };
  keepLoader?: boolean;
}

const baseDeclarations = [TicketDetailsComponent, TicketCardComponent, PriorityBadgeComponent, StatusLabelComponent];
const baseImports = [
  CommonModule,
  RouterTestingModule,
  NoopAnimationsModule,
  MatCardModule,
  MatButtonModule,
  MatChipsModule,
  MatProgressBarModule,
  MatIconModule,
];

const createModuleMetadata = (config: TicketDetailsStoryConfig) => ({
  declarations: [...baseDeclarations],
  imports: [...baseImports],
  providers: [
    {
      provide: TicketService,
      useValue: createTicketService(config.ticket$, config.externalUser),
    },
    {
      provide: AuthService,
      useValue: createAuthService(config.userRole),
    },
    {
      provide: UiService,
      useValue: createUiService(config.keepLoader ?? false),
    },
    {
      provide: ActivatedRoute,
      useValue: createActivatedRoute(config.routeId),
    },
  ],
});

const createTicketService = (ticket$: Observable<Ticket>, externalUser?: { name: string }) => {
  const defaultSuggestion = {
    suggested_status: TicketStatus.InProgress,
    suggested_priority: TicketPriority.Medium,
    suggested_tags: ['api', 'triage'],
  };
  return {
    getTicket: () => ticket$,
    getExternalUserInfo: () => of(externalUser ?? { name: 'Acme Support' }),
    getTriageSuggestion: () => of(defaultSuggestion),
    updateTicket: () => of({ ...sampleTicket }),
  } as Pick<TicketService, 'getTicket' | 'getExternalUserInfo' | 'getTriageSuggestion' | 'updateTicket'>;
};

const createAuthService = (role: UserRole) => {
  const user: AuthUser = {
    id: 1,
    name: 'Story User',
    email: 'story@example.com',
    role,
  };
  const subject = new BehaviorSubject<AuthUser | null>(user);
  const authState$ = new BehaviorSubject<boolean>(true);

  return {
    currentUser$: subject.asObservable(),
    isAuthenticated$: authState$.asObservable(),
    isAuthenticated: () => true,
    getSnapshotUser: () => user,
  } as Pick<AuthService, 'currentUser$' | 'isAuthenticated$' | 'isAuthenticated' | 'getSnapshotUser'>;
};

const createUiService = (keepLoader: boolean) => {
  const loading$ = new BehaviorSubject<boolean>(keepLoader);
  return {
    loading$,
    showLoader: () => loading$.next(true),
    hideLoader: () => {
      if (!keepLoader) {
        loading$.next(false);
      }
    },
    showSnackbar: () => {},
  } as Pick<UiService, 'loading$' | 'showLoader' | 'hideLoader' | 'showSnackbar'>;
};

const createActivatedRoute = (id: number): ActivatedRoute =>
  ({
    snapshot: {
      paramMap: convertToParamMap({ id: id.toString() }),
    },
  } as ActivatedRoute);

const sampleTicket: Ticket = {
  id: 501,
  title: 'API error when uploading CSV files',
  description:
    'Enterprise customers report intermittent 500 responses when uploading CSV attachments larger than 5MB. The logs show timeout errors.',
  priority: TicketPriority.High,
  status: TicketStatus.New,
  assignee_id: 9,
  creator_id: 27,
  tags: ['api', 'uploads', 'regression'],
  created_at: '2024-05-08T09:30:00.000Z',
  updated_at: '2024-05-09T14:10:00.000Z',
};

const sampleSuggestion = {
  suggested_status: TicketStatus.InProgress,
  suggested_priority: TicketPriority.High,
  suggested_tags: ['uploads', 'priority'],
};

const meta: Meta<TicketDetailsComponent> = {
  title: 'Containers/TicketDetails',
  component: TicketDetailsComponent,
  parameters: {
    layout: 'fullscreen',
  },
  render: () => ({
    template: `
      <div class="sb-aurora-panel" style="width: min(1100px, 100%);">
        <app-ticket-details></app-ticket-details>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<TicketDetailsComponent>;

export const Default: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      ticket$: of(sampleTicket),
      userRole: UserRole.Agent,
      routeId: sampleTicket.id,
    }),
  }),
};

export const Loading: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      ticket$: NEVER as Observable<Ticket>,
      userRole: UserRole.Agent,
      routeId: sampleTicket.id,
      keepLoader: true,
    }),
  }),
};

export const NotFound: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      ticket$: throwError(() => ({ status: 404 })) as Observable<Ticket>,
      userRole: UserRole.Reporter,
      routeId: 9999,
    }),
  }),
};

export const WithTriageSuggestion: Story = {
  render: () => ({
    props: {},
    moduleMetadata: createModuleMetadata({
      ticket$: of({ ...sampleTicket, status: TicketStatus.InProgress }),
      userRole: UserRole.Admin,
      routeId: sampleTicket.id,
    }),
    onComponentInstance: (instance: TicketDetailsComponent) => {
      instance.triageSuggestion = sampleSuggestion;
    },
  }),
};
