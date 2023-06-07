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
  }

  async getQuery(query: string) {
    return new Promise((resolve, reject) => {
      this.db.getConnection((err, connection) => {
        if (err) {
          console.log('error get connection');
          reject(err);
        }
        connection.query(query, (err, result) => {
          if (err) {
            console.log('error get query');
            reject(err);
          }
          resolve(result);
        });
        connection.release();
      });
    });
  }
}
