import { Controller, Get, Post, Body } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';

@Controller('api')
export class MysqlDbController {
  constructor(private readonly mysqlDbService: MysqlDbService) {}

  @Get()
  getHello(): string {
    return 'controller sql db';
  }
  @Post('query')
  async getQuery(@Body() body: { query: string }) {
    let error = false;
    let data: any;
    try {
      const queryData = await this.mysqlDbService.getQuery(body.query);
      data = queryData;
    } catch {
      error = true;
    }
    console.log(error ? 'failed query data' : 'success query data');
    return {
      error,
      data,
    };
  }
}
