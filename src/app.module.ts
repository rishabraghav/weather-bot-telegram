import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';




require('dotenv').config()

@Module({
  imports: [TelegramBotModule, SubscriptionModule, MongooseModule.forRoot(process.env.MONGO_URI),
     AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
