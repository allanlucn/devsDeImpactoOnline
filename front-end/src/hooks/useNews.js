import { useState, useEffect } from 'react';
import { fetchNewsApi, likeNewsApi, likeCommentApi } from '../api/news';

export const useNews = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    fetchNewsApi().then(data => setNewsItems(data));
  }, []);

  const handleLikeNews = (id) => {
    // Optimistic update
    setNewsItems(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = item.likedByUser;
        return { 
          ...item, 
          likes: isLiked ? item.likes - 1 : item.likes + 1,
          likedByUser: !isLiked
        };
      }
      return item;
    }));
    likeNewsApi(id);
  };

  const handleLikeComment = (newsId, commentId) => {
    // Optimistic update
    setNewsItems(prev => prev.map(item => {
      if (item.id !== newsId) return item;
      return {
        ...item,
        comments: item.comments.map(c => {
          if (c.id === commentId) {
            const isLiked = c.likedByUser;
            return { 
              ...c, 
              likes: isLiked ? c.likes - 1 : c.likes + 1,
              likedByUser: !isLiked
            };
          }
          return c;
        }).sort((a, b) => b.likes - a.likes)
      };
    }));
    likeCommentApi(newsId, commentId);
  };

  return {
    newsItems,
    handleLikeNews,
    handleLikeComment
  };
};
