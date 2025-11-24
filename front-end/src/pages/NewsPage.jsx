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
    loadReactions
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

  // Filter news to limit "Geral" category to 3 items
  const processedNews = React.useMemo(() => {
    let geralCount = 0;
    return newsItems.filter(news => {
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
  }, [newsItems]);

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
