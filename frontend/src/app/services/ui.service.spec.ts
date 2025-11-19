import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UiService } from './ui.service';

describe('UiService', () => {
  let service: UiService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    });

    service = TestBed.inject(UiService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('showLoader() should emit true from loading$', () => {
    service.showLoader();

    expect(service.loading$.getValue()).toBeTrue();
  });

  it('hideLoader() should emit false from loading$', () => {
    service.showLoader();
    service.hideLoader();

    expect(service.loading$.getValue()).toBeFalse();
  });

  it('showSnackbar() should call MatSnackBar.open', () => {
    const message = 'Hello world';
    const action = 'Close';
    const duration = 500;

    service.showSnackbar(message, action, duration);

    expect(snackBar.open).toHaveBeenCalledWith(message, action, { duration });
  });
});
