import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import { Product } from '../Components/Product';
import GamingCategories from '../Components/GamingCategories'; // Import the GamingCategories component

const HomeScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('price'); // Default sorting by price
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order ascending

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
  }, [searchQuery, sortBy, sortOrder]);

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
      <GamingCategories />
      <h1>Latest Products</h1>
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
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      {/* Add the GamingCategories component */}
    </div>
  );
};

export default HomeScreen;
