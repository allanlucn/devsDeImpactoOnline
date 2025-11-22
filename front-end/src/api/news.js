// Placeholder for FastAPI integration

export const fetchNewsApi = async () => {
  // TODO: Replace with actual API call
  return [
    {
      id: 1,
      title: 'Governo Anuncia Novas Diretrizes para Política Fiscal',
      summary: 'O governo federal detalhou hoje as novas diretrizes para a política fiscal do país.',
      content: `O governo federal detalhou hoje as novas diretrizes para a política fiscal do país, visando maior controle dos gastos públicos e a estabilização da dívida. As medidas incluem a revisão de incentivos fiscais e um novo arcabouço para o controle das despesas, que substituirá o teto de gastos.

A equipe econômica projeta que, com as novas regras, será possível alcançar um superávit primário já no próximo ano, contribuindo para a melhoria da confiança dos investidores e a redução dos juros a longo prazo. O projeto de lei será encaminhado ao Congresso Nacional na próxima semana, onde se espera um debate intenso entre os parlamentares sobre os impactos e a eficácia das propostas.`,
      source: 'Fonte da Notícia',
      date: '24 de Julho, 2024',
      timestamp: 'Há 2 horas',
      category: 'Trabalho', // Using 'Trabalho' to match the blue color in the image for now, or could be 'Economia'
      likes: 120,
      likedByUser: false,
      comments: [
        { 
          id: 101, 
          user: 'Carlos S.', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
          text: 'Medidas importantes, mas a execução será o grande desafio. Espero que o Congresso colabore.', 
          likes: 10, 
          likedByUser: false 
        },
        { 
          id: 102, 
          user: 'Ana Lúcia', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
          text: 'Estou cética quanto ao superávit já no próximo ano. Parece uma meta otimista demais.', 
          likes: 5, 
          likedByUser: false 
        }
      ]
    },
    {
      id: 2,
      title: 'Câmara aprova projeto que afrouxa regras para uso de agrotóxicos no país',
      summary: 'Projeto polêmico foi aprovado na noite de ontem.',
      content: 'A Câmara dos Deputados aprovou o projeto de lei que altera as regras para fiscalização e uso de agrotóxicos. A medida gera polêmica entre ambientalistas e o setor do agronegócio...',
      source: 'Jornal Nacional',
      date: '23 de Julho, 2024',
      timestamp: 'Há 12 horas',
      category: 'Meio Ambiente',
      likes: 85,
      likedByUser: false,
      comments: [
        { 
          id: 103, 
          user: 'Roberto M.', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
          text: 'Preocupante para a saúde pública.', 
          likes: 20, 
          likedByUser: false 
        }
      ]
    },
    {
      id: 3,
      title: 'Comissão de Saúde debate a implementação do piso salarial da enfermagem',
      summary: 'Debate foca em fontes de custeio para o piso.',
      content: 'A Comissão de Saúde realizou hoje uma audiência pública para discutir as fontes de financiamento para o piso salarial da enfermagem...',
      source: 'Agência Câmara',
      date: '23 de Julho, 2024',
      timestamp: 'Ontem',
      category: 'Saúde',
      likes: 240,
      likedByUser: false,
      comments: []
    }
  ];

};

export const likeNewsApi = async (id) => {
  // TODO: Replace with actual API call
};

export const likeCommentApi = async (newsId, commentId) => {
  // TODO: Replace with actual API call
};
