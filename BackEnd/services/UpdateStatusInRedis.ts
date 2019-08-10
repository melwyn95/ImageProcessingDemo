import RedisClient from './RedisClient';

const UpdateStatusInRedis = (jobId: string, status: string, message: string = '') => {
    RedisClient.hmset(jobId, {
        jobId,
        status,
        message,
    });
};

export default UpdateStatusInRedis;