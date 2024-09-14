import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CounterUrl, CounterUrlDocument } from '../model/counterurl.model';
import { Connection, Model } from 'mongoose';

@Injectable()
export class CounterurlService {
  constructor(
    @InjectModel(CounterUrl.name)
    private counterUrlModel: Model<CounterUrlDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findOne(): Promise<CounterUrl | null> {
    try {
      return await this.counterUrlModel.findOne().exec();
    } catch (error) {
      throw new HttpException(
        'Error retrieving counter URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createCounterUrl(): Promise<CounterUrl> {
    try {
      const createdCounterUrl = new this.counterUrlModel({
        sequence_value: 1000000000000,
      });
      return await createdCounterUrl.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error creating counter URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNextUrl(): Promise<CounterUrl> {
    try {
      let counterUrl = await this.findOne();
      if (!counterUrl) {
        counterUrl = await this.createCounterUrl();
      }

      const updatedCounter = await this.counterUrlModel.findOneAndUpdate(
        { _id: counterUrl._id },
        { $inc: { sequence_value: 1 } },
        { new: true },
      );

      if (!updatedCounter) {
        throw new HttpException(
          'Error updating counter URL',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return updatedCounter;
    } catch (error) {
      throw new HttpException(
        'Error retrieving the next URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
