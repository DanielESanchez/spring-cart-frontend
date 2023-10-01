import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from "src/app/services/auth-service/login.service";
import { CookiesService } from "src/app/services/auth-service/cookies.service";

export interface LoginInfo {
  username: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  password?: string;
  username?: string;

  constructor(private loginService: LoginService,
    private cookiesService: CookiesService,
    private router: Router,
    private messageService: MessageService) {
    if (loginService.isLoggedIn()) {
      this.router.navigate(["/"])
    }
  }

  login() {
    if (!this.username || !this.password) return;
    const loginInfo: LoginInfo = {
      username: this.username,
      password: this.password
    }
    this.loginService.login(loginInfo).subscribe(
      (response: any) => {
        this.cookiesService.saveRoles(response.headers.get("Roles"), response.headers.get("Expiration"))
        this.cookiesService.saveToken(response.headers.get("Token"), response.headers.get("Expiration"))
        this.cookiesService.saveUsername(loginInfo.username, response.headers.get("Expiration"))
        this.messageService.add({ severity: 'success', summary: 'Welcome', detail: `Welcome Back!.`, closable: true });
        // this.router.navigate(["/"])
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was retriving your account, the email or password is incorrect.`, closable: true });
      }
    )
  }

  goHome() {
    this.router.navigate([".."])
  }

}
