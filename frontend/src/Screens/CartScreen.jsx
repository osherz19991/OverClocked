import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Image } from 'react-bootstrap';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          // Parse the stored cart items as an array
          setCartItems(JSON.parse(storedCartItems));
        } else {
          setCartItems([]); // If no items are stored, set an empty array
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    
    fetchCartItems();
  }, []);
  
  const handleEmptyCart = () => {
    localStorage.removeItem('cartItems');
    setCartItems([]); // Clear the cart items in state
  };
  
  const handleCheckout = () => {
    localStorage.setItem('totalPrice', totalPrice);
    navigate('/checkout'); // Use navigate to redirect to checkout page
  };
  
  const handleRemoveItem = (itemToRemove) => {
    // Find the index of the item to remove
    const itemIndex = cartItems.findIndex(item => item === itemToRemove);
  
    if (itemIndex !== -1) {
      // Create a copy of the cartItems array
      const updatedCartItems = [...cartItems];
  
      // Decrement the quantity of the item at the found index
      updatedCartItems[itemIndex].quantity = Math.max(0, updatedCartItems[itemIndex].quantity - 1);
  
      // Update the cartItems in state and local storage
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
  };
  
  
  
  
  
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div>Your cart is empty. <Link to="/">Go back to shopping</Link></div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '100px' }}>
                  <Image src={item.imgUrl} alt={item.title} style={{ width: '50px', height: '50px' }} />
                </div>
                <div style={{ marginRight: '100px' }}>
                  Quantity: {item.quantity}
                </div>
                <div style={{ marginRight: '100px' }}>
                  Price: ${item.price}
                </div>
                <div>
                  <button onClick={() => handleRemoveItem(item)}>Cancel</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={handleEmptyCart}>Empty Cart</button>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
