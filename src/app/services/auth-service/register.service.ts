import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }
  
  saveNewUser(user: any) {
    return this.http.post<any>(`${environment.API_URL}user/new`, user, { observe: "response" });
  }

}
