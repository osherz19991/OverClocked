import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom';

export const Product = ({product}) => {
  return (
  <Card className="my-3 p-3 rounded"style={{ height: '100%' }}>
    <Link to={`/product/${product._id}`}>
      <Card.Img src={product.imgUrl} variant='top' />
    </Link>
    <Card.Body>
      <Link to={`/product/${product._id}`}>
        <Card.Title as='div'><strong>{product.title}</strong></Card.Title>
      </Link>
      <Card.Text as='div'>
        <Rating value={Number(product.stars)} 
        text={`${product.numReviews} reviews`} />
       
      </Card.Text>
      <Card.Text as='h3'>${product.price}</Card.Text>
    </Card.Body>
    
  </Card>
  )
}
