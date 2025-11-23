// URL do back-end (ajuste conforme necessário)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Cria um novo usuário no sistema
 * @param {Object} userData - Dados do usuário
 * @param {string} userData.name - Nome do usuário
 * @param {string} userData.phone - Telefone do usuário (apenas números)
 * @param {string} userData.gender - Gênero (M/F/O)
 * @param {string} userData.race - Raça/Etnia
 * @param {string} userData.job - Profissão específica
 * @param {string} userData.job_label - Categoria da profissão
 * @param {string} userData.zipcode - CEP (8 dígitos, apenas números)
 * @returns {Promise<Object>} Dados do usuário criado
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Erro ao criar usuário: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

/**
 * Busca um usuário por ID
 * @param {number} userId - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Erro ao buscar usuário: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

/**
 * Login do usuário via telefone
 * @param {string} phone - Telefone do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export const loginUser = async (phone) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/login?user_phone=${encodeURIComponent(
        phone
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Erro ao fazer login: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};
