import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { TelegramBotController } from './telegram-bot.controller';

@Module({
  imports: [ SubscriptionModule,],
  providers: [TelegramBotService],
  controllers: [TelegramBotController]
})
export class TelegramBotModule {}
