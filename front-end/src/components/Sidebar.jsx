import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Newspaper, MessageSquare, History, X, Trash2 } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, [isOpen]); // Refresh when sidebar opens

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => location.pathname === path;
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      setChatHistory(history);
    };

    loadHistory();
    window.addEventListener('chatHistoryUpdated', loadHistory);
    return () => window.removeEventListener('chatHistoryUpdated', loadHistory);
  }, []);

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    setChatHistory(updatedHistory);
    window.dispatchEvent(new Event('chatHistoryUpdated'));
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Close Button (Mobile mostly, but good for UX) */}
        <div className="p-4 flex justify-between items-center md:hidden">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
          {/* New Chat Button */}
          <button 
            onClick={() => handleNavigation('/chat')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-full font-medium transition-colors shadow-sm flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Chat</span>
          </button>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => handleNavigation('/news')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${
                isActive('/news') 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-foreground hover:bg-accent/50'
              }`}
            >
              <Newspaper className="w-5 h-5" />
              <span>Notícias</span>
            </button>

            {/* History Section */}
            <div className="mt-2">
              <div className="flex items-center gap-3 px-4 py-2 text-muted-foreground font-medium">
                <History className="w-5 h-5" />
                <span>Histórico</span>
              </div>
              <div className="flex flex-col gap-1 mt-1 pl-4">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="group flex items-center justify-between hover:bg-accent/30 rounded-lg transition-colors pr-2">
                    <button
                      onClick={() => {
                        navigate('/chat', { state: { chatHistoryItem: chat } });
                        onClose();
                      }}
                      className="flex-1 text-sm text-muted-foreground hover:text-foreground px-4 py-2 text-left truncate"
                    >
                      {chat.title}
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir conversa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {chatHistory.length === 0 && (
                  <p className="text-xs text-muted-foreground px-4 py-2 italic">
                    Nenhum histórico recente
                  </p>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div 
            onClick={() => handleNavigation('/profile')}
            className="flex items-center gap-3 p-2 hover:bg-accent rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg">
              {userProfile?.name ? userProfile.name[0].toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-foreground">
                {userProfile?.name || 'Allan'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile?.job || 'Cidadão Ativo'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
