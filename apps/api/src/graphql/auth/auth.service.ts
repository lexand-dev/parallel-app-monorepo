import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { SignInDtoType, SignUpDtoType } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../config/env';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  async register({ name, email, password }: SignUpDtoType) {
    const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS');
    const hashedPW = await bcrypt.hash(password, saltRounds);

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const user = await this.userService.create(name, email, hashedPW);

    if (!user) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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
