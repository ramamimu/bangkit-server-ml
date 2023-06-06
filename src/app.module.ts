import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
@Module({
  imports: [ConfigModule.forRoot(), RedisCacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
