import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { API_BASE_URL, apiUrl } from '../config/api';
import HobbyBadge from './HobbyBadge';

const Header = ({ isAuthenticated, userProfile, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [darkText, setDarkText] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(apiUrl('/api/auth/me'), {
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
    const newSocket = io.connect(API_BASE_URL);

    const onNotification = (data) => {
      const notificationId = Date.now();
      const notificationWithId = { ...data, id: notificationId };
      setNotifications((prev) => [notificationWithId, ...prev]);
      setUnreadCount((c) => c + 1);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      }, 6000);
    };

    newSocket.on('new_notification', onNotification);
    if (currentUserId) {
      newSocket.emit('register_user', { userId: currentUserId });
    }
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
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-active', mobileOpen);
    return () => {
      document.body.classList.remove('mobile-nav-active');
    };
  }, [mobileOpen]);

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
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleNotificationClick = (swapId) => {
    if (swapId) {
      navigate(`/negotiate/${swapId}`);
    }
  };

  return (
    <header id="header" className={`header d-flex align-items-center fixed-top ${darkText ? 'dark-text' : ''}`}>
      {notifications.length > 0 &&
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '350px'
      }}>
          {notifications.map((notif) =>
        <div
          key={notif.id}
          className="alert alert-info alert-dismissible fade show mb-2"
          style={{ cursor: notif.swapId ? 'pointer' : 'default' }}
          onClick={() => handleNotificationClick(notif.swapId)}>
          
              <strong>
                {notif.type === 'swap_request' ? '🔁 Swap request' :
                notif.type === 'swap_accepted' ? '✅ Swap accepted' :
                notif.type === 'dispute_created' ? '⚠️ New dispute' :
                notif.type === 'dispute_updated' ? '🛠️ Dispute updated' :
                '🔔 Notification'}
                :
              </strong>{' '}
              {notif.message}
              <button
            onClick={(e) => {
              e.stopPropagation();
              setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
            }}
            className="btn-close">
          </button>
            </div>
        )}
        </div>
      }

      <div className="container-fluid container-xl header-inner position-relative d-flex align-items-center gap-2">
        <div className="header-brand-cluster d-flex align-items-center flex-shrink-0 gap-2 gap-xl-3">
          <Link to="/" className="logo d-flex align-items-center flex-shrink-0 mb-0">
            <h1 className="sitename mb-0">SwapSphere</h1>
          </Link>

          {isAuthenticated && userProfile &&
          <div
            className="d-none d-xl-flex align-items-center flex-wrap gap-2 ps-3 ps-xl-4 border-start border-secondary-subtle"
            style={{ minHeight: '40px' }}
          >
            <span className="small text-muted text-nowrap">Signed in as</span>
            <span className="fw-semibold text-nowrap">{userProfile.username}</span>
            <HobbyBadge niche={userProfile.hobbyNiche} />
          </div>
          }
        </div>

        <div className="header-actions d-flex align-items-center justify-content-end gap-1 gap-md-2 flex-grow-1 flex-shrink-1 min-w-0">
          <i
            className={`mobile-nav-toggle d-xl-none bi flex-shrink-0 ${mobileOpen ? 'bi-x' : 'bi-list'}`}
            role="button"
            tabIndex={0}
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setMobileOpen((v) => !v);
            }}
          />

          <nav id="navmenu" className="navmenu header-nav flex-shrink-1 min-w-0">
            <ul>
              <li><Link to="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
              <li><Link to="/how-it-works" onClick={() => setMobileOpen(false)}>How it works</Link></li>
              <li><Link to="/safety" onClick={() => setMobileOpen(false)}>Safety</Link></li>

              {isAuthenticated &&
              <>
                  <li><Link to="/marketplace" onClick={() => setMobileOpen(false)}>Marketplace</Link></li>
                  <li>
                    <Link to="/create-listing" onClick={() => setMobileOpen(false)} title="Create a new listing">
                      List
                    </Link>
                  </li>
                  <li><Link to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link></li>
                  <li>
                    <Link to="/my-requests" onClick={() => setMobileOpen(false)} title="Incoming swap requests">
                      Requests
                    </Link>
                  </li>
                  <li>
                    <Link to="/transaction-history" onClick={() => setMobileOpen(false)} title="Transaction history and reviews">
                      History
                    </Link>
                  </li>
                  <li><Link to="/export" onClick={() => setMobileOpen(false)}>Export</Link></li>
                  <li style={{ position: 'relative' }}>
                    <Link to="/negotiate/active" onClick={() => setMobileOpen(false)} title="My negotiations">
                      Negotiate
                      {unreadCount > 0 &&
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '-10px',
                          background: 'red',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '12px'
                        }}>
                        {unreadCount}</span>
                      }
                    </Link>
                  </li>
                  {userProfile?.isAdmin &&
                  <li><Link to="/admin/disputes" onClick={() => setMobileOpen(false)}>Admin Disputes</Link></li>
                  }
                </>
              }

              <li><Link to="/#about" onClick={() => setMobileOpen(false)}>About</Link></li>
              <li><Link to="/#services" onClick={() => setMobileOpen(false)}>Services</Link></li>
            </ul>
          </nav>

          <div className="header-cta flex-shrink-0">
            {!isAuthenticated ?
            <Link className="btn-getstarted" to="/login">
                Start Swapping
              </Link> :
            <button className="btn-getstarted" type="button" onClick={handleLogout} style={{ border: 'none' }} title="Log out">
                Logout
              </button>
            }
          </div>
        </div>
      </div>
    </header>);

};

export default Header;
