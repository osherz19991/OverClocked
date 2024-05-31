import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Rating from './Rating'; // Import the Rating component

const Review = ({ review }) => (
  <Card className="mb-3">
    <Card.Body>
      <Row>
        <Col>
          <Card.Title as="h5">{review.username}</Card.Title>
        </Col>
        <Col className="text-end">
          <Rating value={review.rating} />
        </Col>
      </Row>
      <hr />
      <Card.Subtitle className="text-muted mb-2">{new Date(review.createdAt).toLocaleDateString()}</Card.Subtitle>
      <Card.Text>{review.text}</Card.Text>
    </Card.Body>
  </Card>
);

export default Review;
