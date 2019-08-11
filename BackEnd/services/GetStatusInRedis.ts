import RedisClient from '../helpers/RedisClient';

const GetJobStatusInRedis = (key: string, fieldNames: string [], callback: Function) => {
    RedisClient.hgetall(key, (err, object) => {
        const reducedObject = fieldNames.reduce((acc: any, fileName: string) => {
            acc[fileName] = object[fileName]
            return acc;
        }, {});
        
        callback(err, reducedObject);
    });
};

export default GetJobStatusInRedis;