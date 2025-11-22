// URL do back-end (ajuste conforme necessário)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const sendMessageToApi = async (message, profile = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        profile: profile, // Perfil do usuário (opcional)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      id: Date.now() + 1,
      sender: "bot",
      text:
        data.response ||
        data.text ||
        "Desculpe, não consegui processar sua mensagem.",
    };
  } catch (error) {
    console.error("Error calling chat API:", error);
    return {
      id: Date.now() + 1,
      sender: "bot",
      text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
    };
  }
};
