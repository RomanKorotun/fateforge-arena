import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { ConfigService } from '@nestjs/config';

import { JwtPayload } from '../../../../common/types/jwt-payload.type';

import { ValidateUserService } from '../../application/services/validate-user.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authValidator: ValidateUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    console.log("client",client);
    const cookies = cookie.parse(client.handshake.headers.cookie ?? '');
    console.log("cookies", cookies);
    const token = cookies.accessToken;
    console.log("token", token);

    if (!token) {
      throw new UnauthorizedException('No token');
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.authValidator.validateByPayload(payload);
    console.log("user",user);

    client.data.user = {
      id: user.id,
      username: user.username,
    };

    return true;
  }
}
