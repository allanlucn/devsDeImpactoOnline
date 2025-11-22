import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const interests = [
    "Saúde", "Educação", "Transporte", 
    "Segurança Pública", "Meio Ambiente"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Perfil</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="p-4 max-w-md mx-auto space-y-8">
        {/* Account Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Conta</h2>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-xl transition-colors border border-border">
              <span className="font-medium">Editar Perfil</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-xl transition-colors border border-border">
              <span className="font-medium">Alterar Senha</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Interests Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">Meus Interesses</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span 
                key={interest}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* Feedbacks Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Feedbacks</h2>
          <button 
            onClick={() => navigate('/feedbacks')}
            className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-xl transition-colors border border-border"
          >
            <span className="font-medium">Meus Feedbacks</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </section>

        {/* Activity Chart Section */}
        <section>
          <h2 className="text-sm font-medium mb-4">Activity last 30 days</h2>
          <div className="h-40 w-full bg-card rounded-xl border border-border p-4 flex items-end justify-center relative overflow-hidden">
             {/* Simple SVG Line Chart */}
             <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
               <path 
                 d="M0,35 C10,20 15,15 20,20 C25,25 30,35 35,25 C40,15 45,20 50,18 C55,16 60,30 65,35 C70,40 75,10 80,15 C85,20 90,30 95,10 L100,5" 
                 fill="none" 
                 stroke="hsl(var(--primary))" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 vectorEffect="non-scaling-stroke"
               />
               {/* Area under curve (optional, keeping simple for now) */}
             </svg>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Notificações</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <span className="font-medium">Notificações Push</span>
              <button 
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${pushEnabled ? 'bg-green-500' : 'bg-input'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${pushEnabled ? 'left-6.5 translate-x-0.5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <span className="font-medium">Atualizações por E-mail</span>
              <button 
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${emailEnabled ? 'bg-green-500' : 'bg-input'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${emailEnabled ? 'left-6.5 translate-x-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            Salvar Alterações
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full text-primary font-medium py-2 hover:underline"
          >
            Sair
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
