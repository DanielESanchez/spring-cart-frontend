import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CookiesService } from 'src/app/services/auth-service/cookies.service';
import { LoginService } from 'src/app/services/auth-service/login.service';
import { RegisterService } from 'src/app/services/auth-service/register.service';

export interface RegisterInfo {
  username: string,
  password: string,
  firstName: string,
  lastName: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent {
  password: string = "";
  username: string = "";
  firstName: string = "";
  lastName: string = "";
  validEmail: boolean = true
  validPass: boolean = true
  validFirstName: boolean = true
  validLastName: boolean = true
  dirt: string = "ng-invalid ng-dirty"
  clean: string = ""
  private commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;
  private savedUser: boolean = true

  constructor(private loginService: LoginService,
    private registerService: RegisterService,
    private cookiesService: CookiesService,
    private router: Router,
    private messageService: MessageService) {
    if (loginService.isLoggedIn()) {
      this.router.navigate(["/"])
    }
  }

  saveUser() {
    this.checkUsername()
    this.checkPassword()
    this.checkFirstName()
    this.checkLastName()
    if (!this.validEmail || !this.validPass || !this.validFirstName || !this.validLastName) {
      this.savedUser = false
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please check all fields to save your user.` });
      return
    }
    const userToSave: RegisterInfo = {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    }
    this.registerService.saveNewUser(userToSave).subscribe(
      (response: any) => {
        this.cookiesService.saveRoles(response.headers.get("Roles"), response.headers.get("Expiration"))
        this.cookiesService.saveToken(response.headers.get("Token"), response.headers.get("Expiration"))
        this.messageService.add({ severity: 'success', summary: 'Welcome', detail: `Welcome Back!.`, closable: true });
        this.savedUser = true
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was saving your account. Try again later`, closable: true });
      }
    )
  }

  private checkUsername() {
    (this.username.length < 1) ? this.validFirstName = false : this.validFirstName = true
  }

  private checkFirstName() {
    (this.firstName.length < 1) ? this.validFirstName = false : this.validFirstName = true
  }

  private checkLastName() {
    (this.lastName.length < 1) ? this.validLastName = false : this.validLastName = true
  }


  private isPasswordCommon(password: string): boolean {
    return this.commonPasswordPatterns.test(password)
  }

  private checkPassword() {
    let numberOfElements = 0;
    numberOfElements = /.*[a-z].*/.test(this.password) ? ++numberOfElements : numberOfElements
    numberOfElements = /.*[A-Z].*/.test(this.password) ? ++numberOfElements : numberOfElements
    numberOfElements = /.*[0-9].*/.test(this.password) ? ++numberOfElements : numberOfElements

    if (this.password === null || this.password.length < 8) {
      this.validPass = false
    } else if (this.isPasswordCommon(this.password) === true) {
      this.validPass = false
    } else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
      this.validPass = false
    } else {
      this.validPass = true
    }
  }

  onCloseToast() {
    if (this.savedUser) this.router.navigate(["/"])
  }

}
