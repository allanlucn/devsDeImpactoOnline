const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export const sendMessageToApi = async (message) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: Date.now() + 1,
      sender: 'bot',
      text: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
    };
  }
};
