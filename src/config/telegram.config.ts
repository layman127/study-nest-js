import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from '../telegram/telegram.interface';

export function getTelegramConfig(
  configService: ConfigService,
): ITelegramOptions {
  const token = configService.getOrThrow('TELEGRAM_TOKEN');
  return {
    chatId: configService.getOrThrow('CHAT_ID') ?? '',
    token,
  };
}
