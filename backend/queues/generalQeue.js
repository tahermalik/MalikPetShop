import { Queue } from "bullmq";
import connection from "../config/connection.js";

const generalQueue=new Queue("generalQueue",{
    connection:connection
});

export default generalQueue;