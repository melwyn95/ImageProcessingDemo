import Producer from '../helpers/KafkaProducer';
import UpdateStatusInRedis from './UpdateStatusInRedis';
import GetStatusInRedis from './GetStatusInRedis';
import { KAFKA_TOPIC } from '../config';
import { JOB_QUEUED } from '../constants';


Producer.on('ready', () => {
    UpdateStatusInRedis('kafka', {
        status: 'running'
    });
});

Producer.on('error', () => {
    UpdateStatusInRedis('kafka', {
        status: 'stopped'
    });
});

export const AddJobToQueue = (jobId: string, messages: string) => {
    GetStatusInRedis('kafka', ['status'], (_: any, { status }: { status: string}) => {
        switch (status) {
            case 'running': {
                const payloads = [{ topic: KAFKA_TOPIC, messages }];
                Producer.send(payloads, (_err, _) => {
                    if (!_err) {
                        console.log('No Error')
                        UpdateStatusInRedis(jobId, {
                            message: JOB_QUEUED
                        });
                    }
                });
                break;
            }
            default: console.log('Error: Kakfa Broker Not Running') 
        }
    });
}