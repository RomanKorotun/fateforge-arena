import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { RequestMetadataService } from './request-metadata.service';
import { GeoIpService } from '../../../../core/geoip/geo-ip.service';
import { SigninOauthUseCase } from '../../application/signin-oauth/signin-oauth.usecase';
import { AuthCookieService } from './auth-cookie-service';
import { OAuthRequest } from '../types/oauth-request.type';

@Injectable()
export class OAuthHandlerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly requestMetadataService: RequestMetadataService,
    private readonly geoIpService: GeoIpService,
    private readonly signinOauthUseCase: SigninOauthUseCase,
    private readonly authCookieService: AuthCookieService,
  ) {}

  async handle(req: OAuthRequest, res: Response) {
    const frontendUrl = this.configService.getOrThrow('FRONTEND_URL');

    const { ip, device } = this.requestMetadataService.getMetadata(req);
    const geo = this.geoIpService.getLocation(ip);

    const result = await this.signinOauthUseCase.execute({
      oauthProfile: req.user,
      ip,
      device,
      geo,
    });

    if (result.status === 'blocked') {
      return res.redirect(`${frontendUrl}/blocked`);
    }

    this.authCookieService.setAuthCookie(res, result.accessToken);
    return res.redirect(`${frontendUrl}/oauth/success`);
  }
}
