import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

// Optional guard for future routes with role-specific access (use with route data.roles)
export const RoleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const allowedRoles = (route.data['roles'] as UserRole[]) ?? [];
  const currentUser = authService.getSnapshotUser();

  if (!currentUser) {
    return false;
  }

  return allowedRoles.includes(currentUser.role);
};
