import { Test, TestingModule } from '@nestjs/testing';
import { MysqlDbService } from './mysql-db.service';

describe('MysqlDbService', () => {
  let service: MysqlDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MysqlDbService],
    }).compile();

    service = module.get<MysqlDbService>(MysqlDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
