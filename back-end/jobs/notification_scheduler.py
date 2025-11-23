import asyncio
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from db.config import SessionLocal
from services.notification_service import NotificationService


BRAZIL_TZ = ZoneInfo("America/Sao_Paulo")


def send_scheduled_notifications():

    print(f"\n{'='*80}")
    print(f"Iniciando envio de notificações agendadas - {datetime.now(BRAZIL_TZ).strftime('%d/%m/%Y %H:%M:%S')}")
    print(f"{'='*80}\n")
    
    db = SessionLocal()
    
    try:
        users = NotificationService.get_users_to_notify(db)
        
        if not users:
            print("Nenhum usuário com alertas ativos encontrado.")
            return
        
        print(f"👥 {len(users)} usuário(s) com alertas ativos")
        

        since_time = datetime.utcnow() - timedelta(hours=8)
        
        last_notifications = [u.last_notification_sent for u in users if u.last_notification_sent]
        if last_notifications:
            oldest_notification = min(last_notifications)
            since_time = min(since_time, oldest_notification)
        
        print(f"Buscando projetos desde: {since_time.strftime('%d/%m/%Y %H:%M:%S')}")
        
        projects = NotificationService.get_recent_projects(db, since_time)
        
        if not projects:
            print("Nenhum projeto novo encontrado no período.")
            return
        
        print(f"{len(projects)} projeto(s) novo(s) encontrado(s)")
        print(f"\n{'─'*80}")
        print("Enviando notificações...\n")
        
        stats = asyncio.run(
            NotificationService.send_notifications_batch(db, users, projects)
        )
        
        print(f"\n{'─'*80}")
        print("ESTATÍSTICAS DO ENVIO:")
        print(f"Total de usuários: {stats['total_users']}")
        print(f"Notificações enviadas: {stats['notifications_sent']}")
        print(f"Falhas no envio: {stats['notifications_failed']}")
        print(f"Sem projetos relevantes: {stats['users_without_relevant_projects']}")
        print(f"{'─'*80}\n")
        
    except Exception as e:
        print(f"Erro ao executar job de notificações: {e}")
        import traceback
        print(traceback.format_exc())
    finally:
        db.close()
    
    print(f"{'='*80}")
    print(f"Envio de notificações concluído - {datetime.now(BRAZIL_TZ).strftime('%d/%m/%Y %H:%M:%S')}")
    print(f"{'='*80}\n")


def start_notification_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone=BRAZIL_TZ)
    
    trigger = CronTrigger(
        hour='6,12,19',
        minute='30',
        timezone=BRAZIL_TZ
    )
    
    scheduler.add_job(
        send_scheduled_notifications,
        trigger=trigger,
        id='send_notifications',
        name='Envio de Notificações WhatsApp',
        replace_existing=True
    )
    
    scheduler.start()
    
    job = scheduler.get_job('send_notifications')
    if job:
        next_run = job.next_run_time
        print(f"Scheduler de notificações iniciado!")
        print(f"Próxima execução: {next_run.strftime('%d/%m/%Y às %H:%M:%S')}")
        print(f"Horários configurados: 6h30, 12h30 e 19h30 (Horário de Brasília)")
    
    return scheduler


def stop_notification_scheduler(scheduler: BackgroundScheduler):
    if scheduler:
        scheduler.shutdown()
        print("Scheduler de notificações parado")
