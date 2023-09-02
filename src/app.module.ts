import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Telegraf } from 'telegraf';

require('dotenv').config();

@Module({
  imports: [
    TelegramBotModule,
    SubscriptionModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const app = express();
    app.use(bodyParser.json());
    consumer.apply(app).forRoutes('*');
  }
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setWebhook(`${process.env.URL}/your-webhook-path`);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.launch();
