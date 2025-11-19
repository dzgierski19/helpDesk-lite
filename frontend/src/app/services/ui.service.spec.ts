import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UiService } from './ui.service';

describe('UiService', () => {
  let service: UiService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [{ provide: MatSnackBar, useValue: snackBar }],
    });

    service = TestBed.inject(UiService);
  });

  it('showLoader() should increment pending requests and emit true', () => {
    service.showLoader();

    expect(service.loading$.value).toBeTrue();
  });

  it('hideLoader() should decrement pending requests and emit false when counter is zero', () => {
    service.showLoader();
    service.showLoader();

    service.hideLoader();
    expect(service.loading$.value).toBeTrue();

    service.hideLoader();
    expect(service.loading$.value).toBeFalse();
  });

  it('showSnackbar() should call MatSnackBar.open', () => {
    service.showSnackbar('Test message', 'Close', 5000);

    expect(snackBar.open).toHaveBeenCalledWith('Test message', 'Close', {
      duration: 5000,
    });
  });
});
