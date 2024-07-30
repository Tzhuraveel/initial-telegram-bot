import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { BotService } from './services/bot.service';
import { BotConnectService } from './services/bot-connect.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useClass: BotConnectService,
    }),
  ],
  providers: [BotService],
})
export class BotModule {}
