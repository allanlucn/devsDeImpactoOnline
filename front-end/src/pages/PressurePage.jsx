import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle, FileText, Activity, Info, ThumbsDown, Flame, Bot } from 'lucide-react';

const PressurePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const news = location.state?.news;
  
  const [activeTab, setActiveTab] = useState('detalhes');
  const [pressureCount, setPressureCount] = useState(1240);
  const [hasPressed, setHasPressed] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchPressureSummary = async () => {
    setLoadingSummary(true);
    try {
      const storedProfile = localStorage.getItem('userProfile');
      const profile = storedProfile ? JSON.parse(storedProfile) : {};

      const response = await fetch('http://localhost:8000/agents/pressure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: news.content || news.summary || news.title,
          profile: profile
        }),
      });

      if (!response.ok) throw new Error('Falha ao gerar resumo');
      
      const data = await response.json();
      setAiSummary(data.text);
    } catch (error) {
      console.error("Erro ao buscar resumo de pressão:", error);
      setAiSummary("Não foi possível gerar o resumo de impacto no momento.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handlePressure = () => {
    if (!hasPressed) {
      setPressureCount(prev => prev + 1);
      setHasPressed(true);
    }
  };

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>Notícia não encontrada. Volte e tente novamente.</p>
        <button onClick={() => navigate('/news')} className="ml-2 text-primary underline">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => navigate('/news')}
          className="p-2 -ml-2 hover:bg-accent rounded-full text-muted-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-foreground truncate">Pressão Popular</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Title Section */}
        <section>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight mb-3">
            {news.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> Em Andamento
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
              <ThumbsDown className="w-3 h-3" /> Ameaça o Bolso
            </span>
          </div>
        </section>

        {/* Pressure Thermometer Card */}
        <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Termômetro da Pressão</h2>
          
          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((pressureCount / 2000) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-orange-600 font-bold">
              <Flame className="w-5 h-5 fill-current" />
              <span>{pressureCount.toLocaleString()} pressões hoje</span>
            </div>
            <div className="flex -space-x-2">
              <img src="https://ui-avatars.com/api/?name=Ana&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
              <img src="https://ui-avatars.com/api/?name=Bob&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
              <img src="https://ui-avatars.com/api/?name=Carol&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                +99
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
              <Bot className="w-4 h-4" />
              Resumo por IA
            </div>
            
            {!aiSummary && !loadingSummary && (
              <button 
                onClick={fetchPressureSummary}
                className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Gerar Análise de Impacto
              </button>
            )}

            {loadingSummary && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                Analisando impacto financeiro e riscos...
              </div>
            )}

            {aiSummary && (
              <div className="text-sm text-foreground/90 leading-relaxed prose prose-sm max-w-none animate-in fade-in duration-500">
                <div dangerouslySetInnerHTML={{ __html: aiSummary?.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
              </div>
            )}
          </div>

          <button 
            onClick={handlePressure}
            disabled={hasPressed}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mb-3 ${
              hasPressed 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <Flame className={`w-5 h-5 ${hasPressed ? '' : 'animate-pulse'}`} />
            {hasPressed ? 'Pressão Realizada!' : 'Fazer Pressão Agora'}
          </button>

          {hasPressed && (
            <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <MessageCircle className="w-5 h-5" />
              Compartilhe no WhatsApp
            </button>
          )}
        </section>

        {/* Tabs Section */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex border-b border-border">
            {['Detalhes', 'Tramitação', 'Documentos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors relative ${
                  activeTab === tab.toLowerCase() 
                    ? 'text-primary font-bold' 
                    : 'text-muted-foreground hover:bg-accent/50'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
          
          <div className="p-5">
            {activeTab === 'detalhes' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Autor</p>
                    <p className="font-semibold text-foreground">{news.source || "Dep. João da Silva"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Data da Proposta</p>
                    <p className="font-semibold text-foreground">{news.date || "15 de Março, 2025"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Situação Atual</p>
                    <p className="font-semibold text-foreground">Aguardando Parecer da Comissão</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tramitação' && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Histórico de tramitação indisponível no momento.
              </div>
            )}
            {activeTab === 'documentos' && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum documento anexado.
              </div>
            )}
          </div>
        </section>

        {/* Share & Pressure Footer */}
        <section className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold mb-2">Compartilhe e pressione!</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Sua voz faz a diferença. Convide mais pessoas para esta causa.
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PressurePage;
