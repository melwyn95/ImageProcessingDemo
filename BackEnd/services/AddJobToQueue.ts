import Producer from '../helpers/KafkaProducer';
import UpdateStatusInRedis from './UpdateStatusInRedis';
import GetStatusInRedis from './GetStatusInRedis';
import { KAFKA_TOPIC } from '../config';
import { JOB_QUEUED, PROCESSING, RUNNING, STOPPED, KAFKA_ERROR } from '../constants';
import { Job } from '../types';


Producer.on('ready', () => {
    UpdateStatusInRedis('kafka', {
        status: RUNNING
    });
});

Producer.on('error', () => {
    UpdateStatusInRedis('kafka', {
        status: STOPPED
    });
});

export const AddJobToQueue = (jobId: string, messages: string) => {
    GetStatusInRedis('kafka', ['status'], (_: any, { status }: { status: string}) => {
        switch (status) {
            case RUNNING: {
                const payloads = [{ topic: KAFKA_TOPIC, messages }];
                Producer.send(payloads, (_err, _) => {
                    if (!_err) {
                        const job: Job = {
                            jobId,
                            status: PROCESSING,
                            message: JOB_QUEUED,
                        }
                        UpdateStatusInRedis(jobId, job);
                    }
                });
                break;
            }
            default: console.log(KAFKA_ERROR); 
        }
    });
}