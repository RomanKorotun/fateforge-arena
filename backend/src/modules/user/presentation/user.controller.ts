import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { AuthRequest } from '../../../common/types/auth-request';
import { DeleteUserUseCase } from '../application/use-cases/delete-user/delete-user.usecase';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { AddAddressUseCase } from '../application/use-cases/add-address/add-address.usecase';
import { AddAddressDto } from './dto/add-address.dto';
import { getMeUseCase } from '../application/use-cases/get-user/get-me.usecase';
import { GetUsersUseCase } from '../application/use-cases/get-users/get-users.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getMeUseCase: getMeUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
    private readonly getUsersUseCase: GetUsersUseCase
  ) {}

  // Отримати інформацію про себе (повний профіль + адреса)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    return this.getMeUseCase.execute(req.user.id);
  }

  // Додає адресу користувача
  @UseGuards(JwtAuthGuard)
  @Post('me/address')
  async addAddress(@Req() req: AuthRequest, @Body() dto: AddAddressDto) {
    return this.addAddressUseCase.execute({ userId: req.user.id, data: dto });
  }

  // Список користувачів з обмеженою інформацією (для рейтингу/статистики)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return await this.getUsersUseCase.execute()
  }

  // видаляє акаунт користувача (SOFT DELETE)
  @Delete('me')
  async deleteMe(@Req() req: AuthRequest) {
    return this.deleteUserUseCase.execute(req.user.id);
  }
}
