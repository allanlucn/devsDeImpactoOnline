import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewsPage.css';
import { useNews } from '../hooks/useNews';
import NewsHeader from '../components/NewsHeader';
import NewsCard from '../components/NewsCard';
import NewsDetail from '../components/NewsDetail';
import Sidebar from '../components/Sidebar';

const NewsPage = () => {
  const navigate = useNavigate();
  const { 
    newsItems, 
    handleAddComment, 
    handleLikeComment, 
    handleLikeNews,
    handleDislikeNews,
    loadComments,
    loadReactions,
    userProfile
  } = useNews();
  const [selectedNews, setSelectedNews] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const handleAskAI = (news) => {
    navigate('/chat', { state: { context: news } });
  };

  const handleSelectNews = async (news) => {
    setSelectedNews(news);
    await loadComments(news.id);
    await loadReactions(news.id);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Filter news to limit "Geral" category to 15 items and prioritize ID 489 for app users
  const processedNews = React.useMemo(() => {
    let newsList = [...newsItems];
    let prioritizedNews = null;

    // Hardcode news ID 489 for ALL users (temporary fix)
    // Remove existing ID 489 if present to avoid duplicates
    const index = newsList.findIndex(n => n.id == 489);
    if (index !== -1) {
      newsList.splice(index, 1);
    }

    // Hardcode the news item at the top
    prioritizedNews = {
      id: 489,
      title: "Lei do Combustível do Futuro (Lei 14.993/2024)",
      summary: "A lei trata de: estabelece marco para a mobilidade sustentável de baixo carbono, aumenta a participação de biocombustíveis e cria programas de combustível sustentável de aviação, diesel verde, biometano e captura e estocagem de CO₂, bem como permite elevar o percentual obrigatório de etanol na gasolina, o que pode alterar desempenho e consumo dos veículos.",
      content: "Estabelece marco para a mobilidade sustentável de baixo carbono, aumentando a participação de biocombustíveis e criando programas de combustível sustentável de aviação, diesel verde, biometano e captura e estocagem de CO₂, além de autorizar o aumento gradual da mistura de etanol anidro na gasolina.",
      source: 'Câmara dos Deputados',
      date: '08 de outubro de 2024',
      timestamp: 'Recentemente',
      category: 'app',
      likes: 0,
      likedByUser: false,
      comments: [],
      link_inteiro_teor: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14993.htm",
      tipo: "LEI",
      numero: "14993",
      ano: "2024"
    };

    let geralCount = 0;
    const filtered = newsList.filter(news => {
      const isGeral = news.category?.toLowerCase() === 'geral';
      if (isGeral) {
        if (geralCount < 15) {
          geralCount++;
          return true;
        }
        return false;
      }
      return true;
    });

    if (prioritizedNews) {
      return [prioritizedNews, ...filtered];
    }

    return filtered;
  }, [newsItems, userProfile]);

  const activeNews = selectedNews ? newsItems.find(n => n.id === selectedNews.id) : null;
  const visibleNews = processedNews.slice(0, visibleCount);

  if (activeNews) {
    return (
      <NewsDetail 
        news={activeNews}
        onBack={() => setSelectedNews(null)}
        onAskAI={handleAskAI}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onLikeNews={handleLikeNews}
        onDislikeNews={handleDislikeNews}
      />
    );
  }

  return (
    <div className="news-page-wrapper bg-background min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NewsHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="p-4 max-w-md mx-auto">
        {visibleNews.map((news) => (
          <NewsCard 
            key={news.id} 
            news={news} 
            onClick={handleSelectNews}
          />
        ))}

        {visibleCount < processedNews.length && (
          <button 
            onClick={handleLoadMore}
            className="w-full py-3 mt-4 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
          >
            Carregar mais notícias
          </button>
        )}
      </main>
    </div>
  );
};

export default NewsPage;
