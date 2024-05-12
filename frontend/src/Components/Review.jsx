import React from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import Rating from './Rating'; // Import the Rating component

const Review = ({ review }) => {
  return (
    <ListGroup.Item>
      <strong>{review.user}</strong> {/* Display the name of the user */}
      <Rating value={review.rating} /> {/* Display the rating */}
      <p>{review.text}</p> {/* Display the review text */}
      <p>{review.createdAt.substring(0, 10)}</p> {/* Display the creation date */}
      {/* Add a form to allow users to rate the review */}
      <Form.Group controlId='reviewRating'>
        <Form.Label>Rate this review:</Form.Label>
        <Form.Control as='select'>
          <option value='1'>1 - Poor</option>
          <option value='2'>2 - Fair</option>
          <option value='3'>3 - Average</option>
          <option value='4'>4 - Good</option>
          <option value='5'>5 - Excellent</option>
        </Form.Control>
      </Form.Group>
    </ListGroup.Item>
  );
};

export default Review;
