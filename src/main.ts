import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { RedisCacheService } from './redis-cache/redis-cache.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT || 8080}`);
  });

  const Redis = await NestFactory.create(RedisCacheModule);
  const redisService = Redis.get(RedisCacheService);
  const redisClient = redisService.getRedisClient();
  const redisSubsriber = redisService.getSubscriber();
  const redisPublisher = redisService.getPublisher();

  redisClient.on('connect', async () => {
    console.log('Connected to redis server');
    const data = await redisService.getRedisClient().get('name');
    console.log(data);
  });
  await redisSubsriber.subscribe('hello', async (msg: string) => {
    console.log(msg);
    redisService.setMessage(msg);
    await redisPublisher.publish('world', `Hello dari server :D! ${msg}`);
  });
  redisClient.on('error', () => {
    console.log('Error occured while connecting or accessing redis server');
  });
}
bootstrap();
