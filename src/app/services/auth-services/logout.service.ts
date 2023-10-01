import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private cookieService: CookieService) { }

  logout() {
    this.cookieService.delete("roles")
    this.cookieService.delete("token")
    this.cookieService.delete("username")
  }
}
