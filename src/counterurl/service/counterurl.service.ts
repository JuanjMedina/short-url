import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CounterUrl, CounterUrlDocument } from '../model/counterurl.model';
import { Connection, Model } from 'mongoose';
import { transaction } from '@/utils/transaction.mongo';

@Injectable()
export class CounterurlService {
  constructor(
    @InjectModel(CounterUrl.name)
    private counterUrlModel: Model<CounterUrlDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async getNextUrl(): Promise<CounterUrl> {
    const counter = await this.counterUrlModel.findOneAndUpdate(
      {},
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true },
    );
    return counter;
  }
}
