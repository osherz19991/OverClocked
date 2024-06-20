import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const { username } = useParams();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('/api/orderHistory', {
          username: localStorage.getItem('username'),
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await axios.get(`/api/orderHistory/${username}`);
  //       setOrders(response.data);
  //     } catch (error) {
  //       console.error('Error fetching orders:', error);
  //     }
  //   };
  //     fetchOrders();
 
  // }, [username]);

  useEffect(() => {
    // Update localStorage only when orders state changes
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <Container style={{ marginTop: '20px', animation: 'fadeIn 1s ease-in-out' }}>
      <h2 className="mb-4">Order History</h2>
      {orders.length === 0 ? (
        <Card className="p-4">
          <div>No orders found.</div>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4 p-4">
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <h4>Order ID: {order.id}</h4>
                  <p>
                    <strong>Total Price:</strong> ${order.totalPrice}
                  </p>
                  <p>
                    <strong>Order Date:</strong> {new Date(order.date).toLocaleDateString('en-GB')}
                  </p>
                </Col>
              </Row>
              <h5>Order Items:</h5>
              {JSON.parse(order.cartItems).map((item) => (
                <Row key={item._id} className="mb-3 align-items-center">
                  <Col xs={2} sm={1}>
                    <Link to={`/product/${item._id}`}>
                      <Image src={item.imgUrl} alt={item.title} fluid rounded />
                    </Link>
                  </Col>
                  <Col xs={10} sm={11}>
                    <Row>
                      <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                        <strong>{item.title}</strong>
                      </Col>
                      <Col xs={6} sm={2}>
                        <p className="mb-0">Quantity: {item.quantity}</p>
                      </Col>
                      <Col xs={6} sm={2}>
                        <p className="mb-0">Price: ${item.price}</p>
                      </Col>
                      <Col xs={12} sm={2}>
                        <p className="mb-0">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
              <hr />
            </Card.Body>
          </Card>
        ))
      )}
      <div className="text-center mt-4">
        <Link to="/">
          <Button variant="primary">Go back to Home</Button>
        </Link>
      </div>
    </Container>
  );
};

export default OrderHistoryScreen;
