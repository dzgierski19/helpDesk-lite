import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { UiService } from '../services/ui.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private readonly uiService: UiService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.uiService.showLoader();

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = `Wystąpił błąd: ${error.error?.message || error.message}`;
        this.uiService.showSnackbar(errorMessage);
        return throwError(() => error);
      }),
      finalize(() => this.uiService.hideLoader()),
    );
  }
}
