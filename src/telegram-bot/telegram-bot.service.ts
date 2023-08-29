import { Injectable, Logger } from '@nestjs/common';
const TelegramBot = require('node-telegram-bot-api');

const token = '6441656172:AAHYRlzf_YPrsCuUUiKEmccwnOaDhnagX4o';


@Injectable()
export class TelegramBotService {
    private readonly bot: any
    private logger = new Logger(TelegramBotService.name)
    constructor(){
        this.bot = new TelegramBot(token, {polling: true});
        // this.bot.on('message', this.onRecieveMessage);
        this.bot.onText(/\/subscribe/, this.subscribe);
    }
    onRecieveMessage = (msg:any) => {
        const chatId: any = msg.chat.id;

        // send a message to the chat acknowledging receipt of their message
        this.logger.debug(msg);
        
        this.bot.sendMessage(chatId, 'Received your message');
    }
    subscribe = (msg: any, match: any) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
      
        const chatId = msg.chat.id;
        const resp = "You have successfully subscribed for getting daily updates on weather"; // the captured "whatever"
      
        // send back the matched "whatever" to the chat
        this.bot.sendMessage(chatId, resp);
      };
}
