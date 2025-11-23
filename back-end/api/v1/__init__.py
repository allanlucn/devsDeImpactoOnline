from fastapi import APIRouter
from .routes.users import router as user_router
from .routes.chat import router as chat_router
from .routes.news import router as news_router
from .routes.notifications import router as notification_router
from .routes.comments import router as comment_router
from .routes.reactions import router as reaction_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(user_router)
api_router.include_router(chat_router)
api_router.include_router(news_router)
api_router.include_router(notification_router)
api_router.include_router(comment_router)
api_router.include_router(reaction_router)





