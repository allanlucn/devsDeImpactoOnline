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

export const likeNewsApi = async (id) => {
  return { success: true };
};

export const likeCommentApi = async (newsId, commentId) => {
  return { success: true };
};
