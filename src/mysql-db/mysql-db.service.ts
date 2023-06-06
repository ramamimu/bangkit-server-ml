import { Injectable } from '@nestjs/common';
import * as Mysql from 'mysql';

@Injectable()
export class MysqlDbService {
  private db: Mysql.Connection;
  constructor() {
    this.db = Mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    this.db.connect((err) => {
      if (err) throw err;
      console.log('Connected!');
      this.db.query('show tables', (err, result) => {
        if (err) throw err;
        console.log(result);
      });
    });
  }

  getDb(): Mysql.Connection {
    return this.db;
  }
}
