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
  const { newsItems, handleAddComment, handleLikeComment } = useNews();
  const [selectedNews, setSelectedNews] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handler for the "Perguntar p/ IA" button inside the detail view
  const handleAskAI = (news) => {
    navigate('/chat', { state: { context: news } });
  };

  // Derive the active news item from the main state to ensure updates (likes, comments) are reflected
  const activeNews = selectedNews ? newsItems.find(n => n.id === selectedNews.id) : null;

  if (activeNews) {
    return (
      <NewsDetail 
        news={activeNews}
        onBack={() => setSelectedNews(null)}
        onAskAI={handleAskAI}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
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
            onClick={setSelectedNews}
          />
        ))}
      </main>
    </div>
  );
};

export default NewsPage;
