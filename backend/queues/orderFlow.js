import { FlowProducer } from 'bullmq';
import connection from '../config/connection.js';

// no name is required here
const orderFlow = new FlowProducer({ connection });

export default orderFlow