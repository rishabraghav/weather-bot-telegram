import { Injectable } from '@nestjs/common';
import { User } from './user.model'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async findUserById(id: string): Promise<  User | null> {
      return this.userModel.findById(id);
    }
}
