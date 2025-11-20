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
  status: TicketStatus.InProgress,
  assignee_id: 9,
  creator_id: 27,
  tags: ['api', 'uploads', 'regression'],
  created_at: '2024-05-08T09:30:00.000Z',
  updated_at: '2024-05-09T14:10:00.000Z',
  status_changes: [
    {
      id: 1,
      ticket_id: 501,
      old_status: TicketStatus.New,
      new_status: TicketStatus.InProgress,
      changed_at: '2024-05-08T11:15:00.000Z',
    },
    {
      id: 2,
      ticket_id: 501,
      old_status: TicketStatus.InProgress,
      new_status: TicketStatus.Resolved,
      changed_at: '2024-05-09T08:45:00.000Z',
    },
    {
      id: 3,
      ticket_id: 501,
      old_status: TicketStatus.Resolved,
      new_status: TicketStatus.InProgress,
      changed_at: '2024-05-09T13:50:00.000Z',
    },
  ],
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
      <div class="app-shell">
        <header class="app-header">
          <div class="header-ambient">
            <span class="ambient-orb ambient-orb--one"></span>
            <span class="ambient-orb ambient-orb--two"></span>
            <span class="ambient-orb ambient-orb--three"></span>
          </div>
          <div class="brand-line">
            <div class="brand">
              <div class="brand-logo">
                <span>HL</span>
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <defs>
                    <linearGradient id="storybook-glow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.9" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="58" stroke="url(#storybook-glow)" stroke-width="4" fill="none" />
                </svg>
              </div>
              <div class="brand-copy">
                <p class="eyebrow">Helpdesk Lite</p>
                <h1>Customer ticketing workspace</h1>
                <p class="subtitle">Manage authentication issues, requests, and AI-powered triage suggestions in one place.</p>
              </div>
            </div>
          </div>
          <nav class="app-actions">
            <div class="user-summary">
              <div class="user-name">Story User</div>
              <div class="user-role">Agent</div>
            </div>
            <button class="new-ticket-button" type="button">Create Ticket</button>
            <button class="logout-button" type="button">Logout</button>
          </nav>
          <div class="hero-metrics">
            <div class="header-pills">
              <span class="pill pill--online">
                <span class="dot"></span>
                Backend live
              </span>
              <span class="pill pill--storybook">
                <mat-icon aria-hidden="true">auto_graph</mat-icon>
                Storybook synced
              </span>
              <span class="pill pill--llm">LLM-assisted delivery</span>
            </div>
          </div>
        </header>
        <main class="app-content">
          <section class="summary-bar">
            <div class="summary-item">
              <span class="summary-label">Live tickets</span>
              <strong>10</strong>
            </div>
            <div class="summary-item">
              <span class="summary-label">Awaiting triage</span>
              <strong>4</strong>
            </div>
            <div class="summary-item">
              <span class="summary-label">Avg response</span>
              <strong>12h</strong>
            </div>
          </section>
          <app-ticket-details></app-ticket-details>
        </main>
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
