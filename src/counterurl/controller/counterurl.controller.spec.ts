import { Test, TestingModule } from '@nestjs/testing';
import { CounterurlController } from '../controller/counterurl.controller';
import { CounterurlService } from '../service/counterurl.service';

const mockCounterUrlService = {
  findOne: jest.fn(),
  createCounterUrl: jest.fn(),
  getNextUrl: jest.fn(),
};

const mockCounterUrl = {
  _id: '66e38beafc9134107c258f6b',
  sequence_value: 1000000000022,
};

describe('CounterurlController', () => {
  let counterUrlController: CounterurlController;
  let counterUrlService: CounterurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterurlController],
      providers: [
        {
          provide: CounterurlService,
          useValue: mockCounterUrlService,
        },
      ],
    }).compile();

    counterUrlController =
      module.get<CounterurlController>(CounterurlController);
    counterUrlService = module.get<CounterurlService>(CounterurlService);
  });

  it('should be defined', () => {
    expect(counterUrlController).toBeDefined();
  });

  describe('update', () => {
    it('should call CounterurlService.getNextUrl and return the result', async () => {
      // Arrange
      const expectedResult = mockCounterUrl;
      jest
        .spyOn(counterUrlService, 'getNextUrl')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await counterUrlController.update();

      // Assert
      expect(counterUrlService.getNextUrl).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
