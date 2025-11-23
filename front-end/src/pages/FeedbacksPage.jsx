import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Eye, FileText, Plus, Gavel } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const FeedbacksPage = () => {
  const navigate = useNavigate();

  const recentActivity = [
    {
      id: 1,
      icon: <Send className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Enviou mensagem para Deputado",
      time: "Hoje, 09:41"
    },
    {
      id: 2,
      icon: <Eye className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Leu alerta PL 234",
      time: "Ontem, 15:20"
    },
    {
      id: 3,
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Assinou petição online",
      time: "2 dias atrás"
    },
    {
      id: 4,
      icon: <Plus className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Começou a monitorar PL 567",
      time: "3 dias atrás"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Seu Impacto</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Main Stats Card */}
        <div className="bg-card rounded-3xl p-8 text-center shadow-sm border border-border">
          <div className="text-6xl font-bold text-primary mb-2">12</div>
          <div className="text-muted-foreground font-medium">Cobranças Enviadas</div>
        </div>

        {/* Secondary Stats */}
        <div className="flex justify-center">
          <div className="bg-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-border min-w-[200px]">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Gavel className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Leis Monitoradas</div>
              <div className="text-2xl font-bold">5</div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <h2 className="text-sm font-medium mb-4">Atividade dos últimos 30 dias</h2>
          <div className="h-32 w-full flex items-end justify-center relative overflow-hidden">
             {/* SVG Line Chart matching the reference */}
             <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
               <path 
                 d="M0,35 C5,30 10,15 15,15 C20,15 25,30 30,30 C35,30 40,15 45,20 C50,25 55,15 60,15 C65,15 70,35 75,35 C80,35 85,10 90,10 C95,10 98,20 100,18" 
                 fill="none" 
                 stroke="hsl(var(--primary))" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 vectorEffect="non-scaling-stroke"
               />
             </svg>
          </div>
        </section>

        {/* Recent Activity List */}
        <section>
          <h2 className="text-lg font-bold mb-4">Atividade recente</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="bg-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-border">
                <div className={`p-3 rounded-full ${activity.bg} flex-shrink-0`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeedbacksPage;
