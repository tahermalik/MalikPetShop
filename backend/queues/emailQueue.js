import { Queue } from "bullmq";

// queues/emailQueue.js
import connection from "../config/connection.js";


/// just creation of the empty queues
const emailQueue = new Queue('emailQueue', {
    connection: connection
});

export default emailQueue;