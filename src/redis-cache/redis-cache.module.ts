import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheController } from './redis-cache.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RedisCacheService],
  controllers: [RedisCacheController],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
