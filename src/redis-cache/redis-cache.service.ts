import { Injectable } from '@nestjs/common';
import * as Redis from 'redis';

@Injectable()
export class RedisCacheService {
  private redisClient: Redis.RedisClientType;

  constructor() {
    this.redisClient = Redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    (async () => {
      await this.redisClient.connect();
    })();
  }

  getRedisClient(): Redis.RedisClientType {
    return this.redisClient;
  }

  getCache(key: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const data = await this.redisClient.get(key);
      if (data === null) {
        reject();
      }
      resolve(data);
    });
  }

  setCache(key: string, value: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const data = await this.redisClient.set(key, value);
      if (data) {
        resolve(data);
      }
      reject();
    });
  }
}
