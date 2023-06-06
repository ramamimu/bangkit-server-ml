import { Injectable } from '@nestjs/common';
import * as Mysql from 'mysql';

@Injectable()
export class MysqlDbService {
  private db: Mysql.Pool;
  constructor() {
    this.db = Mysql.createPool({
      connectionLimit: 50,
      connectTimeout: 2000,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log(this.getQuery('show tables'));
  }

  async getQuery(query: string): Promise<string> {
    let data = '';
    await this.db.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected!');
      connection.query(query, (err, result) => {
        if (err) throw err;
        data = result;
        console.log(result);
      });
      connection.release();
    });

    return data;
  }
}
