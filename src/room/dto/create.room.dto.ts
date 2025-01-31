export class CreateRoomDto {
  number: number;
  price: string;
  type: 'simple' | 'double' | 'royal' | 'luxury';
  conditioner: boolean;
}
