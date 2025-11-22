import React from 'react';
import { Sparkles } from 'lucide-react';

const NewsCard = ({ news, onClick }) => {
  // Helper to determine tag color based on category
  const getTagColor = (category) => {
    const colors = {
      'Trabalho': 'bg-primary/10 text-primary',
      'Meio Ambiente': 'bg-green-100 text-green-700',
      'Saúde': 'bg-teal-100 text-teal-700',
      'Economia': 'bg-primary/10 text-primary', // Using primary as default/similar to image
      'Política': 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div 
      onClick={() => onClick && onClick(news)}
      className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(news.category)}`}>
          {news.category}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {news.timestamp || 'Recentemente'}
        </span>
      </div>

      <h3 className="text-base font-bold text-card-foreground leading-snug">
        {news.title}
      </h3>
    </div>
  );
};

export default NewsCard;
