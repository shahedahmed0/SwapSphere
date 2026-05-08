import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL, apiUrl } from '../config/api';

const NegotiationHub = ({ swapId, userId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [alert, setAlert] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(apiUrl('/api/auth/me'), {
          headers: { 'x-auth-token': token }
        });
        setUsername(res.data.username);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (loading) return;

    const newSocket = io.connect(API_BASE_URL);
    setSocket(newSocket);

    newSocket.emit('join_chat', { swapId });

    newSocket.on('load_messages', (messages) => {
      setChatHistory(messages);
    });

    newSocket.on('new_notification', (data) => {
      setAlert(data.message);
      setTimeout(() => setAlert(null), 5000);
    });

    newSocket.on('receive_message', (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    newSocket.on('error', () => {});

    return () => {
      newSocket.disconnect();
    };
  }, [swapId, loading]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !username) return;

    const data = {
      swapId,
      text: message,
      userId,
      username,
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', data);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (loading) {
    return <div className="p-5 text-center text-muted">Loading chat…</div>;
  }

  return (
    <div className="negotiation-page section light-background" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container py-4">
        {alert && (
          <div className="alert alert-warning alert-dismissible fade show rounded-4 shadow-sm border-0 mb-4">
            <strong>Notification:</strong> {alert}
            <button type="button" onClick={() => setAlert(null)} className="btn-close" aria-label="Dismiss"></button>
          </div>
        )}

        <div
          className="rounded-4 p-4 mb-3 text-white d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3"
          style={{ background: 'linear-gradient(120deg, #052e16 0%, #166534 40%, #18d26e 100%)' }}
        >
          <div>
            <p className="small text-white-50 text-uppercase fw-semibold mb-1">Swap negotiation</p>
            <h1 className="h4 fw-bold mb-1">Swap #{swapId}</h1>
            <p className="mb-0 small opacity-90">
              Logged in as <span className="fw-semibold">{username}</span> — keep trade details clear and kind.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/my-requests" className="btn btn-light btn-sm rounded-pill px-3">
              My requests
            </Link>
            <Link to="/transaction-history" className="btn btn-outline-light btn-sm rounded-pill px-3 border-2">
              History &amp; reviews
            </Link>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div
            className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between"
            style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}
          >
            <span className="small text-muted fw-semibold text-uppercase tracking-wide">Live messages</span>
            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle">
              <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.45rem', verticalAlign: 'middle' }} aria-hidden="true"></i>
              Connected
            </span>
          </div>

          <div
            className="px-3 px-md-4 py-4 negotiation-chat-scroll"
            style={{
              minHeight: 'min(70vh, 520px)',
              maxHeight: '70vh',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)'
            }}
          >
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-chat-quote display-6 d-block mb-3 opacity-50" aria-hidden="true"></i>
                <p className="mb-1 fw-semibold">No messages yet</p>
                <p className="small mb-0">Introduce yourself and confirm what each side is sending.</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => {
                const mine = msg.userId === userId;
                return (
                  <div key={msg._id || i} className={`d-flex mb-3 ${mine ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div style={{ maxWidth: 'min(85%, 420px)' }}>
                      <div className={`small mb-1 px-1 ${mine ? 'text-end text-muted' : 'text-start text-muted'}`}>
                        {mine ? 'You' : msg.username}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-4 shadow-sm ${
                          mine ? 'bg-success text-white rounded-top-end-0' : 'bg-white border text-dark rounded-top-start-0'
                        }`}
                        style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                      >
                        {msg.text}
                      </div>
                      <div className={`small text-muted mt-1 px-1 ${mine ? 'text-end' : 'text-start'}`}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 p-md-4 border-top bg-white">
            <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden" style={{ borderRadius: '999px' }}>
              <input
                type="text"
                className="form-control border-0 px-4 py-3"
                style={{ boxShadow: 'none' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Suggest shipping, timing, or item details…"
                aria-label="Message"
              />
              <button type="button" className="btn btn-success px-4 rounded-pill me-1 my-1" onClick={sendMessage}>
                Send
              </button>
            </div>
            <p className="small text-muted mt-2 mb-0 px-1">
              Tip: confirm condition and photos here so both sides have the same expectations. See <Link to="/safety">Safety Center</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationHub;
