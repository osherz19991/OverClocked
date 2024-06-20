import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetails from '../Components/ProductDetails.jsx';
import CustomerReviews from '../Components/CustomerReviews.jsx';
import RelatedProductsCarousel from '../Components/RelatedProductsCarousel .jsx';
import axios from 'axios';
// The screen that loads when a user clicks on a product, displaying image, description, price,reviews and
// add to cart button as well as related products.
const ProductScreen = () => {
  const [username, setUsername] = useState('');
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { id: productId } = useParams();
  const [message, setMessage] = useState('');
const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

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
      let searchQuery = product.Category;
      const { data } = await axios.get(`/api/products?search=${searchQuery}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  
// This useEffect hook is used to fetch the product details and reviews when the component mounts
// It also sets the username state to the value stored in the local storage
// The productId is passed as a dependency to the useEffect hook so that the product details and reviews are fetched whenever the productId change
  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    fetchProduct();
    fetchReviews();
    setQuantity(1);
  }, [productId]);

  // this useEffect is used to fetch related products when the product state is updated
  // this is necessary because the product state is updated after the fetchProduct function is called
  // and we need to fetch related products only after the product state is updated
  // so we use the product state as a dependency for this useEffect
  // the if condition ensures that it won't run on first render but only after the product state is updated

  useEffect(() => {
    if (product && product.Category) {
      fetchProducts();
    }
  }, [product]);

  useEffect(() => {
    setMessage('');
  }, [productId]);


  
// this useEffect is used to check if the user has purchased the product, when product mounts,
// it will check if the product is in the user's purchase history
// if it is, it will set the hasPurchased state to true.

useEffect(() => {
    const checkPurchaseHistory = async () => {
      try {
        if (product && product._id) { // Checking if product is loaded
          const response = await axios.post('/api/orderHistory', { username });
    
        const orderHistory = response.data;
        
        // Extract all cart items from each order in the orderHistory
        // flatmap is used to flatten the array of arrays into a single array and
        // parse the cartItems string into an array
        const cartItems = orderHistory.flatMap(order => JSON.parse(order.cartItems));
        
        // Check if any cart item has the same _id as the product
        const purchased = cartItems.some(item => item._id === product._id);
        
        setHasPurchased(purchased);
          
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    checkPurchaseHistory(); // Call the async function inside useEffect
  
  }, [product]);

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
      const reviewData = {username, text: reviewText, rating,createdAt: new Date().toISOString()};
      await axios.post(`/api/products/${productId}/addReviews`, reviewData);
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
        Go Home
      </Link>
      <ProductDetails
        product={product}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        addToCartHandler={addToCartHandler}
        message={message}
        hasPurchased={hasPurchased}
      />
      <RelatedProductsCarousel products={products} />
      <CustomerReviews
        reviews={reviews}
        reviewText={reviewText}
        setReviewText={setReviewText}
        rating={rating}
        setRating={setRating}
        addReviewHandler={addReviewHandler}
        hasPurchased={hasPurchased}
        username={username}
      />
    </>
  );
};

export default ProductScreen;
