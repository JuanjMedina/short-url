import { User } from '../../user/model/user.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ShortUrlDocument = HydratedDocument<ShortUrl>;

@Schema({ timestamps: true })
export class ShortUrl {
  @Prop()
  url: string;

  @Prop()
  shortUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  user: User;
}
export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
