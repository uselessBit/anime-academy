class BaseError(Exception):
    def __init__(self, message: str = ""):
        self.message = message
        super().__init__(message)

class AnimeReviewNotFoundError(BaseError):
    def __init__(self, message: str = "Anime review not found error"):
        super().__init__(message)