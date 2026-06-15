import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../../../core/security/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/security/guards/roles.guard';

import { ParseUuidPipe } from '../../../common/pipes/parse-uuid.pipe';

import { UserRole } from '../../user/domain/enums/user-role.enum';

import { GetAllUsersUseCase } from '../application/get-all-users/get-all-users.usecase';
import { BanUserUseCase } from '../application/ban-user/ban-user.usecase';
import { UnBanUserUseCase } from '../application/un-ban-user/un-ban-user.usecase';

import { BanUserDto } from './dto/ban-user/ban-user.request.dto';
import { GetAdminUsersQueryDto } from './dto/get-users.query.dto';

import { GetAllUsersSwagger } from './swagger/get-all-users.swagger';
import { BanUserSwagger } from './swagger/ban-user.swagger';
import { UnBanUserSwagger } from './swagger/un-ban-user.swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly banUserUseCase: BanUserUseCase,
    private readonly unBanUserUseCase: UnBanUserUseCase,
  ) {}

  // Отримання списку всіх користувачів (доступно лише для адміна)
  @GetAllUsersSwagger()
  @Get('users')
  async getAllUsers(@Query() query: GetAdminUsersQueryDto) {
    return await this.getAllUsersUseCase.execute(query);
  }

  // бан користувача (доступно лише для адміна)
  @BanUserSwagger()
  @Patch('users/:id/ban')
  async banUser(
    @Param('id', new ParseUuidPipe()) id: string,
    @Body() dto: BanUserDto,
  ) {
    return await this.banUserUseCase.execute({ id, data: dto });
  }

  // зняття бану з користувача (доступно лише для адміна)
  @UnBanUserSwagger()
  @Patch('users/:id/unban')
  async unBanUser(@Param('id', new ParseUuidPipe()) id: string) {
    return await this.unBanUserUseCase.execute(id);
  }
}
