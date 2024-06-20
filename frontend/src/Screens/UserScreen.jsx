import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Image, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserScreen = () => {
  const [userData, setUserData] = useState();
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');


  const fetchUserData = async () => {
    try {
      const response = await axios.post('/api/userInfo', { username });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);  // Log the error details
      setError('Error fetching user data');
    }
  };


  useEffect(() => {
    // Fetch user data from the backend API
    if (!userData) {
      fetchUserData();
    }
  }, [username]); // Run again when username changes

  const handleSendPasswordResetEmail = async () => {
    try {
      await axios.post('/api/userInfo/sendPasswordReset', { mail: userData.mail, username: userData.username });
      alert('Password reset link sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email. Please try again later.');
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

  

  const handleForumHistory = async () => {
    try {
      navigate('/ForumHistory');
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  const handleHistory = async () => {
    try {
     // navigate(`/orderHistory/${username}`);
      navigate('/OrderHistory');
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
      setUserData(prevUserData => ({ ...prevUserData, emailNotifications: response.data }));
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
      setUserData(prevUserData => ({ ...prevUserData, twoFactorAuth: response.data }));
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
      //await fetchUserData();
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? 'gold' : 'gray' }}>★</span>
      );
    }
    return stars;
  };



  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={9}>
              <h2>User Information:</h2>
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
              <Button size="sm" onClick={handleSendPasswordResetEmail}>
                Reset Password
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Address Information:</h2>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <strong>Billing Address:</strong>
            </Col>
            <Col md={9}>
              <span>{`${userData.billingAddress?.addressLine1 ?? ''} ${userData.billingAddress?.country ?? ''}`}</span>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Order History:</h2>
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
              <h2>Your Post in the Forum:</h2>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4} className="d-flex justify-content-start">
              <Button variant="info" onClick={handleForumHistory}>
                Press To View Post History
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Payment Methods You Enter:</h2>
            </Col>
          </Row>
          {userData.paymentMethods && userData.paymentMethods.length > 0 ? (
            userData.paymentMethods.map((card, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={12}>
                  <span>card number {index + 1}: </span>
                  <span>#### #### #### {card?.cardNumber?.slice(-4)}</span> {/* Add optional chaining */}
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
              <h2>Account Settings:</h2>
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
          <hr />
          <Row className="mb-3">
            <Col md={12}>
              <h2>Product Reviews:</h2>
            </Col>
          </Row>
          {userData.reviews && userData.reviews.length > 0 ? (
            userData.reviews.map((review, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={12}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      <Link to={`/product/${review.product._id}`}>
                        <Image src={review.product.imgUrl} alt={review.product.title} style={{ width: '40px', marginRight: '10px' }} />
                      </Link>
                      : "{review.newReview.text}"
                    </span>
                    <div>{renderStars(review.newReview.rating)}</div>
                  </div>
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

export default UserScreen;
