import { Module } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';
import { MysqlDbController } from './mysql-db.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  controllers: [MysqlDbController],
  providers: [MysqlDbService],
  imports: [RedisCacheModule],
  exports: [MysqlDbService],
})
export class MysqlDbModule {}
