import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      // Perform validation
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Extract the token from the location pathname
      const tokenFromPathname = window.location.href.replace('http://localhost:3000/password-reset?token=', '');
      setToken(tokenFromPathname);
      // Send password reset request to the backend
      console.log(token);
      console.log(window.location.href);
      await axios.post('/api/resetPassword', { token: tokenFromPathname, newPassword });
      
      // Password reset successful
      alert('Password reset successful!');
      navigate('/');
    } catch (error) {
      console.error('Error resetting password:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <div>{error}</div>}
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default PasswordReset;
