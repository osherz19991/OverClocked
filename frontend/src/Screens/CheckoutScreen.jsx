// CheckoutScreen.js

import React, { useState } from 'react';
import axios from 'axios';

const CheckoutScreen = ({ cartItems}) => {
  const [message, setMessage] = useState('');
  const totalPrice = parseFloat(localStorage.getItem('totalPrice')).toFixed(3);
  const handleCheckout = async () => {
    try {
      // Make a POST request to the backend to process the checkout
      const response = await axios.post('/api/checkout', {
        username: localStorage.getItem('username'),
        cartItems: localStorage.getItem('cartItems'),
        totalPrice,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during checkout:', error);
      setMessage('Failed to process checkout');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={handleCheckout}>Checkout</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckoutScreen;
