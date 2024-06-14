import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import SignUpScreen from './Screens/SignupScreen';
import SigninScreen from './Screens/SigninScreen';
import UserScreen from './Screens/UserScreen';
import CartScreen from './Screens/CartScreen';
import CheckoutScreen from './Screens/CheckoutScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';
import ProductsScreen from './Screens/ProductsScreen';
import PasswordReset from './Screens/PasswordReset';
import AboutUs from './Screens/AboutUsScreen';
import ContactUs from './Screens/ContactUs';
import ForumScreen from './Screens/ForumScreen';
import AdminScreen from './Screens/AdminScreen';
import ForumHistory from './Screens/ForumHistory';
import PostScreen from './Screens/PostScreen';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/overclocked/#" element={<App />}>
          <Route index element={<HomeScreen />} />
          <Route path="product/:id" element={<ProductScreen />} />
          <Route path="signup" element={<SignUpScreen />} />
          <Route path="signin" element={<SigninScreen />} />
          <Route path="userInfo" element={<UserScreen />} />
          <Route path="cart" element={<CartScreen />} />
          <Route path="checkout" element={<CheckoutScreen />} />
          <Route path="orderHistory" element={<OrderHistoryScreen />} />
          <Route path="productsScreen" element={<ProductsScreen />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="forum" element={<ForumScreen />} />
          <Route path="admin" element={<AdminScreen />} />
          <Route path="post/:id" element={<PostScreen />} />
          <Route path="forumHistory" element={<ForumHistory />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
