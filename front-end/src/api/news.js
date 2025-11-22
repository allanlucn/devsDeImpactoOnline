// Placeholder for FastAPI integration

export const fetchNewsApi = async () => {
  // TODO: Replace with actual API call
  return [
    {
      id: 1,
      title: 'Nova tecnologia de IA revolucionária',
      summary: 'Uma nova IA promete mudar a forma como interagimos com computadores.',
      likes: 120,
      likedByUser: false,
      comments: [
        { id: 101, user: 'User1', text: 'Incrível!', likes: 10, likedByUser: false },
        { id: 102, user: 'User2', text: 'Quero testar.', likes: 5, likedByUser: false }
      ]
    },
    {
      id: 2,
      title: 'Avanços na medicina',
      summary: 'Cientistas descobrem cura para doença rara.',
      likes: 85,
      likedByUser: false,
      comments: [
        { id: 103, user: 'User3', text: 'Ótima notícia.', likes: 20, likedByUser: false }
      ]
    }
  ];

};

export const likeNewsApi = async (id) => {
  // TODO: Replace with actual API call
};

export const likeCommentApi = async (newsId, commentId) => {
  // TODO: Replace with actual API call
};
