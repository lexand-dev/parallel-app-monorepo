import * as bcrypt from 'bcrypt';
import { SignInDtoType, SignUpDtoType } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: SignUpDtoType) {
    const hashedPW = await bcrypt.hash(password, 10);

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const user = await this.userService.create(name, email, hashedPW);

    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async login({ email, password }: SignInDtoType) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async current(id: string) {
    return this.userService.findById(id);
  }
}
