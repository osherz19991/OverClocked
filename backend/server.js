// server.js

import express from 'express';
import productRoutes from './routes/productRoutes.js';
import signupRoutes from './routes/signupRoutes.js';
import signinRoutes from './routes/signinRoutes.js';
import userInfoRoutes from './routes/userInfoRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderHistoryRoutes from './routes/orderHistoryRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import resetPassword from './routes/resetPasswordRoute.js'
import forumRoutes from './routes/forumRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { connectDB } from './config/db.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

connectDB()
  .then(db => {
    app.locals.db = db;

    app.use('/api/products', productRoutes);
    app.use('/api/products/${productId}/updateQuantity', productRoutes);
    app.use('/api/products/${productId}/reviews',productRoutes);
    app.use('/api/signup', signupRoutes);
    app.use('/api/signin', signinRoutes);
    app.use('/api/userInfo', userInfoRoutes);
    app.use('/api/userInfo/logout', userInfoRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/cart/add', cartRoutes);
    app.use('/api/orderHistory',orderHistoryRoutes);
    app.use('/api/checkout',checkoutRoutes);
    app.use('/api/resetPassword',resetPassword);
    app.use('/api/forum',forumRoutes);
    app.use('/api/admin',adminRoutes);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
