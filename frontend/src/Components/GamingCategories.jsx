import React, { useState } from 'react';
import { Card, Container, Carousel, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

import { Link } from 'react-router-dom';


const GamingCategories = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{ width: '100%', marginRight: 'auto' }}>
      <Carousel activeIndex={index} onSelect={handleSelect} indicators={true}>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/productsScreen/?search=headsets">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{ maxHeight: '300px', maxWidth:'800px'}} src="/images/headset.jpg" alt="Headset" />
                  <Carousel.Caption>
                    <h3 className="custom-title">Shop Headsets</h3>
                  </Carousel.Caption>
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/productsScreen/?search=gaming keyboard">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{  maxHeight: '300px', maxWidth:'800px' }} src="/images/keyboard.jpg" alt="Keyboard" />
                  <Carousel.Caption>
                    <h3 className="custom-title">Shop Keyboards</h3>
                  </Carousel.Caption>
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/productsScreen/?search=Graphics%20Card">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{  maxHeight: '300px', maxWidth:'1000px' }} src="/images/GraphicsCard.jpg" alt="Graphics Card" />
                  <Carousel.Caption>
                    <h3 className="custom-title">Shop Graphics Cards</h3>
                  </Carousel.Caption>
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/productsScreen/?search=MotherBoard">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{  maxHeight: '300px', maxWidth:'800px' }} src="/images/MotherBoard.jpg" alt="Motherboard" />
                  <Carousel.Caption>
                    <h3 className="custom-title">Shop Motherboards</h3>
                  </Carousel.Caption>
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
      </Carousel>
    </div>
  );
  };
   
  export default GamingCategories;
