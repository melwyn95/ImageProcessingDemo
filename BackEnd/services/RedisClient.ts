import Redis from 'redis';

const client = Redis.createClient({ password: 'foobared' });

export default client;