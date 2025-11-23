from typing import Dict


def build_system_message() -> str:
    return (
        "Você é um assistente que explica leis e decisões políticas em linguagem simples para cidadãos brasileiros. "
        "Responda SEMPRE em no máximo 2 parágrafos curtos, diretos e objetivos.\n\n"
        "Para cada proposta, informe brevemente:\n"
        "• O que é e o que muda na prática\n"
        "• Quem propôs e em que fase está\n"
        "• Principal benefício e principal risco\n"
        "• Como afeta o perfil do usuário especificamente\n\n"
        "IMPORTANTE:\n"
        "- Seja CONCISO: máximo 2 parágrafos\n"
        "- Use linguagem cotidiana, sem jargões\n"
        "- Seja imparcial: sem opinião política ou direcionamento de voto\n"
        "- Foque no impacto prático na vida da pessoa" 
    )



def build_user_message(text: str, profile: Dict[str, str]) -> str:
    """Gera o conteúdo da mensagem do usuário combinando texto e perfil.

    - `text`: texto legislativo ou transcrição
    - `profile`: dicionário simples com informações do usuário
    """
    profile_parts = []
    for k, v in (profile or {}).items():
        if v:
            profile_parts.append(f"{k}: {v}")
    profile_str = "; ".join(profile_parts)

    return f"Perfil: {profile_str}\n\nTexto:\n{text}"
