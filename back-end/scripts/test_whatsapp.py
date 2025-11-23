import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.whatsapp_service import WhatsAppService
from core.config import settings


async def test_connection():
    print("\n" + "="*80)
    print("TESTE DE CONEXAO WHATSAPP")
    print("="*80 + "\n")
    
    print(f"Instance ID: {settings.zapi_instance_id or '(nao configurado)'}")
    print(f"Token: {'*' * 20 if settings.zapi_token else '(nao configurado)'}")
    print(f"Client Token: {'*' * 20 if settings.zapi_client_token else '(nao configurado)'}\n")
    
    if not settings.zapi_instance_id or not settings.zapi_token or not settings.zapi_client_token:
        print("Z-API nao configurada!")
        print("Configure ZAPI_INSTANCE_ID, ZAPI_TOKEN e ZAPI_CLIENT_TOKEN no .env\n")
        return False
    
    print("Verificando status da instancia...\n")
    
    status = await WhatsAppService.check_instance_status()
    
    if status.get("success"):
        if status.get("connected"):
            print(f"WhatsApp CONECTADO!")
            print(f"Estado: {status.get('state')}")
        else:
            print(f"WhatsApp NAO CONECTADO")
            print(f"Estado: {status.get('state')}")
            print(f"Escaneie o QR Code na Z-API para conectar")
        print()
        return status.get("connected")
    else:
        print(f"Erro ao verificar status: {status.get('error')}\n")
        return False


async def test_send_message():
    test_phone = os.getenv("TEST_PHONE_NUMBER")
    
    if not test_phone:
        print("Numero de teste nao configurado")
        print("Configure TEST_PHONE_NUMBER no .env para testar envio de mensagem\n")
        return
    
    print("="*80)
    print("TESTE DE ENVIO DE MENSAGEM")
    print("="*80 + "\n")
    
    print(f"Numero de destino: {test_phone}")
    
    try:
        formatted = WhatsAppService.format_phone(test_phone)
        print(f"Numero formatado: {formatted}\n")
    except ValueError as e:
        print(f"Erro ao formatar telefone: {e}\n")
        return
    
    test_message = """*Teste de Notificacao*

Sistema de Notificacoes WhatsApp

Esta e uma mensagem de teste do sistema de notificacoes de projetos de lei.

Se voce recebeu esta mensagem, o sistema esta funcionando corretamente!"""
    
    print("Enviando mensagem de teste...\n")
    
    result = await WhatsAppService.send_text_message(
        phone="83981709739",
        text=test_message
    )
    
    if result.get("success"):
        if result.get("dry_run"):
            print("MODO DRY-RUN: Mensagem nao foi enviada (apenas simulacao)")
            print(f"Telefone: {result.get('phone')}")
        else:
            print("Mensagem enviada com sucesso!")
            print(f"Telefone: {result.get('phone')}")
        print()
    else:
        print(f"Erro ao enviar mensagem: {result.get('error')}\n")


async def test_format_notification():
    print("="*80)
    print("TESTE DE FORMATACAO DE MENSAGEM")
    print("="*80 + "\n")
    
    class MockProject:
        id = 123
        titulo = "Projeto de Lei sobre Licenca Maternidade Estendida para 180 dias"
        resumo_ia = "Este projeto estende a licenca maternidade de 120 para 180 dias para todas as trabalhadoras CLT, garantindo mais tempo de cuidado com o recem-nascido sem prejuizo ao salario."
        ementa = "Altera a CLT para estender licenca maternidade"
    
    projeto = MockProject()
    
    mensagem = WhatsAppService.format_notification(
        projeto=projeto,
        web_url="https://seuapp.com"
    )
    
    print("Mensagem formatada:")
    print("-" * 80)
    print(mensagem)
    print("-" * 80)
    print(f"\nTamanho: {len(mensagem)} caracteres (maximo: 300)\n")
    
    if len(mensagem) > 300:
        print("ATENCAO: Mensagem excede 300 caracteres!")
    else:
        print("Mensagem dentro do limite de caracteres")
    print()


async def main():
    print("\nIniciando testes do WhatsApp Z-API...\n")
    
    await test_format_notification()
    
    connected = await test_connection()
    
    if connected:
        await test_send_message()
    else:
        print("Pulando teste de envio (WhatsApp nao conectado)\n")
    
    print("="*80)
    print("Testes concluidos!")
    print("="*80 + "\n")
    
    if not connected:
        print("PROXIMOS PASSOS:")
        print("1. Verifique se possui uma conta Z-API ativa")
        print("2. Confirme que as credenciais no .env estao corretas")
        print("3. Escaneie o QR Code para conectar o WhatsApp")
        print("4. Execute este script novamente\n")


if __name__ == "__main__":
    asyncio.run(main())
