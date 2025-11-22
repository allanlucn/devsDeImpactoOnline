const NewsSidebar = ({ newsItems, handleLikeNews, handleLikeComment, onSaibaMais }) => {
  return (
    <aside className="news-sidebar">
      <h3>Notícias Relevantes</h3>
      <div className="news-list">
        {newsItems.map(news => (
          <div key={news.id} className="news-card">
            <h4>{news.title}</h4>
            <p>{news.summary}</p>
            
            <div className="news-actions">
              <button 
                className={`like-btn ${news.likedByUser ? 'active' : ''}`} 
                onClick={() => handleLikeNews(news.id)}
              >
                👍 {news.likes}
              </button>
              <button className="saiba-mais-btn" onClick={() => onSaibaMais(news.title)}>
                Saiba mais
              </button>
            </div>

            <div className="comments-section">
              <h5>Comentários:</h5>
              {news.comments.sort((a, b) => b.likes - a.likes).map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <strong>{comment.user}</strong>
                    <button 
                      className={`like-small-btn ${comment.likedByUser ? 'active' : ''}`} 
                      onClick={() => handleLikeComment(news.id, comment.id)}
                    >
                      👍 {comment.likes}
                    </button>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
              <div className="add-comment">
                <input type="text" placeholder="Comente..." />
                <button>Enviar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NewsSidebar;
