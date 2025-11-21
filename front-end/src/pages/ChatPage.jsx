import React from 'react';
import '../index.css';
import { useChat } from '../hooks/useChat';
import { useNews } from '../hooks/useNews';
import ChatSidebar from '../components/ChatSidebar';
import ChatArea from '../components/ChatArea';
import NewsSidebar from '../components/NewsSidebar';

const ChatPage = () => {
  const { 
    messages, 
    inputValue, 
    setInputValue, 
    chatHistory, 
    activeChatId, 
    handleSendMessage, 
    handleNewChat, 
    handleSwitchChat 
  } = useChat();

  const { newsItems, handleLikeNews, handleLikeComment } = useNews();

  const handleSaibaMais = (newsTitle) => {
    const text = `Quero saber mais sobre "${newsTitle}"`;
    setInputValue(text);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <ChatSidebar 
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          handleNewChat={handleNewChat}
          handleSwitchChat={handleSwitchChat}
        />
        
        <ChatArea 
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
        />

        <NewsSidebar 
          newsItems={newsItems}
          handleLikeNews={handleLikeNews}
          handleLikeComment={handleLikeComment}
          onSaibaMais={handleSaibaMais}
        />
      </div>
    </div>
  );
};

export default ChatPage;
