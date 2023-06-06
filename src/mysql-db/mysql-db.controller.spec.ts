import { Test, TestingModule } from '@nestjs/testing';
import { MysqlDbController } from './mysql-db.controller';
import { MysqlDbService } from './mysql-db.service';

describe('MysqlDbController', () => {
  let controller: MysqlDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MysqlDbController],
      providers: [MysqlDbService],
    }).compile();

    controller = module.get<MysqlDbController>(MysqlDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
