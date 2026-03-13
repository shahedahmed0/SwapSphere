import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const NegotiationHub = ({ swapId, userId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [alert, setAlert] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch current user's username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const res = await axios.get('http://localhost:5000/api/auth/me', {
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

  // Initialize socket connection
  useEffect(() => {
    if (loading) return;

    const socketUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const newSocket = io.connect(socketUrl);
    setSocket(newSocket);

    // Join the chat room and load previous messages
    newSocket.emit('join_chat', { swapId });

    // Load previous messages from database
    newSocket.on('load_messages', (messages) => {
      setChatHistory(messages);
    });

    newSocket.on('new_notification', (data) => {
      setAlert(data.message);
      setTimeout(() => setAlert(null), 5000);
    });

    // Receive new messages
    newSocket.on('receive_message', (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    newSocket.on('error', (error) => {});

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
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading chat...</div>;
  }

  return (
    <div className="container mt-4">
      {/* UI Notification Banner */}
      {alert && (
        <div className="alert alert-warning alert-dismissible fade show">
          <strong>Notification:</strong> {alert}
          <button onClick={() => setAlert(null)} className="btn-close"></button>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-dark text-white">
          Item Negotiation (Swap ID: {swapId})
          <span className="float-end text-light">You: {username}</span>
        </div>
        <div className="card-body chat-window" style={{ height: '300px', overflowY: 'auto' }}>
          {chatHistory.length === 0 ? (
            <p className="text-muted">No messages yet. Start the negotiation!</p>
          ) : (
            chatHistory.map((msg, i) => (
              <div 
                key={msg._id || i} 
                className={`mb-3 ${msg.userId === userId ? 'text-end' : 'text-start'}`}
              >
                <div className="d-inline-block" style={{ maxWidth: '70%' }}>
                  <small className="text-muted d-block mb-1">
                    {msg.userId === userId ? 'You' : msg.username}
                  </small>
                  <div 
                    className={`badge p-2 ${msg.userId === userId ? 'bg-primary' : 'bg-secondary'}`}
                    style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                  >
                    {msg.text}
                  </div>
                  <small className="text-muted d-block mt-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Suggest a trade detail..." 
            />
            <button className="btn btn-danger" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationHub;
