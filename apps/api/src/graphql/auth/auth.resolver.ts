import { Response } from 'express';
import { SuccessResponse } from '@/graphql';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

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
  ) {
    const token = await this.authService.login(args);

    context.res.cookie('auth_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true, message: 'User signed in successfully', token };
  }
}
