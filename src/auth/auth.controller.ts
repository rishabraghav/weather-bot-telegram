import { Controller, Get, UseGuards, Req, Res, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model'; 
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly authService: AuthService,
    ) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res) {
        const user = req.user;
        return res.redirect(`http://localhost:3001?user=${JSON.stringify(user)}`);
    }

    @Get('logout')
    async logout(@Req() req, @Res() res, @Session() session) {
        req.logout((err) => {
            if (err) {
                // Handle any errors that occur during logout
                console.error(err);
                return res.status(500).send('Logout failed');
            }
    
            // Clear the session data
            session.destroy();
    
            // Redirect to the client after successful logout
            res.redirect('http://localhost:3001');
        });
    }

    async serializeUser(user: User, done: (err: any, id?: any) => void): Promise<void> {
        done(null, user.id);
    }

    async deserializeUser(id: string, done: (err: any, user?: User) => void): Promise<void> {
        try {
            const user = await this.authService.findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
}
