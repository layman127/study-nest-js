import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ScheduleModel extends Document {
  @Prop({ required: true })
  nameGuest: string;
  @Prop({ required: true })
  dateCheckIn: Date;
  @Prop({ required: true })
  dateCheckOut: Date;
  @Prop({ required: true })
  roomNumber: number;
}
export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
