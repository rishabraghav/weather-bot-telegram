import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';

@Controller('telegram-bot')
export class TelegramBotController {
    constructor(private readonly telegramService: TelegramBotService) { }

    @Get('sendweatherupdate')
    async sendWeatherUpdate(): Promise<any> {
        const weatherUpdate = await this.telegramService.fetchWeather();
        await this.telegramService.sendWeatherUpdateToAllUsers(weatherUpdate)
        return weatherUpdate
    }

    @Get('checkusers')
    async checkUsers(): Promise<any> {
        const subscribers = await this.telegramService.checkAllUsers();
        return subscribers;
    }
    @Get('defaulttime')
    async defaultTime(): Promise<any> {
        return await this.telegramService.getSchedule();
    }
    @Get('currentweather')
    async currentWeather(): Promise<string> {
        return await this.telegramService.fetchWeather();
    }

    @Post('sendmessage')
    async sendMessage(@Body() body: { customMessage: string }): Promise<string> {
        const { customMessage } = body;
        await this.telegramService.customMessageToAllUsers(customMessage)
        return `successfully sent the "${customMessage}" to all users`
    }

    @Post('changetime')
    async changeTime(@Body() body: { newSchedule: string }): Promise<string> {
        const { newSchedule } = body;
        await this.telegramService.setSchedule(newSchedule);
        return `successfully changed the time to ${newSchedule}`;
    }
    @Delete('unsubscribe/:chatId')
    async unsubscribe(@Param('chatId') chatId: number): Promise<string> {
        // Call a method in your service to handle the subscriber deletion
        const result = await this.telegramService.unsubscribeUser(chatId);
        return result ? `Successfully unsubscribed user with chatId ${chatId}` : `User with chatId ${chatId} not found or already unsubscribed`;
    }

}
