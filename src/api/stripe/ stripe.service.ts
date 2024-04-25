import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;
    constructor(private readonly configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>
    ) {
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        this.stripe = new Stripe(stripeKey);
    }

    async createCustomer(email: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({ email });
    }

    async createProduct(product: Stripe.ProductCreateParams): Promise<Stripe.Product> {
        return this.stripe.products.create(product);
    }

    async createPrice(price: Stripe.PriceCreateParams): Promise<Stripe.Price> {
        return this.stripe.prices.create(price);
    }

    async createPaymentIntent(courseId: string, amount: number): Promise<{ clientSecret: string }> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            metadata: { courseId },
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    async createcheckoutSession(priceId: string, userdata: any): Promise<Stripe.Checkout.Session | any> {

        const user = await this.userModel.findOne({ _id: userdata?.userId });
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: user?.stripeCustomerId,
            success_url: 'http://localhost:3001/enroll',
            cancel_url: 'http://localhost:3001/cancel',
            mode: 'payment'
        });
    }

    async processWebhookEvent(payload: any): Promise<void> {
        console.log("🚀 ~ StripeService ~ processWebhookEvent ~ payload:", payload)
        return payload;
        // const webhookEvent = new this.webhookEventModel({
        //     eventType: payload.type,
        //     eventData: payload.data,
        // });
        // await webhookEvent.save();
    }

}
