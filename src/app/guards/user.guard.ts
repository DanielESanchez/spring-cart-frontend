import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CheckRoleService } from '../services/auth-services/check-role.service';

export const userGuard: CanActivateFn = () => {
  const isUser: boolean = inject(CheckRoleService).hasRole("USER")
  const router: Router = inject(Router)
  if (!isUser) {
    router.navigate(["/"])
  }
  return true
};
