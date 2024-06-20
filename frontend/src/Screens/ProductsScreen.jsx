// ProductsScreen.js

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button, Carousel, Card } from 'react-bootstrap';
import { Product } from '../Components/Product';
import PaginationComponent from '../Components/PaginationComponet';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'; // Import icons for next and previous arrows

const ProductsScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [SuggestedProducts, setSuggestedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('desc');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products?search=${searchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const { data } = response;
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
    fetchSuggestedProducts();
  }, [searchQuery, sortBy, sortOrder]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
  };
  
  const fetchSuggestedProducts = async () => {
    try {
      const response = await axios.post('/api/products/suggested', {
        username: username,
      });
      if(response.data.product)
        setSuggestedProducts(response.data.products);
      else
      {
        const response = await axios.get(`/api/products`);
        const { data } = response;
        setSuggestedProducts(data.products);
      }
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
        <Button variant="primary" onClick={() => handleSort('stars')}>
          Sort by Rating {sortBy === 'stars' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Button>
      </div>
      <Row>
        {currentProducts.map((product) => (
          <Col key={product._id} sm={12} md={12} lg={12} xl={12}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-center mt-3">
        <PaginationComponent currentPage={currentPage} totalPages={Math.ceil(products.length / productsPerPage)} onPageChange={paginate} />
      </div>
    
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
