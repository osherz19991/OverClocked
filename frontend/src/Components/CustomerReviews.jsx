import React from 'react';
import { Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import StarRating from './StarRating';
import Review from './Review';

// This component is used to display customer reviews for a product in ProductScreen.jsx

const CustomerReviews = ({
    reviews,
    reviewText,
    setReviewText,
    rating,
    setRating,
    addReviewHandler,
    hasPurchased,
    username
}) => {
    return (
        <Row>
            <Col md={12}>
                <Card className="mb-4">
                    <Card.Body>
                        <h3 className="mb-4">Customer Reviews</h3>
                        {/* Conditionally render the review form */}
                        {username && hasPurchased && (
                            <Form onSubmit={addReviewHandler}>
                                <Form.Group controlId='review' className="position-relative">
                                    <Form.Label>Your Review</Form.Label>
                                    <div className="d-flex align-items-start">
                                        <Form.Control
                                            as='textarea'
                                            rows={4}
                                            placeholder="Write your review here..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                        <Form.Group controlId='rating' className="ml-auto position-absolute" style={{ bottom: 115, right: 0, fontSize: 25, fontWeight: 'bold', paddingLeft: 10 }}>
                                            <Form.Label>Your Rating</Form.Label>
                                            <div className="d-flex align-items-center">
                                                <StarRating value={rating} onStarClick={(value) => setRating(value)} />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </Form.Group>
                                <Button type='submit' variant='primary'>
                                    Submit Review
                                </Button>
                            </Form>
                        )}
                        {!username && (
                            <p>Please <a href="/signin">sign in</a> to leave a review.</p>
                        )}
                        {username && !hasPurchased &&(
                            <p>In order to leave a review you must purchase the product</p>
                        )}
                 
                    </Card.Body>
                </Card>
                <ListGroup variant='flush'>
                    {reviews.map((review, index) => (
                        <ListGroup.Item key={index}>
                            <Review review={review} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    );
};

export default CustomerReviews;
