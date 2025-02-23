import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from '../telegram/telegram.interface';

export function getTelegramConfig(
  configService: ConfigService,
): ITelegramOptions {
  const token = configService.getOrThrow('TELEGRAM_TOKEN');
  if (token === undefined || token === null || token === '') {
    throw new Error('TELEGRAM_TOKEN не задан');
  }
  return {
    chatId: configService.getOrThrow('CHAT_ID') ?? '',
    token,
  };
}
