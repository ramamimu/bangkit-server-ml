import { Injectable } from '@nestjs/common';
import * as Redis from 'redis';

@Injectable()
export class RedisCacheService {
  private redisClient: Redis.RedisClientType;
  private subscriber: Redis.RedisClientType;
  private publisher: Redis.RedisClientType;
  message: string;

  constructor() {
    console.log(process.env.REDIS_HOST);
    console.log(process.env.REDIS_PORT);
    this.redisClient = Redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    this.subscriber = this.redisClient.duplicate();
    this.publisher = this.redisClient.duplicate();

    (async () => {
      await this.redisClient.connect();
      await this.subscriber.connect();
      await this.publisher.connect();
      await this.subscriber.subscribe('hello', async (msg: string) => {
        console.log(msg);
        this.message = msg;
        await this.publisher.publish('world', `Hello dari server :D! ${msg}`);
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
