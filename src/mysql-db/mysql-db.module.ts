import { Module } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';
import { MysqlDbController } from './mysql-db.controller';

@Module({
  controllers: [MysqlDbController],
  providers: [MysqlDbService],
})
export class MysqlDbModule {}
