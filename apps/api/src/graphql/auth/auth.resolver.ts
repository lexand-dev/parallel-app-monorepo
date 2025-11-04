import { Response } from 'express';
import { SuccessResponse } from '@/graphql';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/guards/auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async signup(
    @Args('input') args: SignUpDto,
    @Context() context: { res: Response },
  ): Promise<SuccessResponse> {
    const token = await this.authService.register(args);
    context.res.cookie('auth_token', token, {
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
  ): Promise<SuccessResponse> {
    const token = await this.authService.login(args);
    context.res.cookie('auth_token', token, {
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
