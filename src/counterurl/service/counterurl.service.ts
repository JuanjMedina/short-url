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
    const $Id = '66d28c678869e05d1abad1c7';
    const counter = await this.counterUrlModel.findOneAndUpdate(
      { _id: $Id },
      { $inc: { sequence_value: 1 } },
    );
    return counter;
  }
}
