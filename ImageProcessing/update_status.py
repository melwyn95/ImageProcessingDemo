import redis

from constants import STATUS, MESSAGE, SUCCESS, SUCCESS_MESSAGE, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD

def get_redis_client():
    return redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)

def update_job_status(job_id, job_data):
    client = get_redis_client()
    client.hmset(job_id, job_data)