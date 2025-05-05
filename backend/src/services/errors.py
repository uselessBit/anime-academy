class BaseError(Exception):
    def __init__(self, message: str = ""):
        self.message = message
        super().__init__(message)


class AnimeReviewNotFoundError(BaseError):
    def __init__(self, message: str = "Anime rating not found error"):
        super().__init__(message)


class AnimeNotFoundError(BaseError):
    def __init__(self, message: str = "Anime not found error"):
        super().__init__(message)


class CommentNotFoundError(BaseError):
    def __init__(self, message: str = "Comment not found error"):
        super().__init__(message)


class KeyAlreadyExistsError(BaseError):
    def __init__(self, name: str, message: str = "Name '{}' already exists"):
        formatted_message = message.format(name)
        super().__init__(formatted_message)
        self.name = name
