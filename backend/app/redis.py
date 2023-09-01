import redis.asyncio as redis

REDIS_URL = "redis://redis-cache:6379"


async def get_redis():
    conn = redis.from_url(
        REDIS_URL, encoding="utf-8", decode_responses=True)
    try:
        yield conn
    finally:
        await conn.close()
