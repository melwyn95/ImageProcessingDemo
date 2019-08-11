import RedisClient from '../helpers/RedisClient';

const UpdateStatusInRedis = (key: string, object: any) => {
    RedisClient.hmset(key, object);
};

export default UpdateStatusInRedis;