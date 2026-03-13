import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import FeaturedServices from './components/FeaturedServices';
import Stats from './components/Stats';
import ItemGallery from './components/ItemGallery';
import Login from './components/Login';
import Register from './components/Register';
import CreateListing from './components/CreateListing.js';
import NegotiationHub from './components/NegotiationHub.js';
import IncomingRequestManager from './components/swaps/IncomingRequestManager';
import ProposeSwapPage from './components/swaps/ProposeSwapPage';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const marginTop = location.pathname === '/' ? '0px' : '90px';
  return (
    <main id="main" style={{ marginTop: marginTop, transition: 'margin 0.3s ease' }}>
      {children}
    </main>
  );
};

function App() {
  const [dbUserId, setDbUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });

    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { 'x-auth-token': token }
          });
          setDbUserId(res.data._id);
          setUserProfile(res.data);
          localStorage.setItem('userId', res.data._id);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) return <div className="p-5 text-center">Verifying SwapSphere Session...</div>;

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} />
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedServices />
                <About />
                <Stats userProfile={userProfile} />
                <Services />
                <ItemGallery isAuthenticated={isAuthenticated} userId={dbUserId} />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/create-listing" 
              element={isAuthenticated ? <CreateListing userId={dbUserId} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/item-gallery" 
              element={<ItemGallery isAuthenticated={isAuthenticated} userId={dbUserId} />} 
            />
            <Route 
              path="/negotiate/:swapId" 
              element={isAuthenticated ? <NegotiationHubWrapper userId={dbUserId} /> : <Navigate to="/login" />} 
            />
            <Route
              path="/my-requests"
              element={isAuthenticated ? <IncomingRequestManager /> : <Navigate to="/login" />}
            />
            <Route
              path="/propose-swap/:itemId"
              element={isAuthenticated ? <ProposeSwapPage /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LayoutWrapper>
      </div>
    </Router>
  );
}

const NegotiationHubWrapper = ({ userId }) => {
  const { swapId } = useParams();
  return <NegotiationHub userId={userId} swapId={swapId} />;
};

export default App;
