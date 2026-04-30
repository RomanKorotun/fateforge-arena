import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../../../common/types/jwt-payload.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generate(payload: JwtPayload): string {
    const accessTokenSecret = this.configService.getOrThrow(
      'ACCESS_TOKEN_SECRET',
    );
    const accessTokenTime = parseInt(
      this.configService.getOrThrow('ACCESS_TOKEN_TIME'),
      10,
    );

    return this.jwtService.sign(payload, {
      secret: accessTokenSecret,
      expiresIn: accessTokenTime,
    });
  }
}
