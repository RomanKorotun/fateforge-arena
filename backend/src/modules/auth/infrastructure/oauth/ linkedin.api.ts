import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class LinkedinApi {
  async getUser(token: string) {
    const res = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new BadGatewayException('OAuth login failed');
    }

    return res.json();
  }
}
