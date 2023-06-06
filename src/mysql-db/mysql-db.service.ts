import { Injectable } from '@nestjs/common';
import * as Mysql from 'promise-mysql';

@Injectable()
export class MysqlDbService {
  private db: Promise<Mysql.Pool>;

  constructor() {
    if (process.env.MODE === 'deployment') {
      this.initDb();
    }
  }

  private async initDb(): Promise<void> {
    try {
      this.db = Mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      console.log('Connected to MySQL DB');
      const data = await this.selectData('SELECT * FROM OperationHours');
      console.log(data);
    } catch (error) {
      console.error('Error connecting to MySQL DB:', error);
    }
  }

  async selectData(query: string): Promise<any[]> {
    const connection = await this.db;
    const result = await connection.query(query);
    return result;
  }
}
