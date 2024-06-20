import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';


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
    <Card style={{ maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
      <h2>Sign In</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" className="mt-3">Sign In</Button>
      </Form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p>
      <button onClick={() => setShowReset(!showReset)}>Forgot Password?</button>
      </p>
      {showReset && (
        <Form onSubmit={handlePasswordReset}>
          <Form.Group controlId="resetEmail">
            <Form.Label>Enter your email to reset password:</Form.Label>
            <Form.Control
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </Form.Group>
          {resetError && <Alert variant="danger">{resetError}</Alert>}
          {resetMessage && <Alert variant="success">{resetMessage}</Alert>}
          <Button type="submit" className="mt-3">Send Reset Link</Button>
        </Form>
      )}
    </Card>
  );
};

export default SigninScreen;
