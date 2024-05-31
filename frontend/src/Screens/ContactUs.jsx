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
                    <p><strong>Phone:</strong> +1 (800) 555-1234</p>
                    <p><strong>Live Chat:</strong> Available 24/7 on our website</p>
                    
                    <h4>Mailing Address:</h4>
                    <p>OverClocked, Inc.</p>
                    <p>123 Tech Avenue</p>
                    <p>Silicon Valley, CA 94043</p>
                    <p>USA</p>
                    
                    <h4>Business Hours:</h4>
                    <p>Monday to Friday: 9:00 AM - 6:00 PM (PST)</p>
                    <p>Saturday: 10:00 AM - 4:00 PM (PST)</p>
                    <p>Sunday: Closed</p>
                    
                    <h4>Follow Us on Social Media:</h4>
                    <p><strong>Facebook:</strong> <a href="https://facebook.com/OverClocked" target="_blank" rel="noopener noreferrer">facebook.com/OverClocked</a></p>
                    <p><strong>Twitter:</strong> <a href="https://twitter.com/OverClocked" target="_blank" rel="noopener noreferrer">twitter.com/OverClocked</a></p>
                    <p><strong>Instagram:</strong> <a href="https://instagram.com/OverClocked" target="_blank" rel="noopener noreferrer">instagram.com/OverClocked</a></p>
                    
                    <p>We look forward to connecting with you! <Link to="/">Go back to shopping</Link></p>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
