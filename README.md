# RadarCidadão 🏛️

> **O Congresso fala difícil. A gente traduz.**

RadarCidadão é uma plataforma que democratiza o acesso à informação legislativa brasileira. Usando inteligência artificial e um design intuitivo, transformamos projetos de lei complexos em informações claras, objetivas e personalizadas para cada cidadão.

E mais: aqui você tem voz ativa.
Comente, opine, compartilhe e crie seus próprios posts explicativos para levar o debate às redes. A IA te ajuda a transformar suas ideias em conteúdo pronto para publicar.

E não para por aí: os comentários mais curtidos da comunidade são sintetizados pela IA e podem até virar propostas reais no e-Cidadania, amplificando a participação popular no processo legislativo.

---

## 🎯 O que faz

- **💬 Chat com IA**: Pergunte sobre leis em linguagem simples e receba respostas claras e contextualizadas
- **📰 Feed Personalizado**: Acompanhe projetos de lei relevantes para seu perfil (profissão, região, gênero, raça)
- **🎯 Filtragem Inteligente**: Sistema de recomendação baseado em tags e perfil do usuário
- **🔔 Alertas Urgentes**: Notificações via WhatsApp sobre leis que podem impactar seu trabalho
- **🗣️ Sem Juridiquês**: Traduz termos técnicos para linguagem acessível
- **📊 Cards de Compartilhamento**: Gere cards personalizados para mobilização social

---

## 🛠️ Tecnologias

### Frontend
- **React 19** - Biblioteca UI moderna
- **Vite** - Build tool rápido
- **React** - Navegação SPA
- **TailwindCSS** - Framework CSS utility-first
- **Lucide React** - Ícones
- **html2canvas** - Geração de imagens de cards
- **Radix UI** - Componentes acessíveis

### Backend
- **FastAPI** - Framework web Python de alta performance
- **SQLAlchemy 2.0** - ORM para PostgreSQL
- **Pydantic** - Validação de dados
- **PostgreSQL** - Banco de dados relacional
- **APScheduler** - Agendamento de tarefas (notificações)
- **Uvicorn** - Servidor ASGI

### Inteligência Artificial
- **Groq API** - LLM de alta velocidade (GPT-OSS-120B)
- **Whisper** - Transcrição de áudio
- **Sistema de Recomendação** - Filtragem baseada em perfil e tags

### Integrações
- **WhatsApp Web.js** - Notificações via WhatsApp
- **API Dados Abertos Câmara** - Fonte de dados legislativos

##  Prototipação

- **[Figma](https://www.figma.com/design/jsHts5PYL1yiXTIcSichpr/PROJETO?node-id=201-418&t=2t7P4E95u8O3zUm9-1)**
---

##  Documentação

- **[Diagrama](https://excalidraw.com/#room=9f2fa5f96ab0dabb8148,eo59Vw1gSkO0uFg2te8y3Q)**
---
## 🚀 Como Rodar

### Pré-requisitos

- **Node.js** 20+ e npm
- **Python** 3.12+
- **PostgreSQL** 14+
- **Conta Groq** ([groq.com](https://groq.com)) para obter API key

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/devsDeImpactoOnline.git
cd devsDeImpactoOnline
```

### 2. Configurar Backend

```bash
cd back-end

# Criar ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione suas credenciais:
# - GROQ_API_KEY
# - DATABASE_URL
# - GROQ_CHAT_URL
# - GROQ_WHISPER_URL

# Inicializar banco de dados
python init_db.py

# Rodar servidor
uvicorn main:app --reload
```

O backend estará disponível em `http://localhost:8000`

### 3. Configurar Frontend

```bash
cd front-end

# Instalar dependências
npm install

# Configurar variáveis de ambiente (opcional)
# Crie um arquivo .env com:
# VITE_API_BASE_URL=http://localhost:8000

# Rodar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 4. Acessar a Aplicação

1. Abra `http://localhost:5173` no navegador
2. Complete o onboarding (cadastro de perfil)
3. Explore o feed personalizado de projetos de lei
4. Converse com a IA sobre legislação

---

## 📱 Funcionalidades Principais

### 1. Onboarding Personalizado
Coleta informações do usuário para personalizar a experiência:
- Nome e dados demográficos (gênero, raça)
- Profissão e categoria (MEI, CLT, informal, etc.)
- Estado e CEP
- Interesses (saúde, educação, transporte, etc.)
- Configuração de alertas urgentes

### 2. Feed de Projetos de Lei
- **Filtragem inteligente** por perfil do usuário
- **Sistema de score** baseado em relevância (tags + conteúdo)
- **Categorização automática** via IA
- **Detalhes completos** de cada projeto (ementa, resumo IA, análise jurídica)

### 3. Chat com IA
- **Perguntas em linguagem natural** sobre qualquer lei
- **Contexto personalizado** baseado no perfil
- **Busca na web** para informações atualizadas
- **Histórico de conversas** salvo localmente

### 4. Sistema de Pressão Popular
- **Análise de impacto** de projetos de lei
- **Geração de cards** para compartilhamento em redes sociais
- **Títulos e subtítulos** gerados por IA
- **Múltiplos templates** de fundo

### 5. Notificações WhatsApp
- **Alertas automáticos** quando novos projetos relevantes são publicados
- **Filtragem por tags** do perfil do usuário
- **Mensagens personalizadas** com resumo e link

---

## 🗂️ Estrutura do Projeto

```
devsDeImpactoOnline/
├── back-end/
│   ├── agents/              # Módulo de IA (Groq, prompts)
│   │   ├── gpt_client.py
│   │   ├── groq_client.py
│   │   ├── whisper_client.py
│   │   ├── card_prompt.py
│   │   └── pressure_prompt.py
│   ├── api/v1/routes/       # Endpoints da API
│   │   ├── news.py          # Feed de projetos
│   │   ├── agents_routes.py # IA e chat
│   │   └── users.py         # Usuários
│   ├── models/              # Modelos Pydantic
│   ├── schemas/             # Schemas SQLAlchemy
│   ├── services/            # Lógica de negócio
│   │   ├── projeto_lei.py
│   │   ├── recommendation.py
│   │   └── notification_service.py
│   ├── db/                  # Configuração do banco
│   ├── jobs/                # Tarefas agendadas
│   └── main.py              # Entrada da aplicação
│
├── front-end/
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── OnboardingPage.jsx
│   │   │   ├── NewsPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── PressurePage.jsx
│   │   │   ├── ShareCardPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── api/             # Clients da API
│   │   ├── hooks/           # Custom hooks
│   │   └── styles/          # Estilos CSS
│   └── package.json
│
└── README.md
```

---

## 🔐 Obtendo API Keys

### Groq API (IA)

1. Acesse [console.groq.com/keys](https://console.groq.com/keys)
2. Faça login com sua conta (ou crie uma nova)
3. Clique em **"Create API Key"**
4. Dê um nome para sua chave (ex: "RadarCidadao")
5. Copie a chave gerada (você não poderá vê-la novamente!)
6. Cole no arquivo `.env` do backend:
   ```bash
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
   ```

### WhatsApp (Z-API) - Para Notificações

1. **Criar conta**
   - Acesse [app.z-api.io](https://app.z-api.io/)
   - Crie sua conta gratuitamente

2. **Criar instância**
   - No painel, vá em **"Instâncias Web"**
   - Clique em **"Meu Número"**
   - Conecte seu WhatsApp escaneando o QR Code

3. **Obter credenciais da instância**
   - Copie o **ID da Instância** → `ZAPI_INSTANCE_ID`
   - Copie o **Token da Instância** → `ZAPI_TOKEN`

4. **Obter token de segurança**
   - Vá em **"Segurança"** no menu lateral
   - Clique em **"Configurar Token de Segurança da Conta"**
   - Copie o **ID** → `ZAPI_CLIENT_TOKEN`

5. **Adicionar ao .env**
   ```bash
   ZAPI_INSTANCE_ID=seu_instance_id_aqui
   ZAPI_TOKEN=seu_token_aqui
   ZAPI_CLIENT_TOKEN=seu_client_token_aqui
   ```


---

## 🔑 Variáveis de Ambiente

### Backend (.env)

```bash
# Groq API
GROQ_API_KEY=your_groq_api_key_here
GROQ_CHAT_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_WHISPER_URL=https://api.groq.com/openai/v1/audio/transcriptions
GROQ_GPT_MODEL=openai/gpt-oss-120b
GROQ_WHISPER_MODEL=whisper-large-v3

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/radarcidadao

# Outros
GROQ_TRANSCRIBE_TIMEOUT=60
```

### Frontend (.env - opcional)

```bash
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📊 Banco de Dados

### Principais Tabelas

- **users** - Dados dos usuários
- **address** - Endereços (CEP, estado, cidade)
- **projetos_lei** - Projetos de lei da Câmara
- **comments** - Comentários em projetos
- **reactions** - Likes/dislikes em projetos e comentários

### Relacionamentos

- User 1:1 Address
- ProjetoLei 1:N Comments
- ProjetoLei 1:N Reactions
- Comment 1:N Reactions

---

## 🤖 Sistema de Recomendação

O sistema filtra e ranqueia projetos de lei baseado em:

### Tópicos por Perfil

- **Profissão** (job_label): MEI, CLT, informal, público, aposentado, estudante
- **Gênero**: mulher, homem, outro
- **Raça**: branca, preta, parda, indígena, amarela
- **Estado**: SP, RJ, MG, etc.

### Cálculo de Score

- **Tags IA** (tags_ia): +3 pontos por tag correspondente
- **Conteúdo textual**: +1 ponto por ocorrência de tópico relevante
- **Mínimo**: score ≥ 0.5 para aparecer no feed

### Exemplo

Usuário: MEI, mulher, SP
- Projeto com tags `["mei", "empreendedorismo", "mulher"]` → score alto
- Projeto sobre "licença maternidade" → score médio
- Projeto sobre "agricultura" → score baixo (não aparece)

---

## 🧪 Testes

### Backend

```bash
cd back-end

# Testar endpoint de feed
curl http://localhost:8000/api/v1/news/feed/1

# Testar chat com IA
curl -X POST http://localhost:8000/agents/simplify \
  -H "Content-Type: application/json" \
  -d '{"text": "O que é o PL 1234/2024?"}'

# Testar geração de card
curl -X POST http://localhost:8000/agents/card-text \
  -H "Content-Type: application/json" \
  -d '{"newsContent": "Câmara aprova PL que taxa apps", "profile": {"occupation": "motorista"}}'
```

### Frontend

```bash
cd front-end
npm run build  # Verificar se build funciona
npm run preview  # Testar build de produção
```

---

## 🚧 Roadmap

- [ ] Implementar sistema de likes/comentários completo
- [ ] Adicionar paginação infinita no feed
- [ ] Cache de projetos no localStorage
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Notificações push web
- [ ] Integração com redes sociais
- [ ] Dashboard de estatísticas
- [ ] Testes automatizados (Jest, Pytest)

---

## 👥 Equipe

Desenvolvido durante o **[Hackathon Devs de Impacto Online](https://devsdeimpacto.imasters.com.br/)** por:

- **[Eduardo Henrique](https://www.linkedin.com/in/henriquebjj/)** - IA
- **[Uilames de Assis](https://www.linkedin.com/in/uilames/)** - Dados
- **[Allan Lucena](https://www.linkedin.com/in/allanlucn/)** - Front-end
- **[Marcio Regio](https://www.linkedin.com/in/marciooregio/)** - UX/UI Designer
- **[Lauro Stephan](https://www.linkedin.com/in/lauro-stephan-b4449124b/)** - Backend

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - uma licença de código aberto permissiva que permite:

✅ Uso comercial  
✅ Modificação  
✅ Distribuição  
✅ Uso privado  

A única exigência é manter o aviso de copyright e a licença em todas as cópias ou partes substanciais do software.

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

- **Email**: radarcidadao83@gmail.com
- **Instagram**: [@radarcidadao83](https://instagram.com/radarcidadao83)

---

## 🙏 Agradecimentos

- **Groq** - Por fornecer acesso à API de IA
- **Câmara dos Deputados** - Pela API de dados abertos
- **Devs de Impacto** - Pela organização do hackathon
- **Comunidade Open Source** - Pelas bibliotecas incríveis

---

<div align="center">

**RadarCidadão** - Democracia baseada em dados 🏛️

</div>
