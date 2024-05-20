import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form, Carousel } from 'react-bootstrap';
import Rating from '../Components/Rating';
import { Product } from '../Components/Product';
import Review from '../Components/Review';
import axios from 'axios';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'; // Import icons for next and previous arrows

const ProductScreen = () => {
  const [username, setUsername] = useState('');
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { id: productId } = useParams();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products?search=${product.Category}`);
      if (product.Category === "other")
        data = await axios.get(`/api/products?search=${product.title}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    fetchProduct();
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (product && product.Category) {
      fetchProducts();
    }
  }, [product]);


  const addToCartHandler = async () => {
    try {
      setMessage('Product added to cart successfully');
      updateCartInLocalStorage(product, quantity);

      // Calculate the updated quantity
      const updatedQuantity = product.quantity - quantity;

      // Send a PUT request to update the product quantity
      await axios.put(`/api/products/${productId}/updateQuantity`, { quantity: updatedQuantity });

      // After updating the quantity, fetch the product again to reflect the changes
      fetchProduct();
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setMessage('Failed to add product to cart');
    }
  };


  const updateCartInLocalStorage = (product, quantity) => {
    const cartItems = getCartFromLocalStorage();
    const updatedCart = [...cartItems, { ...product, quantity }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const getCartFromLocalStorage = () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const addReviewHandler = async () => {
    try {
      // Make a POST request to add the review
      await axios.post(`/api/products/${productId}/reviews`, { text: reviewText });
      // Fetch the updated list of reviews for the product
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      // Update the reviews state with the new list of reviews
      setReviews(data);
      // Clear the review text field
      setReviewText('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.imgUrl} alt={product.title} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.title}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.stars} text={`${product.numReviews} reviews`} />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.title}</ListGroup.Item>
            <ListGroup.Item>Category: {product.Category}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
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
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity:</Col>
                    <Col>
                      <Form.Control as='select' value={quantity} onChange={handleQuantityChange}>
                        {[...Array(product.quantity).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              {product.quantity > 0 && (
                <ListGroup.Item>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.quantity === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                  {message && <p>{message}</p>}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3>Related Products</h3>
          {products.length === 0 ? (
            <p>No related products available</p>
          ) : (
            <Carousel
            variant="dark"
            indicators={false}
            nextIcon={<BsChevronRight style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)' }} />}
            prevIcon={<BsChevronLeft style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)' }} />}
          >
            {Array.from({ length: Math.ceil(products.length / 5) }).map((_, index) => (
              <Carousel.Item key={index}>
                <Row>
                  {products.slice(index * 5, index * 5 + 5).map((product) => (
                    <Col key={product._id}>
                      <Card className="my-3 p-3 rounded" style={{ position: 'relative', height: '300px', maxWidth: '250px' }}>
                        <Link to={`/product/${product._id}`}>
                          <Card.Img src={product.imgUrl} variant='left' style={{ maxWidth: '100%', maxHeight: '100px' }} />
                        </Link>
                        <Card.Body>
                          <Link to={`/product/${product._id}`}>
                            <Card.Title as='div'><strong>{product.title && product.title.substring(0, 40)}</strong></Card.Title>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3>Customer Reviews</h3>
          {/* Review form */}
          <Form onSubmit={addReviewHandler}>
            <Form.Group controlId='review'>
              <Form.Label>Write a Review</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Submit Review
            </Button>
          </Form>
          <ListGroup variant='flush'>
            {reviews.map((review, index) => (
              <ListGroup.Item key={index}>
                <strong>{review.user}</strong>
                <Rating value={review.rating} />
                <p>{review.text}</p>
                <p>{review.createdAt?.substring(0, 10)}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
