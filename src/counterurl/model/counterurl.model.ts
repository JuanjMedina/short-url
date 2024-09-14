import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CounterUrlDocument = HydratedDocument<CounterUrl>;

@Schema()
export class CounterUrl {
  @Prop({
    type: Number,
    default: 100000000000,
  })
  sequence_value: number;

  _id: string;
}

export const CounterUrlSchema = SchemaFactory.createForClass(CounterUrl);
