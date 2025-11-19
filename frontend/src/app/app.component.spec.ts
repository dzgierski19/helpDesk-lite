import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { UiService } from './services/ui.service';
import { AuthService } from './services/auth.service';
import { AuthUser } from './models/auth-user.model';

describe('AppComponent', () => {
  beforeEach(async () => {
    const uiServiceStub = {
      loading$: new BehaviorSubject<boolean>(false),
      showLoader: jasmine.createSpy('showLoader'),
      hideLoader: jasmine.createSpy('hideLoader'),
      showSnackbar: jasmine.createSpy('showSnackbar'),
    };

    const authServiceStub = {
      currentUser$: new BehaviorSubject<AuthUser | null>(null),
      isAuthenticated$: new BehaviorSubject<boolean>(false),
      init: jasmine.createSpy('init').and.returnValue(of(null)),
      logout: jasmine.createSpy('logout').and.returnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, SharedModule, NoopAnimationsModule],
      providers: [
        { provide: UiService, useValue: uiServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-copy h1')?.textContent).toContain('Customer ticketing workspace');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-copy h1')?.textContent).toContain('Customer ticketing workspace');
  });
});
