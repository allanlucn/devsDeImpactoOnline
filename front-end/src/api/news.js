const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Agora';
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return formatDate(dateString);
};

const getCategoryFromTags = (tags) => {
  if (!tags) return 'Geral';
  
  const tagList = Array.isArray(tags) ? tags : (tags.tags || []);
  if (tagList.length === 0) return 'Geral';
  
  const categoryMap = {
    'economia': 'Economia',
    'saúde': 'Saúde',
    'educação': 'Educação',
    'trabalho': 'Trabalho',
    'meio ambiente': 'Meio Ambiente',
    'segurança': 'Segurança',
    'transporte': 'Transporte'
  };
  
  const firstTag = tagList[0].toLowerCase();
  return categoryMap[firstTag] || tagList[0];
};

export const fetchNewsApi = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/news/feed/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar notícias: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map(item => ({
      id: item.id,
      title: item.titulo || `${item.tipo} ${item.numero}/${item.ano}`,
      summary: item.resumo_ia || item.ementa?.substring(0, 150) + '...' || '',
      content: item.ementa || '',
      source: 'Câmara dos Deputados',
      date: formatDate(item.data_apresentacao),
      timestamp: getTimeAgo(item.data_apresentacao),
      category: getCategoryFromTags(item.tags_ia),
      likes: 0,
      likedByUser: false,
      comments: [],
      link_inteiro_teor: item.link_inteiro_teor,
      tipo: item.tipo,
      numero: item.numero,
      ano: item.ano
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
};

export const getCommentsApi = async (newsId, userId) => {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/comments/news/${newsId}`);
    if (userId) url.searchParams.append('user_id', userId);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar comentários: ${response.status}`);
    
    const data = await response.json();
    return data.map(comment => ({
      id: comment.id,
      user: `Usuário ${comment.user_id}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`,
      text: comment.content,
      likes: comment.likes_count,
      likedByUser: comment.user_has_liked,
      created_at: comment.created_at
    }));
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return [];
  }
};

export const addCommentApi = async (newsId, userId, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ news_id: newsId, user_id: userId, content })
    });
    
    if (!response.ok) throw new Error(`Erro ao adicionar comentário: ${response.status}`);
    
    const data = await response.json();
    return {
      id: data.id,
      user: `Usuário ${data.user_id}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user_id}`,
      text: data.content,
      likes: data.likes_count,
      likedByUser: data.user_has_liked,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw error;
  }
};

export const likeCommentApi = async (commentId, userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/reactions/comments/${commentId}/like?user_id=${userId}`,
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error(`Erro ao curtir comentário: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao curtir comentário:', error);
    throw error;
  }
};

export const getNewsReactionsApi = async (newsId, userId) => {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/reactions/news/${newsId}`);
    if (userId) url.searchParams.append('user_id', userId);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar reações: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar reações:', error);
    return { likes_count: 0, dislikes_count: 0, user_reaction: null };
  }
};

export const toggleNewsReactionApi = async (newsId, userId, reactionType) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/reactions/news/${newsId}/${reactionType}?user_id=${userId}`,
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error(`Erro ao reagir: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao reagir:', error);
    throw error;
  }
};
