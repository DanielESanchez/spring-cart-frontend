import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  public getAllProducts(): any {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/products`, { observe: 'response' }).pipe(take(1))
  }

  public login(): any {
    let user = {
      "username": "user",
      "password": "1234"
    }
    return this.http.post(`http://localhost:8080/api/v1/user/login`, user, { observe: 'response' }).pipe(take(1))
  }
}
