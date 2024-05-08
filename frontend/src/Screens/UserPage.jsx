// UserPage.js

import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserPage = ({ username }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend API
    const fetchUserData = async () => {
      try {
        const response = await axios.post('/api/userInfo', { username }); // Pass the username to the server
        console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, [username]); // Add username to the dependency array

  const handleSendPassword = async () => {
    try {
      await axios.post('/api/userInfo/sendPassword', { mail: userData.mail,username: userData.username });
      alert('Password sent to your email!');
    } catch (error) {
      console.error('Error sending password:', error);
      alert('Failed to send password. Please try again later.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/userInfo/logout');
      localStorage.removeItem('username');
      navigate('/');
      navigate(0);
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error, if any
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {userData.username}</p>
      <p>Email: {userData.mail}</p>
      <p>Password: {showPassword ? userData.password : '******'}</p>
      <button onClick={() => setShowPassword(!showPassword)}>Show Password</button>
      <button onClick={handleSendPassword}>Send Password to Email</button>
      <p></p>
      <button onClick={handleLogout}>Logout</button> {/* Add the logout button */}
      {/* Toggle between showing asterisks and the actual password */}
      {/* Add more user information as needed */}
    </div>
  );
};

export default UserPage;
