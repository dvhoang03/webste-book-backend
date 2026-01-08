import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '@/modules/user/user.enum';
import { ROLES_KEY } from '@/modules/auth/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. lấy ra các 'roles' yêu cầu từ @Roles decorator
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu router không yêu cầu role nào, cho phép truy cập
    if (!requireRoles || requireRoles.length === 0) {
      return true;
    }

    // 2. lay thong tin user tu request( da duoc xac thuc JwtAuthGuard truoc do)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. So sanh role cua user voi cac role yeu cau
    return requireRoles.some((role) => role === user.role);
  }
}
