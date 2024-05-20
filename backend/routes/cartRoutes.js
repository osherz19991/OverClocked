// cartRoutes.js

import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch cart items from the database
    const db = await getDB();
    const cartItems = await db.collection('cart').find({}).toArray();
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/add', async (req, res) => {
    try {
      const { productId ,username} = req.body;
  
      const db = await connectDB();
      const productCollectionName = 'Products';
      const product = await db.collection(productCollectionName).findOne({ productId });
      const accountsCollectionName = 'accounts';
      
      // Update the user's account document to add the product to the cart
      await db.collection(accountsCollectionName).updateOne(
        { username },
        { $push: { cart: product } }
      );
  
      res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;
