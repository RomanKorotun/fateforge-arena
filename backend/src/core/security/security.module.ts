import { Module } from '@nestjs/common';

import { PasswordHashService } from './services/password-hash.service';
import { TokenService } from './services/token.service';

@Module({
  providers: [PasswordHashService, TokenService],
  exports: [PasswordHashService, TokenService],
})
export class SecurityModule {}
