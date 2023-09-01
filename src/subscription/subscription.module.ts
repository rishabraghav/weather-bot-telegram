import { Module } from '@nestjs/common';
import { SubscriptionSchema } from './subscription.model';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Subscription', schema: SubscriptionSchema}])],
    exports: [MongooseModule],
})
export class SubscriptionModule {}
