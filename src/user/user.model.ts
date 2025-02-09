import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ collection: 'user', timestamps: true })
export class UserModel extends Document {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  hashedPassword: string;
  @Prop({ required: true, unique: true })
  telephone: string;
  @Prop({ required: true })
  role: 'admin' | 'user';
}
export const UserSchema = SchemaFactory.createForClass(UserModel);
