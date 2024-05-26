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
  },
};

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the sign-in endpoint
      const response = await axios.post('/api/signin', {
        identifier: email,
        password: password,
      });

      console.log('User signed in successfully:', response.data);

      // Fetch the username after successful sign-in
      const username = response.data.username;
      // Store the username in local storage
      localStorage.setItem('username', username);
      navigate('/');

      navigate(0);
    } catch (error) {
      console.error('Error signing in:', error.response.data);
      setError('Invalid email or password');
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
    </div>
  );
};


export default SigninScreen;
