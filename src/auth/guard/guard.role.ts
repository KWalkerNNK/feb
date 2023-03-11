import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../role/role';
import { ROLES_KEY } from '../decorators/decorator.role';
import { MESSAGE } from '../../utils/util.message';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const authorizationHeader = context.switchToHttp().getRequest()
      .headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException('Unauthorized', 401);
    }
    const token = authorizationHeader.replace('Bearer ', '');

    const User: any = await this.jwtService.decode(token);

    const result = await requiredRoles.some((role) =>
      User.role?.includes(role),
    );

    if (!result) {
      throw new HttpException(MESSAGE.FORBIDDEN_RESOURCE, 403);
    }
    return true;
  }
}
