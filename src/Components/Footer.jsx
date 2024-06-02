import React from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const styles = {
  navbar: {
    padding: '10px 0',
    display: 'flex', // Set footer navbar as flex container
    justifyContent: 'space-between', // Align items to the start and end of the container
    alignItems: 'center', // Center items vertically
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandImage: {
    marginBottom: '15px',
    marginRight: '10px',
  },
  footerLinks: {
    display: 'flex', // Set footer links as flex container
    justifyContent: 'center', // Center items horizontally
    gap: '25%',
    padding: 0,
    listStyle: 'none',
    marginBottom: '40px',
    marginRight: '-50%',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  footerText: {
    margin: 0,
  },
};

export const Footer = () => {
  return (
    <footer>
      <Navbar className="custom-navbar" bg="dark" variant="dark" expand="lg" collapseOnSelect style={styles.navbar}>
        <Container>
          <Navbar.Brand style={styles.brand}>
            <LinkContainer to="/">
              <div>
                <img
                  src={'/images/logo.png'}
                  alt="OverClocked Logo"
                  style={styles.brandImage}
                />
                OverClocked
              </div>
            </LinkContainer>
          </Navbar.Brand>
          <Row className="w-100">
            <Col md={6} className="text-center text-md-left">
              <h5>Quick Links</h5>
              <ul style={styles.footerLinks}>
                <li><a href="/" style={styles.link}>Home</a></li>
                <li><a href="/about-us" style={styles.link}>About Us</a></li>
                <li><a href="/contact-us" style={styles.link}>Contact Us</a></li>
              </ul>
            </Col>
            <Col md={6} className="text-center text-md-right">
              <p style={styles.footerText}>&copy; 2024 OverClocked. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </footer>
  );
};

export default Footer;
