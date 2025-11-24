import React from 'react';
import { Sparkles } from 'lucide-react';

const NewsCard = ({ news, onClick }) => {
  // Helper to get tag styling based on tag type
  const getTagStyle = (tag) => {
    const tagStyles = {
      'app': {
        bgColor: 'bg-purple-500',
        textColor: 'text-white',
        label: 'APP'
      },
      'autonomo': {
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        label: 'Autônomo'
      },
      'mei': {
        bgColor: 'bg-indigo-500',
        textColor: 'text-white',
        label: 'MEI'
      },
      'geral': {
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
        label: 'Geral'
      },
      'clt': {
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        label: 'CLT'
      },
      'estudante': {
        bgColor: 'bg-cyan-500',
        textColor: 'text-white',
        label: 'Estudante'
      },
      'mulher': {
        bgColor: 'bg-pink-500',
        textColor: 'text-white',
        label: 'Mulher'
      },
      'homem': {
        bgColor: 'bg-blue-600',
        textColor: 'text-white',
        label: 'Homem'
      },
      'funcpublico': {
        bgColor: 'bg-amber-500',
        textColor: 'text-white',
        label: 'Func. Público'
      }
    };
    
    return tagStyles[tag] || {
      bgColor: 'bg-gray-400',
      textColor: 'text-white',
      label: tag
    };
  };

  const tagStyle = getTagStyle(news.category?.toLowerCase() || '');

  return (
    <div 
      onClick={() => onClick && onClick(news)}
      className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagStyle.bgColor} ${tagStyle.textColor}`}>
          {tagStyle.label}
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
