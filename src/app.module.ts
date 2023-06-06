import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { MysqlDbModule } from './mysql-db/mysql-db.module';
@Module({
  imports: [ConfigModule.forRoot(), RedisCacheModule, MysqlDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
