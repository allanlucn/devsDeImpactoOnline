from typing import List, Dict, Set, Optional


class RecommendationService:

    GENDER_TOPICS = {
        'F': [
            'mulher', 'maternidade', 'licença maternidade', 'violência doméstica',
            'feminicídio', 'igualdade de gênero', 'saúde da mulher', 'direitos reprodutivos',
            'creche', 'assédio', 'aborto', 'gestante'
        ],
        'M': [
            'paternidade', 'licença paternidade', 'homem', 'próstata'
        ],
        'O': [ 
            'identidade de gênero', 'lgbtqia+', 'transgênero', 'diversidade',
            'não-binário', 'discriminação'
        ]
    }
    
    RACE_TOPICS = {
        'branca': ['discriminação racial', 'igualdade racial'],
        'preta': [
            'racismo', 'discriminação racial', 'igualdade racial', 'cotas',
            'população negra', 'quilombola', 'afrodescendente', 'negritude'
        ],
        'parda': [
            'discriminação racial', 'igualdade racial', 'cotas', 'miscigenação'
        ],
        'amarela': [
            'discriminação racial', 'igualdade racial', 'asiático', 'imigração'
        ],
        'indígena': [
            'indígena', 'povos originários', 'terra indígena', 'demarcação',
            'quilombola', 'tradicional'
        ]
    }

    JOB_TOPICS = {

        'formal': [
            'clt', 'trabalhista', 'salário', 'férias', 'décimo terceiro',
            'fgts', 'previdência', 'aposentadoria', 'inss', 'direitos trabalhistas',
            'sindical', 'sindicato'
        ],

        'informal': [
            'microempreendedor', 'mei', 'autônomo', 'informal', 'empreendedorismo',
            'pequena empresa', 'trabalho informal', 'economia informal'
        ],

        'desempregado': [
            'seguro desemprego', 'emprego', 'desemprego', 'qualificação profissional',
            'curso profissionalizante', 'bolsa família', 'assistência social',
            'renda mínima', 'benefício social'
        ],

        'público': [
            'servidor público', 'funcionalismo', 'concurso público', 'estatutário',
            'regime jurídico único', 'rju'
        ],

        'aposentado': [
            'aposentadoria', 'pensão', 'inss', 'previdência', 'idoso',
            'terceira idade', 'benefício previdenciário'
        ],

        'estudante': [
            'educação', 'estudante', 'ensino', 'universidade', 'escola',
            'bolsa estudo', 'enem', 'vestibular', 'fies', 'prouni'
        ]
    }
    
    UNIVERSAL_TOPICS = [
        'saúde', 'sus', 'educação', 'segurança', 'transporte',
        'habitação', 'moradia', 'tributação', 'imposto', 'consumidor',
        'direitos humanos', 'meio ambiente', 'internet', 'privacidade',
        'dados pessoais', 'lgpd'
    ]
    
    STATE_TOPICS = {
        'SP': ['são paulo', 'sp', 'paulista', 'metrô', 'cptm'],
        'RJ': ['rio de janeiro', 'rj', 'carioca', 'fluminense'],
        'MG': ['minas gerais', 'mg', 'mineiro'],
        'RS': ['rio grande do sul', 'rs', 'gaúcho'],
        'BA': ['bahia', 'ba', 'baiano'],
        'PR': ['paraná', 'pr', 'paranaense'],
        'SC': ['santa catarina', 'sc', 'catarinense'],
        'PE': ['pernambuco', 'pe', 'pernambucano'],
        'CE': ['ceará', 'ce', 'cearense'],
        'PA': ['pará', 'pa', 'paraense'],
        'GO': ['goiás', 'go', 'goiano'],
        'MA': ['maranhão', 'ma', 'maranhense'],
        'ES': ['espírito santo', 'es', 'capixaba'],
        'PB': ['paraíba', 'pb', 'paraibano'],
        'AM': ['amazonas', 'am', 'amazonense'],
        'RN': ['rio grande do norte', 'rn', 'potiguar'],
        'MT': ['mato grosso', 'mt', 'mato-grossense'],
        'MS': ['mato grosso do sul', 'ms', 'sul-mato-grossense'],
        'DF': ['distrito federal', 'df', 'brasília', 'brasiliense'],
        'AL': ['alagoas', 'al', 'alagoano'],
        'PI': ['piauí', 'pi', 'piauiense'],
        'SE': ['sergipe', 'se', 'sergipano'],
        'RO': ['rondônia', 'ro', 'rondoniense'],
        'TO': ['tocantins', 'to', 'tocantinense'],
        'AC': ['acre', 'ac', 'acreano'],
        'AP': ['amapá', 'ap', 'amapaense'],
        'RR': ['roraima', 'rr', 'roraimense']
    }
    
    @classmethod
    def get_user_relevant_topics(
        cls,
        gender: str,
        race: str,
        job_label: str,
        state: Optional[str] = None
    ) -> List[str]:

        topics = set()
        
        topics.update(cls.UNIVERSAL_TOPICS)
        
        if gender in cls.GENDER_TOPICS:
            topics.update(cls.GENDER_TOPICS[gender])
        
        race_lower = race.lower() if race else ''
        if race_lower in cls.RACE_TOPICS:
            topics.update(cls.RACE_TOPICS[race_lower])
        
        job_label_lower = job_label.lower() if job_label else ''
        if job_label_lower in cls.JOB_TOPICS:
            topics.update(cls.JOB_TOPICS[job_label_lower])
        
        if state and state.upper() in cls.STATE_TOPICS:
            topics.update(cls.STATE_TOPICS[state.upper()])
        
        return list(topics)
    
    @classmethod
    def calculate_relevance_score(
        cls,
        projeto_tags: List[str],
        projeto_text: str,
        user_topics: List[str]
    ) -> float:

        score = 0.0
        
        projeto_text_lower = projeto_text.lower() if projeto_text else ''
        projeto_tags_lower = [tag.lower() for tag in (projeto_tags or [])]

        for topic in user_topics:
            topic_lower = topic.lower()
            if topic_lower in projeto_tags_lower:
                score += 3.0
        
        for topic in user_topics:
            topic_lower = topic.lower()
            occurrences = projeto_text_lower.count(topic_lower)
            score += min(occurrences, 5)
        
        return score
    
    @classmethod
    def filter_and_rank_projects(
        cls,
        projects: List,
        gender: str,
        race: str,
        job_label: str,
        state: Optional[str] = None,
        min_score: float = 0.5
    ) -> List:

        user_topics = cls.get_user_relevant_topics(gender, race, job_label, state)
        
        scored_projects = []
        for project in projects:
            text_parts = [
                project.titulo or '',
                project.ementa or '',
                project.resumo_ia or ''
            ]
            combined_text = ' '.join(text_parts)
            
            tags = []
            if project.tags_ia:
                if isinstance(project.tags_ia, dict):
                    tags = project.tags_ia.get('tags', [])
                elif isinstance(project.tags_ia, list):
                    tags = project.tags_ia
            
            score = cls.calculate_relevance_score(tags, combined_text, user_topics)
            
            if score >= min_score:
                scored_projects.append({
                    'project': project,
                    'score': score
                })
        
        scored_projects.sort(key=lambda x: x['score'], reverse=True)

        return [item['project'] for item in scored_projects]
