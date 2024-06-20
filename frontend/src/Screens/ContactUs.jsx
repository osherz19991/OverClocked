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
                    <p><strong>Email:</strong> support@overclocked.com</p>
                    <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                 
                    <h4>Mailing Address:</h4>
                    <p>OverClocked Inc.</p>
                    <p>123 Tech Lane</p>
                    <p>Tel aviv, CA 94043</p>
                    <p>Israel</p>
                    
                    <h4>Business Hours:</h4>
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    
                    <p>We look forward to connecting with you! <Link to="/">Go back to shopping</Link></p>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
