import * as mongoose from "mongoose";

export const SubscriptionSchema = new mongoose.Schema({
    chatId: {type: Number, unique: true},
});

export interface Subscription extends mongoose.Document{
    readonly chatId: number
}