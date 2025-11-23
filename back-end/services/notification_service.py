from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from schemas.user import User
from schemas.projetos_lei import ProjetoLei
from services.recommendation import RecommendationService
from services.whatsapp_service import WhatsAppService
from core.config import settings


class NotificationService:

    @staticmethod
    def get_recent_projects(db: Session, since_datetime: datetime) -> List[ProjetoLei]:
        try:
            projects = db.query(ProjetoLei).filter(
                ProjetoLei.data_processamento.isnot(None)
            ).all()

            recent_projects = []
            for project in projects:
                try:
                    if isinstance(project.data_processamento, str):
                        project_date = datetime.fromisoformat(project.data_processamento.replace('Z', '+00:00'))
                    elif isinstance(project.data_processamento, datetime):
                        project_date = project.data_processamento
                    else:
                        continue

                    if project_date.replace(tzinfo=None) >= since_datetime.replace(tzinfo=None):
                        recent_projects.append(project)
                except Exception as e:
                    print(f"Erro ao processar data do projeto {project.id}: {e}")
                    continue
            
            return recent_projects
        except Exception as e:
            print(f"Erro ao buscar projetos recentes: {e}")
            return []
    
    @staticmethod
    def get_users_to_notify(db: Session) -> List[User]:
        try:
            users = db.query(User).filter(User.alert_urgent == True).all()
            return users
        except Exception as e:
            print(f"Erro ao buscar usuarios para notificar: {e}")
            return []
    
    @staticmethod
    def get_top_relevant_project(
        user: User,
        projects: List[ProjetoLei]
    ) -> Optional[ProjetoLei]:
        if not projects:
            return None
        
        try:
            state = None
            if hasattr(user, 'address') and user.address:
                state = user.address.state
        
            ranked_projects = RecommendationService.filter_and_rank_projects(
                projects=projects,
                gender=user.gender,
                race=user.race,
                job_label=user.job_label,
                state=state,
                min_score=settings.notification_min_score
            )

            return ranked_projects[0] if ranked_projects else None
        except Exception as e:
            print(f"Erro ao filtrar projeto relevante para usuario {user.id}: {e}")
            return None
    
    @staticmethod
    async def send_notifications_batch(
        db: Session,
        users: List[User],
        projects: List[ProjetoLei]
    ) -> Dict[str, Any]:
        
        stats = {
            "total_users": len(users),
            "notifications_sent": 0,
            "notifications_failed": 0,
            "users_without_relevant_projects": 0
        }
        
        for user in users:
            try:
                top_project = NotificationService.get_top_relevant_project(user, projects)
                
                if not top_project:
                    stats["users_without_relevant_projects"] += 1
                    print(f"Usuario {user.id} ({user.name}): Nenhum projeto relevante encontrado")
                    continue

                message = WhatsAppService.format_notification(
                    projeto=top_project,
                    web_url=settings.web_url
                )

                result = await WhatsAppService.send_text_message(
                    phone=user.phone,
                    text=message
                )
                
                if result.get("success"):
                    stats["notifications_sent"] += 1

                    user.last_notification_sent = datetime.utcnow()
                    db.commit()
                    
                    print(f"Notificacao enviada para {user.name} ({user.phone}) - Projeto: {top_project.tipo} {top_project.numero}/{top_project.ano}")
                else:
                    stats["notifications_failed"] += 1
                    print(f"Falha ao enviar para {user.name} ({user.phone}): {result.get('error')}")
                    
            except Exception as e:
                stats["notifications_failed"] += 1
                print(f"Erro ao processar notificacao para usuario {user.id}: {e}")
                import traceback
                print(traceback.format_exc())
                continue
        
        return stats
    
    @staticmethod
    async def send_notification_to_user(
        db: Session,
        user_id: int,
        projects: Optional[List[ProjetoLei]] = None
    ) -> Dict[str, Any]:
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {
                    "success": False,
                    "error": "Usuario nao encontrado"
                }

            if projects is None:
                since_time = datetime.utcnow() - timedelta(hours=24)
                projects = NotificationService.get_recent_projects(db, since_time)
            
            if not projects:
                return {
                    "success": False,
                    "error": "Nenhum projeto disponivel"
                }

            top_project = NotificationService.get_top_relevant_project(user, projects)
            
            if not top_project:
                return {
                    "success": False,
                    "error": "Nenhum projeto relevante encontrado para este usuario"
                }

            message = WhatsAppService.format_notification(
                projeto=top_project,
                web_url=settings.web_url
            )
            
            result = await WhatsAppService.send_text_message(
                phone=user.phone,
                text=message
            )
            
            if result.get("success"):

                user.last_notification_sent = datetime.utcnow()
                db.commit()
                
                return {
                    "success": True,
                    "user": user.name,
                    "phone": user.phone,
                    "project": f"{top_project.tipo} {top_project.numero}/{top_project.ano}",
                    "message": message,
                    "dry_run": result.get("dry_run", False)
                }
            else:
                return {
                    "success": False,
                    "error": result.get("error"),
                    "user": user.name
                }
                
        except Exception as e:
            print(f"Erro ao enviar notificacao para usuario {user_id}: {e}")
            import traceback
            print(traceback.format_exc())
            return {
                "success": False,
                "error": str(e)
            }
