import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { apiUrl } from './config/api';


import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import FeaturedServices from './components/FeaturedServices';
import Stats from './components/Stats';
import ItemGallery from './components/ItemGallery';
import Login from './components/Login';
import Register from './components/Register';
import Wishlist from './components/Wishlist';
import CreateListing from './components/CreateListing.js';
import NegotiationHub from './components/NegotiationHub.js';
import IncomingRequestManager from './components/swaps/IncomingRequestManager';
import TransactionHistory from './components/swaps/TransactionHistory';
import ProposeSwapPage from './components/swaps/ProposeSwapPage';
import AdminDisputesPage from './components/admin/AdminDisputesPage.jsx';
import ExportPage from './components/ExportPage.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Safety from './components/Safety';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const marginTop = location.pathname === '/' ? '0px' : '90px';
  return (
    <main id="main" style={{ marginTop: marginTop, transition: 'margin 0.3s ease' }}>
      {children}
    </main>);

};

function App() {
  const [dbUserId, setDbUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (tokenOverride = null) => {
    const token = tokenOverride || localStorage.getItem('token');
    if (!token) {
      setDbUserId(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(apiUrl('/api/auth/me'), {
        headers: { 'x-auth-token': token }
      });
      setDbUserId(res.data._id);
      setUserProfile(res.data);
      localStorage.setItem('userId', res.data._id);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setDbUserId(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    loadUser();
  }, [loadUser]);

  if (loading) return <div className="p-5 text-center">Verifying SwapSphere Session...</div>;

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} userProfile={userProfile} />
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={
            <>
                <Hero />
                <FeaturedServices />
                <About />
                <Stats />
                <Services />
                <section className="section">
                  <div className="container">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                      <div>
                        <h2 className="mb-1">Marketplace</h2>
                        <p className="text-muted mb-0">Browse what the community is swapping right now.</p>
                      </div>
                      <Link className="btn btn-success" to="/marketplace">
                        Explore Marketplace
                      </Link>
                    </div>
                  </div>
                </section>
              </>
            } />
            <Route
              path="/marketplace"
              element={<ItemGallery isAuthenticated={isAuthenticated} userId={dbUserId} />}
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/login" element={<Login onLoginSuccess={loadUser} />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/wishlist"
              element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} />
            

            <Route
              path="/create-listing"
              element={isAuthenticated ? <CreateListing userId={dbUserId} /> : <Navigate to="/login" />} />
            
            <Route
              path="/negotiate/:swapId"
              element={isAuthenticated ? <NegotiationHubWrapper userId={dbUserId} /> : <Navigate to="/login" />} />
            
            <Route
              path="/propose-swap/:itemId"
              element={isAuthenticated ? <ProposeSwapPage /> : <Navigate to="/login" />} />
            

            <Route
              path="/my-requests"
              element={isAuthenticated ? <IncomingRequestManager /> : <Navigate to="/login" />} />
            
            <Route
              path="/transaction-history"
              element={isAuthenticated ? <TransactionHistory userId={dbUserId} userProfile={userProfile} /> : <Navigate to="/login" />} />

            <Route
              path="/export"
              element={isAuthenticated ? <ExportPage /> : <Navigate to="/login" />} />

            <Route
              path="/admin/disputes"
              element={isAuthenticated && userProfile?.isAdmin ? <AdminDisputesPage /> : <Navigate to="/" />} />
            

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LayoutWrapper>
      </div>
    </Router>);

}


const NegotiationHubWrapper = ({ userId }) => {
  const { swapId } = useParams();
  return <NegotiationHub userId={userId} swapId={swapId} />;
};

export default App;
