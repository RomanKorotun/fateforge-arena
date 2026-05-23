import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as maxmind from 'maxmind';
import type { CityResponse } from 'maxmind';
import * as path from 'path';

@Injectable()
export class GeoIpService implements OnModuleInit {
  private lookup!: maxmind.Reader<CityResponse>;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const NODE_ENV = this.configService.getOrThrow<string>('NODE_ENV');

    const dbPath =
      NODE_ENV === 'development'
        ? path.join(process.cwd(), 'src', 'core', 'geoip', 'GeoLite2-City.mmdb')
        : path.join(
            process.cwd(),
          'dist',
            "src",
            'core',
            'geoip',
            'GeoLite2-City.mmdb',
          );

    this.lookup = await maxmind.open<CityResponse>(dbPath);
  }

  getLocation(ip: string) {
    if (!ip) {
      return {
        country: null,
        city: null,
        region: null,
        timezone: null,
      };
    }

    const data = this.lookup.get(ip);

    return {
      country: data?.country?.names?.en ?? null,
      city: data?.city?.names?.en ?? null,
      region: data?.subdivisions?.[0]?.names?.en ?? null,
      timezone: data?.location?.time_zone ?? null,
    };
  }
}
