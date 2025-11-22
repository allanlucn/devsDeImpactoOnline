const ChatSidebar = ({ chatHistory, activeChatId, handleNewChat, handleSwitchChat }) => {
  return (
    <aside className="chat-sidebar">
      <div className="new-chat-btn">
        <button onClick={handleNewChat}>+ Novo Chat</button>
      </div>
      <div className="history-list">
        <p>Histórico</p>
        <ul>
          {chatHistory.map(chat => (
            <li 
              key={chat.id} 
              onClick={() => handleSwitchChat(chat)}
              className={activeChatId === chat.id ? 'active-chat' : ''}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <a href="/">Voltar para Home</a>
      </div>
    </aside>
  );
};

export default ChatSidebar;
