import { CanActivateFn, Router } from '@angular/router';
import { CheckRoleService } from '../services/auth-services/check-role.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const isAdmin: boolean = inject(CheckRoleService).hasRole("ADMIN")
  const router: Router = inject(Router)
  if (!isAdmin) {
    router.navigate(["/"])
  }
  return true
};
