import { SuccessResponse } from '@/graphql';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async signup(@Args('input') args: SignUpDto): Promise<SuccessResponse> {
    await this.authService.register(args);
    return { success: true, message: 'User registered successfully' };
  }

  @Mutation()
  async signin(@Args('input') args: SignInDto) {
    const token = await this.authService.login(args);
    return { success: true, message: 'User signed in successfully', token };
  }
}
