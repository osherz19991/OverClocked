import React, { useState } from 'react';
import { Carousel, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GamingCategories = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Gaming Categories</h2>
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null} indicators={false}>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/?search=headsets">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{ height: '400px' }} src="/images/headset.jpg" alt="Headset" />
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/?search=keyboard">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{ height: '400px' }} src="/images/keyboard.jpg" alt="Keyboard" />
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/?search=Graphics%20Card">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{ height: '400px' }} src="/images/GraphicsCard.jpg" alt="Graphics Card" />
                </div>
              </Link>
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Link to="/?search=MotherBoard">
                <div className="category-item d-flex justify-content-center align-items-center">
                  <img className="d-block w-150" style={{ height: '400px' }} src="/images/MotherBoard.jpg" alt="Motherboard" />
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
