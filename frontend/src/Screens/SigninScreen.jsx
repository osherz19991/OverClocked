import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  signinContainer: {
    width: '300px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '8px',
    margin: '0 auto',
    display: 'block',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginBottom: '15px',
    textAlign: 'center',
  },
  signinButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  signinButtonHover: {
    backgroundColor: '#45a049',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
    marginTop: '10px',
    display: 'block',
    textAlign: 'center',
  },
};

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signin', {
        identifier: email,
        password: password,
      });

      console.log('User signed in successfully:', response.data);

      const username = response.data.username;
      localStorage.setItem('username', username);
      navigate('/');
      navigate(0);
    } catch (error) {
      console.error('Error signing in:', error.response.data);
      setError('Invalid email or password');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signin/sendPasswordReset', { mail: resetEmail });
      setResetMessage('Password reset link sent. Please check your email.');
      setResetError('');
    } catch (error) {
      console.error('Error sending password reset link:', error.response.data);
      setResetError('Error sending password reset link.');
      setResetMessage('');
    }
  };

  return (
    <div style={styles.signinContainer}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <button type="submit" style={styles.signinButton}>Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
      </p>
      <p>
        <span onClick={() => setShowReset(!showReset)} style={styles.link}>Forgot Password?</span>
      </p>
      {showReset && (
        <form onSubmit={handlePasswordReset} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="resetEmail">Enter your email to reset password:</label>
            <input
              type="email"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {resetError && <p style={styles.errorMessage}>{resetError}</p>}
          {resetMessage && <p style={styles.successMessage}>{resetMessage}</p>}
          <button type="submit" style={styles.signinButton}>Send Reset Link</button>
        </form>
      )}
    </div>
  );
};

export default SigninScreen;
