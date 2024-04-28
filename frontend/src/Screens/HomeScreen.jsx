import { useEffect, useState} from 'react';
import React from 'react'
import {Row, Col}   from 'react-bootstrap'
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {   
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    }
    fetchProducts();

  }, []);
  return (
  <>
    <h1>Latest Products</h1>
    <Row>
        
  </Row>
  </>
  )
}

export default HomeScreen