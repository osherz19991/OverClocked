import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.post('/api/userInfo', { username });
      setUserData(response.data);
    } catch (error) {
      setError('Error fetching user data');
    }
  };

  useEffect(() => {
    // Fetch user data from the backend API
    if (!userData) {
      fetchUserData();
    }
  }, [userData, username]); // Add username to the dependency array

  const handleSendPassword = async () => {
    try {
      await axios.post('/api/userInfo/sendPassword', { mail: userData.mail, username: userData.username });
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
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error, if any
    }
  };

  const handleHistory = async () => {
    try {
      navigate('/orderHistory');
    } catch (error) {
      console.error('Error loading order history:', error);
      // Handle error, if any
    }
  };

  const handleToggleEmailNotifications = async () => {
    try {
      const response = await axios.post('/api/userInfo/toggleEmailNotifications', {
        username: userData.username,
      });
      setUserData({ ...userData, emailNotifications: response.data });
    } catch (error) {
      console.error('Error toggling email notifications:', error);
      alert('Failed to update email notifications. Please try again later.');
    }
  };

  const handleToggleTwoFactorAuth = async () => {
    try {
      const response = await axios.post('/api/userInfo/toggleTwoFactorAuth', {
        username: userData.username,
      });
      setUserData({ ...userData, twoFactorAuth: response.data });
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      alert('Failed to update two-factor authentication. Please try again later.');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        alert('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('/api/userInfo/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Fetch user data again to update avatar
      await fetchUserData();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again later.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={9}>
              <h2>User Information</h2>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Name:</strong>
            </Col>
            <Col md={9}>
              <span>{userData.username}</span>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Email:</strong>
            </Col>
            <Col md={9}>
              <span>{userData.mail}</span>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Password:</strong>
            </Col>
            <Col md={9}>
              <span>{showPassword ? userData.password : '*********'}</span>
              <Button size="sm" className="ms-2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Address Information</h2>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Shipping Address:</strong>
            </Col>
            <Col md={9}>
              <span>{userData.shippingAddress}</span>
              <Button size="sm" className="ms-2">
                Update
              </Button>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Billing Address:</strong>
            </Col>
            <Col md={9}>
              <span>{userData.billingAddress}</span>
              <Button size="sm" className="ms-2">
                Update
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Order History</h2>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4} className="d-flex justify-content-start">
              <Button variant="info" onClick={handleHistory}>
                Press To View Order History
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Payment Methods</h2>
              <Button>Add Payment Methood</Button>
            </Col>
          </Row>
          {userData.paymentMethods && userData.paymentMethods.length > 0 ? (
            userData.paymentMethods.map((paymentMethod, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={12}>
                  <span>{paymentMethod}</span>
                </Col>
              </Row>
            ))
          ) : (
            <Row className="mb-3 align-items-center">
              <Col md={12}>
                <span>No payment methods saved.</span>
              </Col>
            </Row>
          )}
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Account Settings</h2>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Email Notifications:</strong>
            </Col>
            <Col md={6}>
              <span>{userData.emailNotifications ? 'Enabled' : 'Disabled'}</span>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <Button size="sm" onClick={handleToggleEmailNotifications}>
                {userData.emailNotifications ? 'Turn Off' : 'Turn On'}
              </Button>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Two-Factor Authentication:</strong>
            </Col>
            <Col md={6}>
              <span>{userData.twoFactorAuth ? 'Enabled' : 'Disabled'}</span>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <Button size="sm" onClick={handleToggleTwoFactorAuth}>
                {userData.twoFactorAuth ? 'Turn Off' : 'Turn On'}
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Saved Items</h2>
            </Col>
          </Row>
          {userData.savedItems && userData.savedItems.length > 0 ? (
            userData.savedItems.map((item, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={12}>
                  <span>{item}</span>
                </Col>
              </Row>
            ))
          ) : (
            <Row className="mb-3 align-items-center">
              <Col md={12}>
                <span>No saved items found.</span>
              </Col>
            </Row>
          )}
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Product Reviews</h2>
            </Col>
          </Row>
          {userData.reviews && userData.reviews.length > 0 ? (
            userData.reviews.map((review, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={12}>
                  <span>Review for {review.productName}: "{review.reviewText}"</span>
                </Col>
              </Row>
            ))
          ) : (
            <Row className="mb-3 align-items-center">
              <Col md={12}>
                <span>No product reviews found.</span>
              </Col>
            </Row>
          )}
          <hr />
          <Row className="mt-3">
            <Col>
              <Button variant="primary" onClick={handleSendPassword}>
                Send Password to Email
              </Button>
              <Button variant="danger" className="ms-2" onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserPage;
