import { Controller, Get } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';

@Controller()
export class MysqlDbController {
  constructor(private readonly mysqlDbService: MysqlDbService) {}

  @Get()
  getHello(): string {
    return 'Welcome to C23-PR513 API management!';
  }
}
