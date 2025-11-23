import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/users";
import "../styles/onboarding.css";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      
      if (cleanPhone.length < 10) {
        throw new Error("Digite um número de telefone válido");
      }

      // Fazer login usando a API
      const userData = await loginUser(cleanPhone);

      // Salvar dados do usuário no localStorage
      const userProfile = {
        id: userData.id,
        name: userData.name,
        job: userData.job,
        gender: userData.gender === "F" ? "Mulher" : userData.gender === "M" ? "Homem" : "Outro",
        race: userData.race,
        phone: cleanPhone,
      };
      
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("userId", userData.id.toString());

      // Redirecionar para a página de notícias
      navigate("/news");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Entrar</h2>
          <p>Digite seu número de telefone para acessar</p>
        </div>

        <form onSubmit={handleLogin} className="modal-form">
          <div className="form-group">
            <label>WhatsApp (DDD + Número)</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading || phone.length < 8}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
