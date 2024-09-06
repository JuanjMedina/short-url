import { ROLES } from '@/constants/roles';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    unique: true,
  })
  username: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop({
    enum: ROLES,
    default: ROLES.USER,
  })
  role: ROLES;

  @Prop({
    default: new mongoose.Types.ObjectId().toHexString(),
  })
  _id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
