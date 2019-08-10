import RedisClient from './RedisClient';

const GetJobStatusInRedis = (jobId: string, fieldNames: string [], callback: Function) => {
    RedisClient.hmget(jobId, fieldNames, (err, object) => {
        callback(err, object);
    });
};

export default GetJobStatusInRedis;