import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap'; // Import Alert and Spinner from react-bootstrap
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutScreen = ({ cartItems }) => {
  const navigate = useNavigate();
  const totalPrice = parseFloat(localStorage.getItem('totalPrice')).toFixed(2);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const [existingPaymentMethods, setExistingPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentMethodError, setPaymentMethodError] = useState('');
  const [billingAddressError, setBillingAddressError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert
  const [isProcessing, setIsProcessing] = useState(false); // State to track if checkout process is ongoing

  const [fieldErrors, setFieldErrors] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    fullName: '',
    addressLine1: '',
    country: '',
  });

  useEffect(() => {
    const fetchPaymentMethodsAndBillingAddress = async () => {
      try {
        const response = await axios.post('/api/checkout/paymentMethods', { username: localStorage.getItem('username') });
        setExistingPaymentMethods(response.data.paymentMethods);
        setBillingAddress(response.data.billingAddress);
      } catch (error) {
        console.error('Error fetching payment methods and billing address:', error);
      }
    };

    fetchPaymentMethodsAndBillingAddress();
  }, []);

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentMethodError('');
    setFieldErrors({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      fullName: '',
      addressLine1: '',
      country: '',
    });
  };

  const handleCheckout = async () => {
    if (isProcessing) {
      return; // Prevent multiple clicks while processing
    }

    let errors = {};
    let hasErrors = false;

    if (!selectedPaymentMethod) {
      setPaymentMethodError('Please select a payment method.');
      hasErrors = true;
    }

    if (selectedPaymentMethod === 'new') {
      if (!paymentDetails.cardNumber) {
        errors.cardNumber = 'Card number is required.';
        hasErrors = true;
      }
      if (!paymentDetails.expirationDate) {
        errors.expirationDate = 'Expiration date is required.';
        hasErrors = true;
      }
      if (!paymentDetails.cvv) {
        errors.cvv = 'CVV is required.';
        hasErrors = true;
      }
    }

    if (!billingAddress.fullName) {
      errors.fullName = 'Full name is required.';
      hasErrors = true;
    }
    if (!billingAddress.addressLine1) {
      errors.addressLine1 = 'Address line 1 is required.';
      hasErrors = true;
    }
    if (!billingAddress.country) {
      errors.country = 'Country is required.';
      hasErrors = true;
    }

    setFieldErrors(errors);

    if (hasErrors) {
      return;
    }

    setIsProcessing(true); // Start checkout process

    try {
      const response = await axios.post('/api/checkout', {
        username: localStorage.getItem('username'),
        cartItems: localStorage.getItem('cartItems'),
        totalPrice,
        paymentDetails: selectedPaymentMethod === 'new' ? paymentDetails : selectedPaymentMethod,
        billingAddress,
      });
      setMessage(response.data.message);
      localStorage.setItem('totalPrice', 0);
      localStorage.removeItem('cartItems');
      setShowSuccessAlert(true); // Show success alert
      setTimeout(() => {
        setShowSuccessAlert(false); // Hide success alert after 5 seconds
        navigate('/orderHistory'); // Redirect to order history page
      }, 5000); // Auto-hide after 5 seconds
    } catch (error) {
      console.error('Error during checkout:', error);
      setMessage('Failed to process checkout');
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Checkout</h2>
      <Row className="mb-4">
        <Col md={6}>
          <h3>Payment Details</h3>
          <Form>
            <Form.Group controlId="paymentMethod">
              <Form.Label>Select Payment Method</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                className={paymentMethodError ? 'is-invalid' : ''}
                disabled={isProcessing} // Disable control while processing
              >
                <option value="">Choose...</option>
                {existingPaymentMethods.map((method, index) => (
                  <option key={index} value={method.cardNumber}>Card **** **** **** {method.cardNumber.slice(-4)}</option>
                ))}
                <option value="new">Add New Payment Method</option>
              </Form.Control>
              {paymentMethodError && <div className="invalid-feedback">{paymentMethodError}</div>}
            </Form.Group>
            {selectedPaymentMethod === 'new' && (
              <>
                <Form.Group controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter card number"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentDetailsChange}
                    className={fieldErrors.cardNumber ? 'is-invalid' : ''}
                    disabled={isProcessing} // Disable control while processing
                  />
                  {fieldErrors.cardNumber && <div className="invalid-feedback">{fieldErrors.cardNumber}</div>}
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId="expirationDate">
                      <Form.Label>Expiration Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        name="expirationDate"
                        value={paymentDetails.expirationDate}
                        onChange={handlePaymentDetailsChange}
                        className={fieldErrors.expirationDate ? 'is-invalid' : ''}
                        disabled={isProcessing} // Disable control while processing
                      />
                      {fieldErrors.expirationDate && <div className="invalid-feedback">{fieldErrors.expirationDate}</div>}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter CVV"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentDetailsChange}
                        className={fieldErrors.cvv ? 'is-invalid' : ''}
                        disabled={isProcessing} // Disable control while processing
                      />
                      {fieldErrors.cvv && <div className="invalid-feedback">{fieldErrors.cvv}</div>}
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Col>
        <Col md={6}>
          <h3>Billing Address</h3>
          <Form>
            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="fullName"
                value={billingAddress.fullName}
                onChange={handleBillingAddressChange}
                className={fieldErrors.fullName ? 'is-invalid' : ''}
                disabled={isProcessing} // Disable control while processing
              />
              {fieldErrors.fullName && <div className="invalid-feedback">{fieldErrors.fullName}</div>}
            </Form.Group>
            <Form.Group controlId="addressLine1">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address line 1"
                name="addressLine1"
                value={billingAddress.addressLine1}
                onChange={handleBillingAddressChange}
                className={fieldErrors.addressLine1 ? 'is-invalid' : ''}
                disabled={isProcessing} // Disable control while processing
              />
              {fieldErrors.addressLine1 && <div className="invalid-feedback">{fieldErrors.addressLine1}</div>}
            </Form.Group>
            <Form.Group controlId="addressLine2">
              <Form.Label>Address Line 2 (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address line 2"
                name="addressLine2"
                value={billingAddress.addressLine2}
                onChange={handleBillingAddressChange}
                disabled={isProcessing} // Disable control while processing
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                name="country"
                value={billingAddress.country}
                onChange={handleBillingAddressChange}
                className={fieldErrors.country ? 'is-invalid' : ''}
                disabled={isProcessing} // Disable control while processing
              />
              {fieldErrors.country && <div className="invalid-feedback">{fieldErrors.country}</div>}
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <div className="text-center">
        <Button variant="primary" onClick={handleCheckout} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              {' '}Processing...
            </>
          ) : (
            <>Checkout</>
          )}
        </Button>
      </div>
      {showSuccessAlert && (
        <Alert variant="success" className="mt-3">
          Purchase successful! Redirecting to order history...
        </Alert>
      )}
      {message && <p className="mt-3 text-center">{message}</p>}
    </Container>
  );
};

export default CheckoutScreen;

