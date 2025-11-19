import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoaderInterceptor } from './loader.interceptor';
import { UiService } from '../services/ui.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoaderInterceptor', () => {
  let interceptor: LoaderInterceptor;
  let uiService: jasmine.SpyObj<UiService>;
  let handler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    uiService = jasmine.createSpyObj<UiService>('UiService', ['showLoader', 'hideLoader', 'showSnackbar']);
    handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [LoaderInterceptor, { provide: UiService, useValue: uiService }],
    });

    interceptor = TestBed.inject(LoaderInterceptor);
  });

  it('should show and hide loader on success', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    handler.handle.and.returnValue(of({} as HttpEvent<unknown>));

    interceptor.intercept(request, handler).subscribe();
    tick();

    expect(uiService.showLoader).toHaveBeenCalled();
    expect(uiService.hideLoader).toHaveBeenCalled();
  }));

  it('should show snackbar on error', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    handler.handle.and.returnValue(throwError(() => error));

    interceptor.intercept(request, handler).subscribe({
      error: () => {},
    });
    tick();

    expect(uiService.showLoader).toHaveBeenCalled();
    expect(uiService.showSnackbar).toHaveBeenCalled();
    expect(uiService.hideLoader).toHaveBeenCalled();
  }));
});
