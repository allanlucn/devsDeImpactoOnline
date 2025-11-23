"""
Script de exemplo para testar o sistema de feed personalizado.
"""
import sys
sys.path.append('.')

from db.config import get_db
from services.projeto_lei import ProjetoLeiService
from schemas.user import User


def test_personalized_feed():
    """Testa o feed personalizado para diferentes perfis de usuários."""
    
    db = next(get_db())
    
    print("=" * 80)
    print("TESTE DO SISTEMA DE FEED PERSONALIZADO")
    print("=" * 80)
    print()
    
    # Busca alguns usuários para teste
    users = db.query(User).limit(3).all()
    
    if not users:
        print("⚠️  Nenhum usuário encontrado no banco de dados.")
        print("    Cadastre usuários primeiro usando a API.")
        return
    
    for user in users:
        print(f"\n{'=' * 80}")
        print(f"USUÁRIO: {user.name} (ID: {user.id})")
        print(f"{'=' * 80}")
        print(f"📱 Telefone: {user.phone}")
        print(f"👤 Gênero: {user.gender}")
        print(f"🎨 Raça: {user.race}")
        print(f"💼 Trabalho: {user.job} ({user.job_label})")
        
        if hasattr(user, 'address') and user.address:
            print(f"📍 Localização: {user.address.city}/{user.address.state}")
        
        print(f"\n{'─' * 80}")
        print("FEED PERSONALIZADO:")
        print(f"{'─' * 80}")
        
        try:
            # Busca o feed personalizado
            feed = ProjetoLeiService.get_personalized_feed(db, user.id, limit=10)
            
            if not feed:
                print("📭 Nenhum projeto relevante encontrado para este perfil.")
                print("   Isso pode acontecer se:")
                print("   - Não há projetos de lei no banco de dados")
                print("   - Os projetos não têm tags ou conteúdo relevante")
                print("   - O score mínimo está muito alto")
            else:
                print(f"✅ {len(feed)} projetos relevantes encontrados:\n")
                
                for i, projeto in enumerate(feed, 1):
                    print(f"{i}. [{projeto.tipo} {projeto.numero}/{projeto.ano}]")
                    print(f"   Título: {projeto.titulo[:100]}..." if len(projeto.titulo or '') > 100 else f"   Título: {projeto.titulo}")
                    
                    # Mostra tags se existirem
                    if projeto.tags_ia:
                        tags = projeto.tags_ia
                        if isinstance(tags, dict):
                            tags = tags.get('tags', [])
                        if tags:
                            tags_str = ', '.join(tags[:5])  # Mostra até 5 tags
                            print(f"   🏷️  Tags: {tags_str}")
                    
                    print()
        
        except Exception as e:
            print(f"❌ Erro ao buscar feed: {e}")
    
    print(f"\n{'=' * 80}")
    print("Teste concluído!")
    print(f"{'=' * 80}")


def test_recommendation_topics():
    """Testa o mapeamento de tópicos para diferentes perfis."""
    from services.recommendation import RecommendationService
    
    print("\n" + "=" * 80)
    print("TESTE DE MAPEAMENTO DE TÓPICOS")
    print("=" * 80)
    
    # Perfis de teste
    test_profiles = [
        {
            'name': 'Maria - Mulher Negra Trabalhadora Formal (SP)',
            'gender': 'F',
            'race': 'preta',
            'job_label': 'formal',
            'state': 'SP'
        },
        {
            'name': 'João - Homem Indígena Estudante (AM)',
            'gender': 'M',
            'race': 'indígena',
            'job_label': 'estudante',
            'state': 'AM'
        },
        {
            'name': 'Alex - Não-binário Branco Desempregado (RJ)',
            'gender': 'O',
            'race': 'branca',
            'job_label': 'desempregado',
            'state': 'RJ'
        },
        {
            'name': 'Ana - Mulher Parda Aposentada (BA)',
            'gender': 'F',
            'race': 'parda',
            'job_label': 'aposentado',
            'state': 'BA'
        },
    ]
    
    for profile in test_profiles:
        print(f"\n{'─' * 80}")
        print(f"PERFIL: {profile['name']}")
        print(f"{'─' * 80}")
        
        topics = RecommendationService.get_user_relevant_topics(
            gender=profile['gender'],
            race=profile['race'],
            job_label=profile['job_label'],
            state=profile['state']
        )
        
        print(f"Total de tópicos relevantes: {len(topics)}")
        print(f"\nTópicos (primeiros 20):")
        
        # Agrupa por categoria para melhor visualização
        gender_topics = [t for t in topics if t in RecommendationService.GENDER_TOPICS.get(profile['gender'], [])]
        race_topics = [t for t in topics if t in RecommendationService.RACE_TOPICS.get(profile['race'].lower(), [])]
        job_topics = [t for t in topics if t in RecommendationService.JOB_TOPICS.get(profile['job_label'].lower(), [])]
        
        if gender_topics:
            print(f"  🚻 Gênero: {', '.join(gender_topics[:5])}")
        if race_topics:
            print(f"  🎨 Raça/Etnia: {', '.join(race_topics[:5])}")
        if job_topics:
            print(f"  💼 Trabalho: {', '.join(job_topics[:5])}")
        print(f"  🌍 Outros: {', '.join([t for t in topics if t not in gender_topics + race_topics + job_topics][:10])}")
    
    print(f"\n{'=' * 80}\n")


if __name__ == "__main__":
    print("\n🚀 Iniciando testes do sistema de feed personalizado...\n")
    
    # Testa mapeamento de tópicos
    test_recommendation_topics()
    
    # Testa feed personalizado
    test_personalized_feed()
    
    print("\n✨ Todos os testes concluídos!\n")
