import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-google-oauth20';
import { User } from "./user.model";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";

require('dotenv').config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['profile', 'email'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { id, displayName, emails } = profile;


        try {
            let user = await this.userModel.findOne({ googleId: id });
            if (!user) {    
                user = new this.userModel({
                    googleId: id,
                    displayName,
                    email: emails[0].value,
                });
                await user.save();
            }

            return user;
        } catch (error) {
            console.error("this is your error: ", error) // Handle or log the error as needed
        }
    }

}