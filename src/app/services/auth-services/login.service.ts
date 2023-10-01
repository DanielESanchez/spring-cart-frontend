import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CookiesService } from './cookies.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookiesService: CookiesService) { }

  public login(user: any): any {
    return this.http.post(`${environment.API_URL}user/login`, user, { observe: 'response' }).pipe(take(1))
  }

  isLoggedIn() {
    return this.cookiesService.validateCookie()
  }
}
