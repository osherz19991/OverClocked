import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const AboutUs = () => {
    return (
        <Container className="py-5">
            <Row>
                <Col>
                    <h2>About Us</h2>
                    <p>At OverClocked, we are passionate about technology and gaming. Our mission is to provide enthusiasts, gamers, and professionals with the best computer components and gaming gear available on the market.</p>
                    
                    <h4>What We Offer:</h4>
                    <ul>
                        <li><strong>Premium Computer Components:</strong> From the latest CPUs and GPUs to motherboards, RAM, and storage solutions, we stock only the best products from top manufacturers.</li>
                        <li><strong>Gaming Gear:</strong> Elevate your gaming experience with our selection of high-quality peripherals, including keyboards, mice, headsets, and monitors.</li>
                        <li><strong>Expert Advice and Support:</strong> Our team of tech experts is always on hand to provide guidance, whether you're building a custom PC or looking for upgrade recommendations.</li>
                        <li><strong>Community and Content:</strong> We believe in building a community of like-minded enthusiasts. Check out our blog and forums for the latest news, reviews, and how-tos.</li>
                    </ul>
                    
                    <h4>Our Values:</h4>
                    <ul>
                        <li><strong>Quality:</strong> We are committed to offering products that meet the highest standards of performance and reliability.</li>
                        <li><strong>Customer Satisfaction:</strong> Your satisfaction is our top priority. We strive to provide exceptional customer service and support at every stage of your shopping experience.</li>
                        <li><strong>Innovation:</strong> Staying ahead in the fast-paced world of technology is key. We continuously update our inventory to ensure we have the latest and greatest products.</li>
                    </ul>
                    
                    <h4>Join the OverClocked Community:</h4>
                    <p>We invite you to explore our site and join our forums. Whether you're a seasoned gamer, a tech professional, or just starting your journey into the world of high-performance computing, OverClocked is here to help you achieve your goals.</p>
                    
                    <p>Thank you for choosing OverClocked. Together, let's push the limits of what's possible. <Link to="/">Go back to shopping</Link></p>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;
