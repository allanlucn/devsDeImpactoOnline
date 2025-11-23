import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import logoSvg from '../assets/svgs/card/vector-white.svg';

const ShareCardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const news = location.state?.news;
  const cardRef = useRef(null);

  const [cardText, setCardText] = useState({
    title: "MOTORISTAS EM ALERTA!",
    subtitle: "O PL 234 quer taxar nossas corridas. Vão mexer no nosso dinheiro. Eu já votei contra. Faça sua parte!"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const backgroundOptions = [
    { id: 1, name: 'Fogo', gradient: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)' },
    { id: 2, name: 'Natureza', gradient: 'linear-gradient(135deg, #51F43C 0%, #0F1B0E 100%)' },
    { id: 3, name: 'Oceano', gradient: 'linear-gradient(135deg, #3CEEF4 0%, #023132 100%)' },
    { id: 4, name: 'Noite', gradient: 'linear-gradient(135deg, #565656 0%, #000000 100%)' },
  ];

  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Gerar texto ao montar o componente
  useEffect(() => {
    generateCardText();
  }, []);

  const generateCardText = async () => {
    setIsGenerating(true);
    try {
      const storedProfile = localStorage.getItem("userProfile");
      const profile = storedProfile ? JSON.parse(storedProfile) : {};

      const response = await fetch("http://localhost:8000/agents/card-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newsContent: news?.content || news?.summary || news?.title || "",
          profile: {
            occupation: profile.occupation || profile.job || "trabalhador",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar texto do card");
      }

      const data = await response.json();
      setCardText({
        title: data.title,
        subtitle: data.subtitle,
      });
    } catch (error) {
      console.error("Erro ao gerar texto do card:", error);
      // Mantém texto padrão em caso de erro
    } finally {
      setIsGenerating(false);
    }
  };

  const changeBackground = (index) => {
    setCurrentBgIndex(index);
    setSelectedBackground(backgroundOptions[index]);
  };

  const nextBackground = () => {
    changeBackground((currentBgIndex + 1) % backgroundOptions.length);
  };

  const previousBackground = () => {
    changeBackground((currentBgIndex - 1 + backgroundOptions.length) % backgroundOptions.length);
  };

  const generateCanvas = async () => {
    if (!cardRef.current) return null;
    return await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: null,
    });
  };

  const downloadCard = async () => {
    const canvas = await generateCanvas();
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'protesto-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareCard = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'protesto-card.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Protesto Popular',
            text: 'Junte-se a essa causa!',
          });
        } catch (error) {
          console.log('Share cancelled or failed', error);
        }
      } else {
        downloadCard();
      }
    });
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
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-accent rounded-full text-muted-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Card Preview & Background Selector */}
        <section className="bg-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold mb-4 text-center">Alerte a Categoria</h2>
          
          <div 
            ref={cardRef}
            className="aspect-[9/16] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg mb-6"
            style={{ background: selectedBackground.gradient }}
          >
            {/* Loading State */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-20">
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Gerando mensagem...</p>
                </div>
              </div>
            )}
            
            {/* Text Content */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-black text-white leading-tight drop-shadow-lg mb-3">
                  {cardText.title}
                </h1>
                <p className="text-base font-semibold text-white/90 drop-shadow mb-4">
                  {cardText.subtitle}
                </p>
                
                {/* Logo */}
                <img 
                  src={logoSvg} 
                  alt="RadarCidadão" 
                  className="h-16"
                />
              </div>
              
              {/* Branding at bottom */}
              <div className="pb-4">
                <p className="text-xs font-bold text-white/90 text-center tracking-wide mt-1">
                  Acesse e participe!
                </p>
                <p className="text-xs font-bold text-white/80 text-center tracking-wider">
                  RadarCidadao
                </p>
              </div>
            </div>
          </div>

          {/* Background Selector */}
          <div>
            <h3 className="text-sm font-bold mb-3 text-center">Escolha o Fundo</h3>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={previousBackground}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Fundo anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-3">
                {backgroundOptions.map((bg, index) => (
                  <button
                    key={bg.id}
                    onClick={() => changeBackground(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentBgIndex === index ? 'bg-primary w-8' : 'bg-border hover:bg-muted-foreground'
                    }`}
                    aria-label={`Selecionar fundo ${bg.name}`}
                    title={bg.name}
                  />
                ))}
              </div>

              <button
                onClick={nextBackground}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Próximo fundo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-3">
          <button 
            onClick={downloadCard}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            Baixar
          </button>

          <button 
            onClick={shareCard}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </button>
        </section>
      </main>
    </div>
  );
};

export default ShareCardPage;
