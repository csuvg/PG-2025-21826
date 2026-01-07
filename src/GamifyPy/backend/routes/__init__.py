from .auth import router as auth_router
from .user import router as user_router
from .category_level import router as category_level_router
from .lessons import router as lessons_router
from .questions import router as questions_router
from .insignias import router as insignias_router

__all__ = [
    "auth_router",
    "user_router",
    "category_level_router",
    "lessons_router",
    "questions_router",
    "insignias_router"
]
