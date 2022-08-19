import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { UiService } from '../ui/ui.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private uiService: UiService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const authRequest = request.clone({
      setHeaders: { authorization: `Bearer ${token}` },
    });
    return next.handle(authRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.uiService.showToast('Authentication required');
        }
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }
}
