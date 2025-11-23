from typing import Dict


def build_card_system_message() -> str:
    """Constrói a mensagem do sistema para geração de conteúdo de cards."""
    return (
        "Você é um especialista em mobilização social e comunicação direta. "
        "Seu objetivo é criar mensagens impactantes para cards de protesto.\n\n"
        "RESPONDA SEMPRE EM FORMATO JSON:\n"
        '{"title": "TÍTULO CURTO EM CAPS", "subtitle": "Subtítulo explicativo direto"}\n\n'
        "REGRAS:\n"
        "- TÍTULO: Máximo 5 palavras, CAIXA ALTA, chamativo, não use emojis\n"
        "- SUBTÍTULO: Máximo 2 linhas, linguagem simples, explique o impacto direto\n"
        "- Seja alarmista se houver risco real ao trabalhador\n"
        "- Use tom de urgência e mobilização\n"
        "- Evite termos técnicos ou números de projetos de lei"
    )


def build_card_user_message(news_content: str, profile: Dict[str, str]) -> str:
    """Constrói a mensagem do usuário com o conteúdo da notícia e perfil.
    
    Args:
        news_content: Conteúdo da notícia a ser transformado em card
        profile: Dicionário com informações do perfil do usuário (occupation, etc)
    
    Returns:
        Mensagem formatada para o modelo
    """
    occupation = profile.get("occupation", "trabalhador")
    
    return (
        f"Público-alvo: {occupation}\n\n"
        f"Conteúdo da notícia:\n{news_content}\n\n"
        "Gere um card de protesto impactante em JSON."
    )
