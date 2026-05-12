import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import { LinkedinApi } from '../oauth/ linkedin.api';
import { AuthProviderEnum } from '../../domain/enums/auth-provider.enum';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly linkedinApi: LinkedinApi,
  ) {
    super({
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      clientID: configService.getOrThrow('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.getOrThrow('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('LINKEDIN_CALLBACK_URL'),
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string) {
    const data = await this.linkedinApi.getUser(accessToken);

    if (!data) {
      throw new BadGatewayException('OAuth login failed');
    }

    return {
      provider: AuthProviderEnum.LINKEDIN,
      providerId: data.sub,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    };
  }
}
