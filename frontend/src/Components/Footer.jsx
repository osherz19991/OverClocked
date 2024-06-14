import React from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const styles = {
  navbar: {
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center', // Center the Navbar horizontally
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandImage: {
    marginBottom: '0',
    marginRight: '10px',
    width: '40px',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center', // Center the quick links horizontally
    gap: '20px',
    padding: 0,
    listStyle: 'none',
    margin: '20px 0',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  footerText: {
    margin: 0,
    color: '#fff',
  },
};

export const Footer = () => {
  return (
    <footer>
      <Navbar className="custom-navbar" bg="dark" variant="dark" expand="lg" collapseOnSelect style={styles.navbar}>
        <Container>
          <Row className="w-100">
            <Col md={8} className="text-center"> {/* Adjusted the Col width */}
              <h5 style={{ color: '#fff' }}>Quick Links</h5>
              <ul style={styles.footerLinks}>
                <li>
                  <LinkContainer to="/">
                    <Link style={styles.link}>Home</Link>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to="/about-us">
                    <Link style={styles.link}>About Us</Link>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to="/contact-us">
                    <Link style={styles.link}>Contact Us</Link>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to="/forum">
                    <Link style={styles.link}>Forum</Link>
                  </LinkContainer>
                </li>
              </ul>
            </Col>
            <Col md={4} className="text-center text-md-right">
              <p style={styles.footerText}>&copy; 2024 OverClocked. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </footer>
  );
};

export default Footer;
