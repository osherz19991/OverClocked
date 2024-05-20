import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import App from './App';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import SignUpScreen from './Screens/SignupScreen';
import SigninScreen from './Screens/SigninScreen';
import UserPage from './Screens/UserPage';
import CartScreen from './Screens/CartScreen';
import CheckoutScreen from './Screens/CheckoutScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';
import ProductsScreen from './Screens/ProductsScreen';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path ="/" element = {<App />}>
    <Route index={true} path="/" element={<HomeScreen/>} />
    <Route path="/product/:id" element={<ProductScreen/>} />
    <Route path="/signup" element={<SignUpScreen/>} />
    <Route path="/signin" element={<SigninScreen/>} />
    <Route path="/userInfo" element={<UserPage/>} />
    <Route path="/cart" element={<CartScreen/>} />
    <Route path="/checkout" element={<CheckoutScreen/>} />
    <Route path="/orderHistory" element={<OrderHistoryScreen/>} />
    <Route path="/productsScreen" element={<ProductsScreen/>} />
    </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
   <RouterProvider  router = {router} />
  </React.StrictMode>
);


reportWebVitals();
