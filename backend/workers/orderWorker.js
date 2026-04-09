// workers/emailWorker.js
import { Worker } from 'bullmq';
import connection from '../config/connection.js';
import User from '../schema/userSchema.js';
import Order from '../schema/orderSchema.js';
const orderWorker = new Worker('orderPipeline', async (job) => {
    let jobName=job.name;
    switch(jobName){
        case "task1":
            const {userId}=job.data;
            let result=await User.findById(userId).select("orders").lean()
            result=result["orders"]
            // console.log(result)     [ 'ORD-1775641238620-000020', 'ORD-1775641615846-000021' ]
            return result // passing the result to the next job
            break;

        case "task2":
            const task1Data = await job.getChildrenValues();
            let orderIds=Object.values(task1Data)[0];   // here i have the array of orderIds
            
            // now lets fetch each order; orderData is an array of object where each object is an order placed by the user
            const orderData=await Order.find({orderId:{$in:orderIds}}).select("paymentStatus status couponId finalAmount products createdAt").sort({createdAt:-1}).lean()
            return orderData;
            
        default:
            console.log("No such job exists with this name")
    }

    

}, {
    connection: connection,
    concurrency: 1,       // how many jobs to process at once
    attempts: 3,          // retry 3 times if fails
    backoff: {
        type: 'exponential',
        delay: 2000       // 2s, 4s, 8s
    }
});

orderWorker.on('completed', (job) => {
    console.log(`Order job ${job.id} completed`);
});

orderWorker.on('failed', (job, err) => {
    console.log(`Order job ${job.id} failed: ${err.message}`);
});

export default orderWorker;