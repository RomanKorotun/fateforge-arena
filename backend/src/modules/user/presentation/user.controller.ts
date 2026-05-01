import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { AuthRequest } from '../../../common/types/auth-request';
import { DeleteUserUseCase } from '../application/use-cases/delete-user/delete-user.usecase';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { AddAddressUseCase } from '../application/use-cases/add-address/add-address.usecase';
import { AddAddressDto } from './dto/add-address/add-address-request.dto';
import { getMeUseCase } from '../application/use-cases/get-user/get-me.usecase';
import { GetUsersUseCase } from '../application/use-cases/get-users/get-users.usecase';
import { createMulterConfig } from '../../../core/multer/multer.config';
import { AvatarValidationPipe } from './pipes/avatar-validation.pipe';
import { UploadAvatarUseCase } from '../application/use-cases/upload-avatar/upload-avatar.usecase';
import { GetUserSwagger } from './swagger/get-useers.swagger';
import { AddAddressSwagger } from './swagger/add-address.swagger';
import { UploadAvatarSwagger } from './swagger/upload-avatar.swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getMeUseCase: getMeUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
  ) {}

  // Отримати інформацію про себе (повний профіль + адреса)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    return this.getMeUseCase.execute(req.user.id);
  }

  // завантажує аватар користувача
  @UploadAvatarSwagger()
  @UseGuards(JwtAuthGuard)
  @Post('me/profile/avatar')
  @UseInterceptors(FileInterceptor('avatar', createMulterConfig('avatars')))
  async uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile(AvatarValidationPipe) file: Express.Multer.File,
  ) {
    return this.uploadAvatarUseCase.execute({
      userId: req.user.id,
      avatar: file.filename,
    });
  }

  // Додає адресу користувача
  @AddAddressSwagger()
  @UseGuards(JwtAuthGuard)
  @Post('me/address')
  async addAddress(@Req() req: AuthRequest, @Body() dto: AddAddressDto) {
    return this.addAddressUseCase.execute({ userId: req.user.id, data: dto });
  }

  // Список користувачів з обмеженою інформацією (для рейтингу/статистики)
  @GetUserSwagger()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return await this.getUsersUseCase.execute();
  }

  // видаляє акаунт користувача (SOFT DELETE)
  @Delete('me')
  async deleteMe(@Req() req: AuthRequest) {
    return this.deleteUserUseCase.execute(req.user.id);
  }
}
