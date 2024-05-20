import React from 'react';
import { Navbar, Nav, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const Footer = () => {
  return (
    <footer>
    <Navbar className="custom-navbar" bg="dark" variant="dark" expand="lg" collapseOnSelect>

      <Container>
      <Navbar.Brand>
            <LinkContainer to="/">
              <div>
                <img
                  src={'/images/logo.png'} alt="OverClocked Logo" style={{ marginBottom: '10px' }} />
                OverClocked
              </div>
            </LinkContainer>
          </Navbar.Brand>
        <Row>
          <Col md={6} className="text-center text-md-left">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </Col>
          <Col md={6} className="text-center text-md-right">
            <p>&copy; 2024 OverClocked. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
      </Navbar>

    </footer>
  );
};


export default Footer;
