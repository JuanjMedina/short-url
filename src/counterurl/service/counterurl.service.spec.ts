import { Test, TestingModule } from '@nestjs/testing';
import { CounterurlService } from './counterurl.service';

describe('CounterurlService', () => {
  let service: CounterurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounterurlService],
    }).compile();

    service = module.get<CounterurlService>(CounterurlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
