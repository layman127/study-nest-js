import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  private allowedRoles: string[];
  constructor(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRole = context.switchToHttp()?.getRequest()?.user?.role;
    return typeof userRole === 'string' && this.allowedRoles.includes(userRole);
  }
}
