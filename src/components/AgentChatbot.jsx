import React, { useRef, useState, useEffect } from 'react';
import './AgentChatbot.css';
import { FaRobot, FaPaperPlane, FaTimes, FaStar, FaPlay } from 'react-icons/fa';

const MovieCard = ({ movie }) => (
  <div className="agent-movie-card">
    {/* Poster */}
    {movie.poster && <img src={movie.poster} alt={movie.title} className="agent-movie-poster" />}
    {/* Fallback to Poster from JSON if not mapped */}
    {!movie.poster && movie.Poster && <img src={movie.Poster} alt={movie.Title} className="agent-movie-poster" />}
    <div className="agent-movie-info">
      <div className="agent-movie-title">{movie.title || movie.Title} <span className="agent-movie-year">({movie.year || movie.Year})</span></div>
      <div className="agent-movie-rating"><FaStar style={{ color: '#f7c948', marginRight: 4 }} /> {movie.rating || movie.imdbRating}</div>
      <div className="agent-movie-overview">{movie.overview || movie.Plot}</div>
      {/* Movie stills gallery */}
      {Array.isArray(movie.images) && movie.images.length > 0 && (
        <div className="agent-movie-stills-section">
          <div className="agent-movie-stills-label">Movie Stills</div>
          <div className="agent-movie-stills-scroll">
            {movie.images.map((img, idx) => (
              <img key={idx} src={img} alt={(movie.title || movie.Title) + ' still ' + (idx+1)} className="agent-movie-still" />
            ))}
          </div>
        </div>
      )}
      {/* Fallback for Images from JSON if not mapped */}
      {Array.isArray(movie.Images) && movie.Images.length > 0 && (
        <div className="agent-movie-stills-section">
          <div className="agent-movie-stills-label">Movie Stills</div>
          <div className="agent-movie-stills-scroll">
            {movie.Images.map((img, idx) => (
              <img key={idx} src={img} alt={(movie.title || movie.Title) + ' still ' + (idx+1)} className="agent-movie-still" />
            ))}
          </div>
        </div>
      )}
      {/* Cast names only */}
      {(movie.actors || movie.Actors) && (
        <div className="agent-movie-cast-list">
          <div className="agent-movie-cast-title">Cast:</div>
          <div className="agent-movie-cast-names">
            {(movie.actors || movie.Actors).split(',').map((name, idx) => (
              <span key={idx} className="agent-movie-cast-name-text">{name.trim()}</span>
            ))}
          </div>
        </div>
      )}
      {movie.trailer && (
        <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="agent-movie-trailer-btn">
          <FaPlay style={{ marginRight: 4 }} /> Watch Trailer
        </a>
      )}
    </div>
  </div>
);

const AgentChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am pranjal your movie assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [lastMovies, setLastMovies] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (open && chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Helper to fetch trailers for a list of movies
  const fetchTrailers = async (movies) => {
    const withTrailers = await Promise.all(movies.map(async (movie) => {
      if (!movie.id) return movie;
      try {
        const res = await fetch(`/api/tmdb/movie/${movie.id}/videos`);
        const data = await res.json();
        const trailer = (data.results || []).find(v => v.site === 'YouTube' && v.type === 'Trailer');
        return { ...movie, trailer: trailer ? `https://youtube.com/watch?v=${trailer.key}` : null };
      } catch {
        return { ...movie };
      }
    }));
    return withTrailers;
  };

  const appendMessage = (sender, text, movies) => {
    setMessages(msgs => [...msgs, { sender, text, movies }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    appendMessage('user', input);
    appendMessage('ai', '...'); // Placeholder
    setLoading(true);
    setLastQuery(null);
    setLastPage(1);
    setLastMovies([]);
    setHasMore(false);
    const userMessage = input;
    setInput('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      let movies = data.movies || [];
      movies = await fetchTrailers(movies);
      setMessages(msgs => {
        // Remove the last placeholder
        const newMsgs = msgs.slice(0, -1);
        return [...newMsgs, { sender: 'ai', text: data.reply || 'No response.', movies }];
      });
      if (movies.length > 0) {
        setLastQuery({ ...data, userMessage });
        setLastPage(1);
        setLastMovies(movies);
        setHasMore(movies.length === 5); // If 5, there may be more
      }
    } catch (err) {
      setMessages(msgs => {
        const newMsgs = msgs.slice(0, -1);
        return [...newMsgs, { sender: 'ai', text: 'Error: Could not get a response.' }];
      });
    } finally {
      setLoading(false);
    }
  };

  // Show more handler
  const handleShowMore = async () => {
    if (!lastQuery) return;
    setLoading(true);
    try {
      // Call a new backend endpoint for pagination, or re-call /api/chat with page param
      const page = lastPage + 1;
      const params = new URLSearchParams();
      if (lastQuery.userMessage) params.append('q', lastQuery.userMessage);
      params.append('page', page);
      const response = await fetch(`/api/chat/more?${params.toString()}`);
      const data = await response.json();
      let movies = data.movies || [];
      movies = await fetchTrailers(movies);
      setMessages(msgs => {
        // Append as a new AI message
        return [...msgs, { sender: 'ai', text: 'Here are more movies:', movies }];
      });
      setLastPage(page);
      setLastMovies(movies);
      setHasMore(movies.length === 5);
    } catch {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Error: Could not fetch more movies.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open ? (
        <div className="agent-chatbot-window">
          <div className="agent-chatbot-header">
            <span className="agent-chatbot-title">
              <FaRobot style={{ color: 'var(--accent)', fontSize: '1.3rem' }} />
              MovieBot
            </span>
            <button className="agent-chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">
              <FaTimes />
            </button>
          </div>
          <div className="agent-chatbot-messages" ref={chatWindowRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`agent-chatbot-msg ${msg.sender}`}>
                <div>{msg.text}</div>
                {msg.movies && Array.isArray(msg.movies) && msg.movies.length > 0 && (
                  <div className="agent-movie-list">
                    {msg.movies.map((movie, i) => <MovieCard key={movie.id || i} movie={movie} />)}
                  </div>
                )}
                {msg.sender === 'ai' && idx === messages.length - 1 && hasMore && (
                  <button className="agent-movie-showmore-btn" onClick={handleShowMore} disabled={loading}>
                    Show more
                  </button>
                )}
              </div>
            ))}
          </div>
          <form className="agent-chatbot-input-row" onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              required
              aria-label="Type your message"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      ) : (
        <button className="agent-chatbot-fab" onClick={() => setOpen(true)} aria-label="Open chatbot">
          <FaRobot />
        </button>
      )}
    </>
  );
};

export default AgentChatbot; 