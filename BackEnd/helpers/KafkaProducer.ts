// Refer: https://github.com/that-coder/kafka-example/blob/master/producer.app.js

import kafka from 'kafka-node';
import { KAFKA_SERVER } from '../config';

const KafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_SERVER });
const Producer = new kafka.Producer(KafkaClient);

export default Producer;
