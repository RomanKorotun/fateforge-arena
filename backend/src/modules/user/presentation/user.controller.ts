import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import type { AuthRequest } from '../../../common/types/auth-request';
import { DeleteUserUseCase } from '../application/use-cases/delete-user/delete-user.usecase';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { AddAddressUseCase } from '../application/use-cases/add-address/add-address.usecase';
import { AddAddressDto } from './dto/add-address/add-address-request.dto';
import { getMeUseCase } from '../application/use-cases/get-me/get-me.usecase';
import { GetUsersUseCase } from '../application/use-cases/get-users/get-users.usecase';
import { createMulterConfig } from '../../../core/multer/multer.config';
import { AvatarValidationPipe } from './pipes/avatar-validation.pipe';
import { UploadAvatarUseCase } from '../application/use-cases/upload-avatar/upload-avatar.usecase';
import { GetUserSwagger } from './swagger/get-useers.swagger';
import { AddAddressSwagger } from './swagger/add-address.swagger';
import { UploadAvatarSwagger } from './swagger/upload-avatar.swagger';
import { DeleteMeSwagger } from './swagger/delete-me.swagger';
import { GetAddressUseCase } from '../application/use-cases/get-address/get-address.usecase';
import { GetAddressSwagger } from './swagger/get-address.swagger';
import { UpdateAddressDto } from './dto/update-address/update-address.request.dto';
import { UpdateAddressUseCase } from '../application/use-cases/update-address/update-address.usecase';
import { NonEmptyBodyPipe } from '../../../common/pipes/non-empty-body.pipe';
import { UpdateAddressSwagger } from './swagger/update-address.swagger';
import { GetMeSwagger } from './swagger/get-me.swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getMeUseCase: getMeUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
    private readonly getAddressUseCase: GetAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
  ) {}

  // Отримати інформацію про себе (повний профіль)
  @GetMeSwagger()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    return await this.getMeUseCase.execute(req.user.id);
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
    return await this.uploadAvatarUseCase.execute({
      userId: req.user.id,
      avatar: file.filename,
    });
  }

  // Додає адресу користувача
  @AddAddressSwagger()
  @UseGuards(JwtAuthGuard)
  @Post('me/address')
  async AddAddress(@Req() req: AuthRequest, @Body() dto: AddAddressDto) {
    return await this.addAddressUseCase.execute({
      userId: req.user.id,
      data: dto,
    });
  }

  // Отримати адресу користувача
  @GetAddressSwagger()
  @UseGuards(JwtAuthGuard)
  @Get('me/address')
  async getAddress(@Req() req: AuthRequest, @Res() res: Response) {
    const address = await this.getAddressUseCase.execute(req.user.id);
    return res.json(address);
  }

  // Оновити адресу користувача
  @UpdateAddressSwagger()
  @UseGuards(JwtAuthGuard)
  @Put('me/address')
  async updateAddress(
    @Req() req: AuthRequest,
    @Body(NonEmptyBodyPipe) dto: UpdateAddressDto,
  ) {
    return await this.updateAddressUseCase.execute({
      userId: req.user.id,
      data: dto,
    });
  }

  // Список користувачів з обмеженою інформацією (для рейтингу/статистики)
  @GetUserSwagger()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return await this.getUsersUseCase.execute();
  }

  // видаляє акаунт користувача (SOFT DELETE)
  @DeleteMeSwagger()
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: AuthRequest) {
    return await this.deleteUserUseCase.execute(req.user.id);
  }
}
