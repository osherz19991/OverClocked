import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductDetails from '../Components/ProductDetails.jsx';
import CustomerReviews from '../Components/CustomerReviews.jsx';
import RelatedProductsCarousel from '../Components/RelatedProductsCarousel .jsx';
import UserRoleChecker from '../Components/UserRoleChecker';
import axios from 'axios';

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
  const [userRole, setUserRole] = useState('normal');
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [editedProduct, setEditedProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        try {
          const role = await UserRoleChecker({ username: storedUsername });
          setUserRole(role);
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      }
    };

    checkUserRole();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [productId]);

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }, [productId]);

  const fetchProducts = useCallback(async () => {
    try {
      let searchQuery = product.Category;
      const { data } = await axios.get(`/api/products?search=${searchQuery}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [product.Category]);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    fetchProduct();
    fetchReviews();
    setQuantity(1);
  }, [fetchProduct, fetchReviews]);

  useEffect(() => {
    if (product && product.Category) {
      fetchProducts();
    }
  }, [product, fetchProducts]);

  useEffect(() => {
    setMessage('');
  }, [productId]);

  useEffect(() => {
    const checkPurchaseHistory = async () => {
      try {
        if (product && product._id) {
          const response = await axios.post('/api/orderHistory', { username });
          const orderHistory = response.data;
          const cartItems = orderHistory.flatMap(order => JSON.parse(order.cartItems));
          const purchased = cartItems.some(item => item._id === product._id);
          setHasPurchased(purchased);
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    checkPurchaseHistory();
  }, );

  const addToCartHandler = async () => {
    try {
      setMessage('Product added to cart successfully');
      updateCartInLocalStorage(product, quantity);

      const updatedQuantity = product.quantity - quantity;

      await axios.put(`/api/products/${productId}/updateQuantity`, { quantity: updatedQuantity });

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
      const reviewData = { username, text: reviewText, rating, createdAt: new Date().toISOString() };
      await axios.post(`/api/products/${productId}/addReviews`, reviewData);
      fetchReviews();
      setReviewText('');
      setRating(0);
      navigate(0);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleEdit = () => {
    // Toggle edit mode and set initial values for edited product
    setEditMode(true);
    setEditedProduct(product);
  };

  const handleDelete = async () => {
    try {
      await axios.put(`/api/products/${productId}/delete`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const { title, Category, price } = editedProduct;
      const updatedProduct = { title, Category, price };
      await axios.put(`/api/products/${productId}/update`, updatedProduct);
      setProduct(updatedProduct); // Update local product state with edited values
      setEditMode(false); // Exit edit mode
      navigate(0);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Home
      </Link>
      <ProductDetails
        product={editMode ? editedProduct : product} // Display editedProduct if in edit mode
        quantity={quantity} // Display editedQuantity if in edit mode
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
      {userRole === 'admin' && !editMode && (
        <div className="admin-edit-section">
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit Product
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Remove
          </button>
        </div>
      )}
      {editMode && (
        <div className="admin-edit-section">
          <h3>Edit Product</h3>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              className="form-control"
              value={editedProduct.title}
              onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <textarea
              className="form-control"
              value={editedProduct.Category}
              onChange={(e) => setEditedProduct({ ...editedProduct, Category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              className="form-control"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      )}
    </>
  );
};

export default ProductScreen;
