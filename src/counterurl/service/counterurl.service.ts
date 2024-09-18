import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CounterUrl, CounterUrlDocument } from '../model/counterurl.model';
import { Model } from 'mongoose';

@Injectable()
export class CounterurlService {
  constructor(
    @InjectModel(CounterUrl.name)
    private counterUrlModel: Model<CounterUrlDocument>,
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
      const createdCounterUrl = await this.counterUrlModel.create({
        sequence_value: 1000000000000,
      });

      return createdCounterUrl;
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

      const updatedCounter = await this.counterUrlModel
        .findOneAndUpdate(
          { _id: counterUrl._id },
          { $inc: { sequence_value: 1 } },
          { new: true },
        )
        .exec();
      console.log(updatedCounter);
      // if (!updatedCounter) {
      //   throw new HttpException(
      //     'Error updating counter URL',
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }

      return updatedCounter;
    } catch (error) {
      // throw new HttpException(
      //   'Error retrieving the next URL',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }
}
