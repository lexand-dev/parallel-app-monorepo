import { Response } from 'express';
import { UseGuards } from '@nestjs/common';

import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/env';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  @Mutation()
  async signup(
    @Args('input') args: SignUpDto,
    @Context() context: { res: Response },
  ) {
    const cookieSecret = this.configService.get('COOKIE_SECRET');
    const token = await this.authService.register(args);
    context.res.cookie(cookieSecret, token, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true, message: 'User registered successfully' };
  }

  @Mutation()
  async signin(
    @Args('input') args: SignInDto,
    @Context() context: { res: Response },
  ) {
    const cookieSecret = this.configService.get('COOKIE_SECRET');
    const token = await this.authService.login(args);
    context.res.cookie(cookieSecret, token, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true, message: 'User signed in successfully' };
  }

  @Mutation()
  logout(@Context() context: { res: Response }) {
    context.res.clearCookie('auth_token');
    return { success: true, message: 'User logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Query()
  async current(@Context() context: any) {
    const userId = context.user.sub;
    console.log('Current user ID:', userId);
    return await this.authService.current(userId);
  }
}
