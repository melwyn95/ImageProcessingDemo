import RedisClient from './RedisClient';

const GetJobStatusInRedis = (jobId: string, fieldNames: string [], callback: Function) => {
    RedisClient.hgetall(jobId, (err, object) => {
        callback(err, fieldNames.reduce((acc: any, fileName: string) => {
            acc[fileName] = object[fileName]
            return acc;
        }, {}));
    });
};

export default GetJobStatusInRedis;