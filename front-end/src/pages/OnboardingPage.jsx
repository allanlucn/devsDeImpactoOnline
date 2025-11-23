import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";
import { ThemeToggle } from "../components/ThemeToggle";
import { createUser } from "../api/users";
import LoginModal from "../components/LoginModal";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    occupation: "",
    occupationDetail: "",
    firstName: "",
    gender: "",
    race: "",
    state: "",
    alertUrgent: false,
    phone: "",
    zipcode: "",
  });
  const [error, setError] = useState("");

  const totalSteps = 3;

  const occupations = [
    { label: "Trabalhador de app", icon: "📱", subtitle: "Uber/Ifood" },
    { label: "Funcionário Público", icon: "🏛️", subtitle: "Policial, Professor" },
    { label: "Autônomo", icon: "🔧", subtitle: "Pedreiro, Vendedor" },
    { label: "CLT", icon: "💼", subtitle: "Estoquista, Enfermeiro(a)" },
    { label: "Estudante", icon: "🎓", subtitle: "Bolsista, Pesquisador" },
    { label: "MEI", icon: "🏪", subtitle: "Freelancer, Empresário" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOccupationSelect = (occupation) => {
    setFormData((prev) => ({ ...prev, occupation }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setLoadingMessage("Salvando suas preferências...");

    try {
      // Mapeia o gênero para o formato esperado pela API (M/F/O)
      const genderMap = {
        "Mulher": "F",
        "Homem": "M",
        "Outro": "O"
      };

      // Remove caracteres não numéricos do telefone
      const cleanPhone = formData.phone.replace(/\D/g, "");
      
      // Remove caracteres não numéricos do CEP
      const cleanZipcode = formData.zipcode.replace(/\D/g, "");

      // Valida se o CEP tem 8 dígitos
      if (cleanZipcode.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos");
      }

      const userData = {
        name: formData.firstName,
        phone: cleanPhone,
        gender: genderMap[formData.gender] || "O",
        race: formData.race,
        job: formData.occupationDetail || formData.occupation,
        job_label: formData.occupation,
        zipcode: cleanZipcode,
        alert_urgent: formData.alertUrgent,
      };

      console.log(userData)

      setLoadingMessage("Criando seu perfil...");
      
      // Envia os dados para o backend
      const createdUser = await createUser(userData);

      // Salva no localStorage para uso no chat
      const userProfile = {
        id: createdUser.id,
        name: formData.firstName,
        job: formData.occupationDetail || formData.occupation,
        gender: formData.gender,
        race: formData.race,
        state: formData.state,
        phone: cleanPhone,
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("userId", createdUser.id.toString());

      setLoadingMessage("Configurando seu radar...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoadingMessage("Tudo pronto!");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      navigate("/news");
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      setError(err.message || "Erro ao salvar suas informações. Tente novamente.");
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  const progressPercent = (step / totalSteps) * 100;

  // Render Steps
  const renderStep1 = () => (
    <div className="onboarding-content">
      <div className="step-header">
        <h2>Qual é o seu corre?</h2>
        <p className="step-description">
          Para a IA filtrar apenas o alertas que afetam a sua vida.
        </p>
      </div>

      <div className="options-grid">
        {occupations.map((opt) => (
          <button
            key={opt.label}
            className={`option-card ${
              formData.occupation === opt.label ? "selected" : ""
            }`}
            onClick={() => handleOccupationSelect(opt.label)}
          >
            <span className="option-icon">{opt.icon}</span>
            <span className="option-label">{opt.label}</span>
            {opt.subtitle && (
              <span className="option-subtitle">{opt.subtitle}</span>
            )}
          </button>
        ))}
      </div>

      {formData.occupation && (
        <div className="occupation-detail-wrapper">
          <div className="form-group">
            <label>Especifique sua função ou atividade</label>
            <input
              type="text"
              name="occupationDetail"
              placeholder={`Ex: ${occupations.find(o => o.label === formData.occupation)?.subtitle?.split(", ")[0] || "Sua função específica"}`}
              value={formData.occupationDetail}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="onboarding-content">
      <div className="step-header">
        <h2>Quem é você?</h2>
        <p className="step-description">
          Leis podem mudar dependendo de quem você é e onde mora.
        </p>
      </div>

      <div className="form-grid-2col">
        <div className="form-group full-width">
          <label>Como você quer ser chamado?</label>
          <input
            type="text"
            name="firstName"
            placeholder="Seu primeiro nome"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Gênero</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Selecione...</option>
            <option value="Mulher">Mulher</option>
            <option value="Homem">Homem</option>
            <option value="Outro">Outro / Prefiro não responder</option>
          </select>
        </div>

        <div className="form-group">
          <label>Raça/Cor</label>
          <select
            name="race"
            value={formData.race}
            onChange={handleInputChange}
          >
            <option value="">Selecione...</option>
            <option value="Branca">Branca</option>
            <option value="Negra/Parda">Negra/Parda</option>
            <option value="Indígena">Indígena</option>
            <option value="Amarela">Amarela</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Onde você mora? (Estado/UF)</label>
        <select
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione um estado</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="onboarding-content">
      <div className="step-header">
        <h2>Ativar Radar</h2>
        <p className="step-description">
          Último passo para ativar sua proteção.
        </p>
      </div>

      <div className="checkbox-group vertical">
        <label
          className={`checkbox-card ${formData.alertUrgent ? "selected" : ""}`}
        >
          <input
            type="checkbox"
            name="alertUrgent"
            checked={formData.alertUrgent}
            onChange={handleInputChange}
          />
          <div className="text">
            <strong>Alertas Urgentes</strong>
            <span>
              Quando tiver lei que pode ferrar ou ajudar seu trabalho.
            </span>
          </div>
        </label>

        <label
          className={`checkbox-card ${formData.alertPolls ? "selected" : ""}`}
        >
          <input
            type="checkbox"
            name="alertPolls"
            checked={formData.alertPolls}
            onChange={handleInputChange}
          />
          <div className="text">
            <strong>Enquetes Rápidas</strong>
            <span>Responda e ganhe pontos na comunidade.</span>
          </div>
        </label>
      </div>

      <div className="form-group">
        <label>Seu WhatsApp (DDD + Número)</label>
        <input
          type="tel"
          name="phone"
          placeholder="(11) 99999-9999"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>CEP (Código de Endereçamento Postal)</label>
        <input
          type="text"
          name="zipcode"
          placeholder="12345-678"
          value={formData.zipcode}
          onChange={handleInputChange}
          maxLength="9"
          required
        />
      </div>
    </div>
  );

  if (isSubmitting) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="spinner"></div>
          <h3>Processando...</h3>
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <header className="onboarding-header">
          <div className="header-top">
            <button
              className="btn-back-icon"
              onClick={prevStep}
              title="Voltar"
              style={{ visibility: step > 1 ? "visible" : "hidden" }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button 
                className="btn-login" 
                onClick={() => setShowLoginModal(true)}
                title="Já tem cadastro? Faça login"
              >
                Entrar
              </button>
              <ThemeToggle />
            </div>
            <div className="step-indicator">
              Passo {step} de {totalSteps}
            </div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </header>

        <main>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </main>

        <div className="onboarding-actions">
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
              {error}
            </div>
          )}
          {step < 3 ? (
            <button 
              className="btn-primary" 
              onClick={nextStep}
              disabled={
                (step === 1 && !formData.occupation) ||
                (step === 2 && !formData.state)
              }
            >
              Continuar &gt;
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!formData.state || !formData.phone || formData.phone.length < 8 || !formData.zipcode || formData.zipcode.replace(/\D/g, "").length !== 8}
            >
              Ativar Radar agora
            </button>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default OnboardingPage;
