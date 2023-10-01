import { Injectable } from '@angular/core';
import { CookiesService } from './cookies.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {

  constructor(private cookiesService: CookiesService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string = ""
    if (this.cookiesService.validateCookie()) token = this.cookiesService.getAuthCookie();
    const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    return next.handle(authReq);
  }
}
