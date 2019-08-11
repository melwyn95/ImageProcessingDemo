// Refer: https://www.sitepoint.com/using-redis-node-js/

import RedisClient from '../helpers/RedisClient';

const getLimitedObject = (object: any, keys: string []) => keys.reduce((acc: any, fileName: string) => {
    acc[fileName] = object[fileName]
    return acc;
}, {});

const GetJobStatusInRedis = (key: string, fieldNames: string [], callback: Function) => {
    RedisClient.hgetall(key, (err, object) => {
        const reducedObject = fieldNames.length > 0 ? getLimitedObject(object, fieldNames) : object;
        callback(err, reducedObject);
    });
};

export default GetJobStatusInRedis;