import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '../config/env';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const authCookieName = this.configService.get('COOKIE_SECRET');
    const token = req.cookies[authCookieName];

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    const payload = await this.jwtService.verifyAsync(token);
    console.log('Verified payload:', payload);
    ctx.getContext().user = payload;
    return true;
  }
}
