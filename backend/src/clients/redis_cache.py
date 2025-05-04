import logging
from fastapi.responses import JSONResponse
import json
from redis.asyncio import Redis
from fastapi import Response


from src.settings.redis import RedisSettings

logger = logging.getLogger(__name__)


class RedisCache:
    def __init__(self, client: Redis, settings: RedisSettings) -> None:
        self.client = client
        self.settings = settings
        self.invalidate_methods = ["POST", "PATCH", "DELETE"]

    async def read(self, cache_key: str) -> JSONResponse | None:
        cached_data = await self.client.get(cache_key)
        if cached_data:
            return JSONResponse(content=json.loads(cached_data))
        return None

    async def create(self, response, cache_key: str) -> Response:
        response_body = b""
        async for chunk in response.body_iterator:
            response_body += chunk

        if response.status_code == 200:
            try:
                json_body = json.loads(response_body.decode())
                await self.client.set(cache_key, json.dumps(json_body), ex=self.settings.expiration)
            except json.JSONDecodeError:
                pass

        return Response(
            content=response_body,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.media_type,
        )

    async def delete_keys(self, request):
        if request.method in self.invalidate_methods:
            if "crud" in request.url.path.lower():
                path_pattern = f"cache:*:{request.url.path}*"
                async for key in self.client.scan_iter(match=path_pattern):
                    await self.client.delete(key)
