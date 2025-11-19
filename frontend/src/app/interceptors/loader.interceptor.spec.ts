import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoaderInterceptor } from './loader.interceptor';
import { UiService } from '../services/ui.service';

describe('LoaderInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let uiService: jasmine.SpyObj<UiService>;

  beforeEach(() => {
    uiService = jasmine.createSpyObj('UiService', ['showLoader', 'hideLoader', 'showSnackbar']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UiService, useValue: uiService },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show and hide loader for a successful request', () => {
    http.get('/test').subscribe();

    const request = httpMock.expectOne('/test');
    expect(uiService.showLoader).toHaveBeenCalled();

    request.flush({});

    expect(uiService.hideLoader).toHaveBeenCalled();
  });

  it('should show snackbar and hide loader on error', () => {
    http.get('/test').subscribe({
      next: () => fail('Expected request to error'),
      error: () => void 0,
    });

    const request = httpMock.expectOne('/test');
    expect(uiService.showLoader).toHaveBeenCalled();

    request.flush({ message: 'Boom' }, { status: 500, statusText: 'Server Error' });

    expect(uiService.showSnackbar).toHaveBeenCalledWith('Wystąpił błąd: Boom');
    expect(uiService.hideLoader).toHaveBeenCalled();
  });
});
