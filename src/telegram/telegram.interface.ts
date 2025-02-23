import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ITelegramOptions {
  chatId: string;
  token: string;
}
export interface ITelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ..._args: ConfigService[]
  ) => Promise<ITelegramOptions> | ITelegramOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
