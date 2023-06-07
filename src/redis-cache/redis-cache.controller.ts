import { Controller, Get } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('redis')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @Get('/')
  getHello(): string {
    return 'hello, you are in redis management';
  }
}
