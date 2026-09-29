import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { users } from '../database/schema/users.schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findByEmail(email: string) {
    const result = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] ?? null;
  }

  async findById(id: number) {
    const result = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
