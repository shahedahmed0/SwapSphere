import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    hobbyNiche: 'Board Games'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.msg);
        navigate('/login');
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <section id="register" className="register section" style={{
      minHeight: '100vh',
      paddingTop: '120px',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2c3e50' }}>Join SwapSphere</h2>
                  <p className="text-muted">Create your collector profile today</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Username</label>
                      <input type="text" className="form-control" placeholder="HobbyistName"
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Primary Hobby</label>
                      <select className="form-select" onChange={(e) => setFormData({ ...formData, hobbyNiche: e.target.value })}>
                        <option>Board Games</option>
                        <option>Rare Seeds</option>
                        <option>Vintage Cards</option>
                        <option>Retro Gaming</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input type="email" className="form-control" placeholder="email@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password" id="register-pass" className="form-control" placeholder="Min. 6 characters"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>

                  <button type="submit" className="btn btn-success w-100 py-2 fw-bold rounded-3">
                    Create Account
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0 small">Already a member? <Link to="/login" style={{ color: '#e84545', fontWeight: '600', textDecoration: 'none' }}>Login here</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default Register;
