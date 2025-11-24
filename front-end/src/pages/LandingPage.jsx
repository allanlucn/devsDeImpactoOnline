import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { MessageSquare, Scale, DollarSign, Send, Sparkles } from "lucide-react";
import heroPhone from "../assets/phoneimg.png";
import logo from "../assets/logo.png";
import "../styles/LandingPage.css";
import { ThemeToggle } from "../components/ThemeToggle";
import LoginModal from "../components/LoginModal";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <img src={logo} alt="RadarCidadao" className="logo-image" />
              <span className="logo-text">RadarCidadao</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => setShowLoginModal(true)}>Entrar</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">
                O Congresso fala difícil. A gente traduz.
              </h1>
              <p className="hero-description">
                Seu assistente legislativo pessoal. Pergunte sobre leis, monitore seus direitos e participe das decisões que afetam você.
              </p>
              <div className="hero-cta">
                <Button size="lg" className="cta-button" onClick={() => navigate("/onboarding")}>
                  Participe
                </Button>
                <p className="hero-note">
                  100% Gratuito - Sem cadastro complexo.
                </p>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <img 
                  src={heroPhone} 
                  alt="Interface do aplicativo mostrando chat legislativo" 
                  className="hero-phone"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Você não tem tempo de ler o Diário Oficial.
            </h2>
            <p className="section-description">
              Entender o cenário político é complexo. Nós simplificamos para você.
            </p>
          </div>
          <div className="features-grid">
            <Card className="feature-card">
              <CardContent className="feature-content">
                <div className="feature-icon">
                  <MessageSquare className="icon" />
                </div>
                <h3 className="feature-title">O Ruído</h3>
                <p className="feature-description">
                  Milhares de notícias e discussões acontecem todos os dias, tornando impossível acompanhar tudo.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="feature-content">
                <div className="feature-icon">
                  <Scale className="icon" />
                </div>
                <h3 className="feature-title">O Juridiquês</h3>
                <p className="feature-description">
                  Leis são escritas em uma linguagem técnica e de difícil acesso para o Cidadão comum.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="feature-content">
                <div className="feature-icon">
                  <DollarSign className="icon" />
                </div>
                <h3 className="feature-title">O Prejuízo</h3>
                <p className="feature-description">
                  Não entender uma nova lei pode resultar em perda de direitos e impactos financeiros inesperados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="chat-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Pergunte.
            </h2>
            <p className="section-description">
              Nossa IA lê todas as atualizações em tempo real e responde às suas perguntas.
            </p>
          </div>
          <Card className="chat-card">
            <CardContent className="chat-content">
              <div className="chat-messages">
                <div className="message message-user">
                  <p>Como a nova lei de motoristas de app me afeta?</p>
                </div>
                <div className="message message-bot">
                  <p>
                    A Lei 14.297/2024, sancionada em 15/11, cria direitos para quem trabalha em aplicativos de transporte. Você terá direito a: ✓ Contribuir para o INSS (aposentadoria), ✓ Seguro em caso de acidente durante corridas, ✓ Transparência nos valores pagos pelos passageiros. A lei entra em vigor em 90 dias.
                  </p>
                </div>
                <div className="message message-user">
                  <p>Algo mudou sobre auxílio-doença hoje?</p>
                </div>
                <div className="message message-bot">
                  <p>Sim! O Congresso aprovou hoje (20/11) o fim da carência de 12 meses para auxílio-doença em casos de doenças graves. Se você tiver câncer, HIV ou outras doenças listadas na lei, pode solicitar o benefício imediatamente após a contribuição ao INSS. Aguarda sanção presidencial.</p>
                </div>
              </div>
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Digite sua pergunta aqui..."
                  className="chat-input"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="container">
          <div className="news-grid">
            <div className="news-content">
              <h2 className="section-title">
                Notícias com contexto, não apenas manchetes.
              </h2>
              <p className="news-description">
                Leu algo no feed e não entendeu? Clique no botão "Perguntar para a IA" e receba uma explicação instantânea sobre aquela notícia específica. Sem fake news, direto da fonte oficial.
              </p>
            </div>
            <div className="news-card-wrapper">
              <Card className="news-card">
                <CardContent className="news-card-content">
                  <div className="news-badge">
                    📰 Notícia • 2 horas atrás
                  </div>
                  <h3 className="news-title">
                    Câmara aprova Novo Arcabouço Fiscal com 372 votos favoráveis
                  </h3>
                  <p className="news-excerpt">
                    O projeto que estabelece novas regras para o controle de gastos públicos foi aprovado na noite de terça-feira pela Câmara dos Deputados. A proposta segue agora para sanção presidencial e pode impactar políticas sociais nos próximos anos.
                  </p>
                  <Button variant="outline" className="news-button" onClick={() => navigate("/onboarding")}>
                    <Sparkles className="h-4 w-4" />
                    Perguntar para a IA
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="stats-title">
            Democracia baseada em dados.
          </h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">Milhares</div>
              <div className="stat-label">de Leis Indexadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24h/7</div>
              <div className="stat-label">Monitoramento em Tempo Real</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Baseado em Dados Oficiais</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section py-20 bg-white dark:bg-background">
        <div className="container">
          <div className="section-header mb-12">
            <h2 className="section-title text-3xl font-bold text-center mb-4 text-foreground">
              Sua voz importa. Participe do debate.
            </h2>
            <p className="section-description text-center text-muted-foreground max-w-2xl mx-auto">
              Não seja apenas um espectador. Comente, curta e dê upvote nas opiniões que representam você. Influencie o debate sobre as leis que afetam sua vida.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="community-card p-6 bg-card border-border">
              <CardContent className="flex flex-col items-center text-center p-0">
                <div className="mb-4 p-3 bg-primary/10 rounded-full text-primary">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Comente</h3>
                <p className="text-muted-foreground">
                  Compartilhe sua perspectiva sobre projetos de lei e veja o que outros cidadãos pensam.
                </p>
              </CardContent>
            </Card>
            <Card className="community-card p-6 bg-card border-border">
              <CardContent className="flex flex-col items-center text-center p-0">
                <div className="mb-4 p-3 bg-primary/10 rounded-full text-primary">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Engaje</h3>
                <p className="text-muted-foreground">
                  Dê likes e interaja com a comunidade. Construa uma reputação de cidadão ativo.
                </p>
              </CardContent>
            </Card>
            <Card className="community-card p-6 bg-card border-border">
              <CardContent className="flex flex-col items-center text-center p-0">
                <div className="mb-4 p-3 bg-primary/10 rounded-full text-primary">
                  <Scale className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Impacte</h3>
                <p className="text-muted-foreground">
                  Seu engajamento ajuda a destacar os temas mais importantes para a sociedade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Assuma o controle dos seus direitos.
            </h2>
            <Button size="lg" className="cta-button" onClick={() => navigate("/onboarding")}>
              Abrir Radar Cidadão
            </Button>
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default LandingPage;
