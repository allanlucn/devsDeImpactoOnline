# RadarCidadão 🏛️

> O Congresso fala difícil. A gente traduz.

RadarCidadão é uma plataforma que simplifica o acesso à informação legislativa brasileira. Converse com uma IA sobre leis, acompanhe notícias do Congresso e entenda como as decisões políticas afetam sua vida.

[placeholder imagem hero - interface principal]

## 🎯 O que faz

- **Chat com IA**: Pergunte sobre leis em linguagem simples e receba respostas claras
- **Feed de Notícias**: Acompanhe atualizações do Congresso Nacional em tempo real
- **Contexto Personalizado**: Informações adaptadas ao seu perfil (profissão, região, idade)
- **Sem Juridiquês**: Traduz termos técnicos para linguagem acessível

[placeholder imagem chat - exemplo de conversa com IA]

## 🛠️ Tecnologias

### Frontend

- **React 18** + **Vite** - Interface moderna e responsiva
- **TailwindCSS** - Estilização com design system
- **React Router** - Navegação

### Backend

- **FastAPI** - API REST de alta performance
- **Python 3.12** - Lógica de negócio
- **PostgreSQL** - Armazenamento de dados
- **Groq API** - IA para processamento de linguagem natural

[placeholder imagem arquitetura - diagrama de componentes]

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- Python 3.12+
- PostgreSQL
- Conta Groq (para API key)

### Frontend

```bash
cd front-end
npm install
npm run dev
```

### Backend

```bash
cd back-end
cp .env.example .env
# Configure seu GROQ_API_KEY no arquivo .env
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📱 Funcionalidades

### Onboarding Personalizado

Coletamos informações básicas para personalizar sua experiência.

[placeholder imagem onboarding - telas do fluxo]

### Feed de Notícias

Notícias do Congresso com opção de perguntar à IA sobre cada uma.

[placeholder imagem feed - lista de notícias]

### Perfil do Usuário

Gerencie suas preferências e veja seu histórico de interações.

[placeholder imagem perfil - tela de configurações]

## 👥 Equipe

Desenvolvido durante o hackathon Devs de Impacto Online.


**RadarCidadão** - Democracia baseada em dados.
