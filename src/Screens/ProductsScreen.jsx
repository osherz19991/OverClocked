import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button, Carousel, Card } from 'react-bootstrap';
import { Product } from '../Components/Product';
import Rating from '../Components/Rating'
import GamingCategories from '../Components/GamingCategories'; // Import the GamingCategories component
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'; // Import icons for next and previous arrows

const ProductsScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [SuggestedProducts, setSuggestedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('price'); // Default sorting by price
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order ascending
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products?search=${searchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const { data } = response;
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
    fetchSuggestedProducts();
  }, [searchQuery, sortBy, sortOrder]);

  const fetchSuggestedProducts = async () => {
    try {
      const response = await axios.post('/api/products/suggested', {
        username: username,
      });
      setSuggestedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      // Toggle sorting order if the same criteria is clicked again
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting criteria changed, set it to the new criteria and default to ascending order
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };



  return (
    <div>
      <div>
        <Button variant="primary" onClick={() => handleSort('price')}>
          Sort by Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Button>{' '}
        <Button variant="primary" onClick={() => handleSort('rating')}>
          Sort by Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Button>
      </div>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={12} lg={12} xl={12}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <h2>Suggested Products For You</h2>
      <Carousel
        variant="dark"
        indicators={false}
        nextIcon={<BsChevronRight style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)' }} />}
        prevIcon={<BsChevronLeft style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)' }} />}
      >
        {Array.from({ length: Math.ceil(SuggestedProducts.length / 6) }).map((_, index) => (
          <Carousel.Item key={index}>
            <Row>
              {SuggestedProducts.slice(index * 6, index * 6 + 6).map((product) => (
                <Col sm={12} md={6} lg={2} key={product._id}>
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
    </div>
  );
};

export default ProductsScreen;
