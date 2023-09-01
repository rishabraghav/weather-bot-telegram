import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy'; // Import path should match your actual file path
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModel } from './user.model';
import { UserSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'google' }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    providers: [GoogleStrategy, AuthService, UserModel],
    controllers: [AuthController],
})
export class AuthModule {}
