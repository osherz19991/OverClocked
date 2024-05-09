import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form, Carousel } from 'react-bootstrap';
import Rating from '../Components/Rating';
import { Product } from '../Components/Product';
import axios from 'axios';

const ProductScreen = () => {
  const [username, setUsername] = useState('');
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { id: productId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };

    fetchProduct();
    if (product) {

      const fetchProducts = async () => {

        try {
          const { data } = await axios.get(`/api/products?search=${product.Category}`);
          if (product.Category == "other")
            data = await axios.get(`/api/products?search=${Product.title}`);
          console.log(data.products);
          setProducts(data.products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

      fetchProducts();
    }
  }, [productId]);
  const addToCartHandler = async () => {
    try {
      setMessage('Product added to cart successfully');
      updateCartInLocalStorage(product, quantity);
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
              {product.quantity > 0 &&(
              <ListGroup.Item>
                <Button
                  className='btn-block'
                  type='button'
                  disabled={product.quantity === 0}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
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
            <Carousel indicators={false} prevLabel={<span style={{ color: 'blue', marginRight: '150px' }}>&#10094;</span>} nextLabel={<span style={{ color: 'red' }}>&#10095;</span>}>
              {products.map((relatedProduct, index) => {
                if (index % 4 === 0) {
                  return (
                    <Carousel.Item key={index}>
                      <Row>
                        {products.slice(index, index + 4).map((product) => (
                          <Col sm={12} md={6} lg={3} key={product._id}>
                            <Product product={product} />
                          </Col>
                        ))}
                      </Row>
                    </Carousel.Item>
                  );
                } else {
                  return null;
                }
              })}
            </Carousel>
          )}
        </Col>
      </Row>

    </>
  );
};

export default ProductScreen;
