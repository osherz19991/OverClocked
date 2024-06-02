import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Button, Table } from 'react-bootstrap';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleEmptyCart = () => {
    localStorage.removeItem('cartItems');
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    localStorage.setItem('totalPrice', totalPrice);
    navigate('/checkout');
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedCartItems = cartItems.map(item => {
      if (item === itemToRemove) {
        item.quantity = Math.max(0, item.quantity - 1); // Decrease quantity by 1
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove items with quantity zero

    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="mb-4">Your cart is empty. <Link to="/">Go back to shopping</Link></div>
      ) : (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td><Link to={`/product/${item._id}`}><Image src={item.imgUrl} alt={item.title} style={{ width: '50px', height: '50px' }} /></Link></td>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td><Button variant="danger" onClick={() => handleRemoveItem(item)}>Remove</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mb-3">
            <Button variant="danger" onClick={handleEmptyCart}>Empty Cart</Button>{' '}
            <Button variant="primary" onClick={handleCheckout}>Proceed to Checkout</Button>
          </div>
          <p className="mb-0">Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
