import React from 'react';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from './Rating';

const ProductDetails = ({ product, quantity, handleQuantityChange, addToCartHandler, message }) => {
  return (
    <Row>
      <Col md={5}>
        <Image src={product.imgUrl} alt={product.title} fluid />
      </Col>
      <Col md={4}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h3>{product.title}</h3>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating
              value={product.stars}
              text={
                product.reviews && product.reviews.length > 0
                  ? `${product.reviews.length} reviews`
                  : 'No reviews yet. Be the first to add one.'
              }
            />
          </ListGroup.Item>
          <ListGroup.Item>Category: {product.Category}</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>Price:</Col>
                <Col>
                  <strong>${product.price}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Status:</Col>
                <Col>
                  <strong>{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            {product.quantity > 0 && (
              <>
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity:</Col>
                    <Col>
                      <Form.Control as="select" value={quantity} onChange={handleQuantityChange}>
                        {[...Array(product.quantity).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.quantity === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                  {message && <p>{message}</p>}
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDetails;
