import { Injectable, Logger } from '@nestjs/common';
const TelegramBot = require('node-telegram-bot-api');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from 'src/subscription/subscription.model';
import * as cron from 'node-cron';
import axios from 'axios';

require('dotenv').config()

const token = process.env.TELEGRAM_TOKEN;


@Injectable()
export class TelegramBotService {
    private readonly bot: any
    private logger = new Logger(TelegramBotService.name)
    private cronJob;
    private cronSchedule = "0 9 * * *";

    constructor(@InjectModel('Subscription') private readonly subscriptionModel: Model<Subscription>) {
        this.bot = new TelegramBot(token, { polling: true });
        this.bot.on('message', this.onRecieveMessage);
        this.bot.onText(/\/subscribe/, this.handleSubscribe);

        this.rescheduleCronJob();
    }
    setSchedule(newSchedule: string): void {
        this.cronSchedule = newSchedule;
    
        // Reschedule the cron job with the new schedule
        this.rescheduleCronJob();
    }
    getSchedule= async(): Promise<string> => {
        return this.cronSchedule;
    }
    private rescheduleCronJob() {
        // Clear any existing cron job
        if (this.cronJob) {
            this.cronJob.stop();
        }
    
        // Schedule the cron job with the new schedule
        this.cronJob = cron.schedule(this.cronSchedule, async () => {
            console.log('Cron job triggered at:', new Date());
            const weatherUpdate = await this.fetchWeather();
            console.log('Weather updates :', weatherUpdate);
            this.sendWeatherUpdateToAllUsers(weatherUpdate);
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata',
        });
    }

    checkAllUsers = async (): Promise<any> => {
        const subscribers = await this.subscriptionModel.find().exec()
        return subscribers;
    }
    sendWeatherUpdateToAllUsers = async (weatherUpdate: string): Promise<void> => {
        const subscribers = await this.subscriptionModel.find().exec()
        const message = `Weather Update:\n${weatherUpdate}`
        console.log(message);
        
        for (const subscriber of subscribers) {
            this.bot.sendMessage(subscriber.chatId, message);
        }
    }

    customMessageToAllUsers = async (message: string): Promise<void> => {
        const subscribers = await this.subscriptionModel.find().exec()

        for (const subscriber of subscribers) {
            this.bot.sendMessage(subscriber.chatId, message);
        }
    }

    fetchWeather = async (): Promise<string> => {
        const apiKey = process.env.WEATHER_API;
        const city = 'NOIDA'
        const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`


        try {
            const response = await axios.get(apiUrl);
            console.log(response);

            const weatherDescription = response.data.current.weather_descriptions[0];
            const temperature = response.data.current.temperature;

            return `Current weather in ${city}: ${weatherDescription}, Temperature: ${temperature}°C`;
        } catch (error) {
            console.error('Error fetching weather:', error);
            return 'Unable to fetch weather update at the moment.';
        }
    }

    onRecieveMessage = async (msg: any) => {
        const chatId: any = msg.chat.id;
        this.logger.debug(msg);
        const isSubscribed = await this.checkSubscription(chatId)

        if (!isSubscribed) {
            this.bot.sendMessage(chatId, 'Please subscribe to our weather bot using "/subscribe"');
        }
    }

    handleSubscribe = async (msg: any, match: any) => {
        const chatId = msg.chat.id
        const isSubscribed = await this.checkSubscription(chatId)
        if (isSubscribed) {
            this.bot.sendMessage(chatId, "You are already Subscribed")
        } else {
            this.subscribeUser(chatId)

            const resp = "You have successfully subscribed for getting daily updates on weather"
            this.bot.sendMessage(chatId, resp)
        }

    }

    async unsubscribeUser(chatId: number): Promise<boolean> {
        try {
          const deletedSubscriber = await this.subscriptionModel.findOneAndDelete({ chatId }).exec();
          return !!deletedSubscriber;
        } catch (error) {
          console.error('Error unsubscribing user:', error);
          return false;
        }
      }

    checkSubscription = async (chatId: number) => {
        const subscription = await this.subscriptionModel.findOne({ chatId }).exec();
        return !!subscription;
    }


    private subscribeUser = async (chatId: number): Promise<void> => {
        const newSubscription = new this.subscriptionModel({ chatId });
        try {
            const response = newSubscription.save()
            console.log("subscribed user: ", await response);

        } catch (err) {
            console.log(err);
        }

    }

}
