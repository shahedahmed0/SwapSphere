import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const Header = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [darkText, setDarkText] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (data && data._id) setCurrentUserId(data._id);
      } catch (err) {
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const socketUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const newSocket = io.connect(socketUrl);

    const onNotification = (data) => {
      if (!currentUserId || data.userId === currentUserId) return;

      const notificationId = Date.now();
      const notificationWithId = { ...data, id: notificationId };
      setNotifications((prev) => [notificationWithId, ...prev]);
      setUnreadCount((c) => c + 1);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      }, 6000);
    };

    newSocket.on('new_notification', onNotification);
    return () => {
      newSocket.off('new_notification', onNotification);
      newSocket.disconnect();
    };
  }, [isAuthenticated, currentUserId]);

  useEffect(() => {
    if (location.pathname.startsWith('/negotiate')) {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    const getBackgroundColor = (el) => {
      while (el && el !== document.documentElement) {
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && !bg.includes('rgba(0, 0, 0, 0)')) {
          return bg;
        }
        el = el.parentElement;
      }
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      return bodyBg || 'rgb(255, 255, 255)';
    };

    const checkBg = () => {
      const x = window.innerWidth / 2;
      const y = headerEl.offsetHeight + 5;
      let elem = document.elementFromPoint(x, y);
      if (elem && elem.id === 'header') {
        elem = elem.nextElementSibling || elem;
      }
      const bg = getBackgroundColor(elem);
      const rgb = bg.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const lum = 0.2126*r + 0.7152*g + 0.0722*b;
        setDarkText(lum > 200);
      } else {
        setDarkText(false);
      }
    };
    window.addEventListener('scroll', checkBg);
    window.addEventListener('resize', checkBg);
    checkBg();
    return () => {
      window.removeEventListener('scroll', checkBg);
      window.removeEventListener('resize', checkBg);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  const handleNotificationClick = (swapId) => {
    if (swapId) {
      navigate(`/negotiate/${swapId}`);
    }
  };

  return (
    <header id="header" className={`header d-flex align-items-center fixed-top ${darkText ? 'dark-text' : ''}`}>
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          maxWidth: '350px'
        }}>
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="alert alert-info alert-dismissible fade show mb-2"
              style={{ cursor: notif.swapId ? 'pointer' : 'default' }}
              onClick={() => handleNotificationClick(notif.swapId)}
            >
              <strong>💬 New Message:</strong> {notif.message}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifications(prev => prev.filter((n) => n.id !== notif.id));
                }}
                className="btn-close"
              ></button>
            </div>
          ))}
        </div>
      )}

      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <Link to="/" className="logo d-flex align-items-center me-auto">
          <h1 className="sitename">SwapSphere</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link to="/">Home</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/item-gallery">Marketplace</Link></li>
                <li><Link to="/create-listing">List an Item</Link></li>
                <li><Link to="/my-requests">Incoming Requests</Link></li>
                <li style={{ position: 'relative' }}>
                  <Link to="/negotiate/active">My Negotiations</Link>
                  {unreadCount > 0 && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-10px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '12px'
                      }}
                    >{unreadCount}</span>
                  )}
                </li>
              </>
            )}
            <li><Link to="/#about">About</Link></li>
            <li><Link to="/#services">Services</Link></li>
          </ul>
        </nav>

        {!isAuthenticated ? (
          <Link className="btn-getstarted ms-3" to="/login" style={{ marginLeft: '25px' }}>
            Start Swapping
          </Link>
        ) : (
          <button className="btn-getstarted ms-3" onClick={handleLogout} style={{ marginLeft: '25px', border: 'none' }}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
