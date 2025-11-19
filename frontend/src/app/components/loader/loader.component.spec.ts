import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { UiService } from '../../services/ui.service';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoaderComponent', () => {
  let fixture: ComponentFixture<LoaderComponent>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [{ provide: UiService, useValue: { loading$: loadingSubject } }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    fixture.detectChanges();
  });

  it('should show spinner when isLoading$ is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not show spinner when isLoading$ is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeNull();
  });
});
