
// import express from 'express';

// import  { MongoClient }  from 'mongodb';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 5000;

// const mongoUrl = process.env.MONGO_URI;
// const dbName = 'final_project';
// const productsCollectionName = 'Products';

// const connectDB = async () => {
//   try {
//     const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('Connected to MongoDB');
//     return client.db(dbName);
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   }
// };

// // GET route to fetch all products
// app.get('/api/products', async (req, res) => {
//   try {
//     const db = await connectDB();
//     const products = await db.collection(productsCollectionName).find({}).limit(5).toArray();
//     console.log('Fetched products:', products);
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// server.js

// server.js
// server.js

import express from 'express';
import productRoutes from './routes/productRoutes.js';
import signupRoutes from './routes/signupRoutes.js';
import signinRoutes from './routes/signinRoutes.js';
import userInfoRoutes from './routes/userInfoRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
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
    app.use('/api/userInfo/sendPassword', userInfoRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/cart/add', cartRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
