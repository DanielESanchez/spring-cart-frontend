import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${environment.API_URL}admin/all/user`)
  }

  enableUser(username: string) { 
    return this.http.patch(`${environment.API_URL}admin/enable/user/${username}`, null)
  }

  disableUser(username: string) { 
    return this.http.patch(`${environment.API_URL}admin/disable/user/${username}`, null)
  }
}
