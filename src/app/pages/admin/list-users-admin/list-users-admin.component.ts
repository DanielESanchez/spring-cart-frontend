import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-list-users-admin',
  templateUrl: './list-users-admin.component.html',
  styleUrls: ['./list-users-admin.component.scss']
})
export class ListUsersAdminComponent implements OnInit {
  private userSelected!: string
  users!: any
  isEnableProcess!: boolean
  isDisableProcess!: boolean

  constructor(private userService: UserService, private messageService: MessageService) { }

  async ngOnInit(): Promise<void> {
    this.getUsers()
  }

  async getUsers() {
    this.users = await lastValueFrom(this.userService.getAllUsers()).catch((err: HttpErrorResponse) => { })
  }

  getStatus(status: boolean): string {
    return status ? "ENABLED" : "DISABLED"
  }

  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger'
  }

  showConfirmEnable(username: string) {
    this.isEnableProcess = true
    this.userSelected = username
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to enable ${username}?`, sticky: true, closable: false });
  }

  async onConfirmEnable() {
    this.messageService.clear()
    let isError = false
    await lastValueFrom(this.userService.enableUser(this.userSelected)).catch((err: HttpErrorResponse) => {
      this.isEnableProcess = false
      this.messageService.add({ severity: 'error', summary: `Error ${err.status}`, detail: `The user ${this.userSelected} could not be enabled. Try again later`, sticky: true, closable: true });
      isError = true
    })
    if (isError) return
    this.isEnableProcess = false
    this.messageService.add({ severity: 'success', summary: 'Completed', detail: `The user ${this.userSelected} has been enabled`, sticky: true, closable: true });
    await this.getUsers()
  }

  onRejectEnable() {
    this.messageService.clear()
    this.isEnableProcess = false
  }

  showConfirmDisable(username: string) {
    this.isDisableProcess = true
    this.userSelected = username
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to disable ${username}?`, sticky: true, closable: false });
   }

  async onConfirmDisable() {
    this.messageService.clear()
    let isError = false
    await lastValueFrom(this.userService.disableUser(this.userSelected)).catch((err: HttpErrorResponse) => {
      this.isDisableProcess = false
      this.messageService.add({ severity: 'error', summary: `Error ${err.status}`, detail: `The user ${this.userSelected} could not be disabled. Try again later`, sticky: true, closable: true });
      isError = true
    })
    if (isError) return
    this.isDisableProcess = false
    this.messageService.add({ severity: 'success', summary: 'Completed', detail: `The user ${this.userSelected} has been disabled`, sticky: true, closable: true });
    await this.getUsers()
   }

  onRejectDisable() { 
    this.messageService.clear()
    this.isDisableProcess = false
  }

}
