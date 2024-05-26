import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const styles = {
  signupContainer: {
    width: '300px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
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
  passwordCriteria: {
    fontSize: '12px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  },
  signupButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  signupButtonHover: {
    backgroundColor: '#45a049',
  },
};

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
  });

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
    };
    setPasswordValidations(validations);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the signup endpoint
      const response = await axios.post('/api/signup', {
        name: username,
        email: email,
        password: password,
        isAdmin: false,
      });

      console.log('User signed up successfully:', response.data);
      setSignupSuccess(true);
      localStorage.setItem('username', username);
      navigate('/'); // Redirect to home page after successful signup
    } catch (error) {
      console.error('Error signing up:', error.response.data);
      setError(error.response.data.error); // Set error message received from the server
    }
  };

  return (
    <div style={styles.signupContainer}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
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
            onChange={handlePasswordChange}
            required
            style={styles.input}
          />
          <div style={styles.passwordCriteria}>
            <p style={{ color: passwordValidations.length ? 'green' : 'red' }}>
              {passwordValidations.length ? '✔' : '✘'} At least 8 characters
            </p>
            <p style={{ color: passwordValidations.upper ? 'green' : 'red' }}>
              {passwordValidations.upper ? '✔' : '✘'} At least one uppercase letter
            </p>
            <p style={{ color: passwordValidations.lower ? 'green' : 'red' }}>
              {passwordValidations.lower ? '✔' : '✘'} At least one lowercase letter
            </p>
            <p style={{ color: passwordValidations.digit ? 'green' : 'red' }}>
              {passwordValidations.digit ? '✔' : '✘'} At least one digit
            </p>
          </div>
        </div>
        {error && <div style={styles.errorMessage}>{error}</div>} {/* Display error message if present */}
        <button type="submit" style={styles.signupButton}>Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};


export default SignupScreen;
