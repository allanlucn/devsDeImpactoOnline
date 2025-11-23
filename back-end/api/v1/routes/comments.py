from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.config import get_db
from models.comment import CommentCreate, CommentUpdate, CommentResponse
from services.comment import CommentService

router = APIRouter(prefix="/comments", tags=["comments"])


@router.get("/news/{news_id}", response_model=List[CommentResponse])
def get_comments_by_news(
    news_id: int,
    user_id: int = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    return CommentService.get_comments_by_news(db, news_id, user_id, skip, limit)


@router.get("/{comment_id}", response_model=CommentResponse)
def get_comment(
    comment_id: int,
    user_id: int = Query(None),
    db: Session = Depends(get_db)
):
    return CommentService.get_comment_by_id(db, comment_id, user_id)


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment_data: CommentCreate,
    db: Session = Depends(get_db)
):
    comment = CommentService.create_comment(db, comment_data)
    return CommentService.get_comment_by_id(db, comment.id, comment_data.user_id)


@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    comment = CommentService.update_comment(db, comment_id, user_id, comment_data)
    return CommentService.get_comment_by_id(db, comment.id, user_id)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    CommentService.delete_comment(db, comment_id, user_id)
    return None
