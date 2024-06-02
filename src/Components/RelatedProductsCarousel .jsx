import React from 'react';
import { Row, Col, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const RelatedProductsCarousel = ({ products }) => {
  return (
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
  );
};

export default RelatedProductsCarousel;
