import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { UiService } from './services/ui.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    const uiServiceStub = {
      loading$: new BehaviorSubject<boolean>(false),
      showLoader: jasmine.createSpy('showLoader'),
      hideLoader: jasmine.createSpy('hideLoader'),
      showSnackbar: jasmine.createSpy('showSnackbar'),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, SharedModule, NoopAnimationsModule],
      providers: [{ provide: UiService, useValue: uiServiceStub }],
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
