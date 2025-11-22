import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Form Data State
  const [formData, setFormData] = useState({
    occupation: "",
    gender: "",
    race: "",
    isLgbtq: false,
    isSingleParent: false,
    state: "",
    alertUrgent: false,
    alertPolls: false,
    phone: "",
  });

  const totalSteps = 3;

  const occupations = [
    { label: "Entregador de app", icon: "🛵", subtitle: "Moto/Bike" },
    { label: "Motorista de app", icon: "🚗", subtitle: "Uber, 99" },
    { label: "Construção civil", icon: "👷", subtitle: "Pedreiro, Servente" },
    { label: "Comércio", icon: "🛍️", subtitle: "Vendedor, Caixa" },
    { label: "Saúde", icon: "⚕️", subtitle: "Enfermagem, Cuidador" },
    { label: "Estudante", icon: "🎓", subtitle: "Bolsista, Uni" },
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
    setLoadingMessage("Salvando suas preferências...");

    const userProfile = {
      job: formData.job,
      gender: formData.gender,
      race: formData.race,
      state: formData.state,
    };

    // Salva no localStorage para uso no chat
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // Simulate API call
    setTimeout(() => {
      setLoadingMessage("Configurando seu radar...");
      setTimeout(() => {
        setLoadingMessage("Tudo pronto!");
        setTimeout(() => {
          // Here we would send data to backend
          // await api.post('/onboarding', finalData);
          navigate("/chat");
        }, 1000);
      }, 1500);
    }, 1500);
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

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isLgbtq"
            checked={formData.isLgbtq}
            onChange={handleInputChange}
          />
          Sou LGBTQIA+
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isSingleParent"
            checked={formData.isSingleParent}
            onChange={handleInputChange}
          />
          Sou Pai/Mãe solo
        </label>
      </div>

      <div className="form-group">
        <label>Onde você mora? (Estado/UF)</label>
        <input
          type="text"
          name="state"
          placeholder="Ex: SP, RJ, MG..."
          value={formData.state}
          onChange={handleInputChange}
          maxLength={2}
          className="input-uppercase"
        />
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
          {step < 3 ? (
            <button className="btn-primary" onClick={nextStep}>
              Continuar &gt;
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!formData.phone || formData.phone.length < 8}
            >
              Ativar Radar agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
