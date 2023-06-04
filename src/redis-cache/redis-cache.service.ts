import { Injectable } from '@nestjs/common';
import * as Redis from 'redis';

@Injectable()
export class RedisCacheService {
  private redisClient: Redis.RedisClientType;
  private subscriber: Redis.RedisClientType;
  message: string;

  constructor() {
    this.redisClient = Redis.createClient();
    this.subscriber = this.redisClient.duplicate();

    (async () => {
      await this.redisClient.connect();
      await this.subscriber.connect();
      await this.subscriber.subscribe('hello', (msg: string) => {
        console.log(msg);
        this.message = msg;
      });
    })();
  }

  getRedisClient(): Redis.RedisClientType {
    return this.redisClient;
  }

  getSubscriber(): Redis.RedisClientType {
    return this.subscriber;
  }

  getMessage(): string {
    return this.message;
  }
}
