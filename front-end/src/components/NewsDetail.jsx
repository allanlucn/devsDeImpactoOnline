import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, ThumbsUp, ThumbsDown } from 'lucide-react';

const NewsDetail = ({ news, onBack, onAskAI, onAddComment, onLikeComment }) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(news.id, commentText);
    setCommentText('');
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-accent rounded-full text-muted-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-foreground truncate">Notícia</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* News Content */}
        <article className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight">
            {news.title}
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span className="font-medium text-primary">{news.source}</span>
            <span>|</span>
            <span>{news.date}</span>
          </div>

          <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-line">
            {news.content || news.summary}
          </div>
        </article>

        {/* AI Action */}
        <div className="mb-10 space-y-3">
          <button 
            onClick={() => onAskAI(news)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            Pergunte para o RadarCidadao
          </button>

          <button 
            onClick={() => navigate('/pressure', { state: { news } })}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
          >
            <ThumbsDown className="w-5 h-5" />
            Não Apoio
          </button>
        </div>

        {/* Comments Section */}
        <section>
          <h3 className="text-lg font-bold text-foreground mb-4">Comentários</h3>
          
          <div className="space-y-6 mb-8">
            {news.comments && news.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img 
                  src={comment.avatar || `https://ui-avatars.com/api/?name=${comment.user}&background=random`} 
                  alt={comment.user}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-bold text-foreground text-sm">{comment.user}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    {comment.text}
                  </p>
                  <button 
                    onClick={() => onLikeComment(news.id, comment.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      comment.likedByUser ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${comment.likedByUser ? 'fill-current' : ''}`} />
                    {comment.likes}
                  </button>
                </div>
              </div>
            ))}
            
            {(!news.comments || news.comments.length === 0) && (
              <p className="text-center text-muted-foreground py-4">Seja o primeiro a comentar!</p>
            )}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleSubmitComment} className="relative">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Adicione seu comentário..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default NewsDetail;
