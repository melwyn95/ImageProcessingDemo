import RedisClient from './RedisClient';

const UpdateStatusInRedis = (jobId: string, object: any) => {
    RedisClient.hmset(jobId, object);
};

export default UpdateStatusInRedis;