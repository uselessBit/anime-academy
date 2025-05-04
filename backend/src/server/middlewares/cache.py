from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from fastapi.responses import JSONResponse
from redis.asyncio import Redis
import json

class CacheMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_client: Redis, expiration: int):
        super().__init__(app)
        self.redis_client = redis_client
        self.expiration = expiration

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if "crud" not in request.url.path.lower():
            return await call_next(request)

        cache_key = f"cache:{request.url.path}?{request.url.query}"

        cached_data = await self.redis_client.get(cache_key)
        if cached_data:
            return JSONResponse(content=json.loads(cached_data))

        response = await call_next(request)

        response_body = b""
        async for chunk in response.body_iterator:
            response_body += chunk

        if response.status_code == 200:
            try:
                json_body = json.loads(response_body.decode())
                await self.redis_client.set(cache_key, json.dumps(json_body), ex=self.expiration)

                return Response(
                    content=response_body,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    media_type=response.media_type,
                )
            except json.JSONDecodeError:
                pass

        return Response(
            content=response_body,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.media_type,
        )
