import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './AuthService.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Exclude the sign-in and sign-up API from requiring the token
    if (req.url.endsWith('/auth/signin') || req.url.endsWith('/auth/signup')) {
      return next.handle(req);
    }

    const authToken = this.authService.getToken();

    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
