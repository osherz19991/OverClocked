import React from 'react';
import { Card, Button } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';
// This component is used to display products in a card format in the ProductsScreen component
export const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded" style={{ position: 'relative' }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.imgUrl} variant='left' style={{ maxHeight: '200px', maxWidth: '250px' }} />
      </Link>
      <div style={{ position: 'absolute', top: '40px', right: '40px', textAlign: 'right', color: '#333' }}>
        <Card.Text as='h3'>${product.price}</Card.Text>
        <Card.Text as='div'>
          <Rating value={Number(product.stars)} />
        </Card.Text>
      </div>
        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as='div' ><strong>{product.title}</strong></Card.Title>
          </Link>
        </Card.Body>
    </Card>
  );
};
