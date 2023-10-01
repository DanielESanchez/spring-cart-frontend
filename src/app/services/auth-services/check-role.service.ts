import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CheckRoleService {

  constructor(private cookieService: CookieService) { }

  hasRole(role: string): boolean {
    role = "ROLE_" + role.toUpperCase()
    if (!this.cookieService.get("roles")) return false

    let roles: string = this.cookieService.get("roles").replace(/\[+/g, '')
    roles = roles.replace(/\]+/g, '')
    roles = roles.replace(/\s+/g, '')
    const arrayRoles: string[] = roles.split(",")
    const foundRole: number = arrayRoles.indexOf(role)
    for (const key in arrayRoles) {
      console.log(arrayRoles[key])
    }
    if (foundRole === -1) return false

    return true
  }
}
