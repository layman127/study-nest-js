export class UpdateRoomDto {
  number?: number;
  price?: string;
  type?: 'simple' | 'double' | 'royal' | 'luxury';
  conditioner?: boolean;
}
