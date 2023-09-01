import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import * as cors from 'cors';


async function bootstrap() {
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'your-secret-key', // Replace with your actual secret key
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize()); 
  app.use(passport.session());
  app.use(cors());
  await app.listen(PORT);
}
bootstrap();
