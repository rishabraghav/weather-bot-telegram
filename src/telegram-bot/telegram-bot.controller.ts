import { Controller, Get } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';

@Controller('telegram-bot')
export class TelegramBotController {
    constructor(private readonly telegramService: TelegramBotService) {}

    @Get('sendweatherupdate')
    async sendWeatherUpdate(): Promise<string> {
        const weatherUpdate = await this.telegramService.fetchWeather();
        await this.telegramService.sendWeatherUpdateToAllUsers(weatherUpdate)
        return 'successfully sent to all users'
    }
}
