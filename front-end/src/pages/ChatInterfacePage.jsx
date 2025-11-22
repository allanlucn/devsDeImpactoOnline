import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { sendMessageToApi } from '../api/chat';

const ChatInterfacePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [currentChatId, setCurrentChatId] = useState(null);

  // Load initial context or history if available
  useEffect(() => {
    if (location.state?.chatHistoryItem) {
      setMessages(location.state.chatHistoryItem.messages);
      setCurrentChatId(location.state.chatHistoryItem.id);
    } else if (location.state?.context) {
      const news = location.state.context;
      const newChatId = Date.now();
      const initialMessage = {
        id: Date.now(),
        text: `Gostaria de saber mais sobre a notícia: "${news.title}"`,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      setCurrentChatId(newChatId);
      setMessages([initialMessage]);
      handleSendMessage(initialMessage.text, newChatId);
    } else {
      // Start a fresh chat if no context
      setCurrentChatId(Date.now());
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text = inputText, chatId = currentChatId) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // If it's a new message (not from context effect), add it to state
    if (text === inputText) {
      setMessages(prev => {
        const newMessages = [...prev, userMessage];
        setTimeout(() => saveChatHistory(newMessages, chatId), 0);
        return newMessages;
      });
      setInputText('');
    }

    setIsLoading(true);

    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      
      // Call backend API via helper
      const botResponse = await sendMessageToApi(text, userProfile);
      
      const botMessage = {
        ...botResponse,
        timestamp: new Date().toISOString() // Ensure timestamp is fresh if not provided
      };

      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        setTimeout(() => saveChatHistory(newMessages, chatId), 0);
        return newMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Desculpe, não consegui processar sua mensagem no momento. Tente novamente mais tarde.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatHistory = (currentMessages, chatId) => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const lastMessage = currentMessages[currentMessages.length - 1];
    const firstMessage = currentMessages[0];
    
    const chatSummary = {
      id: chatId,
      title: firstMessage.text.slice(0, 30) + (firstMessage.text.length > 30 ? '...' : ''),
      lastMessage: lastMessage.text,
      timestamp: lastMessage.timestamp,
      messages: currentMessages
    };

    // Check if chat already exists in history
    const existingIndex = history.findIndex(chat => chat.id === chatId);
    
    let newHistory;
    if (existingIndex >= 0) {
      // Update existing chat
      newHistory = [...history];
      newHistory[existingIndex] = chatSummary;
      // Move to top
      newHistory.splice(existingIndex, 1);
      newHistory.unshift(chatSummary);
    } else {
      // Add new chat
      newHistory = [chatSummary, ...history];
    }

    // Limit to 10 items
    const limitedHistory = newHistory.slice(0, 10);
    localStorage.setItem('chatHistory', JSON.stringify(limitedHistory));
    
    // Trigger a custom event so Sidebar can update
    window.dispatchEvent(new Event('chatHistoryUpdated'));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Header */}
      <header className="flex items-center px-4 py-4 border-b border-border bg-background sticky top-0 z-10">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 hover:bg-accent rounded-full text-muted-foreground"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
            <h2 className="text-2xl font-bold mb-2">Como posso ajudar?</h2>
            <p className="text-muted-foreground">Pergunte sobre leis, notícias ou seus direitos.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-card border border-border text-foreground rounded-tl-none'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte..."
            className="w-full pl-6 pr-12 py-4 rounded-full border border-border bg-card text-foreground shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfacePage;
