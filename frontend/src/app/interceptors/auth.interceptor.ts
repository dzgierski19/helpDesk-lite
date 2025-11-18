import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const currentRole = this.authService.getSnapshotUserRole();

    if (!currentRole) {
      return next.handle(req);
    }

    const roleRequest = req.clone({
      setHeaders: { 'X-USER-ROLE': currentRole },
    });

    return next.handle(roleRequest);
  }
}
