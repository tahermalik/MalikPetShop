import { Worker } from "bullmq";
import connection from "../config/connection.js";
import User from "../schema/userSchema.js";

const generalWorker=new Worker("generalQueue",async (job)=>{
    const jobName=job.name;

    switch(jobName){
        case "addOrderId":
            const {userId,orderId}=job.data;
            await User.findByIdAndUpdate(userId,{$push:{orders:orderId.toString()}});

            break;
        default:
            console.log(`${jobName} cant be handled by the general worker`)
            break;
    }

},{
    connection: connection,
    concurrency: 1,       // how many jobs to process at once
    attempts: 3,          // retry 3 times if fails
    backoff: {
        type: 'exponential',
        delay: 2000       // 2s, 4s, 8s
    }
})

generalWorker.on('completed', (job) => {
    console.log(`OrderId job ${job.id} completed`);
});

generalWorker.on('failed', (job, err) => {
    console.log(`OrderId job ${job.id} failed: ${err.message}`);
});

export default generalWorker;