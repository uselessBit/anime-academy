import inspect
import logging
from http import HTTPStatus

from fastapi import FastAPI, Request
from starlette.responses import JSONResponse

from src.services import errors

logger = logging.getLogger(__name__)


ERROR_STATUS_MAP = {
    errors.AnimeReviewNotFoundError: HTTPStatus.BAD_REQUEST,
    errors.AnimeNotFoundError: HTTPStatus.BAD_REQUEST,
    errors.CommentNotFoundError: HTTPStatus.BAD_REQUEST,
    errors.KeyAlreadyExistsError: HTTPStatus.BAD_REQUEST,
}


async def errors_handler(request: Request, exc: errors.BaseError) -> JSONResponse:
    status_code = ERROR_STATUS_MAP.get(type(exc), HTTPStatus.NOT_IMPLEMENTED)
    message = exc.message if status_code != HTTPStatus.NOT_IMPLEMENTED else HTTPStatus.NOT_IMPLEMENTED.phrase
    logger.error(message)
    return JSONResponse(status_code=status_code, content={"detail": message})


def patch_exception_handlers(app: FastAPI) -> None:
    for _, obj in inspect.getmembers(errors):
        if inspect.isclass(obj) and issubclass(obj, errors.BaseError):
            app.add_exception_handler(obj, errors_handler)
