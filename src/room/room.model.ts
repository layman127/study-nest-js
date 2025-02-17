import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'rooms', timestamps: true })
export class RoomModel extends Document {
  @Prop({ required: true })
  roomNumber: number;
  @Prop({ required: true })
  price: string;
  @Prop({ required: true })
  type: 'simple' | 'double' | 'royal' | 'luxury';
  @Prop({ required: true })
  conditioner: boolean;
  @Prop()
  images: string[];
}
export const RoomSchema = SchemaFactory.createForClass(RoomModel);
