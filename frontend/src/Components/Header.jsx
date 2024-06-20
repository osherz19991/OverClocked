import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar, Nav, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserRoleChecker from './UserRoleChecker';

const Header = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [userRole, setUserRole] = useState('normal');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await UserRoleChecker({ username: username });
        setUserRole(role);
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate('/');
      }
    };

    checkUserRole();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    // Check if searchInput is empty or contains only whitespace
    if (searchInput.trim() === '') {
      navigate(`/productsScreen/?search=amd`);
      setSearchInput(''); // Clear the search input
    } else {
      navigate(`/productsScreen/?search=${searchInput.trim()}`);
      setSearchInput(''); // Clear the search input
    }
  };

  const handleUserClick = () => {
    if (username) {
      navigate('/userInfo');
    } else {
      navigate('/signin');
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <header>
      <Navbar className="custom-navbar" bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand>
            <LinkContainer to="/">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={'/images/logo.png'} alt="OverClocked Logo" style={{ marginBottom: '10px' }} />
                OverClocked
              </div>
            </LinkContainer>
          </Navbar.Brand>

          <Form onSubmit={handleSearchSubmit} className="mb-0">
            <Row className="align-items-center">
              <Col xs={8} md={9}>
                <Form.Group controlId="search" className="mb-1" style={{ width: '38vw' }}>
                  <Form.Control
                    type="text"
                    placeholder="Search Products"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={4} md={3} className="d-flex align-items-center justify-content-end" style={{ width: '10vw' }}>
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={{ width: '10vw', alignItems: 'center' }}>
              <LinkContainer to="/cart">
                <Nav.Link style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <FaShoppingCart style={{ marginRight: '5px' }} /> Cart
                </Nav.Link>
              </LinkContainer>
              {username ? (
                <Nav.Link onClick={handleUserClick} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <FaUser style={{ marginRight: '5px' }} /> {username}
                </Nav.Link>
              ) : (
                <LinkContainer to="/signin">
                  <Nav.Link style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <FaUser style={{ marginRight: '5px' }} /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userRole === 'admin' && (
                <Nav.Link onClick={handleAdminClick} style={{ display: 'flex', alignItems: 'center' }}>
                  <RiAdminFill style={{ marginRight: '5px' }} /> Admin
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};


export default Header;
