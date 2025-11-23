"""
Rotas de gerenciamento de notificações WhatsApp.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime

from db.config import get_db
from services.notification_service import NotificationService
from services.whatsapp_service import WhatsAppService
from schemas.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/test/{user_id}", response_model=Dict[str, Any])
async def test_notification(
    user_id: int,
    db: Session = Depends(get_db)
):
    result = await NotificationService.send_notification_to_user(
        db=db,
        user_id=user_id,
        projects=None 
    )
    
    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Erro ao enviar notificação")
        )
    
    return {
        "success": True,
        "message": "Notificação enviada com sucesso",
        "data": result
    }


@router.get("/status", response_model=Dict[str, Any])
async def get_notification_status(db: Session = Depends(get_db)):

    whatsapp_status = await WhatsAppService.check_instance_status()
    
    users_with_alerts = db.query(User).filter(User.alert_urgent == True).count()
    
    from main import notification_scheduler
    
    next_run = None
    scheduler_running = False
    
    if notification_scheduler:
        scheduler_running = notification_scheduler.running
        job = notification_scheduler.get_job('send_notifications')
        if job:
            next_run = job.next_run_time.isoformat() if job.next_run_time else None
    
    return {
        "whatsapp": {
            "connected": whatsapp_status.get("connected", False),
            "state": whatsapp_status.get("state", "unknown"),
            "configured": bool(whatsapp_status.get("success"))
        },
        "scheduler": {
            "running": scheduler_running,
            "next_execution": next_run,
            "schedule": "6h30, 12h30, 19h30 (Horário de Brasília)"
        },
        "users": {
            "total_with_alerts": users_with_alerts
        },
        "config": {
            "min_score": 5.0,
            "dry_run_mode": False 
        }
    }
