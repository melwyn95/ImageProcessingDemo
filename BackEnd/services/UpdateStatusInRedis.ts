// Refer: http://redis.js.org/#api-friendlier-hash-commands-clienthgetallhash-callback

import RedisClient from '../helpers/RedisClient';

const UpdateStatusInRedis = (key: string, object: any) => {
    RedisClient.hmset(key, object);
};

export default UpdateStatusInRedis;