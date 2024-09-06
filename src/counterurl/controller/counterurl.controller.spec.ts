import { Test, TestingModule } from '@nestjs/testing';
import { CounterurlController } from './counterurl.controller';

describe('CounterurlController', () => {
  let controller: CounterurlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterurlController],
    }).compile();

    controller = module.get<CounterurlController>(CounterurlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
