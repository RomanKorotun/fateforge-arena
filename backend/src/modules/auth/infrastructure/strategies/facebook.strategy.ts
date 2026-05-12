import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.getOrThrow('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('FACEBOOK_CALLBACK_URL'),
      profileFields: ['displayName', 'email', 'photos'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value ?? profile._json?.email ?? null;
    const name = profile.displayName ?? profile._json?.name ?? null;
    const avatar =
      profile.photos?.[0]?.value ?? profile._json?.picture?.data?.url ?? null;

    return {
      provider: AuthProviderEnum.FACEBOOK,
      providerId: profile.id,
      email,
      name,
      avatar,
    };
  }
}
