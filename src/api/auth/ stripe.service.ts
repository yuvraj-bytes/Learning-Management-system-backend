import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;
    constructor(private readonly configService: ConfigService) {
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

    async createcheckoutSession(priceId: string): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            mode: 'payment',
            ui_mode: 'embedded'
        });
    }
}
