import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = req.cookies['auth_token'];

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    const payload = await this.jwtService.verifyAsync(token);
    console.log('Verified payload:', payload);
    ctx.getContext().user = payload;
    return true;
  }
}
