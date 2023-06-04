import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisCacheService } from './redis-cache/redis-cache.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });

  const Redis = new RedisCacheService();
  const redisClient = Redis.getRedisClient();
  redisClient.on('connect', async () => {
    console.log('Connected to redis server');
    const data = await Redis.getRedisClient().get('name');
    console.log(data);
  });

  redisClient.on('error', () => {
    console.log('Error occured while connecting or accessing redis server');
  });
}
bootstrap();
