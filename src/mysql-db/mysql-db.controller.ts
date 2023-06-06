import { Controller, Get } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';

@Controller('api')
export class MysqlDbController {
  constructor(private readonly mysqlDbService: MysqlDbService) {}

  @Get()
  getHello(): string {
    return 'controller sql db';
  }
}
