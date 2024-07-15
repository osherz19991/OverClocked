import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Carousel, Card } from 'react-bootstrap';
import GamingCategories from '../Components/GamingCategories'; 
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'; 

const HomeScreen = () => {
  const [SuggestedProducts, setSuggestedProducts] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchSuggestedProducts();
  }, []);

  const fetchSuggestedProducts = async () => {
    try {
      const response = await axios.post('/api/products/suggested', {
        username: username,
      });
      if(response.data.products){
        setSuggestedProducts(response.data.products);
      }
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

  return (
    <div style={{ padding: '20px', animation: 'fadeIn 1s ease-in-out' }}>
      <GamingCategories />
      <h2 style={{ marginBottom: '20px' }}>Suggested Products For You</h2>
      <Carousel
        variant="dark"
        indicators={false}
        nextIcon={<BsChevronRight style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
        prevIcon={<BsChevronLeft style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
      >
        {Array.from({ length: Math.ceil(SuggestedProducts.length / 6) }).map((_, index) => (
          <Carousel.Item key={index}>
            <Row>
              {SuggestedProducts.slice(index * 6, index * 6 + 6).map((product) => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={2}>
                  <Card className="my-3 p-3 rounded" style={{ position: 'relative', height: '300px', maxWidth: '250px' }}>
                    <Link to={`/product/${product._id}`}>
                      <Card.Img
                        src={product.imgUrl}
                        variant='top'
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          objectFit: 'cover',
                          marginBottom: '10px',
                          transition: 'transform 0.3s ease-in-out',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    </Link>
                    <Card.Body>
                      <Link to={`/product/${product._id}`}>
                        <Card.Title as='div'>
                          <strong>{product.title && product.title.substring(0, 40)}</strong>
                        </Card.Title>
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

export default HomeScreen;
