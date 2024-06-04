import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetails from '../Components/ProductDetails.jsx';
import CustomerReviews from '../Components/CustomerReviews.jsx';
import RelatedProductsCarousel from '../Components/RelatedProductsCarousel .jsx';
import axios from 'axios';

const ProductScreen = () => {
  const [username, setUsername] = useState('');
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { id: productId } = useParams();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products?search=${product.Category}`);
      if (product.Category === "other")
        data = await axios.get(`/api/products?search=${product.title}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    fetchProduct();
    fetchReviews();
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    if (product && product.Category) {
      fetchProducts();
    }
  }, [product]);

  useEffect(() => {
    setMessage('');
  }, [productId]);

  const addToCartHandler = async () => {
    try {
      setMessage('Product added to cart successfully');
      updateCartInLocalStorage(product, quantity);

      // Calculate the updated quantity
      const updatedQuantity = product.quantity - quantity;

      // Send a PUT request to update the product quantity
      await axios.put(`/api/products/${productId}/updateQuantity`, { quantity: updatedQuantity });

      // After updating the quantity, fetch the product again to reflect the changes
      fetchProduct();
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setMessage('Failed to add product to cart');
    }
  };


  const updateCartInLocalStorage = (product, quantity) => {
    const cartItems = getCartFromLocalStorage();
    const updatedCart = [...cartItems, { ...product, quantity }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const getCartFromLocalStorage = () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const addReviewHandler = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        username,
        text: reviewText,
        rating,
        createdAt: new Date().toISOString(),
      };
      await axios.post(`/api/products/${productId}/reviews`, reviewData);
      fetchReviews();
      setReviewText('');
      setRating(0);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <ProductDetails
        product={product}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        addToCartHandler={addToCartHandler}
        message={message}
      />
      <RelatedProductsCarousel products={products} />
      <CustomerReviews
        reviews={reviews}
        reviewText={reviewText}
        setReviewText={setReviewText}
        rating={rating}
        setRating={setRating}
        addReviewHandler={addReviewHandler}
      />
    </>
  );
};

export default ProductScreen;
