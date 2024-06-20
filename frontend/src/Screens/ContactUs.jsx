import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const ContactUs = () => {
    return (
        <Container className="py-5">
            <Row>
                <Col>
                    <h2>Contact Us</h2>
                    <p>At OverClocked, we're here to help you with all your computer component and gaming needs. Whether you have a question about our products, need assistance with an order, or just want to share your feedback, we're always ready to hear from you.</p>
                    
                    <h4>Customer Support:</h4>
                    <p><strong>Email:</strong> </p>
                    <p><strong>Phone:</strong> </p>
                 
                    
                    <h4>Mailing Address:</h4>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    
                    <h4>Business Hours:</h4>
                    <p></p>
                    <p></p>
                    <p></p>
                    
                   
                    
                    <p>We look forward to connecting with you! <Link to="/">Go back to shopping</Link></p>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
