import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const GamingCategories = () => {
  return (
    <div>
      <h2>Gaming Categories</h2>
      <Row>
        <Col sm={6} md={3}>
          <Card>
            <Card.Img variant="top" src="/images/headset.jpg" />
            <Card.Body>
              <Card.Title>Headset</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} md={3}>
          <Card>
            <Card.Img variant="top" src="/images/logo.png" />
            <Card.Body>
              <Card.Title>Keyboard</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} md={3}>
          <Card>
            <Card.Img variant="top" src="/images/category3.jpg" />
            <Card.Body>
              <Card.Title>Racing</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} md={3}>
          <Card>
            <Card.Img variant="top" src="/images/category4.jpg" />
            <Card.Body>
              <Card.Title>Strategy</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GamingCategories;
