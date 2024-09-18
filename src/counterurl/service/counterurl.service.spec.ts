import { Test, TestingModule } from '@nestjs/testing';
import { CounterurlService } from '../service/counterurl.service';
import { CounterUrl, CounterUrlDocument } from '../model/counterurl.model';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

describe('CounterurlService', () => {
  let service: CounterurlService;
  let model: Model<CounterUrlDocument>;

  const mockCounterUrlModel = {
    create: jest.fn().mockResolvedValue(
      Promise.resolve({
        sequence_value: 1000000000000,
        _id: new mongoose.Types.ObjectId(),
      }),
    ),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounterurlService,
        {
          provide: getModelToken(CounterUrl.name),
          useValue: mockCounterUrlModel,
        },
      ],
    }).compile();

    service = module.get<CounterurlService>(CounterurlService);
    model = module.get<Model<CounterUrlDocument>>(
      getModelToken(CounterUrl.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a counter URL', async () => {
    const result = await service.createCounterUrl();
    expect(result).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      sequence_value: 1000000000000,
    });
  });

  it('should return the updated counter URL if it exists', async () => {
    const mockCounterUrl = {
      sequence_value: 1000000000000,
      _id: new mongoose.Types.ObjectId(),
    };

    const updatedCounterUrl = {
      ...mockCounterUrl,
      sequence_value: 1000000000001, // El valor esperado después de la actualización
    };

    // Configura el mock de findOne para que devuelva un contador existente
    mockCounterUrlModel.findOne.mockResolvedValue(mockCounterUrl);

    // Configura el mock de findOneAndUpdate para que devuelva el contador actualizado
    mockCounterUrlModel.findOneAndUpdate.mockResolvedValue(updatedCounterUrl);

    const result = await service.getNextUrl();

    // Asegúrate de que el resultado sea el objeto actualizado
    expect(result).toEqual(updatedCounterUrl);
  });
});
