import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe'
import express from 'express'
import dbConnect from '../config/dbConnect.js'
import {
    globalErrorHandler,
    notFound
} from '../middlewares/globalErrorHandler.js'

import usersRouter from '../routes/usersRouter.js'
import productsRouter from '../routes/productsRouter.js'
import categoriesRouter from '../routes/categoriesRouter.js'
import brandsRouter from '../routes/brandsRouter.js'
import colorsRouter from '../routes/colorsRouter.js'
import reviewsRouter from '../routes/reviewsRouter.js'
import ordersRouter from '../routes/ordersRouter.js'
import couponsRouter from '../routes/couponsRouter.js'

import Order from '../models/OrderModel.js'

// db connect
dbConnect()
const app = express()

//  stripe webhook
// server.js
// Use this sample code to handle webhook events in your integration.
// 1) Paste this code into a new file (server.js)
// 2) Install dependencies
//   npm install stripe
//   npm install express
// 3) Run the server on http://localhost:4242
//   node server.js
// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
// STRIPE instance
const stripe = new Stripe(process.env.STRIPE_KEY)
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
    'whsec_fb1483ed8db1a434f98030f1c88f016fd55d27ec2fb1fc33c4721283a1f07f21'

app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    async (request, response) => {
        const sig = request.headers['stripe-signature']

        let event

        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                sig,
                endpointSecret
            )
            console.log(event)
        } catch (err) {
            console.log('[ERROR:]', err.message)
            response.status(400).send(`Webhook Error: ${err.message}`)
            return
        }

        if (event.type === 'checkout.session.completed') {
            // update the order
            const session = event.data.object
            const { orderId } = session.metadata
            const paymentStatus = session.payment_status
            const paymentMethod = session.payment_method_types[0]
            const totalAmount = session.amount_total
            const currency = session.currency
            // TODO: Debug uncomment //
            //  console.log({
            //     orderId,
            //     paymentStatus,
            //     paymentMethod,
            //     totalAmount,
            //     currency
            // })

            // find the order
            const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
                totalPrice : totalAmount / 100,
                currency,
                paymentMethod,
                paymentStatus
            }, { 
                new: true,
            })
            // TODO: Debug uncomment //
            console.log(order)

        } else {
            return
        }
        // //  Handle the event
        //   switch (event.type) {
        //     case 'payment_intent.succeeded':
        //       const paymentIntentSucceeded = event.data.object;
        //       // Then define and call a function to handle the event payment_intent.succeeded
        //       break;
        //     // ... handle other event types
        //     default:
        //       console.log(`Unhandled event type ${event.type}`);
        //   }

        // Return a 200 response to acknowledge receipt of the event
        response.send()
    }
)
// As we have our own server running we have commented below line
// app.listen(4242, () => console.log('Running on port 4242'));
// middleware
app.use(express.json()) // pass incoming data

// routes
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/brands', brandsRouter)
app.use('/api/v1/colors', colorsRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/orders', ordersRouter)
app.use('/api/v1/coupons', couponsRouter)

// error middleware
app.use(notFound)
app.use(globalErrorHandler)
export default app
