import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const RegistrationScreen = ({ cmsConfig = {} }) => {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [gender, setGender] = useState('Select Gender');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!name.trim()) e.name = 'Name is required';

    if (!phone.trim()) {
      e.phone = 'Phone is required';
    } else if (!/^\d{7,15}$/.test(phone.trim())) {
      e.phone = 'Enter valid phone (7-15 digits)';
    }

    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
      e.email = 'Enter valid email';
    }

    if (!password.trim()) e.password = 'Password is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const success = await registerUser(
      name.trim(),
      email.trim(),
      phone.trim(),
      password,
      referralCode.trim() || null,
      gender !== 'Select Gender' ? gender : null
    );

    if (success) {
      alert('Account created successfully');
      navigate('/login');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundImage: `url(${cmsConfig?.backgroundImage || '/bgHome1.png'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 1,
    backgroundColor: cmsConfig?.cardBackgroundColor || 'rgba(0,0,0,0.85)',
    padding: '28px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: `1px solid ${cmsConfig?.inputBorderColor || '#E50914'}`,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle} />

      <div style={cardStyle}>
        <img
          src={cmsConfig?.logoImage || 'https://via.placeholder.com/120'}
          alt="Logo"
          style={{ width: 110, height: 110, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }}
        />

        <h1 style={{ color: '#fff', textAlign: 'center', margin: '0 0 6px', fontSize: 26 }}>
          {cmsConfig?.title || 'Create Account'}
        </h1>

        <p style={{ color: '#ccc', textAlign: 'center', margin: '0 0 20px', fontSize: 14 }}>
          {cmsConfig?.subtitle || 'Join us today'}
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <input
              style={inputStyle}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
          </div>

          <div>
            <input
              style={inputStyle}
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              maxLength={15}
            />
            {errors.phone && <div style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
          </div>

          <div>
            <input
              style={inputStyle}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
          </div>

          <div>
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
          </div>

          {cmsConfig?.referralEnabled !== false && (
            <input
              style={inputStyle}
              placeholder="Referral Code (Optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            />
          )}

          {cmsConfig?.genderEnabled && (
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ ...inputStyle, color: '#fff', appearance: 'none' }}
            >
              <option value="Select Gender" style={{ color: '#000' }}>Select Gender</option>
              <option value="Male" style={{ color: '#000' }}>Male</option>
              <option value="Female" style={{ color: '#000' }}>Female</option>
              <option value="Other" style={{ color: '#000' }}>Other</option>
            </select>
          )}
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 16,
            padding: '13px',
            borderRadius: 30,
            border: 'none',
            backgroundColor: cmsConfig?.buttonColor || '#E50914',
            color: cmsConfig?.buttonTextColor || '#fff',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div style={{ marginTop: 18, textAlign: 'center', color: '#ccc', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#E50914', fontWeight: 700, textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;
