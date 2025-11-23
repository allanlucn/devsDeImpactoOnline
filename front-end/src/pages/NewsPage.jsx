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

  const handleAskAI = (news) => {
    navigate('/chat', { state: { context: news } });
  };

  const handleSelectNews = async (news) => {
    setSelectedNews(news);
    await loadComments(news.id);
    await loadReactions(news.id);
  };

  const activeNews = selectedNews ? newsItems.find(n => n.id === selectedNews.id) : null;

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
        {newsItems.map((news) => (
          <NewsCard 
            key={news.id} 
            news={news} 
            onClick={handleSelectNews}
          />
        ))}
      </main>
    </div>
  );
};

export default NewsPage;
