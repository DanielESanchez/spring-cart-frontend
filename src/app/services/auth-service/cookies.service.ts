import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private cookieService: CookieService) { }

  validateCookie(): boolean {
    return this.cookieService.check("token")
  }

  getAuthCookie(): string {
    return this.cookieService.get("token")
  }

  getRolesCookie(): string {
    return this.cookieService.get("roles")
  }

  getUsernameCookie(): string {
    return this.cookieService.get("username")
  }

  saveToken(token: string, expiration: string) {
    const expirationDate: Date = new Date(expiration)
    this.cookieService.set("token", token, expirationDate)
  }

  saveRoles(roles: string, expiration: string) {
    const expirationDate: Date = new Date(expiration)
    this.cookieService.set("roles", roles, expirationDate)
  }

  saveUsername(username: string, expiration: string) {
    const expirationDate: Date = new Date(expiration)
    this.cookieService.set("username", username, expirationDate)
  }

}
