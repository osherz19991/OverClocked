
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as Screens from './screenImports';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Screens.HomeScreen />} />
        <Route path="product/:id" element={<Screens.ProductScreen />} />
        <Route path="signup" element={<Screens.SignUpScreen />} />
        <Route path="signin" element={<Screens.SigninScreen />} />
        <Route path="userInfo" element={<Screens.UserScreen />} />
        <Route path="cart" element={<Screens.CartScreen />} />
        <Route path="checkout" element={<Screens.CheckoutScreen />} />
        <Route path="orderHistory" element={<Screens.OrderHistoryScreen />} />
        <Route path="productsScreen" element={<Screens.ProductsScreen />} />
        <Route path="password-reset" element={<Screens.PasswordReset />} />
        <Route path="contact-us" element={<Screens.ContactUs />} />
        <Route path="about-us" element={<Screens.AboutUs />} />
        <Route path="forum" element={<Screens.ForumScreen />} />
        <Route path="admin" element={<Screens.AdminScreen />} />
        <Route path="post/:id" element={<Screens.PostScreen />} />
        <Route path="forumHistory" element={<Screens.ForumHistory />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

