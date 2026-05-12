import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';

import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('DISCORD_CLIENT_ID'),
      clientSecret: configService.getOrThrow('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      provider: AuthProviderEnum.DISCORD,
      providerId: profile.id,
      email: profile.email,
      name: profile.username,
      avatar: profile.avatar,
    };
  }
}
