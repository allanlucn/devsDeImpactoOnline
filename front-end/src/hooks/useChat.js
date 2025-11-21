import { useState } from 'react';
import { sendMessageToApi } from '../api/chat';

export const useChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Olá! Sou a IA que te ajuda a entender como as mudanças te afetam na prática! \n Como posso ajudar você hoje?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(Date.now());

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = { id: Date.now(), sender: 'user', text: inputValue };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');

    // Update history for current chat
    setChatHistory(prev => {
      const existingChatIndex = prev.findIndex(chat => chat.id === activeChatId);
      if (existingChatIndex >= 0) {
        const newHistory = [...prev];
        newHistory[existingChatIndex] = { ...newHistory[existingChatIndex], messages: updatedMessages };
        return newHistory;
      } else {
        return [...prev, { id: activeChatId, title: `Chat ${prev.length + 1}`, messages: updatedMessages }];
      }
    });

    // Send to API (mock)
    sendMessageToApi(inputValue).then(botResponse => {
      setMessages(prev => {
        const newMsgs = [...prev, botResponse];
        
        // Update history again with bot response
        setChatHistory(h => {
          const idx = h.findIndex(c => c.id === activeChatId);
          if (idx >= 0) {
            const nh = [...h];
            nh[idx] = { ...nh[idx], messages: newMsgs };
            return nh;
          }
          return h;
        });
        
        return newMsgs;
      });
    });
  };

  const handleNewChat = () => {
    setMessages([{ id: Date.now(), sender: 'bot', text: 'Olá! Como posso ajudar você hoje?' }]);
    setActiveChatId(Date.now());
  };

  const handleSwitchChat = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    chatHistory,
    activeChatId,
    handleSendMessage,
    handleNewChat,
    handleSwitchChat
  };
};
