import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { users } from '../database/schema/users.schema.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const result = await this.database.db
      .insert(users)
      .values({
        username: dto.username,
        email: dto.email,
        password: passwordHash,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      });

    return result[0];
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
