import { useState, useEffect } from 'react';
import { 
  fetchNewsApi, 
  getCommentsApi, 
  addCommentApi, 
  likeCommentApi,
  getNewsReactionsApi,
  toggleNewsReactionApi 
} from '../api/news';

export const useNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const userProfile = JSON.parse(storedProfile);
      if (userProfile.id) {
        setUserId(userProfile.id);
        fetchNewsApi(userProfile.id).then(data => setNewsItems(data));
      }
    }
  }, []);

  const loadComments = async (newsId) => {
    if (!userId) return;
    
    const comments = await getCommentsApi(newsId, userId);
    setNewsItems(prev => prev.map(item => 
      item.id === newsId ? { ...item, comments } : item
    ));
  };

  const loadReactions = async (newsId) => {
    if (!userId) return;
    
    const reactions = await getNewsReactionsApi(newsId, userId);
    setNewsItems(prev => prev.map(item => 
      item.id === newsId ? { 
        ...item, 
        likes: reactions.likes_count,
        dislikes: reactions.dislikes_count,
        userReaction: reactions.user_reaction
      } : item
    ));
  };

  const handleLikeNews = async (newsId) => {
    if (!userId) return;
    
    try {
      const result = await toggleNewsReactionApi(newsId, userId, 'like');
      setNewsItems(prev => prev.map(item => 
        item.id === newsId ? {
          ...item,
          likes: result.stats.likes_count,
          dislikes: result.stats.dislikes_count,
          userReaction: result.stats.user_reaction
        } : item
      ));
    } catch (error) {
      console.error('Erro ao curtir notícia:', error);
    }
  };

  const handleDislikeNews = async (newsId) => {
    if (!userId) return;
    
    try {
      const result = await toggleNewsReactionApi(newsId, userId, 'dislike');
      setNewsItems(prev => prev.map(item => 
        item.id === newsId ? {
          ...item,
          likes: result.stats.likes_count,
          dislikes: result.stats.dislikes_count,
          userReaction: result.stats.user_reaction
        } : item
      ));
    } catch (error) {
      console.error('Erro ao descurtir notícia:', error);
    }
  };

  const handleLikeComment = async (newsId, commentId) => {
    if (!userId) return;
    
    try {
      await likeCommentApi(commentId, userId);
      await loadComments(newsId);
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    }
  };

  const handleAddComment = async (newsId, text) => {
    if (!userId || !text.trim()) return;
    
    try {
      await addCommentApi(newsId, userId, text);
      await loadComments(newsId);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return {
    newsItems,
    handleLikeNews,
    handleDislikeNews,
    handleLikeComment,
    handleAddComment,
    loadComments,
    loadReactions
  };
};
