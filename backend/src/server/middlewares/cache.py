from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from src.clients.redis_cache import RedisCache


class CacheMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app,
            redis_cache: RedisCache,
    ):
        super().__init__(app)
        self.redis_cache = redis_cache
        self.cache_methods = ["GET", "HEAD"]

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        await self.redis_cache.delete_keys(request)

        if request.method not in self.cache_methods:
            return await call_next(request)

        if "crud" not in request.url.path.lower():
            return await call_next(request)

        cache_key = f"cache:{request.method}:{request.url.path}?{request.url.query}"

        if cache_response := await self.redis_cache.read(cache_key):
            return cache_response

        response = await call_next(request)

        return await self.redis_cache.create(response, cache_key)
