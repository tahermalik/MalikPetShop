// workers/emailWorker.js
import { Worker } from 'bullmq';
import connection from '../config/connection.js';
import { sendEmail } from '../controllers/userController.js';

const emailWorker = new Worker('emailQueue', async (job) => {

    // job.name  → what type of job it is
    // job.data  → the data you passed when adding to queue
    if (job.name === 'sendOrderConfirmation') {
        // console.log("Hola taher mail sent")
        const { orderId, userEmail, amount } = job.data;

        const subject = `Order Confirmed – #${orderId}`;

        const template = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                    .header { background-color: #1a1a2e; padding: 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
                    .body { padding: 36px 40px; }
                    .greeting { font-size: 16px; color: #333333; margin-bottom: 16px; }
                    .message { font-size: 14px; color: #555555; line-height: 1.7; margin-bottom: 24px; }
                    .order-box { background-color: #f9f9f9; border: 1px solid #e8e8e8; border-radius: 6px; padding: 20px 24px; margin-bottom: 24px; }
                    .order-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eeeeee; font-size: 14px; }
                    .order-row:last-child { border-bottom: none; font-weight: bold; font-size: 15px; color: #1a1a2e; }
                    .order-label { color: #777777; }
                    .order-value { color: #333333; }
                    .badge { display: inline-block; background-color: #e8f5e9; color: #2e7d32; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 24px; }
                    .cta { text-align: center; margin: 28px 0; }
                    .cta a { background-color: #1a1a2e; color: #ffffff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
                    .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Order Confirmed</h1>
                    </div>
                    <div class="body">
                        <p class="greeting">Hello,</p>
                        <p class="message">
                            Thank you for your purchase! Your order has been successfully placed and is currently being processed. 
                            We will notify you once your order has been shipped.
                        </p>

                        <span class="badge">✔ Payment Successful</span>

                        <div class="order-box">
                            <div class="order-row">
                                <span class="order-label">Order ID</span>
                                <span class="order-value">#${orderId}</span>
                            </div>
                            <div class="order-row">
                                <span class="order-label">Payment Status</span>
                                <span class="order-value">Successful</span>
                            </div>
                            <div class="order-row">
                                <span class="order-label">Total Amount</span>
                                <span class="order-value">₹${amount}</span>
                            </div>
                        </div>

                        <div class="cta">
                            <a href="${process.env.FRONTEND_URL}/orders/${orderId}">View Your Order</a>
                        </div>

                        <p class="message">
                            If you have any questions or concerns, feel free to reply to this email or contact our support team.
                            We are always happy to help.
                        </p>
                    </div>
                    <div class="footer">
                        <p>You are receiving this email because you placed an order on our platform.</p>
                        <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await sendEmail(userEmail, subject, template, "Order Confirmation Mail");
    }

}, {
    connection: connection,
    concurrency: 5,       // how many jobs to process at once
    attempts: 3,          // retry 3 times if fails
    backoff: {
        type: 'exponential',
        delay: 2000       // 2s, 4s, 8s
    }
});

emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.log(`Email job ${job.id} failed: ${err.message}`);
});

export default emailWorker;